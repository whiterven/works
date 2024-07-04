from flask import Flask, render_template, request, jsonify
import os
import openai
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)

# Set your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Print the API key to verify it's being loaded
#print(os.getenv("OPENAI_API_KEY"))

def generate_cover_letter_with_gpt35(job_description, resume):
    prompt = f"""
    Write a compelling and tailored cover letter based on this job description and resume:

    ## Job Description:
    {job_description}

    ## Resume:
    {resume}

    ## Cover Letter:
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates professional cover letters."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.5,
        max_tokens=1024,
    )

    cover_letter = response['choices'][0]['message']['content'] # type: ignore
    return cover_letter

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_cover_letter', methods=['POST'])
def api_generate_cover_letter():
    data = request.get_json()
    job_description = data['job_description']
    resume = data['resume']

    cover_letter = generate_cover_letter_with_gpt35(job_description, resume)
    return jsonify({'cover_letter': cover_letter})

if __name__ == '__main__':
    app.run(debug=True)
