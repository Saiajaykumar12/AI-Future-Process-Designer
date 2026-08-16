import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not configured in .env")

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_process_analysis(
    industry: str,
    process_name: str,
    description: str,
    objective: str,
):
    prompt = f"""
You are an expert business process transformation consultant.

Analyse the following business process and provide a practical
AI-enabled future-state process.

Industry:
{industry}

Process Name:
{process_name}

Current Process Description:
{description}

Business Objective:
{objective}

Return ONLY valid JSON in exactly this structure:

{{
  "current_process": [
    "step 1",
    "step 2",
    "step 3"
  ],
  "problems": [
    {{
      "activity": "Activity name",
      "problem": "Problem description",
      "severity": "High"
    }}
  ],
  "opportunities": [
    {{
      "title": "AI opportunity",
      "description": "How AI can help"
    }}
  ],
  "future_process": [
    {{
      "activity": "Activity name",
      "responsibility": "AI"
    }}
  ]
}}

Requirements:

- Identify realistic process steps from the description.
- Identify important operational problems.
- Severity must be High, Medium, or Low.
- Suggest practical AI opportunities.
- Clearly distinguish AI, Human, and System responsibilities.
- Keep the recommendations relevant to the industry.
- Do not invent unrelated business activities.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        },
    )

    return response.text