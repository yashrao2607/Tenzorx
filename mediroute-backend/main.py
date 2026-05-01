import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI(title="MediRoute AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Data for Hackathon
MOCK_HOSPITALS = [
    {"id": "h1", "name": "Apollo Hospitals", "location": "Nagpur", "base_multiplier": 1.2, "quality_score": 9.5, "price_tier": "Premium"},
    {"id": "h2", "name": "Wockhardt Super Speciality", "location": "Nagpur", "base_multiplier": 1.1, "quality_score": 8.8, "price_tier": "High"},
    {"id": "h3", "name": "Care Hospital", "location": "Nagpur", "base_multiplier": 1.0, "quality_score": 8.5, "price_tier": "Medium"},
    {"id": "h4", "name": "Orange City Hospital", "location": "Nagpur", "base_multiplier": 0.9, "quality_score": 8.0, "price_tier": "Affordable"},
]

COMORBIDITY_MULTIPLIERS = {
    "Diabetes": 1.15, # +15%
    "Hypertension": 1.10, # +10%
    "Cardiac Disease": 1.25, # +25%
    "Age > 60": 1.12 # +12%
}

PROCEDURES = {
    "Total Knee Replacement": {"base_cost": 180000, "icd": "Z96.65"},
    "Angioplasty": {"base_cost": 150000, "icd": "Z95.5"},
    "Cataract Surgery": {"base_cost": 35000, "icd": "Z96.1"}
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

@app.post("/api/analyze-intent", response_model=IntentResponse)
async def analyze_intent(req: SymptomInput):
    # Mocking Anthropic NLP Intent extraction
    symptom_lower = req.symptoms.lower()
    procedure = "Total Knee Replacement" # default
    icd = PROCEDURES[procedure]["icd"]
    explanation = "Symptoms strongly suggest joint degradation likely requiring surgical replacement."
    
    if "chest pain" in symptom_lower or "heart" in symptom_lower:
        procedure = "Angioplasty"
        icd = PROCEDURES[procedure]["icd"]
        explanation = "Symptoms of chest pain combined with risk factors indicate potential need for coronary angioplasty."
    elif "eye" in symptom_lower or "vision" in symptom_lower:
        procedure = "Cataract Surgery"
        icd = PROCEDURES[procedure]["icd"]
        explanation = "Vision-related symptoms in this demographic are highly correlated with cataracts."

    return IntentResponse(
        procedure_name=procedure,
        icd_code=icd,
        confidence_score=0.88 + random.uniform(-0.05, 0.05),
        explanation=explanation
    )

@app.post("/api/estimate-cost", response_model=List[HospitalEstimate])
async def estimate_cost(req: EstimateRequest):
    if req.procedure_name not in PROCEDURES:
        raise HTTPException(status_code=400, detail="Procedure not supported in MVP")
    
    base_cost = PROCEDURES[req.procedure_name]["base_cost"]
    
    # Calculate comorbidity multiplier
    comorbidity_multiplier = 1.0
    for cmb in req.comorbidities:
        if cmb in COMORBIDITY_MULTIPLIERS:
            comorbidity_multiplier += (COMORBIDITY_MULTIPLIERS[cmb] - 1.0)
            
    estimates = []
    filtered_hospitals = [h for h in MOCK_HOSPITALS if h["location"].lower() == req.location.lower()]
    if not filtered_hospitals:
        filtered_hospitals = MOCK_HOSPITALS # fallback
        
    for h in filtered_hospitals:
        final_multiplier = comorbidity_multiplier * h["base_multiplier"]
        total_cost = int(base_cost * final_multiplier)
        
        # Breakdown logic
        surgery = int(total_cost * 0.40)
        surgeon = int(total_cost * 0.25)
        room = int(total_cost * 0.15)
        meds = int(total_cost * 0.10)
        contingency = total_cost - (surgery + surgeon + room + meds)
        
        estimates.append(
            HospitalEstimate(
                hospital_name=h["name"],
                quality_score=h["quality_score"],
                price_tier=h["price_tier"],
                estimated_cost=total_cost,
                confidence_score=0.92,
                breakdown=[
                    ComponentCost(category="Surgery / OT", amount=surgery),
                    ComponentCost(category="Surgeon Fees", amount=surgeon),
                    ComponentCost(category="Room Rent", amount=room),
                    ComponentCost(category="Medicines & Diagnostics", amount=meds),
                    ComponentCost(category="Comorbidity Contingency", amount=contingency),
                ]
            )
        )
    
    # Sort by quality
    estimates.sort(key=lambda x: x.quality_score, reverse=True)
    return estimates[:3] # Return top 3

@app.post("/api/apply-loan")
async def apply_loan(req: LoanRequest):
    # Mocking NBFC Bridge Integration
    return {
        "status": "APPROVED_IN_PRINCIPLE",
        "loan_id": f"LN-{random.randint(10000, 99999)}",
        "approved_amount": req.amount,
        "emi_options": [
            {"tenure_months": 12, "emi": int(req.amount / 12), "interest": "0% (Hospital Subvention)"},
            {"tenure_months": 24, "emi": int((req.amount * 1.1) / 24), "interest": "10% p.a."}
        ],
        "message": f"Pre-approved via Poonawalla Fincorp anchored at ₹{req.amount}."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
