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
    This function has one job: to generate the full code package.
    """
    if not API_KEY:
        return {"type": "error", "content": "API Key is not configured."}

    # A simpler, more direct master prompt
    master_prompt = f"""
    You are 'Linter', an expert AI software architect. A user has submitted a piece of legacy code to be modernized into {target_language}.

    USER'S LEGACY CODE:
    ```{user_input}```

    Your task is to generate a complete software package by performing the following steps and returning a single, final JSON object.

    1.  **Analyze Logic:** Briefly describe the business logic of the legacy code.
    2.  **Refactor Code:** Refactor the legacy code into a modern, efficient function in {target_language}.
    3.  **Generate Documentation:** Add clear, line-by-line comments and a professional docstring to the new function.
    4.  **Perform Audit:** Provide a brief "Performance & Security Audit" report.
    5.  **Generate Unit Test:** Write a simple, runnable unit test for the new function.
    6.  **Create Diagram Prompt:** Write a detailed text prompt for an AI image generator to create a flowchart of the NEWLY refactored code's logic. This prompt must end with the instruction: 'Generate this image in a high-resolution 1024x1024 format to ensure all text is sharp and legible.'

    Return your entire response as a single JSON object with the following keys:
    "analysis", "refactored_code", "audit_report", "unit_test", "diagram_prompt".
    """

    headers = {"Authorization": f"Bearer {API_KEY}"}
    data = {
        "model": "openai/gpt-5-chat-latest",
        "messages": [{"role": "user", "content": master_prompt}],
        "response_format": {"type": "json_object"}
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data)
        response.raise_for_status()
        
        package_json_str = response.json()["choices"][0]["message"]["content"]
        package = json.loads(package_json_str)

        diagram_prompt = package.get("diagram_prompt")
        if diagram_prompt:
            image_url = generate_image_from_prompt(diagram_prompt)
            package["image_url"] = image_url

        return {
            "type": "refactor_package",
            "content": package
        }

    except Exception as e:
        print(f"An error occurred in the orchestrator: {e}")
        return {"type": "error", "content": "Sorry, I encountered an error."}


def generate_image_from_prompt(prompt: str):
    """
    Calls the "gpt 1" vision model to generate a high-resolution image.
    """
    headers = {"Authorization": f"Bearer {API_KEY}"}
    image_data = { 
        "model": "openai/gpt-image-1",
        "prompt": prompt, 
        "n": 1, 
        "size": "1024x1024"
    }
    
    try:
        image_response = requests.post(IMAGE_API_URL, headers=headers, json=image_data)
        image_response.raise_for_status()
        return image_response.json()["data"][0]["url"]
    except Exception as e:
        print(f"Error generating image: {e}")
        return None