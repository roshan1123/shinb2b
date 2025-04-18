from pydantic import BaseModel
from models.b2b_model import B2blead
from typing import Optional

class B2bCreate(BaseModel):
    companyname: str
    lead_email: str
    url: str
    overview: str
    product_details: str
    target_industry: str
    address: str
    contact_number: str

class B2bUpdate(BaseModel):
    companyname: Optional[str] = None
    lead_email: Optional[str]= None
    overview: Optional[str]= None
    url: Optional[str]= None
    product_details: Optional[str]= None
    target_industry: Optional[str]= None
    address: Optional[str]= None
    contact_number: Optional[str]= None

    class Config:
        orm_mode = True