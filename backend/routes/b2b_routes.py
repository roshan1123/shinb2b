from fastapi import APIRouter, Depends, HTTPException,status, File, UploadFile
from sqlalchemy.orm import Session

from database.connection import get_db
from models.b2b_model import B2blead
from schemas.b2b_schema import B2bUpdate
from schemas.b2b_schema import B2bCreate
from repositories.b2b_repository import create_b2b, get_lead_by_name, get_all_leads,extract_company_details,save_to_json
from security.settings import  admin_required, manager_required, user_required, validate_password, verify_password, create_access_token, verify_token
import datetime
from typing import List 
import pandas as pd
import io


b2b_router = APIRouter()

@b2b_router.post("/b2bleads")
def create_b2b_routes(b2blead: B2bCreate, db: Session = Depends(get_db)):
    if get_lead_by_name(db, b2blead.companyname):
        raise HTTPException(status_code=400, detail="Company Name already Exisits")
    create_b2b(db, b2blead)
    return {"message": "Company Data Registered successfully"}


@b2b_router.get("/getleads")
def get_all_leads_data(db: Session = Depends(get_db), payload: dict = Depends(admin_required)):
    try:
        b2bleads = get_all_leads(db)
        return [
            {
                "id": b2blead.id,
                "companyname": b2blead.companyname,
                "leademail": b2blead.lead_email,
                "overview": b2blead.overview,
                "url": b2blead.url,
                "product_details": b2blead.product_details,
                "target_industry": b2blead.target_industry,
                "address": b2blead.address,
                "contact_number": b2blead.contact_number
            }
            for b2blead in b2bleads
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@b2b_router.post("/upload-b2b")
def upload_b2b_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # 1. Read file content
        contents = file.file.read()

        # 2. Load into pandas dataframe
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        # 3. Validate required columns
        required_columns = ['companyname']
        for col in required_columns:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Missing column: {col}")

        # 4. Process rows
        leads_to_add = []
        duplicate_companies = []

        for _, row in df.iterrows():
            company_name = row['companyname'].strip()

            # Check for duplicate company name in DB
            existing = db.query(B2blead).filter(B2blead.companyname == company_name).first()
            if existing:
                duplicate_companies.append(company_name)
                continue

            lead = B2blead(
                companyname=company_name,
                lead_email=row['lead_email'],
                overview=row['overview'],
                url=row['url'],
                product_details=row['product_details'],
                target_industry=row['target_industry'],
                address=row['address'],
                contact_number=row['contact_number']
            )
            leads_to_add.append(lead)

        # 5. Insert new records
        if leads_to_add:
            db.bulk_save_objects(leads_to_add)
            db.commit()

        return {
            "message": f"{len(leads_to_add)} B2B leads uploaded successfully.",
            "duplicates_skipped": duplicate_companies
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        file.file.close()
     
    

 # Update B2B Lead
@b2b_router.put("/update-lead/{companyname}")
def update_b2b_lead(companyname: str, b2b_update: B2bUpdate, db: Session = Depends(get_db)):
    # Get the existing lead from the database
    existing_lead = db.query(B2blead).filter(B2blead.companyname == companyname).first()

    if not existing_lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    #Web Scraping
    company_details = extract_company_details(existing_lead.url)
    # Save the result as JSON
    save_to_json(company_details)
    # Traverse and print each key-value pair
    for key, value in company_details.items():
        print(f"{key}: {value}")
    
    b2b_update.overview = company_details.get("Company Overview")
    b2b_update.product_details = company_details.get("Core Product or Service")
    b2b_update.target_industry = company_details.get("Industry")
    #b2b_update.overview = company_details.get("Standout Features")

    print(b2b_update.overview)

    if b2b_update.overview:
        existing_lead.overview = b2b_update.overview

    if b2b_update.product_details:
        existing_lead.product_details = b2b_update.product_details

    if b2b_update.target_industry:
        existing_lead.target_industry = b2b_update.target_industry
    

    # Commit the changes to the database
    db.commit()
    db.refresh(existing_lead)

    return {"message": "B2B lead updated successfully", "lead": existing_lead}

