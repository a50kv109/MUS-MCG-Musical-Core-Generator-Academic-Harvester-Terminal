import hashlib
import json
from typing import Dict, Any, List

class MUSMCGAdapter:
    """
    Адаптер для интеграции MUS-MCG с Temporal Analyzer.
    Разделяет статические профили композиторов и реальные временные наблюдения.
    """
    def __init__(self, composer_profile: Dict[str, Any]):
        self.profile_id = composer_profile["id"]
        self.raw_profile = composer_profile
        # Защита исходных данных: профиль сохраняется с отпечатком
        self.profile_hash = self._calculate_hash(composer_profile)

    def _calculate_hash(self, profile: Dict[str, Any]) -> str:
        profile_json = json.dumps(profile, sort_keys=True)
        return hashlib.sha256(profile_json.encode("utf-8")).hexdigest()

    def prepare_observation(self, observation: Dict[str, Any]) -> Dict[str, Any]:
        """
        Подготавливает временное наблюдение для анализа,
        сохраняя связь с защищенным профилем.
        """
        return {
            "profile_id": self.profile_id,
            "profile_hash": self.profile_hash,
            "data": observation
        }
