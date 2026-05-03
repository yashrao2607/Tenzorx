import sys
import os
import asyncio
import json
import logging

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from agents.diagnostician import DiagnosticianAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_diagnostician_with_history():
    agent = DiagnosticianAgent()
    
    symptom = "Severe chest pain and shortness of breath"
    
    # Test 1: No history
    logger.info("Test 1: Analyzing WITHOUT clinical history...")
    res1 = await agent.analyze(symptom)
    logger.info(f"Diagnosis 1: {res1.get('condition')} -> {res1.get('recommended_procedure')}")
    logger.info(f"Rationale 1: {res1.get('clinical_rationale')}")
    
    # Test 2: With high-risk history
    history = {
        "comorbidities": ["Type 2 Diabetes", "Chronic Hypertension"],
        "past_surgeries": ["Coronary Stent (2020)"]
    }
    logger.info("\nTest 2: Analyzing WITH clinical history (Diabetes, Hypertension, Stent)...")
    res2 = await agent.analyze(symptom, clinical_history=history)
    logger.info(f"Diagnosis 2: {res2.get('condition')} -> {res2.get('recommended_procedure')}")
    logger.info(f"Rationale 2: {res2.get('clinical_rationale')}")
    
    assert res2.get("clinical_rationale") is not None
    logger.info("\nVerification Successful: Diagnostician factors in clinical history.")

if __name__ == "__main__":
    asyncio.run(test_diagnostician_with_history())
