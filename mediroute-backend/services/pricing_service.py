from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Hospital

def get_cost_analysis(db: Session, procedure: str, city: str):
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
    
    # 4. Compute recommended_cost: weighted average using quality_score
    # Formula: recommended_cost = sum(cost * quality_score) / sum(quality_score)
    weighted_sum = sum(h.cost * h.quality_score for h in hospitals)
    total_quality = sum(h.quality_score for h in hospitals)
    recommended_cost = weighted_sum / total_quality if total_quality > 0 else avg_cost
    
    # 6. Sorting by best value = highest (quality_score / cost ratio)
    # Convert to list of dicts for response
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
    top_10 = hospital_options[:10]
    
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
        
    savings_opportunity = max_cost - recommended_cost
        
    return {
        "min_cost": int(min_cost),
        "max_cost": int(max_cost),
        "avg_cost": int(avg_cost),
        "recommended_cost": int(recommended_cost),
        "savings_opportunity": int(savings_opportunity),
        "insight": insight,
        "risk_flag": risk_flag,
        "hospital_options": top_10
    }
