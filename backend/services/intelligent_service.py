# services/intelligent_service.py
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY")
API_URL = "https://api.aimlapi.com/v1/chat/completions"
IMAGE_API_URL = "https://api.aimlapi.com/v1/images/generations"

def repair_and_parse_json(potentially_broken_json: str):
    """
    Attempts to parse a JSON string. If it fails, it sends the string
    to the AI to be repaired and then tries to parse it again.
    """
    try:
        return json.loads(potentially_broken_json)
    except json.JSONDecodeError:
        print("Initial JSON parsing failed. Attempting to repair...")
        repair_prompt = f"""
        The following string is broken and is not valid JSON. Please fix any syntax errors 
        and return ONLY the perfectly valid JSON object. Do not add any explanation or markdown formatting.

        Broken String:
        ```
        {potentially_broken_json}
        ```
        """
        headers = {"Authorization": f"Bearer {API_KEY}"}
        data = {
            "model": "openai/gpt-5-chat-latest",
            "messages": [{"role": "user", "content": repair_prompt}],
            "max_tokens": 4096,
        }
        
        try:
            response = requests.post(API_URL, headers=headers, json=data)
            response.raise_for_status()
            repaired_string = response.json()["choices"][0]["message"]["content"]
            
            print(f"RAW REPAIR RESPONSE: {repaired_string}")
            
            if repaired_string.startswith("```json"):
                repaired_string = repaired_string[7:-3].strip()
            
            return json.loads(repaired_string)
        except Exception as e:
            print(f"Could not repair JSON. Error: {e}")
            raise

def handle_user_request(user_input: str, target_language: str):
    """
    This function has one job: to generate the full code package.
    """
    if not API_KEY:
        return {"type": "error", "content": "API Key is not configured."}

    master_prompt = f"""
    You are 'Linter', an expert AI software architect. A user has submitted a piece of legacy code to be modernized into {target_language}.

    USER'S LEGACY CODE:
    ```{user_input}```

    Your task is to generate a complete software package by performing the following steps and returning a single, final JSON object with the following keys: "analysis", "refactored_code", "audit_report", "unit_test", "diagram_prompt".

    1.  **Analyze Logic:** Briefly describe the business logic of the legacy code.
    2.  **Refactor Code:** Refactor the legacy code into a modern, efficient function in {target_language}.
    3.  **Generate Documentation:** Add clear, line-by-line comments and a professional docstring to the new function.
    4.  **Perform Audit:** Provide a brief "Performance & Security Audit" report.
    5.  **Generate Unit Test:** Write a simple, runnable unit test for the new function.
    6.  **Create Diagram Prompt:** Write a detailed text prompt for an AI image generator to create a flowchart of the NEWLY refactored code's logic. This prompt must end with the instruction: 'Generate this image in a high-resolution 1024x1024 format to ensure all text is sharp and legible.'
    """

    headers = {"Authorization": f"Bearer {API_KEY}"}
    data = {
        "model": "openai/gpt-5-chat-latest",
        "messages": [{"role": "user", "content": master_prompt}],
        "response_format": {"type": "json_object"},
        "max_tokens": 4096,
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=data)
        response.raise_for_status()
        
        package_json_str = response.json()["choices"][0]["message"]["content"]
        package = repair_and_parse_json(package_json_str)

        diagram_prompt = package.get("diagram_prompt")
        if diagram_prompt:
            image_url = generate_image_from_prompt(diagram_prompt)
            print(f"GENERATED IMAGE URL: {image_url}")
            
            if image_url:
                package["image_url"] = image_url

        return {"type": "refactor_package", "content": package}

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        print(f"Status Code: {http_err.response.status_code}")
        print(f"Response Body: {http_err.response.text}")
        return {"type": "error", "content": f"The AI API returned an error: {http_err.response.status_code}"}
    except Exception as e:
        print(f"An error occurred in the orchestrator: {e}")
        return {"type": "error", "content": "Sorry, I encountered an error."}

def generate_image_from_prompt(prompt: str):
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