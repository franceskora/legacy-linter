# services/intelligent_service.py
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY")
API_URL = "https://api.aimlapi.com/v1/chat/completions"
IMAGE_API_URL = "https://api.aimlapi.com/v1/images/generations"

def handle_user_request(user_input: str, target_language: str):
    """
    This is the main orchestrator. It understands the user's intent and
    can deliver a simple answer or a full code modernization package.
    """
    if not API_KEY:
        return {"type": "error", "content": "API Key is not configured."}

    master_prompt = f"""
    You are 'Linter', an expert AI software architect. Analyze the user's input and determine their intent from the options below.

    USER INPUT:
    ```{user_input}```

    Respond with a single JSON object that has a 'type' key and a 'content' key based on the following rules:

    1.  **Intent: Full Code Modernization Request**
        - **Condition:** The input is a block of code, and a target language ('{target_language}') is specified.
        - **Action:** Generate a complete software package.
        - **JSON Output:**
            {{
                "type": "refactor_package",
                "content": {{
                    "analysis": "<Your brief analysis of the code's logic>",
                    "refactored_code": "<The complete, documented, refactored code in {target_language}>",
                    "audit_report": "<A brief Performance & Security Audit report>",
                    "unit_test": "<A simple, runnable unit test for the new code>",
                    "diagram_prompt": "<A detailed text prompt for an AI image generator to create a flowchart. **Crucially, the prompt must end with the instruction: 'Generate this image in a high-resolution 1024x1024 format to ensure all text is sharp and legible.'**>"
                }}
            }}

    2.  **Intent: Code Submission without Target Language**
        - **Condition:** The input is a block of code, but no target language is specified.
        - **Action:** Identify the source language and ask the user for the target language.
        - **JSON Output:**
            {{
                "type": "clarification",
                "content": "I've identified this as [Source Language] code. What language would you like to convert it to? I can suggest Python or JavaScript."
            }}

    3.  **Intent: Website Generation Request (Step-by-Step)**
        - **Condition:** The user asks to create a webpage.
        - **Action:** First, generate only the code.
        - **JSON Output:**
            {{
                "type": "website_code",
                "content": {{
                    "html_code": "<The generated HTML>",
                    "css_code": "<The generated CSS>",
                    "js_code": "<The generated JS>",
                    "follow_up_prompt": "I've generated the code for your webpage. Would you like me to generate a visual preview of how it will look?"
                }}
            }}

    4.  **Intent: General Question / Follow-up**
        - **Condition:** The input is a question or a statement, not a block of code for modernization or website generation.
        - **Action:** Answer the question conversationally.
        - **JSON Output:**
            {{
                "type": "answer",
                "content": "<Your conversational answer>"
            }}
    """

    headers = {"Authorization": f"Bearer {API_KEY}"}
    data = {
        "model": "gpt-5",
        "messages": [{"role": "user", "content": master_prompt}],
        "response_format": {"type": "json_object"}
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data)
        response.raise_for_status()
        
        decision_json_str = response.json()["choices"][0]["message"]["content"]
        decision = json.loads(decision_json_str)

        if decision.get("type") == "refactor_package":
            diagram_prompt = decision["content"].get("diagram_prompt")
            if diagram_prompt:
                image_url = generate_image_from_prompt(diagram_prompt)
                decision["content"]["image_url"] = image_url

        return decision

    except Exception as e:
        print(f"An error occurred in the orchestrator: {e}")
        return {"type": "error", "content": "Sorry, I encountered an error."}


def generate_image_from_prompt(prompt: str):
    """
    Calls the "gpt 1" vision model to generate a high-resolution image.
    """
    headers = {"Authorization": f"Bearer {API_KEY}"}
    image_data = { 
        "model": "gpt 1", # Using your preferred model
        "prompt": prompt, 
        "n": 1, 
        "size": "1024x1024" # Ensuring high resolution
    }
    
    try:
        image_response = requests.post(IMAGE_API_URL, headers=headers, json=image_data)
        image_response.raise_for_status()
        return image_response.json()["data"][0]["url"]
    except Exception as e:
        print(f"Error generating image: {e}")
        return None