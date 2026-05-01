import os
import json
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

CLAUDE_MODEL = "claude-3-5-sonnet-20240620"
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def analyze_intent(symptoms: str, age: int, conditions_text: str = ""):
    """
    Blueprint: LLM-Based Multi-Agent System (MAS) Simulation
    Expanded: Analyzes both symptoms and free-text pre-existing conditions.
    """

    system_prompt = """
    You are a Multi-Agent Clinical Support System (MACSS). 
    Your workflow:
    1. DIAGNOSE: Map symptoms to ICD-10.
    2. CONDITION ANALYSIS: Analyze pre-existing conditions and assign a risk multiplier (1.0 to 2.0).
    3. INVESTIGATE: Suggest labs/tests.
    4. TREAT: Recommend standard clinical path.

    Return JSON:
    {
        "icd10_code": "code",
        "procedure_name": "name",
        "diagnostic_hypothesis": ["h1", "h2"],
        "investigations": ["test1", "test2"],
        "care_plan": "Step-by-step clinical protocol",
        "confidence_score": 0.XX,
        "risk_multiplier": 1.XX,
        "condition_tags": ["tag1", "tag2"],
        "risk_explanation": "Why this risk multiplier was assigned"
    }
    """
    
    prompt = f"""
    Patient Age: {age}
    Symptoms: {symptoms}
    Pre-existing Conditions: {conditions_text}
    """
    
    try:
        message = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=1000,
            temperature=0,
            system=system_prompt,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return json.loads(message.content[0].text)
    except Exception as e:
        print(f"Agent Error: {e}")
        return {
            "icd10_code": "I25.10",
            "procedure_name": "Angioplasty",
            "diagnostic_hypothesis": ["Coronary Artery Disease"],
            "investigations": ["ECG", "Troponin"],
            "care_plan": "Standard cardiac stabilization protocol.",
            "confidence_score": 0.85,
            "risk_multiplier": 1.2,
            "condition_tags": ["Cardiovascular"],
            "risk_explanation": "Fallback due to API error."
        }
