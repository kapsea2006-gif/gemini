from collections import Counter
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.routers.auth import require_role
from app.models.models import User, StudentProfile, CompanyProfile, Internship, Application
from app.schemas.schemas import AdminDashboardStats, UserOut, CompanyProfileOut, InternshipOut
from app.matching.factory import get_matching_engine, get_available_engines
from app.core.config import settings

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats", response_model=AdminDashboardStats)
def get_admin_dashboard_stats(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    total_students = db.query(StudentProfile).count()
    total_companies = db.query(CompanyProfile).count()
    total_internships = db.query(Internship).count()
    active_internships = db.query(Internship).filter(Internship.status == "open").count()
    total_applications = db.query(Application).count()

    verified_companies = db.query(CompanyProfile).filter(CompanyProfile.is_verified == True).count()
    pending_companies = total_companies - verified_companies

    # Calculate average match score across applications
    apps = db.query(Application).all()
    avg_score = 0.0
    if apps:
        avg_score = round(sum(a.match_score_at_application for a in apps) / len(apps), 1)

    # Compute skill demand vs supply matrix
    # Industry demand: frequency in internship required_skills
    internships = db.query(Internship).all()
    demand_counter: Counter = Counter()
    for i in internships:
        for sk in (i.required_skills or []):
            demand_counter[sk.strip().title()] += 1

    # Student supply: frequency in student profiles
    students = db.query(StudentProfile).all()
    supply_counter: Counter = Counter()
    for s in students:
        for sk in (s.skills or []):
            supply_counter[sk.strip().title()] += 1

    # Top demanded skills
    top_demanded = [
        {"skill": skill, "count": count}
        for skill, count in demand_counter.most_common(8)
    ]

    # Combined skill gap matrix for top 8 demanded skills
    matrix = []
    for skill, demand_count in demand_counter.most_common(8):
        matrix.append({
            "skill": skill,
            "industry_demand": demand_count,
            "student_supply": supply_counter.get(skill, 0)
        })

    return AdminDashboardStats(
        total_students=total_students,
        total_companies=total_companies,
        total_internships=total_internships,
        active_internships=active_internships,
        total_applications=total_applications,
        verified_companies=verified_companies,
        pending_companies=pending_companies,
        average_match_score=avg_score,
        top_demanded_skills=top_demanded,
        skill_gap_matrix=matrix,
        matching_engine_active=settings.MATCHING_ENGINE
    )


@router.get("/users", response_model=List[UserOut])
def list_users(
    role: Optional[str] = Query(None, description="Filter by student, company, or admin"),
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role.lower())
    return query.order_by(User.created_at.desc()).all()


@router.put("/users/{user_id}/status")
def toggle_user_status(
    user_id: int,
    is_active: bool,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot alter your own active status")

    user.is_active = is_active
    db.commit()
    return {"message": f"User {'activated' if is_active else 'deactivated'} successfully"}


@router.get("/companies", response_model=List[CompanyProfileOut])
def list_companies(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    return db.query(CompanyProfile).order_by(CompanyProfile.created_at.desc()).all()


@router.put("/companies/{company_id}/verify")
def set_company_verification(
    company_id: int,
    is_verified: bool,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    company = db.query(CompanyProfile).filter(CompanyProfile.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    company.is_verified = is_verified
    db.commit()
    return {"message": f"Company {'verified' if is_verified else 'unverified'} successfully"}


@router.get("/internships", response_model=List[InternshipOut])
def list_all_internships_admin(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    return db.query(Internship).order_by(Internship.created_at.desc()).all()


@router.put("/internships/{internship_id}/status")
def set_internship_status(
    internship_id: int,
    status: str = Query(..., pattern="^(open|closed|draft)$"),
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    internship.status = status
    db.commit()
    return {"message": f"Internship status updated to {status}"}


@router.get("/matching-config")
def get_matching_config(
    current_user: User = Depends(require_role(["admin"]))
):
    """
    Returns available matching engines and active configuration parameters.
    """
    engines = get_available_engines()
    return {
        "active_engine": settings.MATCHING_ENGINE,
        "available_engines": engines,
        "weights": {
            "required_skills": 0.55,
            "preferred_skills": 0.15,
            "education_alignment": 0.15,
            "domain_interests": 0.10,
            "certification_bonus_cap": 10.0
        },
        "description": "Pluggable AI architecture: Replace with deep semantic or LLM embeddings by implementing BaseMatchingEngine."
    }
