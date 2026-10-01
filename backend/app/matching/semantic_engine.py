import math
import re
from collections import Counter
from typing import Any, List, Set
from app.matching.base import BaseMatchingEngine, MatchScoreResult
from app.matching.rule_engine import normalize_skill

def tokenize_and_clean(text: str) -> List[str]:
    """Tokenize and clean text into lowercase alpha words."""
    words = re.findall(r'\b[a-zA-Z]{2,}\b', text.lower())
    # Filter common stop words
    stop_words = {
        "and", "the", "for", "with", "this", "that", "from", "you", "are",
        "our", "will", "have", "been", "role", "work", "team", "years", "seeking"
    }
    return [w for w in words if w not in stop_words]

def cosine_similarity(vec1: Counter, vec2: Counter) -> float:
    """Compute cosine similarity between two frequency vectors."""
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])

    sum1 = sum([val ** 2 for val in vec1.values()])
    sum2 = sum([val ** 2 for val in vec2.values()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0
    return float(numerator) / denominator


class SemanticCosineMatchingEngine(BaseMatchingEngine):
    """
    Alternative AI Matching Engine utilizing Term Frequency - Vector Space Cosine Similarity
    fused with exact and fuzzy skill alignment.
    Demonstrates the modularity of the AI matching architecture.
    """

    @property
    def engine_name(self) -> str:
        return "SemanticCosineMatchingEngine-v1.0"

    def calculate_match(self, student_profile: Any, internship: Any) -> MatchScoreResult:
        # Build student document
        student_skills = student_profile.skills or []
        student_certs = [
            c.get("title", "") if isinstance(c, dict) else str(c)
            for c in (student_profile.certifications or [])
        ]
        student_interests = student_profile.interests or []
        student_text = " ".join([
            student_profile.headline or "",
            student_profile.major or "",
            student_profile.bio or "",
            " ".join(student_skills),
            " ".join(student_certs),
            " ".join(student_interests)
        ])

        # Build internship document
        req_skills = internship.required_skills or []
        pref_skills = internship.preferred_skills or []
        academic_fields = internship.academic_fields or []
        internship_text = " ".join([
            internship.title,
            internship.department or "",
            internship.description,
            " ".join(req_skills),
            " ".join(pref_skills),
            " ".join(academic_fields)
        ])

        # Calculate semantic cosine score
        vec_student = Counter(tokenize_and_clean(student_text))
        vec_internship = Counter(tokenize_and_clean(internship_text))
        cosine_sim = cosine_similarity(vec_student, vec_internship)
        semantic_score = min(100.0, cosine_sim * 140.0)  # normalized scale

        # Calculate skill overlap
        norm_student_skills: Set[str] = {normalize_skill(s) for s in student_skills}
        matched_required: List[str] = []
        missing_required: List[str] = []

        for skill in req_skills:
            norm = normalize_skill(skill)
            if norm in norm_student_skills or any(norm in s or s in norm for s in norm_student_skills):
                matched_required.append(skill)
            else:
                missing_required.append(skill)

        matched_preferred: List[str] = []
        for skill in pref_skills:
            norm = normalize_skill(skill)
            if norm in norm_student_skills or any(norm in s or s in norm for s in norm_student_skills):
                matched_preferred.append(skill)

        req_ratio = (len(matched_required) / len(req_skills)) if req_skills else 1.0
        skills_score = req_ratio * 100.0

        # Weighted hybrid blend
        overall = (skills_score * 0.50) + (semantic_score * 0.40) + (10.0 if student_certs else 0.0)
        overall_score = round(max(0.0, min(100.0, overall)), 1)

        recommendations = []
        if missing_required:
            recommendations.append(f"Consider building projects with: {', '.join(missing_required[:3])}.")

        summary = f"Semantic Match ({overall_score}%): Vector text correlation {round(semantic_score, 1)}% with {len(matched_required)}/{len(req_skills)} required skills matched."

        return MatchScoreResult(
            overall_score=overall_score,
            skills_score=round(skills_score, 1),
            education_score=round(semantic_score, 1),
            interests_score=round(semantic_score, 1),
            certifications_bonus=10.0 if student_certs else 0.0,
            matched_required_skills=matched_required,
            missing_required_skills=missing_required,
            matched_preferred_skills=matched_preferred,
            skill_gap_recommendations=recommendations,
            match_summary=summary,
            engine_used=self.engine_name
        )
