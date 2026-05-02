from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

def test_model(model_name):
    print(f"Testing {model_name}...")
    try:
        llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=os.getenv("GEMINI_API_KEY"),
            temperature=0
        )
        response = llm.invoke("Hi")
        print(f"Success: {response.content}")
        return True
    except Exception as e:
        print(f"Failed: {e}")
        return False

models_to_try = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
for m in models_to_try:
    if test_model(m):
        break
