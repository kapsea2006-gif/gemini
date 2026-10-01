from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.routers.auth import require_role
from app.models.models import User, StudentProfile, Internship, Application
from app.schemas.schemas import ApplicationCreate, ApplicationOut
from app.matching.factory import get_matching_engine

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("", response_model=ApplicationOut)
def apply_to_internship(
    app_in: ApplicationCreate,
    current_user: User = Depends(require_role(["student"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    internship = db.query(Internship).filter(Internship.id == app_in.internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    if internship.status != "open":
        raise HTTPException(status_code=400, detail="This internship is no longer accepting applications.")

    # Check for duplicate application
    existing = db.query(Application).filter(
        Application.internship_id == app_in.internship_id,
        Application.student_id == profile.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this internship.")

    # Compute snapshot match score using current active matching engine
    engine = get_matching_engine()
    match_result = engine.calculate_match(profile, internship)

    application = Application(
        internship_id=internship.id,
        student_id=profile.id,
        status="applied",
        cover_letter=app_in.cover_letter,
        match_score_at_application=match_result.overall_score,
        match_breakdown=match_result.to_dict()
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    return application


@router.get("/{application_id}", response_model=ApplicationOut)
def get_application(
    application_id: int,
    current_user: User = Depends(require_role(["student", "company", "admin"])),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Authorization check
    if current_user.role == "student":
        if application.student.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized")
    elif current_user.role == "company":
        if application.internship.company.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized")

    return application


@router.delete("/{application_id}")
def withdraw_application(
    application_id: int,
    current_user: User = Depends(require_role(["student"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    application = db.query(Application).filter(
        Application.id == application_id,
        Application.student_id == profile.id
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(application)
    db.commit()
    return {"message": "Application withdrawn successfully"}
