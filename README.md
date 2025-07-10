# 🤖 AI-Powered Resume Analyzer – Resume Insight

An intelligent resume analyzer web app that helps job seekers and recruiters evaluate resumes in seconds. Built using **Gemini 1.5 Flash**, **NLP**, and **Flask**, the tool extracts key details and provides AI-driven insights to improve resume quality — all within a clean, interactive interface.

> ✅ **Live Demo:** [resume-insight.onrender.com](https://resume-insight.onrender.com)

---

## 🚀 Features

- 📄 **Upload Resume (PDF)**  
  Instantly parse resumes and extract structured information.

- 🤖 **Gemini-Powered Feedback**  
  Leverages **Gemini 1.5 Flash API** to compare resumes against job descriptions and offer contextual feedback.

- 🧠 **NLP-Based Resume Analysis**  
  Uses `spaCy` and other NLP tools to extract skills, experience, and sections.

- 📊 **Insightful Summary**  
  Highlights keywords, tech stacks, and provides feedback on structure and content.

- 🌓 **Clean UI/UX**  
  Minimal and responsive interface for seamless interaction.

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python, Flask  
- **AI & NLP:** Gemini 1.5 Flash API, spaCy, PyPDF2  
- **Hosting:** Render

---

## 📦 Getting Started Locally

### 1. Clone the Repository

```
git clone https://github.com/Dhruv-201004/AI-Powered-Resume-Analyzer.git
cd AI-Powered-Resume-Analyzer
```
### 2. Create Virtual Environment & Install Dependencies
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
### 3. Add Gemini API Key
Create a .env file in the project root:
```
GEMINI_API_KEY=your_gemini_api_key_here
```
### 4. Start the Flask App
```
python app.py
```
Visit http://localhost:5000 in your browser to use the app locally.


Built with ❤️ by [Dhruv](https://github.com/Dhruv-201004)
