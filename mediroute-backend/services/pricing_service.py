from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Hospital

def get_cost_analysis(db: Session, procedure: str, city: str, comorbidities: list[str] = [], requested_loan_amount: int = 0):
    # 1. Filter hospitals by procedure + city
    query = db.query(Hospital).filter(
        Hospital.procedure == procedure,
        Hospital.city == city
    )
    
    hospitals = query.all()
    if not hospitals:
        return None
    
    # 2. Compute min, max, avg cost
    costs = [h.cost for h in hospitals]
    min_cost = min(costs)
    max_cost = max(costs)
    avg_cost = sum(costs) / len(costs)
    
    # 4. Compute recommended_cost (Base Cost)
    weighted_sum = sum(h.cost * h.quality_score for h in hospitals)
    total_quality = sum(h.quality_score for h in hospitals)
    base_recommended_cost = weighted_sum / total_quality if total_quality > 0 else avg_cost
    
    # Comorbidity Multiplier Logic
    COMORBIDITY_MULTIPLIERS = {
        "diabetes": 0.15,
        "hypertension": 0.10,
        "heart_disease": 0.20
    }
    
    total_multiplier = 0.0
    applied_factors = []
    
    for c in (comorbidities or []):
        c_lower = c.lower()
        if c_lower in COMORBIDITY_MULTIPLIERS:
            impact = COMORBIDITY_MULTIPLIERS[c_lower]
            total_multiplier += impact
            applied_factors.append({
                "condition": c_lower,
                "impact": f"+{int(impact * 100)}%"
            })
            
    adjusted_recommended_cost = base_recommended_cost * (1 + total_multiplier)
    
    # Underwriting Intelligence Logic
    loan_recommendation = "N/A"
    fraud_flag = False
    reason = "No loan requested"
    
    if requested_loan_amount > 0:
        if requested_loan_amount <= adjusted_recommended_cost * 1.1:
            loan_recommendation = "APPROVE"
            reason = "Requested amount is within 10% of risk-adjusted cost benchmark."
        elif requested_loan_amount <= adjusted_recommended_cost * 1.3:
            loan_recommendation = "REVIEW"
            reason = "Requested amount exceeds benchmark by 10-30%. Manual verification required."
        else:
            loan_recommendation = "REJECT"
            fraud_flag = True
            reason = "Requested amount significantly exceeds risk-adjusted benchmark (>30%). High risk of inflated billing/fraud."

    # 6. Sorting by best value
    
    # 6. Sorting by best value
    hospital_options = []
    for h in hospitals:
        hospital_options.append({
            "name": h.name,
            "cost": h.cost,
            "quality_score": h.quality_score,
            "value_index": h.quality_score / h.cost
        })
    
    # Sort and limit to top 10
    hospital_options.sort(key=lambda x: x["value_index"], reverse=True)
    top_10 = [{k: v for k, v in h.items() if k != "value_index"} for h in hospital_options[:10]]
    
    # Financial Insights Logic
    price_spread_ratio = max_cost / min_cost if min_cost > 0 else 1
    
    if price_spread_ratio > 2.0:
        insight = "High price variation detected"
        risk_flag = "high"
    elif price_spread_ratio > 1.5:
        insight = "Moderate price variation"
        risk_flag = "medium"
    else:
        insight = "Low cost variance"
        risk_flag = "low"
        
    savings_opportunity = max_cost - base_recommended_cost
        
    return {
        "min_cost": int(min_cost),
        "max_cost": int(max_cost),
        "avg_cost": int(avg_cost),
        "base_recommended_cost": int(base_recommended_cost),
        "adjusted_recommended_cost": int(adjusted_recommended_cost),
        "applied_factors": applied_factors,
        "savings_opportunity": int(savings_opportunity),
        "insight": insight,
        "risk_flag": risk_flag,
        "loan_recommendation": loan_recommendation,
        "fraud_flag": fraud_flag,
        "reason": reason,
        "hospital_options": top_10
    }
