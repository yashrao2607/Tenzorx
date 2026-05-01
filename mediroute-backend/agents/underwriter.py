import logging
import time
from typing import Dict, Any

logger = logging.getLogger(__name__)

class UnderwriterAgent:
    async def review(self, adjusted_cost: float, requested_amount: int) -> Dict[str, Any]:
        start_time = time.perf_counter()
        
        loan_recommendation = "N/A"
        fraud_flag = False
        reason = "No loan requested"
        overpricing_percent = 0.0
        decision_confidence = "N/A"
        
        if requested_amount > 0:
            overpricing_percent = ((requested_amount - adjusted_cost) / adjusted_cost) * 100 if adjusted_cost > 0 else 0
            
            if requested_amount <= adjusted_cost * 1.1:
                loan_recommendation = "APPROVE"
                decision_confidence = "HIGH"
                reason = f"Requested ₹{requested_amount:,} is within 10% of risk-adjusted benchmark (₹{int(adjusted_cost):,})."
            elif requested_amount <= adjusted_cost * 1.3:
                loan_recommendation = "REVIEW"
                decision_confidence = "MEDIUM"
                reason = f"Requested ₹{requested_amount:,} exceeds benchmark (₹{int(adjusted_cost):,}) by {int(overpricing_percent)}%. Manual verification required."
            else:
                loan_recommendation = "REJECT"
                fraud_flag = True
                decision_confidence = "HIGH"
                reason = f"Requested ₹{requested_amount:,} significantly exceeds risk-adjusted benchmark (₹{int(adjusted_cost):,}) by {int(overpricing_percent)}%."

        duration = time.perf_counter() - start_time
        logger.info(f"[Underwriter] Review Success | Duration: {duration:.2f}s")
        
        return {
            "loan_recommendation": loan_recommendation,
            "decision_confidence": decision_confidence,
            "overpricing_percent": round(overpricing_percent, 2),
            "fraud_flag": fraud_flag,
            "reason": reason
        }
