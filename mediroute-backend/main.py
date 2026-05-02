import time
import uuid
import statistics
import re
from rapidfuzz import fuzz
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import logging
import sys

from config import settings
from services.intent_service import analyze_intent
from services.cost_service import calculate_costs
from services.loan_service import process_loan
from services.orchestrator import run_full_analysis, diagnostician, cost_auditor, underwriter
from database import get_db, engine, Base
from storage_utils import read_json, append_json, now_iso
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

# ──────────────────────────────────────────────
# PYDANTIC MODELS
# ──────────────────────────────────────────────

class SymptomRequest(BaseModel):
    symptom_text: str

class CostAnalysisRequest(BaseModel):
    procedure: str
    city: str
    comorbidities: Optional[list[str]] = []
    requested_loan_amount: Optional[int] = 0

class FullAnalysisRequest(BaseModel):
    symptom_text: str
    city: str
    comorbidities: Optional[list[str]] = []
    requested_loan_amount: int

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

# ── Phase 2 Models ──

class RegisterUserRequest(BaseModel):
    name: str
    age: int
    aadhaar: str
    pan: str
    occupation: str
    city: str
    phone: str

class SearchDiseaseRequest(BaseModel):
    user_id: str
    symptom_text: str
    answers: Optional[List[Dict[str, str]]] = None

class GetQuestionsRequest(BaseModel):
    concern: str

class HospitalsByCityRequest(BaseModel):
    city: str
    procedure: str
    icd10_code: str

class ApplyLoanRequest(BaseModel):
    user_id: str
    hospital_id: int
    hospital_name: Optional[str] = None
    icd10_code: str
    procedure: str
    requested_amount: int
    city: Optional[str] = None


# ──────────────────────────────────────────────
# VALIDATION UTILS
# ──────────────────────────────────────────────

class Verhoeff:
    d = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ]
    p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ]

    @staticmethod
    def validate(number: str) -> bool:
        if not number.isdigit() or len(number) != 12:
            return False
        if number[0] in ['0', '1']:
            return False
        try:
            c = 0
            # Verhoeff algorithm requires reversing the digits
            # and checking if the final result of multiplications is 0
            for i, digit in enumerate(reversed(number)):
                c = Verhoeff.d[c][Verhoeff.p[i % 8][int(digit)]]
            return c == 0
        except Exception:
            return False


def _normalize_digits(value: str) -> str:
    return "".join(ch for ch in str(value) if ch.isdigit())


def _procedure_aliases(icd10_code: str, procedure: str) -> list[str]:
    aliases_by_code = {
        "N20.0": ["Pathri ka operation", "Stone removal", "ESWL", "Laser stone treatment"],
        "K35": ["Appendix operation", "Appendix surgery", "Appendicitis operation"],
        "I25.10": ["Heart stent", "Stent procedure", "Coronary angioplasty"],
        "M17.1": ["Ghutan badalne ka operation", "Knee implant surgery", "TKR"],
        "H25.0": ["Motiyabind operation", "Lens replacement", "Phaco surgery"],
        "K40": ["Hernia operation", "Jhaad ka operation", "Mesh hernia repair"],
    }
    if icd10_code in aliases_by_code:
        return aliases_by_code[icd10_code]
    return [procedure, procedure.lower(), f"{procedure} treatment"]


def _load_hospitals_data() -> list[dict]:
    data = read_json("hospitals_data.json")
    if data:
        return data
    try:
        from seed_storage import seed
        logger.warning("[Hospitals] hospitals_data.json missing/empty. Auto-seeding storage...")
        seed()
        data = read_json("hospitals_data.json")
    except Exception as e:
        logger.error(f"[Hospitals] Auto-seed failed: {e}")
    return data


def _resolve_market_matches(all_data: list[dict], city: str, icd10_code: str, procedure: str) -> tuple[list[dict], str, str, str]:
    requested_city = (city or "").strip()
    city_rows = [h for h in all_data if h["city"].lower() == requested_city.lower()]
    if not city_rows:
        unique_cities = sorted({h.get("city", "").strip() for h in all_data if h.get("city")})
        if not unique_cities:
            return [], icd10_code, procedure, requested_city or "Unknown"
        best_city = max(
            unique_cities,
            key=lambda c: fuzz.ratio(requested_city.lower(), c.lower()) if requested_city else 0
        )
        city_rows = [h for h in all_data if h.get("city", "").strip().lower() == best_city.lower()]
        if city_rows:
            logger.warning(f"[Hospitals] City '{requested_city}' not found. Falling back to '{best_city}'.")
            requested_city = best_city

    exact_code = [h for h in city_rows if h.get("icd10_code") == icd10_code]
    if exact_code:
        resolved_proc = exact_code[0].get("procedure", procedure)
        return exact_code, icd10_code, resolved_proc, requested_city

    proc_rows = [
        h for h in city_rows
        if procedure and procedure.lower() in h.get("procedure", "").lower()
    ]
    if proc_rows:
        resolved_code = proc_rows[0].get("icd10_code", icd10_code)
        resolved_proc = proc_rows[0].get("procedure", procedure)
        return proc_rows, resolved_code, resolved_proc, requested_city

    unique_procedures = sorted({h.get("procedure", "") for h in city_rows if h.get("procedure")})
    if not unique_procedures:
        return [], icd10_code, procedure, requested_city

    best = max(unique_procedures, key=lambda p: fuzz.partial_ratio(procedure.lower(), p.lower()) if procedure else 0)
    fuzzy_rows = [h for h in city_rows if h.get("procedure") == best]
    resolved_code = fuzzy_rows[0].get("icd10_code", icd10_code)
    return fuzzy_rows, resolved_code, best, requested_city

# ──────────────────────────────────────────────
# EXISTING ENDPOINTS (unchanged)
# ──────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "message": f"MediRoute AI API is running on port {settings.PORT}",
        "docs": "/docs",
        "health": "/health"
    }

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
    logger.info(f"Analyzing symptom via Diagnostician Agent: {req.symptom_text[:50]}...")
    return await diagnostician.analyze(req.symptom_text)

@app.post("/api/cost-analysis")
async def api_cost_analysis(req: CostAnalysisRequest, db: Session = Depends(get_db)):
    logger.info(f"Cost analysis via Cost Auditor Agent: {req.procedure}")
    result = await cost_auditor.audit(db, req.procedure, req.city, req.comorbidities)
    if not result:
        raise HTTPException(status_code=404, detail="No hospitals found")
    if req.requested_loan_amount > 0:
        underwriting = await underwriter.review(result["adjusted_recommended_cost"], req.requested_loan_amount)
        result.update(underwriting)
    return result

@app.post("/api/full-analysis")
async def api_full_analysis(req: FullAnalysisRequest, db: Session = Depends(get_db)):
    logger.info(f"Full pipeline analysis for symptom: {req.symptom_text[:50]}")
    return await run_full_analysis(db, req.symptom_text, req.city, req.comorbidities, req.requested_loan_amount)

@app.post("/api/update-comorbidity")
async def api_update_comorbidity(req: EstimateRequest):
    return calculate_costs(req.procedure_name, req.comorbidities, req.location)

# ──────────────────────────────────────────────
# PHASE 2 ENDPOINTS
# ──────────────────────────────────────────────

@app.post("/api/register-user")
async def register_user(req: RegisterUserRequest):
    aadhaar_digits = _normalize_digits(req.aadhaar)
    phone_digits = _normalize_digits(req.phone)
    pan = req.pan.strip().upper()

    if not Verhoeff.validate(aadhaar_digits):
        raise HTTPException(status_code=422, detail="Invalid Aadhaar: Checksum failed or incorrect format (12 digits, cannot start with 0 or 1)")
    if len(phone_digits) != 10:
        raise HTTPException(status_code=422, detail="Phone number must be exactly 10 digits")
    if phone_digits[0] not in ['6', '7', '8', '9']:
        raise HTTPException(status_code=422, detail="Invalid Mobile: Indian numbers must start with 6, 7, 8, or 9")
    if not re.fullmatch(r"[A-Z]{5}[0-9]{4}[A-Z]", pan):
        raise HTTPException(status_code=422, detail="Invalid PAN: Must follow format AAAAA9999A (5 Letters, 4 Digits, 1 Letter)")

    user_id = f"USR-{uuid.uuid4().hex[:8]}"
    record = {
        "user_id": user_id,
        "name": req.name,
        "age": req.age,
        "aadhaar": f"XXXX-XXXX-{aadhaar_digits[-4:]}",
        "pan": pan,
        "occupation": req.occupation,
        "city": req.city,
        "phone": phone_digits,
        "registered_at": now_iso(),
    }
    append_json("users.json", record)
    logger.info(f"[Register] New user {user_id} from {req.city}")
    return {"user_id": user_id, "status": "registered", "city": req.city, "userData": record}


@app.get("/api/get-user-profile/{user_id}")
async def get_user_profile(user_id: str):
    users = read_json("users.json")
    user_record = next((u for u in users if u.get("user_id") == user_id), None)
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "userData": user_record}


@app.post("/api/get-questions")
async def get_questions(req: GetQuestionsRequest):
    logger.info(f"[Questions] concern={req.concern[:40]}")
    return await diagnostician.get_clarifying_questions(req.concern)


@app.post("/api/search-disease")
async def search_disease(req: SearchDiseaseRequest):
    logger.info(f"[Search] user={req.user_id} symptom={req.symptom_text[:40]}")
    result = await diagnostician.analyze(req.symptom_text, req.answers)
    if "procedure_aliases" not in result or not result.get("procedure_aliases"):
        result["procedure_aliases"] = _procedure_aliases(
            result.get("icd10_code", ""),
            result.get("recommended_procedure", "Treatment"),
        )

    # Save search log
    append_json("searches.json", {
        "user_id": req.user_id,
        "symptom_text": req.symptom_text,
        "result": result,
        "timestamp": now_iso(),
    })

    return result


@app.post("/api/hospitals-by-city")
async def hospitals_by_city(req: HospitalsByCityRequest):
    logger.info(f"[Hospitals] city={req.city} proc={req.procedure} icd={req.icd10_code}")

    all_data = _load_hospitals_data()

    matches, resolved_icd10, resolved_procedure, resolved_city = _resolve_market_matches(
        all_data, req.city, req.icd10_code, req.procedure
    )

    if not matches:
        raise HTTPException(status_code=404, detail=f"No hospitals found in {req.city} for {req.procedure}. Run seed_storage.py.")

    costs = [h["estimated_total_cost"] for h in matches]
    fair_market_price = int(statistics.median(costs))

    response = {
        "city": resolved_city,
        "icd10_code": resolved_icd10,
        "procedure": resolved_procedure,
        "fair_market_price": fair_market_price,
        "min_cost": min(costs),
        "max_cost": max(costs),
        "hospital_count": len(matches),
        "hospitals": sorted(matches, key=lambda x: x["estimated_total_cost"]),
    }

    # Save for audit
    append_json("cost_comparisons.json", {
        "city": req.city,
        "resolved_city": resolved_city,
        "icd10_code": resolved_icd10,
        "procedure": resolved_procedure,
        "fair_market_price": fair_market_price,
        "hospital_count": len(matches),
        "timestamp": now_iso(),
    })

    return response


@app.post("/api/apply-for-loan")
async def apply_for_loan(req: ApplyLoanRequest):
    users = read_json("users.json")
    user_record = next((u for u in users if u.get("user_id") == req.user_id), None)
    resolved_city = req.city or (user_record.get("city") if user_record else None)
    if not resolved_city:
        raise HTTPException(status_code=422, detail="City is required (or must exist on registered user)")

    logger.info(f"[Loan] user={req.user_id} hospital={req.hospital_name or req.hospital_id} amount={req.requested_amount}")

    all_data = _load_hospitals_data()
    city_matches, resolved_icd10, resolved_procedure, resolved_city = _resolve_market_matches(
        all_data, resolved_city, req.icd10_code, req.procedure
    )

    if not city_matches:
        raise HTTPException(status_code=404, detail="No market data available")

    costs = [h["estimated_total_cost"] for h in city_matches]
    fair_market_price = int(statistics.median(costs))
    max_approvable = int(fair_market_price * 1.10)

    selected = next((h for h in city_matches if h["hospital_id"] == req.hospital_id), None)
    selected_cost = selected["estimated_total_cost"] if selected else fair_market_price

    overpricing_pct = round(((req.requested_amount - fair_market_price) / fair_market_price) * 100, 2)

    # Decision logic
    if req.requested_amount <= max_approvable:
        decision = "APPROVED"
        recommendation = "Your loan is within fair market range. Approved."
    elif req.requested_amount <= fair_market_price * 1.30:
        decision = "REVIEW"
        recommendation = f"Requested amount exceeds fair market price by {overpricing_pct:.0f}%. Manual verification required."
    else:
        decision = "REJECTED"
        recommendation = f"Loan REJECTED: Requested amount exceeds regional fair price by {overpricing_pct:.0f}%. This indicates potential cost inflation."

    # Find cheaper alternative if selected hospital is expensive
    cheaper = None
    sorted_by_cost = sorted(city_matches, key=lambda x: x["estimated_total_cost"])
    cheapest = sorted_by_cost[0]
    if selected and cheapest["hospital_id"] != selected["hospital_id"]:
        savings = selected_cost - cheapest["estimated_total_cost"]
        if savings > 0:
            cheaper = {
                "hospital_name": cheapest["hospital_name"],
                "cost": cheapest["estimated_total_cost"],
                "savings": savings,
            }

    emi_options = []
    if decision == "APPROVED":
        amt = req.requested_amount
        emi_options = [
            {"tenure_months": 12, "emi": int(amt / 12), "interest": "0% (Subvention)"},
            {"tenure_months": 24, "emi": int((amt * 1.08) / 24), "interest": "8% p.a."},
        ]

    result = {
        "decision": decision,
        "icd10_code": resolved_icd10,
        "procedure": resolved_procedure,
        "fair_market_price": fair_market_price,
        "max_approvable": max_approvable,
        "requested_amount": req.requested_amount,
        "selected_hospital_cost": selected_cost,
        "city_min_cost": min(costs),
        "city_max_cost": max(costs),
        "overpricing_pct": overpricing_pct,
        "recommendation": recommendation,
        "cheaper_alternative": cheaper,
        "emi_options": emi_options,
    }

    # Save decision
    append_json("loan_decisions.json", {
        "user_id": req.user_id,
        "hospital_name": req.hospital_name or (selected["hospital_name"] if selected else "Unknown"),
        "city": resolved_city,
        "icd10_code": resolved_icd10,
        "procedure": resolved_procedure,
        "requested_amount": req.requested_amount,
        "decision": decision,
        "fair_market_price": fair_market_price,
        "timestamp": now_iso(),
    })

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
