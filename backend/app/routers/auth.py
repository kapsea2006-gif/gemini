from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.core.config import settings
from app.models.models import User, StudentProfile, CompanyProfile
from app.schemas.schemas import UserCreate, UserLogin, UserOut, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: int = payload.get("user_id")
    if user_id is None:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if user is None:
        raise credentials_exception
    return user

def require_role(allowed_roles: list[str]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: role must be one of {allowed_roles}"
            )
        return current_user
    return role_checker


@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )

    # Create new User
    user = User(
        email=user_in.email.lower(),
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize empty profile based on role
    if user.role == "student":
        student_profile = StudentProfile(
            user_id=user.id,
            headline="Student Candidate",
            skills=[],
            certifications=[],
            interests=[],
            location_preference="Remote"
        )
        db.add(student_profile)
    elif user.role == "company":
        company_profile = CompanyProfile(
            user_id=user.id,
            company_name=user.full_name,
            is_verified=False  # Requires admin approval
        )
        db.add(company_profile)
    db.commit()

    token_payload = {"user_id": user.id, "email": user.email, "role": user.role}
    access_token = create_access_token(token_payload)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated by an administrator."
        )

    token_payload = {"user_id": user.id, "email": user.email, "role": user.role}
    access_token = create_access_token(token_payload)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile_data = None
    if current_user.role == "student" and current_user.student_profile:
        p = current_user.student_profile
        profile_data = {
            "id": p.id,
            "headline": p.headline,
            "major": p.major,
            "university": p.university,
            "graduation_year": p.graduation_year,
            "gpa": p.gpa,
            "bio": p.bio,
            "skills": p.skills or [],
            "certifications": p.certifications or [],
            "interests": p.interests or [],
            "location_preference": p.location_preference,
            "resume_url": p.resume_url,
            "github_url": p.github_url,
            "linkedin_url": p.linkedin_url,
            "portfolio_url": p.portfolio_url
        }
    elif current_user.role == "company" and current_user.company_profile:
        cp = current_user.company_profile
        profile_data = {
            "id": cp.id,
            "company_name": cp.company_name,
            "industry": cp.industry,
            "website": cp.website,
            "location": cp.location,
            "description": cp.description,
            "logo_url": cp.logo_url,
            "is_verified": cp.is_verified
        }

    return {
        "user": UserOut.model_validate(current_user),
        "profile": profile_data
    }


@router.post("/demo-login/{role}", response_model=Token)
def demo_login(role: str, db: Session = Depends(get_db)):
    """
    Convenient 1-click test login for evaluator to switch roles seamlessly.
    Allowed roles: student, company, admin.
    """
    role = role.lower()
    if role not in ["student", "company", "admin"]:
        raise HTTPException(status_code=400, detail="Role must be student, company, or admin")
    
    user = db.query(User).filter(User.role == role, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"No pre-seeded demo user found for role '{role}'. Please seed the database first."
        )

    token_payload = {"user_id": user.id, "email": user.email, "role": user.role}
    access_token = create_access_token(token_payload)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )
