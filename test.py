import requests

# Define the API endpoint
url = "https://devsdocode-openai.hf.space/chat/completions"

# Define the request payload
payload = {
    "model": "gpt-4-turbo-2024-04-09",
    "messages": [
        {"role": "system", "content": "You are a helpful AI assistant."},
        {"role": "user", "content": "Write a short story about a robot exploring Mars."}
    ],
    "temperature": 0.7,
    "top_p": 1,
    "stream": False
}

# Send the request
response = requests.post(url, json=payload)

# Print the response
if response.status_code == 200:
    result = response.json()
    print(result["choices"][0]["message"]["content"])
else:
    print(f"Error: {response.status_code}, {response.text}")
