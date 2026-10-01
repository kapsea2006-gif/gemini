from typing import Dict, Type, Optional
from app.matching.base import BaseMatchingEngine
from app.matching.rule_engine import WeightedRulesMatchingEngine
from app.matching.semantic_engine import SemanticCosineMatchingEngine
from app.core.config import settings

# Registry of available matching engine strategies
MATCHING_ENGINE_REGISTRY: Dict[str, Type[BaseMatchingEngine]] = {
    "weighted_rules": WeightedRulesMatchingEngine,
    "semantic_cosine": SemanticCosineMatchingEngine,
}

def register_matching_engine(name: str, engine_cls: Type[BaseMatchingEngine]) -> None:
    """
    Allows developers or plugins to register custom or advanced AI matching engines
    (e.g., SentenceTransformers, Gemini LLM, LangChain, etc.) at runtime.
    """
    MATCHING_ENGINE_REGISTRY[name.lower()] = engine_cls

def get_matching_engine(engine_type: Optional[str] = None) -> BaseMatchingEngine:
    """
    Factory function returning an instance of the configured or requested matching engine.
    Defaults to settings.MATCHING_ENGINE (usually 'weighted_rules').
    """
    target = (engine_type or settings.MATCHING_ENGINE).lower()
    engine_cls = MATCHING_ENGINE_REGISTRY.get(target)
    
    if not engine_cls:
        # Fallback to default
        engine_cls = WeightedRulesMatchingEngine
    
    return engine_cls()

def get_available_engines() -> list[str]:
    """Returns list of registered matching engine identifiers."""
    return list(MATCHING_ENGINE_REGISTRY.keys())
