from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.models.models import Internship, StudentProfile, User
from app.schemas.schemas import InternshipOut, MatchBreakdown
from app.matching.factory import get_matching_engine
from app.routers.auth import oauth2_scheme
from app.core.security import decode_access_token

router = APIRouter(prefix="/internships", tags=["Internships"])

@router.get("", response_model=List[InternshipOut])
def list_internships(
    search: Optional[str] = Query(None, description="Search by title, description, or skill"),
    skill: Optional[str] = Query(None, description="Filter by required skill"),
    location_type: Optional[str] = Query(None, description="remote, hybrid, or onsite"),
    min_stipend: Optional[float] = Query(None, description="Minimum monthly stipend"),
    db: Session = Depends(get_db)
):
    query = db.query(Internship).filter(Internship.status == "open")

    if location_type:
        query = query.filter(Internship.location_type == location_type.lower())

    if min_stipend is not None:
        query = query.filter(Internship.stipend_monthly >= min_stipend)

    internships = query.order_by(Internship.created_at.desc()).all()

    if search:
        s = search.lower()
        internships = [
            i for i in internships
            if s in i.title.lower() or s in i.description.lower() or any(s in str(sk).lower() for sk in (i.required_skills or []))
        ]

    if skill:
        sk_lower = skill.lower()
        internships = [
            i for i in internships
            if any(sk_lower in str(sk).lower() for sk in (i.required_skills or []))
        ]

    return internships


@router.get("/{internship_id}", response_model=InternshipOut)
def get_internship_detail(internship_id: int, db: Session = Depends(get_db)):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return internship


@router.get("/{internship_id}/match-score", response_model=MatchBreakdown)
def get_internship_match_for_student(
    internship_id: int,
    token: Optional[str] = Depends(oauth2_scheme),
    engine_name: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Computes real-time match breakdown between the currently logged-in student and this internship.
    """
    if not token:
        raise HTTPException(status_code=401, detail="Authentication token required")
    payload = decode_access_token(token)
    if not payload or not payload.get("user_id"):
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("user_id")
    student = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Only students have profile match calculations")

    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    engine = get_matching_engine(engine_name)
    match_res = engine.calculate_match(student, internship)
    return MatchBreakdown(**match_res.to_dict())
