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

Analyse the following business process and design a practical
AI-enabled future-state process.

Industry:
{industry}

Process Name:
{process_name}

Current Process Description:
{description}

Business Objective:
{objective}

Return ONLY valid JSON.

Use exactly this structure:

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

Rules:

1. Identify realistic current process steps only from the description.
2. Identify the most important operational problems.
3. Severity must be exactly one of:
   High, Medium, Low.
4. Suggest practical AI opportunities.
5. Clearly distinguish:
   AI, Human, and System responsibilities.
6. Keep recommendations relevant to the specified industry.
7. Do not invent unrelated business activities.
8. The future process should improve the current process and address
   the stated business objective.
9. Keep the output concise and practical.
10. Return valid JSON only. Do not include markdown or ```json.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
        },
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response")

    return response.text