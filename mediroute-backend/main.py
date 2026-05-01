import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import anthropic

app = FastAPI(title="MediRoute AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Hospitals
HOSPITALS_DATA = []
hospitals_file = os.path.join(os.path.dirname(__file__), "hospitals.json")
if os.path.exists(hospitals_file):
    with open(hospitals_file, "r") as f:
        HOSPITALS_DATA = json.load(f)

COMORBIDITY_MULTIPLIERS = {
    "Diabetes": 1.15,
    "Hypertension": 1.10,
    "Cardiac Disease": 1.25,
    "Age > 60": 1.12
}

class SymptomInput(BaseModel):
    symptoms: str
    age: int
    location: str

class IntentResponse(BaseModel):
    procedure_name: str
    icd_code: str
    confidence_score: float
    explanation: str

class EstimateRequest(BaseModel):
    procedure_name: str
    comorbidities: List[str]
    location: str

class ComponentCost(BaseModel):
    category: str
    amount: int

class HospitalEstimate(BaseModel):
    hospital_name: str
    quality_score: float
    price_tier: str
    estimated_cost: int
    confidence_score: float
    breakdown: List[ComponentCost]

class LoanRequest(BaseModel):
    patient_name: str
    hospital_name: str
    procedure_name: str
    amount: int
    estimated_cost: int

@app.post("/api/analyze-intent", response_model=IntentResponse)
async def analyze_intent(req: SymptomInput):
    # Call Claude API
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        print("WARNING: ANTHROPIC_API_KEY not found. Please set the environment variable. Using fallback mock.")
        return IntentResponse(
            procedure_name="Total Knee Replacement",
            icd_code="Z96.65",
            confidence_score=0.88,
            explanation="Fallback mock explanation due to missing API key."
        )

    try:
        client = anthropic.Anthropic(api_key=api_key)
        prompt = f"""You are a clinical coding AI. Given the following symptoms and age, predict the most likely surgical procedure required, its ICD-10 code, your confidence score (0.0 to 1.0), and a brief explanation.
Symptoms: {req.symptoms}
Age: {req.age}
Return ONLY valid JSON with exactly these keys: "procedure", "icd_code", "confidence", "explanation".
Example list to choose from if applicable: "Total Knee Replacement", "Angioplasty", "Cataract Surgery", "Appendectomy", "Gallbladder Removal". Do not use markdown backticks in your output, just return the raw JSON object.
"""

        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=300,
            temperature=0.1,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        content = response.content[0].text.strip()
        
        # Clean up if claude returns markdown
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        
        data = json.loads(content.strip())
        return IntentResponse(
            procedure_name=data.get("procedure", "Total Knee Replacement"),
            icd_code=data.get("icd_code", "Z96.65"),
            confidence_score=float(data.get("confidence", 0.85)),
            explanation=data.get("explanation", "AI analyzed symptoms.")
        )
    except Exception as e:
        print(f"Error calling Claude: {e}")
        return IntentResponse(
            procedure_name="Total Knee Replacement",
            icd_code="Z96.65",
            confidence_score=0.88,
            explanation=f"Error connecting to AI: {str(e)}"
        )

@app.post("/api/estimate-cost", response_model=List[HospitalEstimate])
async def estimate_cost(req: EstimateRequest):
    filtered_hospitals = [h for h in HOSPITALS_DATA if h["city"].lower() == req.location.lower()]
    if not filtered_hospitals:
        filtered_hospitals = HOSPITALS_DATA[:10] # fallback if city not found
        
    estimates = []
    
    # Calculate comorbidity multiplier
    comorbidity_multiplier = 1.0
    for cmb in req.comorbidities:
        if cmb in COMORBIDITY_MULTIPLIERS:
            comorbidity_multiplier += (COMORBIDITY_MULTIPLIERS[cmb] - 1.0)

    # limit to top 3 by rating
    sorted_hospitals = sorted(filtered_hospitals, key=lambda h: h.get("ratings", {}).get("capability", 0) + h.get("ratings", {}).get("reputation", 0), reverse=True)[:3]

    for h in sorted_hospitals:
        procedures = h.get("procedures", {})
        
        proc_data = None
        for p_name, p_val in procedures.items():
            if p_name.lower() in req.procedure_name.lower() or req.procedure_name.lower() in p_name.lower():
                proc_data = p_val
                break
        
        if not proc_data:
            # Fallback procedure data if AI generated a novel procedure
            proc_data = {
                "base_cost": 150000,
                "room_cost_per_day": 5000,
                "avg_days": 4,
                "doctor_fee": 40000,
                "medications": 15000,
                "diagnostics": 7500
            }

        total_base = proc_data["base_cost"]
        final_multiplier = comorbidity_multiplier
        
        # Breakdown logic
        surgery = int(total_base * 0.40 * final_multiplier)
        surgeon = int(proc_data["doctor_fee"] * final_multiplier)
        room = int((proc_data["room_cost_per_day"] * proc_data["avg_days"]) * final_multiplier)
        meds = int(proc_data["medications"] * final_multiplier)
        diagnostics = int(proc_data["diagnostics"] * final_multiplier)
        
        total_cost = surgery + surgeon + room + meds + diagnostics

        quality_score = round((h.get("ratings", {}).get("capability", 0.8) + h.get("ratings", {}).get("reputation", 0.8)) * 5, 1)

        estimates.append(
            HospitalEstimate(
                hospital_name=h["name"],
                quality_score=quality_score,
                price_tier=h.get("tier", "Premium"),
                estimated_cost=total_cost,
                confidence_score=0.92,
                breakdown=[
                    ComponentCost(category="Surgery / OT", amount=surgery),
                    ComponentCost(category="Surgeon Fees", amount=surgeon),
                    ComponentCost(category="Room Rent", amount=room),
                    ComponentCost(category="Medicines", amount=meds),
                    ComponentCost(category="Diagnostics", amount=diagnostics),
                ]
            )
        )
    
    return estimates

@app.post("/api/apply-loan")
async def apply_loan(req: LoanRequest):
    # Fraud flag logic: AI flags loans where requested amount deviates >15% from MediRoute estimate
    deviation = (req.amount - req.estimated_cost) / req.estimated_cost if req.estimated_cost > 0 else 0
    is_fraud_flagged = deviation > 0.15
    
    if is_fraud_flagged:
        return {
            "status": "MANUAL_REVIEW_REQUIRED",
            "loan_id": f"LN-{random.randint(10000, 99999)}",
            "approved_amount": 0,
            "patient_name": req.patient_name,
            "emi_options": [],
            "message": f"🚨 FRAUD FLAG: Requested loan (₹{req.amount}) exceeds MediRoute AI estimate (₹{req.estimated_cost}) by >15%. Flagged for Poonawalla risk team.",
            "is_fraud_flagged": True
        }
    
    return {
        "status": "APPROVED_IN_PRINCIPLE",
        "loan_id": f"LN-{random.randint(10000, 99999)}",
        "patient_name": req.patient_name,
        "approved_amount": req.amount,
        "emi_options": [
            {"tenure_months": 12, "emi": int(req.amount / 12), "interest": "0% (Hospital Subvention)"},
            {"tenure_months": 24, "emi": int((req.amount * 1.1) / 24), "interest": "10% p.a."}
        ],
        "message": f"Pre-approved via Poonawalla Fincorp anchored at ₹{req.amount}.",
        "is_fraud_flagged": False
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
