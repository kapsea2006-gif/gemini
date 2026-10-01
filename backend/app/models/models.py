import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="student")  # "student", "company", "admin"
    avatar_url = Column(String(512), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    company_profile = relationship("CompanyProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    headline = Column(String(255), nullable=True)
    major = Column(String(255), nullable=True)
    university = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    gpa = Column(Float, nullable=True)
    bio = Column(Text, nullable=True)
    
    # Store rich arrays in JSON
    # e.g., ["Python", "PyTorch", "React", "Docker"]
    skills = Column(JSON, default=list)
    # e.g., [{"title": "AWS Certified Developer", "issuer": "Amazon", "year": 2025, "credential_id": "AWS-123"}]
    certifications = Column(JSON, default=list)
    # e.g., ["Natural Language Processing", "Robotics", "Cloud Architecture"]
    interests = Column(JSON, default=list)

    location_preference = Column(String(255), default="Remote")
    resume_url = Column(String(512), nullable=True)
    github_url = Column(String(512), nullable=True)
    linkedin_url = Column(String(512), nullable=True)
    portfolio_url = Column(String(512), nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="student_profile")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")


class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_name = Column(String(255), nullable=False)
    industry = Column(String(255), nullable=True)
    website = Column(String(512), nullable=True)
    location = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String(512), nullable=True)
    is_verified = Column(Boolean, default=False)  # Admin approval verification
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="company_profile")
    internships = relationship("Internship", back_populates="company", cascade="all, delete-orphan")


class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("company_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    department = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    location_type = Column(String(50), default="remote")  # "remote", "hybrid", "onsite"
    location = Column(String(255), default="Remote")
    duration_weeks = Column(Integer, default=12)
    stipend_monthly = Column(Float, default=0.0)
    
    # Required skills e.g., ["Python", "FastAPI", "PostgreSQL"]
    required_skills = Column(JSON, default=list)
    # Preferred skills e.g., ["Docker", "Kubernetes", "AWS"]
    preferred_skills = Column(JSON, default=list)
    # Target majors e.g., ["Computer Science", "Data Science"]
    academic_fields = Column(JSON, default=list)
    min_gpa = Column(Float, nullable=True)
    openings = Column(Integer, default=1)
    deadline = Column(String(50), nullable=True)
    status = Column(String(50), default="open")  # "open", "closed", "draft"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("CompanyProfile", back_populates="internships")
    applications = relationship("Application", back_populates="internship", cascade="all, delete-orphan")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="applied")  # "applied", "under_review", "shortlisted", "interviewing", "accepted", "rejected"
    cover_letter = Column(Text, nullable=True)
    match_score_at_application = Column(Float, default=0.0)
    match_breakdown = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    internship = relationship("Internship", back_populates="applications")
    student = relationship("StudentProfile", back_populates="applications")
