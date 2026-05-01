import logging
import time
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from agents.diagnostician import DiagnosticianAgent
from agents.cost_auditor import CostAuditorAgent
from agents.underwriter import UnderwriterAgent

logger = logging.getLogger(__name__)

# Initialize agents
diagnostician = DiagnosticianAgent()
cost_auditor = CostAuditorAgent()
underwriter = UnderwriterAgent()

async def run_full_analysis(db: Session, symptom_text: str, city: str, comorbidities: List[str], requested_loan_amount: int) -> Dict[str, Any]:
    start_time = time.perf_counter()
    
    # Step 1: Diagnostician
    diagnosis = await diagnostician.analyze(symptom_text)
    procedure = diagnosis.get("recommended_procedure", "")
    condition = diagnosis.get("condition", "")
    
    # Step 2: Cost Auditor
    cost_data = {}
    if procedure and procedure != "Retry" and procedure != "Consult physician":
        cost_data = await cost_auditor.audit(db, procedure, city, comorbidities, condition)
        
        # Override ICD-10 if auditor found a correction
        if cost_data.get("corrected_icd10"):
            diagnosis["icd10_code"] = cost_data["corrected_icd10"]
    
    # Step 3: Underwriter
    underwriting = {}
    adjusted_cost = cost_data.get("adjusted_recommended_cost", 0)
    if adjusted_cost > 0:
        underwriting = await underwriter.review(adjusted_cost, requested_loan_amount)
        
    # Calculate Overall Confidence
    diag_conf = diagnosis.get("confidence_score", 0)
    uw_conf = underwriting.get("decision_confidence", "LOW")
    
    if diag_conf >= 0.8 and uw_conf == "HIGH":
        overall_confidence = "HIGH"
    elif diag_conf >= 0.6 or uw_conf == "MEDIUM":
        overall_confidence = "MEDIUM"
    else:
        overall_confidence = "LOW"
        
    # Generate 1-Line Summary & Risk Level
    overpricing = underwriting.get("overpricing_percent", 0)
    rec = underwriting.get("loan_recommendation", "N/A")
    
    # Risk Level Mapping
    if overpricing <= 10:
        risk_level = "low"
    elif overpricing <= 30:
        risk_level = "moderate"
    else:
        risk_level = "high"
        
    summary = f"{rec}: Requested loan exceeds fair cost by {overpricing}%, indicating {risk_level} inflation risk for {condition}."

    total_duration = time.perf_counter() - start_time
    logger.info(f"[Orchestrator] Full Analysis Complete | Total Time: {total_duration:.2f}s")
    
    return {
        "summary": summary,
        "risk_level": risk_level,
        "overall_confidence": overall_confidence,
        "diagnosis": diagnosis,
        "cost_analysis": cost_data,
        "underwriting": underwriting,
        "performance": {
            "total_time": f"{total_duration:.2f}s"
        }
    }
