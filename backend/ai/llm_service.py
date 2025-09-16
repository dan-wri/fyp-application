import os
import json
import random
from openai import OpenAI
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def improve_text_with_ai(text: str, rewrite_type: str) -> str:
    """
    Uses OpenAI to rewrite text based on the type.
    """
    if rewrite_type == "Email":
        system_prompt = """You are a professional email writer.
        Rewrite the user's text as a clear, concise, professional business email.
        Keep the meaning, but improve tone and structure."""
    else:
        system_prompt = """You are a professional editor.
        Rewrite the text to be clearer, more fluent, and professional.
        Do not change its meaning.
        Return only the improved text."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            temperature=0.4
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error improving text with AI: {e}")
        return "Could not improve text."
