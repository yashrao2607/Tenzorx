import json
import logging
import re
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from config import settings

logger = logging.getLogger(__name__)

# Use the modern OllamaLLM class to resolve deprecations
llm = OllamaLLM(model=settings.OLLAMA_MODEL, temperature=0)

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

def extract_json(text: str):
    """
    Robustly extracts a JSON object from a string, finding the first '{' and last '}'.
    """
    try:
        # Find the first '{' and the last '}'
        start_index = text.find('{')
        end_index = text.rfind('}')
        
        if start_index == -1 or end_index == -1:
            return None
            
        json_str = text[start_index:end_index + 1]
        return json.loads(json_str)
    except Exception as e:
        logger.error(f"JSON Extraction Error: {e}")
        return None

def analyze_symptom_ollama(symptom_text: str):
    """
    Analyzes user symptoms using local Ollama (Llama 3).
    Returns a dictionary with condition, icd10_code, recommended_procedure, and confidence_score.
    """
    
    prompt_template = PromptTemplate(
        template="{system_prompt}\n\nUser Symptom: {symptom_text}\n\nReturn ONLY a JSON object in this format:\n{{\n  \"condition\": \"...\",\n  \"icd10_code\": \"...\",\n  \"recommended_procedure\": \"...\",\n  \"confidence_score\": 0.XX\n}}",
        input_variables=["system_prompt", "symptom_text"]
    )
    
    formatted_prompt = prompt_template.format(
        system_prompt=system_prompt,
        symptom_text=symptom_text
    )
    
    try:
        response = llm.invoke(formatted_prompt)
        logger.debug(f"Raw Ollama Response: {response}")
        
        # Robust extraction
        result = extract_json(response)
        
        if result:
            return result
        else:
            logger.error(f"Failed to extract JSON from response: {response}")
            raise ValueError("No valid JSON found in LLM response")
    
    except Exception as e:
        logger.error(f"Ollama Service Error: {e}")
        # Fallback if parsing fails or LLM errors
        return {
            "condition": "Analysis Error",
            "icd10_code": "Unknown",
            "recommended_procedure": "Clinical consultation required",
            "confidence_score": 0.0,
            "error_detail": str(e)
        }
