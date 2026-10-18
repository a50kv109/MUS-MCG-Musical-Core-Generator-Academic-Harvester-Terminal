# ==============================================================================
# 🎼 АКАДЕМІЧНИЙ КОМБАЙН: НОВІ КОМПОЗИТОРСЬКІ ЯДРА
# Архітектор: Арцибашев Андрій Олексійович
# Ідентифікатор: AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS
# ==============================================================================

from pathlib import Path
import json
import random

BASE_DIR = Path(__file__).resolve().parent
CORES_PATH = BASE_DIR / "src" / "data" / "cores.json"
if not CORES_PATH.exists():
    CORES_PATH = BASE_DIR / "cores.json"

_CACHED_CORES = None

def _load_core_by_prefix(prefix):
    global _CACHED_CORES
    if _CACHED_CORES is None:
        with open(CORES_PATH, "r", encoding="utf-8") as f:
            _CACHED_CORES = json.load(f)
    for c in _CACHED_CORES:
        if c["id"].startswith(prefix):
            return c
    raise ValueError(f"Core prefix '{prefix}' not found in {CORES_PATH}")

class MartynovCore:
    """
    Володимир Мартинов: сакральний мінімалізм, духовна глибина
    """
    def __init__(self):
        c = _load_core_by_prefix("martynov")
        self.signature = "AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS"
        self.name = c["name"]
        self.type = c["type"]
        self.tdi = c["tdi"]  # Авторський базовий TDI
        self.tdi_baseline = c["tdi"]
        self.evrid = {
            "function": c["evrid"]["function"],
            "tension": c["evrid"]["tension"],
            "density": c["evrid"]["density"],
            "gravity": c["evrid"]["gravitation"]
        }
        self.nadi = c["nadi"]
        self.acoustic = c["acoustic"]
        self.unique_params = {
            "style": "нова іскренність",
            "focus": "духовна глибина, повторення патернів"
        }

    def calculate_tdi(self):
        """Розрахунок TDI по формулі: (T * D) / (F + 0.1)"""
        f, t, d = self.evrid["function"], self.evrid["tension"], self.evrid["density"]
        return round(min((t * d) / (f + 0.1), 1.0), 3)

    def get_metadata(self):
        return {
            "name": self.name,
            "type": self.type,
            "evrid": self.evrid,
            "nadi": self.nadi,
            "acoustic": self.acoustic,
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "unique_params": self.unique_params,
            "signature": self.signature
        }

    def generate_example(self):
        return {
            "composer": self.name,
            "melody": round(random.uniform(0.3, 0.5), 3),
            "texture": round(random.uniform(0.7, 0.9), 3),
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "description": "Повільний, медитативний розвиток з глибоким басовим фундаментом."
        }


class RichterCore:
    """
    Кирило Ріхтер: експресивний мінімалізм, кінематографічність
    """
    def __init__(self):
        c = _load_core_by_prefix("richter")
        self.signature = "AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS"
        self.name = c["name"]
        self.type = c["type"]
        self.tdi = c["tdi"]
        self.tdi_baseline = c["tdi"]
        self.evrid = {
            "function": c["evrid"]["function"],
            "tension": c["evrid"]["tension"],
            "density": c["evrid"]["density"],
            "gravity": c["evrid"]["gravitation"]
        }
        self.nadi = c["nadi"]
        self.acoustic = c["acoustic"]
        self.unique_params = {
            "style": "неокласика",
            "focus": "кінематографічність, емоційна пульсація"
        }

    def calculate_tdi(self):
        """Розрахунок TDI по формулі: (T * D) / (F + 0.1)"""
        f, t, d = self.evrid["function"], self.evrid["tension"], self.evrid["density"]
        return round(min((t * d) / (f + 0.1), 1.0), 3)

    def get_metadata(self):
        return {
            "name": self.name,
            "type": self.type,
            "evrid": self.evrid,
            "nadi": self.nadi,
            "acoustic": self.acoustic,
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "unique_params": self.unique_params,
            "signature": self.signature
        }

    def generate_example(self):
        return {
            "composer": self.name,
            "melody": round(random.uniform(0.6, 0.8), 3),
            "texture": round(random.uniform(0.5, 0.7), 3),
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "description": "Динамічні арпеджіо на фортепіано з пронизливою струнною лінією."
        }


class PiazzollaCore:
    """
    Астор П'яццолла: nuevo tango, пристрасть, ритмічна складність
    """
    def __init__(self):
        c = _load_core_by_prefix("piazzolla")
        self.signature = "AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS"
        self.name = c["name"]
        self.type = c["type"]
        self.tdi = c["tdi"]
        self.tdi_baseline = c["tdi"]
        self.evrid = {
            "function": c["evrid"]["function"],
            "tension": c["evrid"]["tension"],
            "density": c["evrid"]["density"],
            "gravity": c["evrid"]["gravitation"]
        }
        self.nadi = c["nadi"]
        self.acoustic = c["acoustic"]
        self.unique_params = {
            "style": "аргентинський авангард",
            "focus": "ритмічна складність, пристрасть, джазові гармонії"
        }

    def calculate_tdi(self):
        """Розрахунок TDI по формулі: (T * D) / (F + 0.1)"""
        f, t, d = self.evrid["function"], self.evrid["tension"], self.evrid["density"]
        return round(min((t * d) / (f + 0.1), 1.0), 3)

    def get_metadata(self):
        return {
            "name": self.name,
            "type": self.type,
            "evrid": self.evrid,
            "nadi": self.nadi,
            "acoustic": self.acoustic,
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "unique_params": self.unique_params,
            "signature": self.signature
        }

    def generate_example(self):
        return {
            "composer": self.name,
            "melody": round(random.uniform(0.7, 0.9), 3),
            "texture": round(random.uniform(0.6, 0.8), 3),
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "description": "Синкопований ритм 3+3+2 з експресивним соло бандонеона."
        }


class PaartCore:
    """
    Арво Пярт: tintinnabuli, дзвіночки, сакральна вертикаль
    """
    def __init__(self):
        c = _load_core_by_prefix("paart")
        self.signature = "AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS"
        self.name = c["name"]
        self.type = c["type"]
        self.tdi = c["tdi"]
        self.tdi_baseline = c["tdi"]
        self.evrid = {
            "function": c["evrid"]["function"],
            "tension": c["evrid"]["tension"],
            "density": c["evrid"]["density"],
            "gravity": c["evrid"]["gravitation"]
        }
        self.nadi = c["nadi"]
        self.acoustic = c["acoustic"]
        self.unique_params = {
            "style": "духовний мінімалізм",
            "focus": "сакральна вертикаль, чистота тризвуку"
        }

    def calculate_tdi(self):
        """Розрахунок TDI по формулі: (T * D) / (F + 0.1)"""
        f, t, d = self.evrid["function"], self.evrid["tension"], self.evrid["density"]
        return round(min((t * d) / (f + 0.1), 1.0), 3)

    def get_metadata(self):
        return {
            "name": self.name,
            "type": self.type,
            "evrid": self.evrid,
            "nadi": self.nadi,
            "acoustic": self.acoustic,
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "unique_params": self.unique_params,
            "signature": self.signature
        }

    def generate_example(self):
        return {
            "composer": self.name,
            "melody": round(random.uniform(0.2, 0.4), 3),
            "texture": round(random.uniform(0.8, 0.95), 3),
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "description": "Два голоси: один рухається по щаблях гами, інший співає ноти тонічного тризвуку."
        }


class CrumbCore:
    """
    Джордж Крамб: авангард, незвичні тембри, театральність
    """
    def __init__(self):
        c = _load_core_by_prefix("crumb")
        self.signature = "AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS"
        self.name = c["name"]
        self.type = c["type"]
        self.tdi = c["tdi"]
        self.tdi_baseline = c["tdi"]
        self.evrid = {
            "function": c["evrid"]["function"],
            "tension": c["evrid"]["tension"],
            "density": c["evrid"]["density"],
            "gravity": c["evrid"]["gravitation"]
        }
        self.nadi = c["nadi"]
        self.acoustic = c["acoustic"]
        self.unique_params = {
            "style": "театралізований перформанс",
            "focus": "незвичні тембри, містика, макрокосмос"
        }

    def calculate_tdi(self):
        """Розрахунок TDI по формулі: (T * D) / (F + 0.1)"""
        f, t, d = self.evrid["function"], self.evrid["tension"], self.evrid["density"]
        return round(min((t * d) / (f + 0.1), 1.0), 3)

    def get_metadata(self):
        return {
            "name": self.name,
            "type": self.type,
            "evrid": self.evrid,
            "nadi": self.nadi,
            "acoustic": self.acoustic,
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "unique_params": self.unique_params,
            "signature": self.signature
        }

    def generate_example(self):
        return {
            "composer": self.name,
            "melody": round(random.uniform(0.8, 0.95), 3),
            "texture": round(random.uniform(0.3, 0.5), 3),
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "description": "Шепіт, удари по струнах фортепіано зсередини та гра на келихах з водою."
        }

# ==============================================================================
# ЕКСПОРТ ЯДЕР
# ==============================================================================

if __name__ == "__main__":
    cores = [
        MartynovCore(),
        RichterCore(),
        PiazzollaCore(),
        PaartCore(),
        CrumbCore()
    ]
    
    print("=== АКАДЕМІЧНИЙ КОМБАЙН: ЗГЕНЕРОВАНІ ЯДРА ===")
    for core in cores:
        print(f"\n🎵 {core.name.upper()}")
        print(json.dumps(core.get_metadata(), indent=2, ensure_ascii=False))
        print("Приклад:", core.generate_example()["description"])
