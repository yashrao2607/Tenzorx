import json
import logging
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
# No output parser imports needed as we use manual JSON parsing
from config import settings

logger = logging.getLogger(__name__)

# Requirements: model llama3, structured JSON output
llm = Ollama(model=settings.OLLAMA_MODEL, temperature=0)

system_prompt = """
You are a clinical decision support AI.
Convert user symptoms into:
1. Most likely condition
2. ICD-10 code
3. Recommended medical procedure

Rules:
* Be medically reasonable (not perfect diagnosis)
* Prefer common conditions over rare ones
* Always output structured JSON
* Do not include explanations
"""

def analyze_symptom_ollama(symptom_text: str):
    """
    Analyzes user symptoms using local Ollama (Llama 3).
    Returns a dictionary with condition, icd10_code, recommended_procedure, and confidence_score.
    """
    
    prompt_template = PromptTemplate(
        template="{system_prompt}\n\nUser Symptom: {symptom_text}\n\nOutput JSON Format:\n{{\n  \"condition\": \"...\",\n  \"icd10_code\": \"...\",\n  \"recommended_procedure\": \"...\",\n  \"confidence_score\": 0.XX\n}}",
        input_variables=["system_prompt", "symptom_text"]
    )
    
    formatted_prompt = prompt_template.format(
        system_prompt=system_prompt,
        symptom_text=symptom_text
    )
    
    try:
        response = llm.invoke(formatted_prompt)
        
        # Simple extraction logic for JSON if model includes markdown markers
        cleaned_response = response.strip()
        if "```json" in cleaned_response:
            cleaned_response = cleaned_response.split("```json")[1].split("```")[0].strip()
        elif "```" in cleaned_response:
            cleaned_response = cleaned_response.split("```")[1].strip()
            
        return json.loads(cleaned_response)
    
    except Exception as e:
        logger.error(f"Ollama Service Error: {e}")
        # Fallback if parsing fails or LLM errors
        return {
            "condition": "Error analyzing symptoms",
            "icd10_code": "N/A",
            "recommended_procedure": "Please consult a doctor",
            "confidence_score": 0.0
        }
