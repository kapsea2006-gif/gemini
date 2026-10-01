import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.seed import seed_database
from app.routers import auth, students, companies, internships, applications, admin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("academia_portal")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed demo data if empty
    logger.info("Initializing database schema...")
    try:
        Base.metadata.create_all(bind=engine)
        seed_database()
    except Exception as e:
        logger.error(f"Error during database initialization/seeding: {e}")
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Academia–Industry Collaboration Portal with Extensible AI Skill Matching Engine, Role-Based Access Control, and Analytics.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(companies.router, prefix=settings.API_V1_STR)
app.include_router(internships.router, prefix=settings.API_V1_STR)
app.include_router(applications.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "api_docs": "/docs",
        "matching_engine": settings.MATCHING_ENGINE
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
