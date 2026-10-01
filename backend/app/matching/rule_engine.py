import re
from typing import List, Set, Dict, Any
from app.matching.base import BaseMatchingEngine, MatchScoreResult

# Canonical alias mapping for normalization
SYNONYM_MAP = {
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "python3": "python",
    "ml": "machine learning",
    "ai": "artificial intelligence",
    "dl": "deep learning",
    "nlp": "natural language processing",
    "cv": "computer vision",
    "k8s": "kubernetes",
    "postgres": "postgresql",
    "node": "nodejs",
    "node.js": "nodejs",
    "react": "reactjs",
    "react.js": "reactjs",
    "next": "nextjs",
    "next.js": "nextjs",
    "vue": "vuejs",
    "vue.js": "vuejs",
    "aws": "amazon web services",
    "gcp": "google cloud",
    "azure": "microsoft azure",
    "docker": "docker",
    "fastapi": "fastapi",
    "sql": "sql",
    "nosql": "nosql",
    "mongodb": "mongodb",
    "pytorch": "pytorch",
    "tensorflow": "tensorflow",
    "scikit-learn": "scikitlearn",
    "sklearn": "scikitlearn",
    "pandas": "pandas",
    "numpy": "numpy",
    "ci/cd": "cicd",
    "git": "git",
    "rest": "restful api",
    "rest api": "restful api",
    "graphql": "graphql",
    "graphql api": "graphql",
    "linux": "linux",
    "bash": "bash",
    "tailwind": "tailwindcss",
    "tailwind css": "tailwindcss",
}

def normalize_skill(skill: str) -> str:
    """Normalizes a skill token for fuzzy synonym-aware matching."""
    s = skill.strip().lower()
    s = re.sub(r'[\s\-_]+', ' ', s)
    return SYNONYM_MAP.get(s, s)

class WeightedRulesMatchingEngine(BaseMatchingEngine):
    """
    Production-ready Explainable Rule-Based Matching Engine.
    Evaluates:
      1. Required skills overlap (55% weight)
      2. Preferred skills bonus (15% weight)
      3. Academic / Major compatibility (15% weight)
      4. Domain Interests alignment (10% weight)
      5. Industry Certification boost (up to +10% bonus)
    Provides full explainability, matched vs missing skills, and skill gap guidance.
    """

    def __init__(
        self,
        required_weight: float = 0.55,
        preferred_weight: float = 0.15,
        education_weight: float = 0.15,
        interests_weight: float = 0.10,
        certification_bonus_cap: float = 10.0
    ):
        self.required_weight = required_weight
        self.preferred_weight = preferred_weight
        self.education_weight = education_weight
        self.interests_weight = interests_weight
        self.certification_bonus_cap = certification_bonus_cap

    @property
    def engine_name(self) -> str:
        return "WeightedRulesMatchingEngine-v1.0"

    def calculate_match(self, student_profile: Any, internship: Any) -> MatchScoreResult:
        # Extract student data
        student_skills = student_profile.skills or []
        student_certs = student_profile.certifications or []
        student_interests = student_profile.interests or []
        student_major = (student_profile.major or "").lower()
        student_gpa = student_profile.gpa or 0.0

        # Extract internship requirements
        req_skills = internship.required_skills or []
        pref_skills = internship.preferred_skills or []
        academic_fields = [f.lower() for f in (internship.academic_fields or [])]
        min_gpa = internship.min_gpa or 0.0

        # Normalized sets
        norm_student_skills: Set[str] = {normalize_skill(s) for s in student_skills}
        norm_req_skills: List[str] = [normalize_skill(s) for s in req_skills]
        norm_pref_skills: List[str] = [normalize_skill(s) for s in pref_skills]

        # 1. Required Skills Evaluation
        matched_required: List[str] = []
        missing_required: List[str] = []

        for orig, norm in zip(req_skills, norm_req_skills):
            # check exact or substring/synonym match
            if norm in norm_student_skills or any(norm in s or s in norm for s in norm_student_skills):
                matched_required.append(orig)
            else:
                missing_required.append(orig)

        if req_skills:
            req_ratio = len(matched_required) / len(req_skills)
            skills_score = req_ratio * 100.0
        else:
            skills_score = 100.0

        # 2. Preferred Skills Evaluation
        matched_preferred: List[str] = []
        for orig, norm in zip(pref_skills, norm_pref_skills):
            if norm in norm_student_skills or any(norm in s or s in norm for s in norm_student_skills):
                matched_preferred.append(orig)

        pref_ratio = (len(matched_preferred) / len(pref_skills)) if pref_skills else 1.0

        # 3. Academic & Major Alignment
        education_score = 70.0  # Base standard score
        if academic_fields:
            if any(f in student_major or student_major in f for f in academic_fields):
                education_score = 100.0
            elif any(word in student_major for field in academic_fields for word in field.split() if len(word) > 3):
                education_score = 85.0
            else:
                education_score = 50.0

        # GPA check
        if min_gpa > 0 and student_gpa > 0:
            if student_gpa >= min_gpa:
                education_score = min(100.0, education_score + 10.0)
            else:
                education_score = max(30.0, education_score - 15.0)

        # 4. Domain Interests Alignment
        interests_score = 50.0
        internship_text = f"{internship.title} {internship.department or ''} {internship.description}".lower()
        matched_interests = 0
        for interest in student_interests:
            if interest.lower() in internship_text:
                matched_interests += 1

        if student_interests:
            interests_score = min(100.0, 50.0 + (matched_interests * 20.0))
        elif not student_interests:
            interests_score = 65.0

        # 5. Certification Bonus Boost
        cert_bonus = 0.0
        for cert in student_certs:
            cert_title = ""
            if isinstance(cert, dict):
                cert_title = cert.get("title", "")
            elif isinstance(cert, str):
                cert_title = cert
            
            # If cert mentions any required/preferred skill or domain keywords
            cert_lower = cert_title.lower()
            if any(normalize_skill(s) in cert_lower for s in (req_skills + pref_skills)):
                cert_bonus += 4.0
            else:
                cert_bonus += 2.0

        cert_bonus = min(self.certification_bonus_cap, cert_bonus)

        # Compute Total Weighted Overall Score
        overall = (
            (skills_score * self.required_weight) +
            (pref_ratio * 100.0 * self.preferred_weight) +
            (education_score * self.education_weight) +
            (interests_score * self.interests_weight) +
            cert_bonus
        )
        overall_score = round(max(0.0, min(100.0, overall)), 1)

        # Generate actionable Skill Gap Recommendations
        recommendations: List[str] = []
        if missing_required:
            recommendations.append(
                f"Boost your profile by building projects or taking coursework in: {', '.join(missing_required[:3])}."
            )
        if len(matched_preferred) < len(pref_skills) and pref_skills:
            unmatched_pref = [p for p in pref_skills if p not in matched_preferred]
            recommendations.append(
                f"Optional edge: Adding skills in {', '.join(unmatched_pref[:2])} will make you a top candidate."
            )
        if not student_certs:
            recommendations.append("Consider earning industry-recognized certifications to increase your match score by up to 10%.")

        # Explainable Summary
        if overall_score >= 85:
            summary = f"Exceptional Match ({overall_score}%): You possess {len(matched_required)}/{len(req_skills)} required skills, strong academic alignment, and relevant background."
        elif overall_score >= 70:
            summary = f"Strong Match ({overall_score}%): You meet core requirements with good domain overlap ({len(matched_required)}/{len(req_skills)} skills matched)."
        elif overall_score >= 50:
            summary = f"Moderate Match ({overall_score}%): Partial skill overlap. Enhancing key skills in {', '.join(missing_required[:2]) if missing_required else 'required areas'} will elevate your chances."
        else:
            summary = f"Growth Potential ({overall_score}%): Requires additional foundational skills in {', '.join(missing_required[:2]) if missing_required else 'this field'}."

        return MatchScoreResult(
            overall_score=overall_score,
            skills_score=round(skills_score, 1),
            education_score=round(education_score, 1),
            interests_score=round(interests_score, 1),
            certifications_bonus=round(cert_bonus, 1),
            matched_required_skills=matched_required,
            missing_required_skills=missing_required,
            matched_preferred_skills=matched_preferred,
            skill_gap_recommendations=recommendations,
            match_summary=summary,
            engine_used=self.engine_name
        )
