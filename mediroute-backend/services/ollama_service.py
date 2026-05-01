import json
import logging
import time
import asyncio
from typing import Dict, Any, Optional
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from config import settings

logger = logging.getLogger(__name__)

# Model Optimization
llm = OllamaLLM(
    model=settings.OLLAMA_MODEL, 
    temperature=0.2,
    num_predict=150
)

# ICD Correction Layer
ICD_MAP = {
    "appendicitis": "K35",
    "angina": "I20",
    "osteoarthritis": "M17",
    "glaucoma": "H40"
}

# Simple In-memory Cache
_cache: Dict[str, Dict[str, Any]] = {}

STRICT_SYSTEM_PROMPT = """You are a clinical decision support AI.
Convert user symptoms into:
1. Most likely condition
2. Correct ICD-10 code (STRICT, real-world accurate)
3. Recommended medical procedure

Rules:
* Use ONLY valid ICD-10 codes (e.g., K35 for appendicitis, I20 for angina, M17 for osteoarthritis)
* Do NOT hallucinate codes
* Prefer common diagnoses
* If symptoms are unclear, return: 'condition': 'Insufficient data'

Output ONLY JSON:
{
  "condition": "...",
  "icd10_code": "...",
  "recommended_procedure": "...",
  "confidence_score": 0-1
}"""

def extract_json(text: str) -> Optional[Dict[str, Any]]:
    try:
        start_index = text.find('{')
        end_index = text.rfind('}')
        if start_index == -1 or end_index == -1:
            return None
        return json.loads(text[start_index:end_index + 1])
    except Exception:
        return None

def apply_icd_overrides(data: Dict[str, Any]) -> Dict[str, Any]:
    condition_lower = data.get("condition", "").lower()
    for keyword, code in ICD_MAP.items():
        if keyword in condition_lower:
            data["icd10_code"] = code
            break
    return data

async def analyze_symptom_ollama(symptom_text: str) -> Dict[str, Any]:
    start_time = time.perf_counter()
    
    # Caching Layer
    if symptom_text in _cache:
        logger.info(f"Cache hit for symptom: {symptom_text[:30]}")
        return _cache[symptom_text]

    fallback_response = {
        "condition": "Unknown",
        "icd10_code": "N/A",
        "recommended_procedure": "Consult physician",
        "confidence_score": 0.0
    }

    prompt = PromptTemplate.from_template("{system_prompt}\n\nUser Symptom: {symptom}\n\nJSON Output:").format(
        system_prompt=STRICT_SYSTEM_PROMPT,
        symptom=symptom_text
    )

    for attempt in range(2): # Retry logic
        try:
            # Timeout + LLM Call
            response = await asyncio.wait_for(
                llm.ainvoke(prompt), 
                timeout=settings.OLLAMA_TIMEOUT
            )
            
            # JSON Validation
            result = extract_json(response)
            if result:
                # ICD Correction Layer
                result = apply_icd_overrides(result)
                
                # Performance Logging
                duration = time.perf_counter() - start_time
                logger.info(f"Symptom: {symptom_text[:50]} | Time: {duration:.2f}s | Attempt: {attempt + 1}")
                
                # Update Cache
                _cache[symptom_text] = result
                return result
                
        except asyncio.TimeoutError:
            logger.error(f"Timeout occurred for symptom: {symptom_text[:50]}")
            return {
                "condition": "Service timeout",
                "icd10_code": "N/A",
                "recommended_procedure": "Retry",
                "confidence_score": 0.0
            }
        except Exception as e:
            logger.error(f"Error on attempt {attempt + 1}: {e}")
            if attempt == 1: break # No more retries

    logger.warning(f"Fallback triggered for symptom: {symptom_text[:50]}")
    return fallback_response
