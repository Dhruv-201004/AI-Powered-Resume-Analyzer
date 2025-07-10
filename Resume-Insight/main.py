from flask import request, render_template
import io
import base64
from PIL import Image
import pdf2image
import PyPDF2 as pdf
import google.generativeai as genai

def setup_routes(app):
    def get_gemini_response(input_text, pdf_content=None, prompt=None):
        model = genai.GenerativeModel('gemini-1.5-flash')
        if pdf_content:
            response = model.generate_content([input_text, pdf_content[0], prompt])
        else:
            response = model.generate_content(input_text)
        return response.text

    def input_pdf_setup(uploaded_file):
        images = pdf2image.convert_from_bytes(uploaded_file.read())
        first_page = images[0]
        img_byte_arr = io.BytesIO()
        first_page.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()

        pdf_parts = [
            {
                "mime_type": "image/jpeg",
                "data": base64.b64encode(img_byte_arr).decode()
            }
        ]
        return pdf_parts

    def input_pdf_text(uploaded_file):
        reader = pdf.PdfReader(uploaded_file)
        text = ""
        for page in range(len(reader.pages)):
            text += reader.pages[page].extract_text()
        return text

    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/analyze', methods=['POST'])
    def analyze():
        input_text = request.form.get("job_description")
        file = request.files.get("resume")
        action = request.form.get("action")

        if not file:
            return "Please upload a PDF file to proceed."

        if action == "Analyze Resume":
            prompt = """
          You are a skilled ATS scanner and an experienced Technical Human Resource Manager with expertise in data science.
          Your task is to evaluate a resume against a job description by providing a percentage match based on years of experience, required certifications, 
          and skill relevance. 
          Assess the candidate's alignment with the role, highlight strengths, red flags, or gaps, and offer advice on enhancing skills or addressing deficiencies. 
          Finally, identify missing keywords in the resume compared to the job description, presenting all findings concisely and comprehensively.
          Do all these under 1000 words. Give Percentage match first in different form highlighting it.
          Don't give hypothetical answers if no proper job description given just answer give proper job description."""
            
        else:
             return "Invalid action."

        pdf_content = input_pdf_setup(file)
        response = get_gemini_response(input_text, pdf_content, prompt)
        return response
