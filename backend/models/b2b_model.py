from sqlalchemy import Column, Integer, String
from database.connection import Base

class B2blead(Base):
    __tablename__ = "b2blead"
    id = Column(Integer, primary_key=True, index=True)
    companyname = Column(String, unique=True, index=True)
    lead_email = Column(String)
    url = Column(String)
    overview = Column(String)
    product_details = Column(String)
    target_industry = Column(String)
    address = Column(String)
    contact_number = Column(String)