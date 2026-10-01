from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.routers.auth import get_current_user, require_role
from app.models.models import User, StudentProfile, Internship, Application
from app.schemas.schemas import (
    StudentProfileOut, StudentProfileUpdate, RecommendedInternshipOut,
    ApplicationOut, MatchBreakdown
)
from app.matching.factory import get_matching_engine

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/profile", response_model=StudentProfileOut)
def get_student_profile(
    current_user: User = Depends(require_role(["student"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return profile


@router.put("/profile", response_model=StudentProfileOut)
def update_student_profile(
    profile_in: StudentProfileUpdate,
    current_user: User = Depends(require_role(["student"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile


@router.get("/recommendations", response_model=List[RecommendedInternshipOut])
def get_recommendations(
    min_score: float = Query(0.0, ge=0.0, le=100.0, description="Minimum compatibility score filter"),
    location_type: Optional[str] = Query(None, description="Filter by remote, hybrid, or onsite"),
    search: Optional[str] = Query(None, description="Search keyword in title or description"),
    engine_name: Optional[str] = Query(None, description="Optional override matching engine name"),
    current_user: User = Depends(require_role(["student"])),
    db: Session = Depends(get_db)
):
    """
    Calculates AI compatibility score between the current student and all open internships.
    Returns internships ranked from highest match to lowest with detailed breakdowns.
    """
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    query = db.query(Internship).filter(Internship.status == "open")

    if location_type:
        query = query.filter(Internship.location_type == location_type.lower())

    internships = query.all()

    # If search keyword provided, filter
    if search:
        s = search.lower()
        internships = [
            i for i in internships
            if s in i.title.lower() or s in i.description.lower() or any(s in str(sk).lower() for sk in (i.required_skills or []))
        ]

    engine = get_matching_engine(engine_name)
    ranked = engine.rank_internships_for_student(profile, internships, min_score=min_score)

    results = []
    for internship, match_res in ranked:
        results.append(
            RecommendedInternshipOut(
                internship=internship,
                match=MatchBreakdown(**match_res.to_dict())
            )
        )

    return results


@router.get("/applications", response_model=List[ApplicationOut])
def get_my_applications(
    current_user: User = Depends(require_role(["student"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    applications = (
        db.query(Application)
        .filter(Application.student_id == profile.id)
        .order_by(Application.created_at.desc())
        .all()
    )
    return applications
