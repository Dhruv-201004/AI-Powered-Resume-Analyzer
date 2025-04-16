from flask import Flask
from dotenv import load_dotenv
import google.generativeai as genai
import os

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GENAI_API_KEY"))

# Create the Flask app instance
app = Flask(__name__)

# Import routes from main.py
from main import setup_routes

# Setup the app routes
setup_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
