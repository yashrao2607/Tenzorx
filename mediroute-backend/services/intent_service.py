import os
import json
import anthropic

PROCEDURE_MAP = {
    "knee pain": {"procedure": "Total Knee Replacement", "icd": "Z96.65"},
    "chest pain": {"procedure": "Angioplasty", "icd": "I25.10"},
    "eye": {"procedure": "Cataract Surgery", "icd": "H25.9"},
    "stomach": {"procedure": "Appendectomy", "icd": "K35.80"},
    "gallbladder": {"procedure": "Gallbladder Removal", "icd": "K80.20"}
}

def analyze_intent(symptoms: str, age: int):
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        return _fallback_intent(symptoms)

    try:
        client = anthropic.Anthropic(api_key=api_key)
        prompt = f"""You are a clinical mapping AI.
Given these symptoms: '{symptoms}' and age: {age},
Classify the primary symptom cluster into one of these EXACT categories if applicable: 'knee pain', 'chest pain', 'eye', 'stomach', 'gallbladder'.
If none match, provide a very short symptom summary.
Return ONLY valid JSON with keys: "symptom_category" and "explanation". Do not use markdown backticks.
"""
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=200,
            temperature=0.1,
            messages=[{"role": "user", "content": prompt}]
        )
        content = response.content[0].text.strip()
        
        # Clean up JSON
        if content.startswith("```json"): content = content[7:]
        if content.startswith("```"): content = content[3:]
        if content.endswith("```"): content = content[:-3]
        
        try:
            data = json.loads(content.strip())
        except:
            return _fallback_intent(symptoms)
            
        category = data.get("symptom_category", "").lower()
        explanation = data.get("explanation", "AI analyzed symptoms.")
        
        match = PROCEDURE_MAP.get(category)
        if match:
            return {
                "procedure_name": match["procedure"],
                "icd_code": match["icd"],
                "confidence_score": 0.95,
                "explanation": explanation
            }
        else:
            return _fallback_intent(symptoms)
    except Exception as e:
        print(f"Error calling Claude: {e}")
        return _fallback_intent(symptoms)

def _fallback_intent(symptoms: str):
    symptom_lower = symptoms.lower()
    for key, val in PROCEDURE_MAP.items():
        if key in symptom_lower:
            return {
                "procedure_name": val["procedure"],
                "icd_code": val["icd"],
                "confidence_score": 0.85,
                "explanation": f"Matched symptom cluster: {key}"
            }
    return {
        "procedure_name": "General Consultation",
        "icd_code": "Z00.00",
        "confidence_score": 0.50,
        "explanation": "Could not map to specific procedure."
    }
