import os
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None


def get_response(message):

    if not message.strip():
        return "Please type something!"

    if "time" in message.lower():
        return "Current time is " + datetime.now().strftime("%I:%M %p")

    if "date" in message.lower() or "today" in message.lower():
        return "Today's date is " + datetime.now().strftime("%d-%m-%Y")

    if client is None:
        return "API key not found. Check your .env file."

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": "You are SmartBot, a helpful AI assistant."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            max_completion_tokens=512
        )

        return response.choices[0].message.content

    except Exception as e:
        return "AI Error: " + str(e)