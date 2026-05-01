from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

from services.intent_service import analyze_intent
from services.cost_service import calculate_costs
from services.loan_service import process_loan

app = FastAPI(title="MediRoute AI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomInput(BaseModel):
    symptoms: str
    age: int
    location: str

class EstimateRequest(BaseModel):
    procedure_name: str
    comorbidities: List[str]
    location: str

class LoanRequest(BaseModel):
    patient_name: str
    hospital_name: str
    procedure_name: str
    amount: int
    estimated_cost: int

@app.post("/api/analyze-intent")
async def api_analyze_intent(req: SymptomInput):
    return analyze_intent(req.symptoms, req.age)

@app.post("/api/estimate-cost")
async def api_estimate_cost(req: EstimateRequest):
    return calculate_costs(req.procedure_name, req.comorbidities, req.location)

@app.post("/api/apply-loan")
async def api_apply_loan(req: LoanRequest):
    return process_loan(req.patient_name, req.hospital_name, req.procedure_name, req.amount, req.estimated_cost)

@app.post("/api/update-comorbidity")
async def api_update_comorbidity(req: EstimateRequest):
    return calculate_costs(req.procedure_name, req.comorbidities, req.location)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
