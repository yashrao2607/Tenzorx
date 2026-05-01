import random

def process_loan(patient_name, hospital_name, procedure_name, amount, estimated_cost):
    # Calculate deviation
    deviation = (amount - estimated_cost) / estimated_cost if estimated_cost > 0 else 0
    
    # 1. Fraud Check: Deviation > 15%
    is_fraud_flagged = deviation > 0.15
    
    # 2. Max Loan Cap: 10 Lakhs
    max_cap = 1000000 
    if amount > max_cap:
        is_fraud_flagged = True
        
    # 3. Patient Risk Score (Mocked based on age/comorbidities - in real app would be Credit Score)
    patient_risk_score = random.randint(650, 850)
    
    # 4. Hospital Tier Validation
    # (In real app, check if hospital is in approved network)
    
    if is_fraud_flagged:
        reason = "Deviation > 15%" if deviation > 0.15 else "Exceeds Max Cap"
        return {
            "status": "MANUAL_REVIEW_REQUIRED",
            "loan_id": f"LN-{random.randint(10000, 99999)}",
            "approved_amount": 0,
            "patient_name": patient_name,
            "patient_risk_score": patient_risk_score,
            "emi_options": [],
            "message": f"🚨 REVIEW FLAG: {reason}. Requested loan (₹{amount}) exceeds MediRoute AI bounds (₹{estimated_cost}). Flagged for Poonawalla risk team.",
            "is_fraud_flagged": True
        }
    
    return {
        "status": "APPROVED_IN_PRINCIPLE",
        "loan_id": f"LN-{random.randint(10000, 99999)}",
        "patient_name": patient_name,
        "patient_risk_score": patient_risk_score,
        "approved_amount": amount,
        "emi_options": [
            {"tenure_months": 12, "emi": int(amount / 12), "interest": "0% (Hospital Subvention)"},
            {"tenure_months": 24, "emi": int((amount * 1.1) / 24), "interest": "10% p.a."}
        ],
        "message": f"Pre-approved via Poonawalla Fincorp. Patient Credit Score: {patient_risk_score}.",
        "is_fraud_flagged": False
    }
