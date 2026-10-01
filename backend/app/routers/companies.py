from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.routers.auth import require_role
from app.models.models import User, CompanyProfile, Internship, Application, StudentProfile
from app.schemas.schemas import (
    CompanyProfileOut, CompanyProfileUpdate,
    InternshipOut, InternshipCreate, InternshipUpdate,
    CandidateMatchOut, ApplicationStatusUpdate, ApplicationOut,
    MatchBreakdown
)
from app.matching.factory import get_matching_engine

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.get("/profile", response_model=CompanyProfileOut)
def get_company_profile(
    current_user: User = Depends(require_role(["company"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return profile


@router.put("/profile", response_model=CompanyProfileOut)
def update_company_profile(
    profile_in: CompanyProfileUpdate,
    current_user: User = Depends(require_role(["company"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        profile = CompanyProfile(user_id=current_user.id, company_name=current_user.full_name)
        db.add(profile)

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile


@router.post("/internships", response_model=InternshipOut)
def create_internship(
    item_in: InternshipCreate,
    current_user: User = Depends(require_role(["company"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    internship = Internship(
        company_id=profile.id,
        **item_in.model_dump()
    )
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return internship


@router.get("/internships", response_model=List[InternshipOut])
def get_company_internships(
    current_user: User = Depends(require_role(["company"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    return db.query(Internship).filter(Internship.company_id == profile.id).order_by(Internship.created_at.desc()).all()


@router.put("/internships/{internship_id}", response_model=InternshipOut)
def update_internship(
    internship_id: int,
    item_in: InternshipUpdate,
    current_user: User = Depends(require_role(["company"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    internship = db.query(Internship).filter(
        Internship.id == internship_id,
        Internship.company_id == profile.id
    ).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    update_data = item_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(internship, field, val)

    db.commit()
    db.refresh(internship)
    return internship


@router.delete("/internships/{internship_id}")
def delete_internship(
    internship_id: int,
    current_user: User = Depends(require_role(["company"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    internship = db.query(Internship).filter(
        Internship.id == internship_id,
        Internship.company_id == profile.id
    ).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    db.delete(internship)
    db.commit()
    return {"message": "Internship successfully removed"}


@router.get("/internships/{internship_id}/applicants", response_model=List[CandidateMatchOut])
def get_internship_applicants(
    internship_id: int,
    current_user: User = Depends(require_role(["company"])),
    db: Session = Depends(get_db)
):
    """
    Returns all applicants for a company's internship ranked by AI compatibility score.
    """
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    internship = db.query(Internship).filter(
        Internship.id == internship_id,
        Internship.company_id == profile.id
    ).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    applications = (
        db.query(Application)
        .filter(Application.internship_id == internship_id)
        .all()
    )

    engine = get_matching_engine()
    results = []

    for app in applications:
        student = app.student
        if not student:
            continue

        # Re-evaluate live match or use stored
        match_res = engine.calculate_match(student, internship)
        results.append(
            CandidateMatchOut(
                student=student,
                match=MatchBreakdown(**match_res.to_dict()),
                application_id=app.id,
                application_status=app.status,
                cover_letter=app.cover_letter,
                applied_at=app.created_at
            )
        )

    # Sort candidates by overall compatibility score descending
    results.sort(key=lambda x: x.match.overall_score, reverse=True)
    return results


@router.put("/applications/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(require_role(["company"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    application = (
        db.query(Application)
        .join(Internship)
        .filter(Application.id == application_id, Internship.company_id == profile.id)
        .first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found or unauthorized")

    application.status = status_update.status
    db.commit()
    db.refresh(application)
    return application
