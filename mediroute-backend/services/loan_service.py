import random
import uuid

# Blueprint Stage 5 - Loan Bridge
def process_loan(patient_name, hospital_name, procedure_name, amount, estimated_cost):
    applicant_id = f"APP-{uuid.uuid4().hex[:8].upper()}"
    
    # Calculate deviation
    deviation = (amount - estimated_cost) / estimated_cost if estimated_cost > 0 else 0
    
    # Fraud Check
    is_fraud_flagged = deviation > 0.15 or amount > 1000000
    
    patient_risk_score = random.randint(680, 820)
    
    # Mocking NBFC response (Webhook simulation)
    # Payload includes blueprint-specific fields
    loan_packet = {
        "applicant_id": applicant_id,
        "procedure_name": procedure_name,
        "hospital_name": hospital_name,
        "requested_amount": amount,
        "estimated_anchor_cost": estimated_cost,
        "risk_score": patient_risk_score,
        "status": "FLAGGED" if is_fraud_flagged else "PRE_APPROVED"
    }
    
    if is_fraud_flagged:
        return {
            "status": "MANUAL_REVIEW_REQUIRED",
            "loan_id": f"LN-{random.randint(10000, 99999)}",
            "applicant_id": applicant_id,
            "approved_amount": 0,
            "patient_name": patient_name,
            "patient_risk_score": patient_risk_score,
            "message": "🚨 Webhook simulation: NBFC API flagged deviation. Manual clinical review triggered.",
            "is_fraud_flagged": True,
            "emi_options": []
        }
    
    return {
        "status": "APPROVED_IN_PRINCIPLE",
        "loan_id": f"LN-{random.randint(10000, 99999)}",
        "applicant_id": applicant_id,
        "patient_name": patient_name,
        "patient_risk_score": patient_risk_score,
        "approved_amount": amount,
        "emi_options": [
            {"tenure_months": 12, "emi": int(amount / 12), "interest": "0% (Subvention)"},
            {"tenure_months": 24, "emi": int((amount * 1.08) / 24), "interest": "8% p.a."}
        ],
        "message": f"Pre-approved via NBFC Bridge. Decision ID: {uuid.uuid4().hex[:6].upper()}.",
        "is_fraud_flagged": False
    }
