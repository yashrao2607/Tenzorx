import logging
import time
from sqlalchemy.orm import Session
from models import Hospital
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class CostAuditorAgent:
    def __init__(self):
        self.ICD_MAP = {
            "appendicitis": "K35",
            "angina": "I20",
            "osteoarthritis": "M17",
            "glaucoma": "H40"
        }
        self.COMORBIDITY_MULTIPLIERS = {
            "diabetes": 0.15,
            "hypertension": 0.10,
            "heart_disease": 0.20
        }

    def _apply_icd_overrides(self, condition: str, current_code: str) -> str:
        condition_lower = condition.lower()
        for keyword, code in self.ICD_MAP.items():
            if keyword in condition_lower:
                return code
        return current_code

    async def audit(self, db: Session, procedure: str, city: str, comorbidities: List[str] = [], condition: str = "") -> Dict[str, Any]:
        start_time = time.perf_counter()
        
        query = db.query(Hospital).filter(
            Hospital.procedure == procedure,
            Hospital.city == city
        )
        
        hospitals = query.all()
        if not hospitals:
            return {}
        
        costs = [h.cost for h in hospitals]
        min_cost = min(costs)
        max_cost = max(costs)
        avg_cost = sum(costs) / len(costs)
        
        weighted_sum = sum(h.cost * h.quality_score for h in hospitals)
        total_quality = sum(h.quality_score for h in hospitals)
        base_recommended_cost = weighted_sum / total_quality if total_quality > 0 else avg_cost
        
        # Multipliers
        total_multiplier = 0.0
        applied_factors = []
        for c in (comorbidities or []):
            c_lower = c.lower()
            if c_lower in self.COMORBIDITY_MULTIPLIERS:
                impact = self.COMORBIDITY_MULTIPLIERS[c_lower]
                total_multiplier += impact
                applied_factors.append({"condition": c_lower, "impact": f"+{int(impact * 100)}%"})
                
        adjusted_recommended_cost = base_recommended_cost * (1 + total_multiplier)
        
        # Best value options
        hospital_options = []
        for h in hospitals:
            hospital_options.append({
                "name": h.name, "cost": h.cost, "quality_score": h.quality_score, "value_index": h.quality_score / h.cost
            })
        hospital_options.sort(key=lambda x: x["value_index"], reverse=True)
        top_10 = [{k: v for k, v in h.items() if k != "value_index"} for h in hospital_options[:10]]
        
        # Insights
        price_spread_ratio = max_cost / min_cost if min_cost > 0 else 1
        risk_flag = "high" if price_spread_ratio > 2.0 else "medium" if price_spread_ratio > 1.5 else "low"
        
        duration = time.perf_counter() - start_time
        logger.info(f"[Cost Auditor] Audit Success | Duration: {duration:.2f}s")
        
        return {
            "min_cost": int(min_cost),
            "max_cost": int(max_cost),
            "avg_cost": int(avg_cost),
            "base_recommended_cost": int(base_recommended_cost),
            "adjusted_recommended_cost": int(adjusted_recommended_cost),
            "applied_factors": applied_factors,
            "savings_opportunity": int(max_cost - base_recommended_cost),
            "risk_flag": risk_flag,
            "hospital_options": top_10,
            "corrected_icd10": self._apply_icd_overrides(condition, "")
        }
