from typing import List, Dict, Any
import math

class Validator:
    @staticmethod
    def validate_observations(observations: List[Dict[str, Any]]):
        """
        Проверка временных наблюдений:
        - Конечность числовых значений
        - Хронологический порядок
        """
        if not observations:
            return

        # 1. Проверка конечности
        for obs in observations:
            for key, value in obs.items():
                if isinstance(value, (int, float)):
                    if not math.isfinite(value):
                        raise ValueError(f"Недопустимое значение (NaN/Inf) в поле {key}")

        # 2. Проверка хронологического порядка
        timestamps = [obs.get("timestamp") for obs in observations if "timestamp" in obs]
        if len(timestamps) != len(observations):
             raise ValueError("Все наблюдения должны иметь временную метку")
        
        if timestamps != sorted(timestamps):
            raise ValueError("Нарушение хронологического порядка наблюдений")
