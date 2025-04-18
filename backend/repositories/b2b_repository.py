from sqlalchemy.orm import Session
from models.b2b_model import B2blead
from schemas.b2b_schema import B2bCreate
import os
import requests
from bs4 import BeautifulSoup
from groq import Groq  # pip install groq
import re
import json


def create_b2b(db: Session, b2bcreate: B2bCreate):
    db_b2blead = B2blead(
        companyname=b2bcreate.companyname,
        lead_email=b2bcreate.lead_email,
        overview=b2bcreate.overview,
        url=b2bcreate.url,
        product_details=b2bcreate.product_details,
        target_industry=b2bcreate.target_industry,
        address=b2bcreate.address,
        contact_number=b2bcreate.contact_number
    )
    db.add(db_b2blead)
    db.commit()
    db.refresh(db_b2blead)
    return db_b2blead


def get_lead_by_name(db: Session, companyname: str):
    return db.query(B2blead).filter(B2blead.companyname  == companyname).first()

def get_all_leads(db: Session):
    return db.query(B2blead).all()


######  Web Scraping using Groq #######
# Initialize Groq client with API key
# Initialize Groq client with API key
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def fetch_website_content(url):
    """Fetch and clean website content."""
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Remove script and style tags
        for script_or_style in soup(["script", "style", "noscript"]):
            script_or_style.decompose()
        
        # Get text and clean it
        text = soup.get_text(separator=' ', strip=True)
        text = re.sub(r'\s+', ' ', text)
        return text[:8000]  # Limit characters for input token safety
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return None

def summarize_with_groq(text, model="llama3-8b-8192"):
    """Generate a summary using Groq AI."""
    try:
        prompt = (
            "Summarize the following company website text. "
            "Focus on the company overview, core products, industry, and any standout features. "
            f"Website Content:\n{text}"
        )

        chat_completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a company analyst AI."},
                {"role": "user", "content": prompt}
            ]
        )

        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error during Groq summarization: {e}")
        return None

def extract_company_details(url):
    """Extract and summarize company details from the URL."""
    website_text = fetch_website_content(url)
    
    if website_text:
        summary = summarize_with_groq(website_text)


        structured_info = extract_company_info(summary)
        # Assuming that the summary contains relevant data
        company_data = {
            "Company Overview": structured_info.get("Company Overview"),  # Extracted from summary
            "Core Product or Service":  structured_info.get("Core Products"),  # Extracted from summary
            "URL": url,
            "Industry": structured_info.get("Industry"),
            "Standout Features": structured_info.get("Standout Features")
        }
        return company_data
    else:
        return {"Error": "Failed to retrieve or summarize website content"}

def save_to_json(company_details, output_filename="company_details.json"):
    """Save company details in JSON format."""
    with open(output_filename, "w") as json_file:
        json.dump(company_details, json_file, indent=4)
        print(f"Company details saved to {output_filename}")


def extract_company_info(summary_text):
    # Define the field markers
    sections = {
        "Company Overview": r"\*\*Company Overview:\*\*(.*?)\*\*Core Products:\*\*",
        "Core Products": r"\*\*Core Products:\*\*(.*?)\*\*Industry:\*\*",
        "Industry": r"\*\*Industry:\*\*(.*?)\*\*Standout Features:\*\*",
        "Standout Features": r"\*\*Standout Features:\*\*(.*)"
    }

    extracted = {}

    for key, pattern in sections.items():
        match = re.search(pattern, summary_text, re.DOTALL)
        if match:
            # Clean up and strip extra whitespace
            extracted[key] = match.group(1).strip()
        else:
            extracted[key] = None  # Not found

    return extracted