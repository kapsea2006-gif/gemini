import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Academia–Industry Collaboration Portal"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-jwt-key-for-academia-portal-2026!#$")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for convenience

    # Database
    # Standard PostgreSQL URL format: postgresql://user:password@localhost:5432/academia_portal
    # Defaults to SQLite for immediate local plug-and-play if PostgreSQL is not active
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./portal.db"
    )

    # Matching Engine Strategy
    # Options: "weighted_rules" (default, highly configurable) or "semantic_tfidf"
    MATCHING_ENGINE: str = os.getenv("MATCHING_ENGINE", "weighted_rules")

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
