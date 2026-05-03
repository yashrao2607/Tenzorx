import logging
import time
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from agents.diagnostician import DiagnosticianAgent
from agents.cost_auditor import CostAuditorAgent
from agents.underwriter import UnderwriterAgent

logger = logging.getLogger(__name__)

# Initialize agents
diagnostician = DiagnosticianAgent()
cost_auditor = CostAuditorAgent()
underwriter = UnderwriterAgent()

async def run_full_analysis(db: Session, symptom_text: str, city: str, comorbidities: List[str], requested_loan_amount: int, clinical_history: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    start_time = time.perf_counter()
    
    # Step 1: Diagnostician (Pass clinical history if available)
    diagnosis = await diagnostician.analyze(symptom_text, clinical_history=clinical_history)

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
    adjusted_cost = cost_data.get("risk_adjusted_cost", 0)
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
        
    # Generate Executive Summary & Risk Level
    overpricing = underwriting.get("overpricing_percentage", 0)
    decision = underwriting.get("loan_recommendation", "N/A")
    
    # Risk Level Mapping with proper capitalization
    if overpricing <= 10:
        risk_level = "Low"
    elif overpricing <= 30:
        risk_level = "Moderate"
    else:
        risk_level = "High"
        
    summary = f"{decision}: Requested loan exceeds fair cost by {overpricing}%, indicating {risk_level} inflation risk for {condition}."

    total_duration = time.perf_counter() - start_time
    logger.info(f"[Orchestrator] Full Analysis Complete | Total Time: {total_duration:.2f}s")
    
    return {
        "summary": summary,
        "overall_confidence": overall_confidence,
        "diagnosis": diagnosis,
        "cost_analysis": cost_data,
        "underwriting": underwriting,
        "performance": {
            "total_time": f"{total_duration:.2f}s"
        }
    }
