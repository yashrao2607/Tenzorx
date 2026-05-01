import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import logging
import sys

from config import settings
from services.intent_service import analyze_intent
from services.cost_service import calculate_costs
from services.loan_service import process_loan
from services.ollama_service import analyze_symptom_ollama
from database import get_db, engine, Base
from services.pricing_service import get_cost_analysis
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException

# Initialize database
Base.metadata.create_all(bind=engine)

# Structured Logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"Path: {request.url.path} | Method: {request.method} | Time: {process_time:.4f}s")
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomRequest(BaseModel):
    symptom_text: str

class CostAnalysisRequest(BaseModel):
    procedure: str
    city: str
    comorbidities: Optional[list[str]] = []

class SymptomInput(BaseModel):
    symptoms: str
    age: int
    location: str
    patient_name: Optional[str] = "Anonymous"
    address: Optional[str] = ""
    conditions_text: Optional[str] = ""

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

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": settings.VERSION}

@app.post("/api/analyze-intent")
async def api_analyze_intent(req: SymptomInput):
    logger.info(f"Analyzing intent for symptoms: {req.symptoms[:50]}...")
    return analyze_intent(req.symptoms, req.age, req.conditions_text)

@app.post("/api/estimate-cost")
async def api_estimate_cost(req: EstimateRequest):
    logger.info(f"Estimating cost for procedure: {req.procedure_name}")
    return calculate_costs(req.procedure_name, req.comorbidities, req.location)

@app.post("/api/apply-loan")
async def api_apply_loan(req: LoanRequest):
    logger.info(f"Processing loan application for {req.patient_name}")
    return process_loan(req.patient_name, req.hospital_name, req.procedure_name, req.amount, req.estimated_cost)

@app.post("/api/analyze-symptom")
async def api_analyze_symptom(req: SymptomRequest):
    logger.info(f"Analyzing symptom via Ollama: {req.symptom_text[:50]}...")
    return await analyze_symptom_ollama(req.symptom_text)

@app.post("/api/cost-analysis")
async def api_cost_analysis(req: CostAnalysisRequest, db: Session = Depends(get_db)):
    logger.info(f"Cost analysis for {req.procedure} in {req.city} with {req.comorbidities}")
    result = get_cost_analysis(db, req.procedure, req.city, req.comorbidities)
    if not result:
        raise HTTPException(status_code=404, detail="No hospitals found for this procedure and city")
    return result

@app.post("/api/update-comorbidity")
async def api_update_comorbidity(req: EstimateRequest):
    return calculate_costs(req.procedure_name, req.comorbidities, req.location)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
