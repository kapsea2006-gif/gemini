from abc import ABC, abstractmethod
from typing import List, Tuple, Dict, Any, Optional
from pydantic import BaseModel

class MatchScoreResult(BaseModel):
    overall_score: float  # 0.0 to 100.0
    skills_score: float   # 0.0 to 100.0
    education_score: float # 0.0 to 100.0
    interests_score: float # 0.0 to 100.0
    certifications_bonus: float # 0.0 to 15.0
    matched_required_skills: List[str] = []
    missing_required_skills: List[str] = []
    matched_preferred_skills: List[str] = []
    skill_gap_recommendations: List[str] = []
    match_summary: str = ""
    engine_used: str = "BaseMatchingEngine"

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()


class BaseMatchingEngine(ABC):
    """
    Abstract Base Class for all AI Matching Engines.
    Any new matching algorithm (Semantic Embeddings, Deep Learning,
    Knowledge Graphs, or LLM-based) must inherit from this class.
    """

    @property
    @abstractmethod
    def engine_name(self) -> str:
        """Unique identifier name for this matching algorithm."""
        pass

    @abstractmethod
    def calculate_match(self, student_profile: Any, internship: Any) -> MatchScoreResult:
        """
        Calculate compatibility score between a single student and an internship.
        Returns a MatchScoreResult with numeric score and explainability breakdown.
        """
        pass

    def rank_internships_for_student(
        self, student_profile: Any, internships: List[Any], min_score: float = 0.0
    ) -> List[Tuple[Any, MatchScoreResult]]:
        """
        Rank a collection of internships for a student in descending order of compatibility score.
        """
        scored_items = []
        for internship in internships:
            result = self.calculate_match(student_profile, internship)
            if result.overall_score >= min_score:
                scored_items.append((internship, result))
        
        # Sort descending by overall_score
        scored_items.sort(key=lambda x: x[1].overall_score, reverse=True)
        return scored_items

    def rank_candidates_for_internship(
        self, internship: Any, student_profiles: List[Any], min_score: float = 0.0
    ) -> List[Tuple[Any, MatchScoreResult]]:
        """
        Rank a collection of student candidates for an internship in descending order of compatibility score.
        """
        scored_items = []
        for student in student_profiles:
            result = self.calculate_match(student, internship)
            if result.overall_score >= min_score:
                scored_items.append((student, result))
        
        scored_items.sort(key=lambda x: x[1].overall_score, reverse=True)
        return scored_items
