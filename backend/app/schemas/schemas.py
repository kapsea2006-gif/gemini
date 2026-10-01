import datetime
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, EmailStr, Field

# --- Auth & User Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = Field(..., pattern="^(student|company|admin)$")

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(UserBase):
    id: int
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None


# --- Student Profile Schemas ---
class CertificationItem(BaseModel):
    title: str
    issuer: str
    year: Optional[int] = None
    credential_id: Optional[str] = None

class StudentProfileBase(BaseModel):
    headline: Optional[str] = None
    major: Optional[str] = None
    university: Optional[str] = None
    graduation_year: Optional[int] = None
    gpa: Optional[float] = None
    bio: Optional[str] = None
    skills: List[str] = []
    certifications: List[Dict[str, Any]] = []
    interests: List[str] = []
    location_preference: Optional[str] = "Remote"
    resume_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfileUpdate(StudentProfileBase):
    pass

class StudentProfileOut(StudentProfileBase):
    id: int
    user_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True


# --- Company Profile Schemas ---
class CompanyProfileBase(BaseModel):
    company_name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None

class CompanyProfileCreate(CompanyProfileBase):
    pass

class CompanyProfileUpdate(CompanyProfileBase):
    pass

class CompanyProfileOut(CompanyProfileBase):
    id: int
    user_id: int
    is_verified: bool
    created_at: datetime.datetime
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True


# --- Internship Schemas ---
class InternshipBase(BaseModel):
    title: str
    department: Optional[str] = None
    description: str
    location_type: str = "remote"  # remote, hybrid, onsite
    location: str = "Remote"
    duration_weeks: int = 12
    stipend_monthly: float = 0.0
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    academic_fields: List[str] = []
    min_gpa: Optional[float] = None
    openings: int = 1
    deadline: Optional[str] = None
    status: str = "open"

class InternshipCreate(InternshipBase):
    pass

class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    description: Optional[str] = None
    location_type: Optional[str] = None
    location: Optional[str] = None
    duration_weeks: Optional[int] = None
    stipend_monthly: Optional[float] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    academic_fields: Optional[List[str]] = None
    min_gpa: Optional[float] = None
    openings: Optional[int] = None
    deadline: Optional[str] = None
    status: Optional[str] = None

class InternshipOut(InternshipBase):
    id: int
    company_id: int
    created_at: datetime.datetime
    company: Optional[CompanyProfileOut] = None

    class Config:
        from_attributes = True


# --- Matching & Recommendation Schemas ---
class MatchBreakdown(BaseModel):
    overall_score: float
    skills_score: float
    education_score: float
    interests_score: float
    certifications_bonus: float
    matched_required_skills: List[str]
    missing_required_skills: List[str]
    matched_preferred_skills: List[str]
    skill_gap_recommendations: List[str]
    match_summary: str
    engine_used: str

class RecommendedInternshipOut(BaseModel):
    internship: InternshipOut
    match: MatchBreakdown

class CandidateMatchOut(BaseModel):
    student: StudentProfileOut
    match: MatchBreakdown
    application_id: Optional[int] = None
    application_status: Optional[str] = None
    cover_letter: Optional[str] = None
    applied_at: Optional[datetime.datetime] = None


# --- Application Schemas ---
class ApplicationCreate(BaseModel):
    internship_id: int
    cover_letter: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(applied|under_review|shortlisted|interviewing|accepted|rejected)$")

class ApplicationOut(BaseModel):
    id: int
    internship_id: int
    student_id: int
    status: str
    cover_letter: Optional[str] = None
    match_score_at_application: float
    match_breakdown: Dict[str, Any]
    created_at: datetime.datetime
    updated_at: datetime.datetime
    internship: Optional[InternshipOut] = None
    student: Optional[StudentProfileOut] = None

    class Config:
        from_attributes = True


# --- Admin Dashboard Schemas ---
class SkillDemandStat(BaseModel):
    skill: str
    industry_demand: int
    student_supply: int

class AdminDashboardStats(BaseModel):
    total_students: int
    total_companies: int
    total_internships: int
    active_internships: int
    total_applications: int
    verified_companies: int
    pending_companies: int
    average_match_score: float
    top_demanded_skills: List[Dict[str, Any]]
    skill_gap_matrix: List[SkillDemandStat]
    matching_engine_active: str
