# ==============================================================================
# 🎼 GENERATOR: COMPOSER CORES v2.0 (ДЛЯ ПРОЄКТУ 3)
# Архітектор: Арцибашев Андрій Олексійович
# Ідентифікатор: AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS
# ==============================================================================

from pathlib import Path
import json

# ==============================================================================
# Шлях до єдиного джерела даних cores.json
# ==============================================================================
BASE_DIR = Path(__file__).resolve().parent
CORES_PATH = BASE_DIR / "src" / "data" / "cores.json"
if not CORES_PATH.exists():
    CORES_PATH = BASE_DIR / "cores.json"

def _load_cores_from_json():
    with open(CORES_PATH, "r", encoding="utf-8") as f:
        cores_list = json.load(f)
    
    db = {}
    legacy_aliases = {
        "rach": "rachmaninoff",
        "tchai": "tchaikovsky",
        "bach": "bach",
        "moz": "mozart",
        "bort": "bortnyansky"
    }
    
    for item in cores_list:
        prefix = item["id"].split("_")[0]
        # Для повної сумісності з форматом [F, T, D, G] у Проєкті 3:
        evrid_list = [
            item["evrid"]["function"],
            item["evrid"]["tension"],
            item["evrid"]["density"],
            item["evrid"]["gravitation"]
        ]
        
        # Расчётный TDI по формуле из EVRID
        f_val, t_val, d_val = item["evrid"]["function"], item["evrid"]["tension"], item["evrid"]["density"]
        calc_tdi = round(min((t_val * d_val) / (f_val + 0.1), 1.0), 3)

        entry = {
            "id": item["id"],
            "name": item["name"],
            "evrid": evrid_list,
            "evrid_dict": item["evrid"],
            "nadi": item["nadi"],
            "acoustic": item["acoustic"],
            "tdi": item["tdi"],               # Авторский базовый показатель (сохранён)
            "calculated_tdi": calc_tdi,       # Динамически вычисленный показатель
            "delta": item["delta"],
            "type": item["type"],
            "era": item["era"]
        }
        
        db[prefix] = entry
        db[item["id"]] = entry
        
        if prefix in legacy_aliases:
            alias = legacy_aliases[prefix]
            db[alias] = entry
            
    return db

composers_db = _load_cores_from_json()

class ComposerCoreGenerator:
    """
    Генератор композиторських ядер для Проєкту 2
    """
    
    def __init__(self):
        self.signature = "AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS"
        self.phi = 1.618
        self.theta = 0.3678
        self.composers = composers_db
        
    def get_composer_core(self, composer_name):
        """Повертає повне ядро композитора"""
        if composer_name not in self.composers:
            raise ValueError(f"Композитор {composer_name} не знайдений у базі.")
        return self.composers[composer_name]
        
    def calculate_tdi(self, evrid):
        """
        Розрахунок TDI по формулі: (T * D) / (F + 0.1)
        Евристичний алгебраїчний індекс гармонійно-фактурного балансу.
        """
        f, t, d, g = evrid
        return round(min((t * d) / (f + 0.1), 1.0), 3)
    
    def export_for_project3(self, composer_name):
        """
        Експортує ядро у форматі, готовому для Проєкту 3.
        Зберігає 'tdi' як авторський еталон і надає 'calculated_tdi' для нових споживачів.
        """
        core = self.get_composer_core(composer_name)
        return {
            "composer": core["name"],
            "evrid": core["evrid"],
            "nadi": core["nadi"],
            "tdi": core["tdi"],                          # Базовий авторський TDI (сумісність)
            "calculated_tdi": core["calculated_tdi"],     # Розрахунковий TDI
            "recommended_voices": {
                "ida": core["nadi"]["ida"],
                "pingala": core["nadi"]["pingala"],
                "sushumna": core["nadi"]["sushumna"]
            },
            "signature": self.signature
        }

# ==============================================================================
# API ДЛЯ ПРОЄКТУ 3
# ==============================================================================

def get_composer_list():
    """Повертає список унікальних ідентифікаторів доступних композиторів"""
    seen = set()
    result = []
    for core in composers_db.values():
        if core["id"] not in seen:
            seen.add(core["id"])
            result.append(core["id"])
    return result

def get_composer_details(composer_name):
    """Повертає детальну інформацію для Проєкту 3"""
    generator = ComposerCoreGenerator()
    return generator.export_for_project3(composer_name)

def get_all_composers_for_project3():
    """Повертає ВСІ ядра одним пакетом для Проєкту 3"""
    generator = ComposerCoreGenerator()
    result = {}
    for composer in get_composer_list():
        result[composer] = generator.export_for_project3(composer)
    return result

# ==============================================================================
# ПРИКЛАД ВИКОРИСТАННЯ В ПРОЄКТІ 3
# ==============================================================================
if __name__ == "__main__":
    # Отримати всі композиторські ядра одним пакетом
    all_composers = get_all_composers_for_project3()
    print("Усі ядра успішно завантажені:", list(all_composers.keys()))

    # Вибрати ядро для конкретного композитора
    rach_core = get_composer_details("rachmaninoff")

    print(f"\\nДеталі ядра: {rach_core['composer']}")
    print(f"TDI: {rach_core['tdi']}")
    print(f"Рекомендовані голоси: {json.dumps(rach_core['recommended_voices'], indent=2, ensure_ascii=False)}")
    print(f"Сигнатура: {rach_core['signature']}")
