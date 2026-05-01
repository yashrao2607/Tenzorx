import json
import logging
import time
import asyncio
from typing import Dict, Any, Optional
from langchain_ollama import OllamaLLM
from config import settings

logger = logging.getLogger(__name__)

llm = OllamaLLM(
    model=settings.OLLAMA_MODEL, 
    temperature=0.2,
    num_predict=120,
    top_p=0.9,
    repeat_penalty=1.1
)

MINIMAL_PROMPT = """You are a clinical AI.
Return JSON only:
{{
  "condition": "...",
  "icd10_code": "...",
  "recommended_procedure": "...",
  "confidence_score": 0-1
}}

Rules:
* Always return a SPECIFIC medical procedure (e.g., Appendectomy, Angioplasty, Knee Replacement).
* AVOID vague terms like 'Consultation', 'Evaluation', or 'Checkup'.
* Use valid ICD-10 codes. Prefer common conditions."""

class DiagnosticianAgent:
    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def _extract_json(self, text: str) -> Optional[Dict[str, Any]]:
        try:
            start_index = text.find('{')
            end_index = text.rfind('}')
            if start_index == -1 or end_index == -1:
                return None
            return json.loads(text[start_index:end_index + 1])
        except Exception:
            return None

    async def analyze(self, symptom_text: str) -> Dict[str, Any]:
        start_time = time.perf_counter()
        
        if symptom_text in self._cache:
            logger.info(f"[Diagnostician] Cache hit: {symptom_text[:20]}")
            return self._cache[symptom_text]

        prompt = f"{MINIMAL_PROMPT}\n\nSymptom: {symptom_text}\nJSON:"

        try:
            response = await asyncio.wait_for(
                llm.ainvoke(prompt), 
                timeout=settings.OLLAMA_TIMEOUT
            )
            
            result = self._extract_json(response)
            if result:
                duration = time.perf_counter() - start_time
                logger.info(f"[Diagnostician] Logic Success | Duration: {duration:.2f}s")
                self._cache[symptom_text] = result
                return result
                
        except asyncio.TimeoutError:
            logger.error(f"[Diagnostician] Timeout exceeded")
            return {
                "condition": "Service timeout",
                "icd10_code": "N/A",
                "recommended_procedure": "Retry",
                "confidence_score": 0.0
            }
        except Exception as e:
            logger.error(f"[Diagnostician] Error: {e}")

        return {
            "condition": "Unknown",
            "icd10_code": "N/A",
            "recommended_procedure": "Consult physician",
            "confidence_score": 0.0
        }
