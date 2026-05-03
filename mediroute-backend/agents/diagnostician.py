import json
import logging
import time
import asyncio
from typing import Dict, Any, Optional, List
from langchain_google_genai import ChatGoogleGenerativeAI
from config import settings

logger = logging.getLogger(__name__)

PRIMARY_MODEL = settings.GEMINI_MODEL or "gemini-2.0-flash"
FALLBACK_MODEL = "gemini-2.0-flash"

llm_primary = ChatGoogleGenerativeAI(
    model=PRIMARY_MODEL,
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.2,
)

llm_fallback = ChatGoogleGenerativeAI(
    model=FALLBACK_MODEL,
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.2,
)

QUESTIONS_PROMPT = """You are a clinical AI agent. A user has a medical concern. 
Your goal is to ask 3-4 highly relevant clarifying questions to help narrow down the likely medical procedure needed.
Return JSON only:
{{
  "questions": [
    "Question 1...",
    "Question 2...",
    "Question 3...",
    "Question 4..."
  ]
}}
Ensure questions are concise and directly help in surgical/procedure identification."""

DIAGNOSIS_PROMPT = """You are a clinical AI agent. 
Based on the user's initial concern, their answers to clarifying questions, and their VERIFIED clinical history (comorbidities/past surgeries), identify the most likely medical condition and required procedure.

Return JSON only:
{{
  "condition": "...",
  "icd10_code": "...",
  "recommended_procedure": "...",
  "confidence_score": 0.0-1.0,
  "clinical_rationale": "Briefly explain how the clinical history (if any) impacted this diagnosis.",
  "procedure_aliases": ["...", "..."]
}}

Rules:
* Always return a SPECIFIC medical procedure (e.g., Appendectomy, Angioplasty, Knee Replacement).
* AVOID vague terms like 'Consultation' or 'Evaluation'.
* Use valid ICD-10 codes.
* If clinical history increases surgical risk or complexity, reflect that in the confidence score and rationale."""

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

    async def _invoke_model(self, model: ChatGoogleGenerativeAI, prompt: str) -> Optional[Dict[str, Any]]:
        try:
            response = await asyncio.wait_for(
                model.ainvoke(prompt),
                timeout=settings.API_TIMEOUT
            )
            return self._extract_json(response.content)
        except Exception as e:
            logger.error(f"Model invocation error: {e}")
            return None

    async def get_clarifying_questions(self, concern: str) -> Dict[str, Any]:
        prompt = f"{QUESTIONS_PROMPT}\n\nMedical Concern: {concern}\nJSON:"
        result = await self._invoke_model(llm_primary, prompt)
        if not result:
            result = await self._invoke_model(llm_fallback, prompt)
        return result or {"questions": ["Can you describe the pain in more detail?", "How long have you been experiencing this?", "Are there any other symptoms?"]}

    async def analyze(self, symptom_text: str, answers: Optional[List[Dict[str, str]]] = None, clinical_history: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        history_str = "None"
        if clinical_history:
            comorb = ", ".join(clinical_history.get("comorbidities", [])) or "None"
            past_surg = ", ".join(clinical_history.get("past_surgeries", [])) or "None"
            history_str = f"Comorbidities: {comorb} | Past Surgeries: {past_surg}"

        if not answers:
            # Traditional one-shot analysis
            prompt = f"{DIAGNOSIS_PROMPT}\n\nClinical History: {history_str}\n\nSymptom: {symptom_text}\nJSON:"
        else:
            # Multi-turn analysis
            answers_str = "\n".join([f"Q: {a['question']}\nA: {a['answer']}" for a in answers])
            prompt = f"{DIAGNOSIS_PROMPT}\n\nClinical History: {history_str}\n\nInitial Concern: {symptom_text}\n\nClarifying Answers:\n{answers_str}\nJSON:"

        result = await self._invoke_model(llm_primary, prompt)
        if not result:
            result = await self._invoke_model(llm_fallback, prompt)
            
        if not result:
            return {
                "condition": "Unknown",
                "icd10_code": "N/A",
                "recommended_procedure": "Consult physician",
                "confidence_score": 0.0,
                "clinical_rationale": "Model failed to generate response.",
                "procedure_aliases": ["Consult doctor"]
            }
        return result

