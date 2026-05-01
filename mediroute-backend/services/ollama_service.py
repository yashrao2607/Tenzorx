import json
import logging
import time
import asyncio
from typing import Dict, Any, Optional
from langchain_ollama import OllamaLLM
from config import settings

logger = logging.getLogger(__name__)

# 1. MODEL OPTIMIZATION (llama3:8b, low token limit)
llm = OllamaLLM(
    model=settings.OLLAMA_MODEL, 
    temperature=0.2,
    num_predict=120,      # Reduced for speed
    top_p=0.9,
    repeat_penalty=1.1
)

# ICD Correction Layer
ICD_MAP = {
    "appendicitis": "K35",
    "angina": "I20",
    "osteoarthritis": "M17",
    "glaucoma": "H40"
}

# 5. IN-MEMORY CACHING
_cache: Dict[str, Dict[str, Any]] = {}

# 3. SHORTEN PROMPT (Minimalist clinical prompt)
MINIMAL_PROMPT = """You are a clinical AI.
Return JSON only:
{{
  "condition": "...",
  "icd10_code": "...",
  "recommended_procedure": "...",
  "confidence_score": 0-1
}}
Use valid ICD-10 codes. Prefer common conditions."""

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

# 6. ASYNC OPTIMIZATION
async def analyze_symptom_ollama(symptom_text: str) -> Dict[str, Any]:
    start_time = time.perf_counter()
    
    # 5. CACHING LAYER
    if symptom_text in _cache:
        logger.info(f"Cache hit: {symptom_text[:20]} | Time: 0s")
        return _cache[symptom_text]

    fallback_response = {
        "condition": "Unknown",
        "icd10_code": "N/A",
        "recommended_procedure": "Consult physician",
        "confidence_score": 0.0
    }

    prompt = f"{MINIMAL_PROMPT}\n\nSymptom: {symptom_text}\nJSON:"

    try:
        # 4. RESPONSE TIMEOUT CONTROL (5s)
        response = await asyncio.wait_for(
            llm.ainvoke(prompt), 
            timeout=settings.OLLAMA_TIMEOUT
        )
        
        result = extract_json(response)
        if result:
            result = apply_icd_overrides(result)
            
            # 7. LOGGING UPDATE
            duration = time.perf_counter() - start_time
            logger.info(f"Model: {settings.OLLAMA_MODEL} | Duration: {duration:.2f}s | Out: {result['icd10_code']}")
            
            _cache[symptom_text] = result
            return result
            
    except asyncio.TimeoutError:
        logger.error(f"Timeout (5s) exceeded for: {symptom_text[:30]}")
        return {
            "condition": "Service timeout",
            "icd10_code": "N/A",
            "recommended_procedure": "Retry",
            "confidence_score": 0.0
        }
    except Exception as e:
        logger.error(f"LLM Error: {e}")

    return fallback_response
