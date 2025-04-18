
from fastapi import FastAPI
from database.connection import Base, engine
from routes.user_routes import user_router
from routes.b2b_routes import b2b_router
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Initialize Database
Base.metadata.create_all(bind=engine)

# FastAPI App
app = FastAPI()

# CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(user_router)
app.include_router(b2b_router)

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
