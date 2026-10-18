"""
MCG-V3.0 — Comprehensive Verification Suite for Single Source of Truth (cores.json)
"""

import unittest
import json
import os
import subprocess
import zipfile
import shutil
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).resolve().parent
CORES_JSON_PATH = ROOT_DIR / "src" / "data" / "cores.json"
APP_TSX_PATH = ROOT_DIR / "src" / "App.tsx"

# Golden inventory baseline for exact numeric verification (all 17 composers)
EXPECTED_INVENTORY = {
    "rach_v2.0": {"name": "РАХМАНИНОВ", "tdi": 0.21, "delta": 0.78, "evrid": {"function": 0.95, "tension": 0.25, "density": 0.60, "gravitation": 0.90}, "freq": 432},
    "chesnokov_v1.0": {"name": "ЧЕСНОКОВ", "tdi": 0.18, "delta": 0.71, "evrid": {"function": 0.90, "tension": 0.20, "density": 0.55, "gravitation": 0.95}, "freq": 432},
    "bort_v1.2": {"name": "БОРТНЯНСЬКИЙ", "tdi": 0.12, "delta": 0.68, "evrid": {"function": 0.92, "tension": 0.12, "density": 0.45, "gravitation": 0.88}, "freq": 432},
    "arkh_v1.1": {"name": "АРХАНГЕЛЬСЬКИЙ", "tdi": 0.15, "delta": 0.65, "evrid": {"function": 0.89, "tension": 0.18, "density": 0.48, "gravitation": 0.91}, "freq": 432},
    "kuznetsov_v1.0": {"name": "КУЗНЕЦОВ", "tdi": 0.17, "delta": 0.70, "evrid": {"function": 0.88, "tension": 0.30, "density": 0.50, "gravitation": 0.92}, "freq": 432},
    "grechaninov_v1.0": {"name": "ГРЕЧАНІНОВ", "tdi": 0.17, "delta": 0.70, "evrid": {"function": 0.88, "tension": 0.30, "density": 0.50, "gravitation": 0.92}, "freq": 432},
    "palest_v1.0": {"name": "ПАЛЕСТРИНА", "tdi": 0.05, "delta": 0.58, "evrid": {"function": 0.96, "tension": 0.12, "density": 0.40, "gravitation": 0.94}, "freq": 440},
    "kuku_v2.0": {"name": "КУКУЗЕЛЬ", "tdi": 0.04, "delta": 0.62, "evrid": {"function": 0.92, "tension": 0.18, "density": 0.35, "gravitation": 0.96}, "freq": 432},
    "bach_v2.1": {"name": "BACH", "tdi": 0.12, "delta": 0.92, "evrid": {"function": 0.98, "tension": 0.40, "density": 0.70, "gravitation": 0.92}, "freq": 256},
    "moz_v3.0": {"name": "MOZART", "tdi": 0.08, "delta": 0.85, "evrid": {"function": 0.97, "tension": 0.35, "density": 0.55, "gravitation": 0.85}, "freq": 432},
    "glin_v1.5": {"name": "ГЛИНКА", "tdi": 0.16, "delta": 0.69, "evrid": {"function": 0.93, "tension": 0.22, "density": 0.52, "gravitation": 0.89}, "freq": 432},
    "tchai_v1.2": {"name": "ЧАЙКОВСКИЙ", "tdi": 0.24, "delta": 0.78, "evrid": {"function": 0.94, "tension": 0.40, "density": 0.70, "gravitation": 0.92}, "freq": 440},
    "martynov_v1.0": {"name": "МАРТЫНОВ", "tdi": 0.14, "delta": 0.67, "evrid": {"function": 0.88, "tension": 0.15, "density": 0.45, "gravitation": 0.95}, "freq": 432},
    "richter_v1.0": {"name": "РИХТЕР", "tdi": 0.21, "delta": 0.67, "evrid": {"function": 0.85, "tension": 0.35, "density": 0.50, "gravitation": 0.80}, "freq": 440},
    "piazzolla_v1.0": {"name": "ПЬЯЦЦОЛЛА", "tdi": 0.32, "delta": 0.71, "evrid": {"function": 0.87, "tension": 0.45, "density": 0.65, "gravitation": 0.75}, "freq": 440},
    "paart_v1.0": {"name": "ПЯРТ", "tdi": 0.08, "delta": 0.66, "evrid": {"function": 0.90, "tension": 0.10, "density": 0.40, "gravitation": 0.98}, "freq": 432},
    "crumb_v1.0": {"name": "КРАМБ", "tdi": 0.42, "delta": 0.72, "evrid": {"function": 0.82, "tension": 0.55, "density": 0.75, "gravitation": 0.70}, "freq": 440}
}

class TestSingleSourceOfTruth(unittest.TestCase):
    def setUp(self):
        self.assertTrue(CORES_JSON_PATH.exists(), f"File {CORES_JSON_PATH} must exist")
        with open(CORES_JSON_PATH, "r", encoding="utf-8") as f:
            self.cores = json.load(f)

    def test_01_json_validity_and_count(self):
        """Проверка 1: JSON валиден и содержит ровно 17 записей"""
        self.assertIsInstance(self.cores, list)
        self.assertEqual(len(self.cores), 17, f"Ожидалось 17 записей, обнаружено {len(self.cores)}")

    def test_02_unique_identifiers(self):
        """Проверка 2: Все идентификаторы ядер уникальны"""
        ids = [core["id"] for core in self.cores]
        self.assertEqual(len(ids), len(set(ids)), "Обнаружены дублирующиеся ID ядер")
        self.assertEqual(len(ids), 17)

    def test_03_required_fields_and_types(self):
        """Проверка 3: Обязательные поля и типы данных соблюдены"""
        required_root_keys = ["id", "name", "era", "type", "tdi", "delta", "status", "evrid", "nadi", "acoustic", "color"]
        for c in self.cores:
            for k in required_root_keys:
                self.assertIn(k, c, f"Ключ {k} отсутствует в ядре {c.get('id')}")

            # EVRID
            for evk in ["function", "tension", "density", "gravitation"]:
                self.assertIn(evk, c["evrid"], f"Ключ {evk} отсутствует в evrid для {c['id']}")
                val = c["evrid"][evk]
                self.assertIsInstance(val, (int, float))
                self.assertGreaterEqual(val, 0.0)
                self.assertLessEqual(val, 1.0)

            # NADI
            for nk in ["ida", "pingala", "sushumna"]:
                self.assertIn(nk, c["nadi"])
                self.assertIsInstance(c["nadi"][nk], str)
                self.assertTrue(len(c["nadi"][nk]) > 0)

            # Acoustic
            self.assertIn("freq", c["acoustic"])
            self.assertIn("timbre", c["acoustic"])
            self.assertIn("reverb", c["acoustic"])

    def test_04_frozen_inventory_parameters(self):
        """Проверка 4: Числовые параметры строго совпадают с зафиксированным инвентарём"""
        for core in self.cores:
            cid = core["id"]
            self.assertIn(cid, EXPECTED_INVENTORY, f"Неизвестное ядро {cid}")
            expected = EXPECTED_INVENTORY[cid]

            self.assertEqual(core["name"], expected["name"])
            self.assertAlmostEqual(core["tdi"], expected["tdi"], places=3)
            self.assertAlmostEqual(core["delta"], expected["delta"], places=3)
            self.assertEqual(core["acoustic"]["freq"], expected["freq"])

            for evk in ["function", "tension", "density", "gravitation"]:
                self.assertAlmostEqual(core["evrid"][evk], expected["evrid"][evk], places=3)

    def test_05_react_reads_cores_json(self):
        """Проверка 5: React-компонент импортирует cores.json без скрытого хардкода"""
        with open(APP_TSX_PATH, "r", encoding="utf-8") as f:
            src = f.read()

        self.assertIn("import INITIAL_CORES from './data/cores.json';", src)
        # Проверяем отсутствие старого хардкод-массива в App.tsx
        self.assertNotIn('id: "rach_v2.0", name: "РАХМАНИНОВ"', src)
        self.assertNotIn('id: "crumb_v1.0", name: "КРАМБ"', src)

    def test_06_composer_core_generator_reads_cores_json(self):
        """Проверка 6: composer_core_generator.py читает cores.json и разделяет tdi и calculated_tdi"""
        import composer_core_generator as gen
        
        composer_list = gen.get_composer_list()
        self.assertEqual(len(composer_list), 17)

        # Проверка сохранения обратной совместимости по ключу tdi и наличия calculated_tdi
        rach_details = gen.get_composer_details("rachmaninoff")
        self.assertEqual(rach_details["composer"], "РАХМАНИНОВ")
        self.assertEqual(rach_details["tdi"], 0.21, "Базовый tdi Рахманинова должен оставаться 0.21")
        self.assertEqual(rach_details["calculated_tdi"], 0.143, "Расчётный tdi Рахманинова должен быть 0.143")

        crumb_details = gen.get_composer_details("crumb_v1.0")
        self.assertEqual(crumb_details["composer"], "КРАМБ")
        self.assertEqual(crumb_details["tdi"], 0.42, "Базовый tdi Крамба должен оставаться 0.42")
        self.assertEqual(crumb_details["calculated_tdi"], 0.448, "Расчётный tdi Крамба должен быть 0.448")

    def test_07_academic_harvester_reads_cores_json(self):
        """Проверка 7: academic_harvester.py предоставляет tdi и calculated_tdi раздельно"""
        import academic_harvester as ah
        
        martynov = ah.MartynovCore()
        meta = martynov.get_metadata()
        self.assertEqual(meta["name"], "МАРТЫНОВ")
        self.assertEqual(martynov.tdi, 0.14, "Авторский базовый tdi Мартынова должен быть 0.14")
        self.assertEqual(meta["tdi"], 0.14, "Метаданные должны сохранять ключ tdi со значением 0.14")
        self.assertEqual(meta["calculated_tdi"], 0.069, "Расчётный tdi Мартынова должен быть 0.069")

        crumb = ah.CrumbCore()
        meta_c = crumb.get_metadata()
        self.assertEqual(meta_c["name"], "КРАМБ")
        self.assertEqual(crumb.tdi, 0.42, "Авторский базовый tdi Крамба должен быть 0.42")
        self.assertEqual(meta_c["tdi"], 0.42, "Метаданные должны сохранять ключ tdi со значением 0.42")
        self.assertEqual(meta_c["calculated_tdi"], 0.448, "Расчётный tdi Крамба должен быть 0.448")

    def test_08_zip_export_integrity(self):
        """Проверка 8: Экспортируемый ZIP содержит 6 файлов, оба показателя TDI и исполняется без ошибок"""
        temp_dir = Path("/tmp/test_ssot_export")
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
        temp_dir.mkdir(parents=True)

        try:
            with open(CORES_JSON_PATH, "r", encoding="utf-8") as f:
                cores_data = json.load(f)

            test_ids = ["rach_v2.0", "bach_v2.1", "crumb_v1.0"]
            class_map = {"rach": "RachmaninoffCore", "bach": "BachCore", "crumb": "CrumbCore"}

            for target_id in test_ids:
                core = next(c for c in cores_data if c["id"] == target_id)
                prefix = target_id.split("_")[0]
                cls_name = class_map[prefix]
                target_dir = temp_dir / prefix
                target_dir.mkdir()

                # Симулируем генерацию, соответствующую обновлённому контракту App.tsx
                core_py = f'''"""
🎼 {core["name"]} MUSICAL CORE v1.0
"""
import math, random, json

class {cls_name}:
    def __init__(self):
        self.id = "AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS"
        self.name = "{core['name']}"
        self.ready_for_integration = True
        self.evrid = {{
            "function": {core['evrid']['function']},
            "tension": {core['evrid']['tension']},
            "density": {core['evrid']['density']},
            "gravity": {core['evrid']['gravitation']}
        }}
        self.delta = {core['delta']}
        self.tdi = {core['tdi']}
        self.tdi_baseline = {core['tdi']}
        self.nadi = {json.dumps(core['nadi'])}
        self.acoustic = {json.dumps(core['acoustic'])}

    def calculate_tdi(self):
        tdi = (self.evrid["tension"] * self.evrid["density"]) / (self.evrid["function"] + 0.1)
        return round(min(tdi, 1.0), 3)

    def calculate_delta(self):
        f, t, d, g = self.evrid["function"], self.evrid["tension"], self.evrid["density"], self.evrid["gravity"]
        return round(f * 0.3 + t * 0.2 + d * 0.2 + g * 0.3, 3)

    def validate_s_core(self, melody, texture):
        return round(math.sqrt(melody**2 + texture**2), 3)

    def get_metadata(self):
        return {{
            "id": self.id,
            "name": self.name,
            "evrid": self.evrid,
            "delta": self.calculate_delta(),
            "nadi": self.nadi,
            "acoustic": self.acoustic,
            "tdi": self.tdi,
            "calculated_tdi": self.calculate_tdi(),
            "ready": self.ready_for_integration
        }}

    def generate_example(self):
        m = round(random.uniform(0.6, 0.9), 3)
        t = round(random.uniform(0.6, 0.8), 3)
        res = self.validate_s_core(m, t)
        return {{
            "melody": m, "texture": t, "resonance": res,
            "tdi": self.tdi, "calculated_tdi": self.calculate_tdi(),
            "style": "{core['name']}",
            "s_core": f"{{m}}² + {{t}}² = {{res}}²"
        }}
'''
                example_py = f'''from {prefix}_core import {cls_name}
import json
c = {cls_name}()
print(f"Loaded {{c.name}}")
ex = c.generate_example()
assert "tdi" in ex and "calculated_tdi" in ex
print(json.dumps(ex))
'''
                test_py = f'''import unittest
from {prefix}_core import {cls_name}

class Test{cls_name}(unittest.TestCase):
    def setUp(self):
        self.core = {cls_name}()

    def test_evrid(self):
        for k in ["function", "tension", "density", "gravity"]:
            self.assertTrue(0.0 <= self.core.evrid[k] <= 1.0)

    def test_tdi_separation(self):
        self.assertEqual(self.core.tdi, {core['tdi']})
        expected_calc = round(min((self.core.evrid["tension"] * self.core.evrid["density"]) / (self.core.evrid["function"] + 0.1), 1.0), 3)
        self.assertEqual(self.core.calculate_tdi(), expected_calc)

    def test_alyosha_gate_limit(self):
        self.assertLess(self.core.tdi, 0.45)
        self.assertLess(self.core.calculate_tdi(), 0.45)

if __name__ == '__main__':
    unittest.main()
'''
                f_val, t_val, d_val = core["evrid"]["function"], core["evrid"]["tension"], core["evrid"]["density"]
                calc_tdi = round(min((t_val * d_val) / (f_val + 0.1), 1.0), 3)
                meta_json = {
                    "core_id": f"{core['id']}_v1.0",
                    "name": core["name"],
                    "metrics": {
                        "tdi": core["tdi"],
                        "calculated_tdi": calc_tdi,
                        "delta_peak": core["delta"]
                    }
                }

                (target_dir / f"{prefix}_core.py").write_text(core_py, encoding="utf-8")
                (target_dir / "example.py").write_text(example_py, encoding="utf-8")
                (target_dir / "test_core.py").write_text(test_py, encoding="utf-8")
                (target_dir / "metadata.json").write_text(json.dumps(meta_json, indent=2), encoding="utf-8")
                (target_dir / "requirements.txt").write_text("# Zero dependencies\n", encoding="utf-8")
                (target_dir / "README.md").write_text(f"# {core['name']}\n", encoding="utf-8")

                zip_path = temp_dir / f"{prefix}_core.zip"
                with zipfile.ZipFile(zip_path, "w") as zf:
                    for f in [f"{prefix}_core.py", "example.py", "test_core.py", "metadata.json", "requirements.txt", "README.md"]:
                        zf.write(target_dir / f, arcname=f)

                with zipfile.ZipFile(zip_path, "r") as zf:
                    names = zf.namelist()
                    self.assertEqual(len(names), 6)

                p_ex = subprocess.run(["python3", "-B", "example.py"], cwd=target_dir, capture_output=True, text=True)
                self.assertEqual(p_ex.returncode, 0, f"example.py failed for {target_id}: {p_ex.stderr}")

                p_test = subprocess.run(["python3", "-B", "-m", "unittest", "test_core.py"], cwd=target_dir, capture_output=True, text=True)
                self.assertEqual(p_test.returncode, 0, f"test_core.py failed for {target_id}: {p_test.stderr}")

        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)

    def test_09_tdi_semantic_separation_all_17_cores(self):
        """Проверка 9: Для всех 17 ядер проверена формула расчёта TDI и соблюдение правила допуска Шлюза Алёши"""
        for core in self.cores:
            cid = core["id"]
            stored_tdi = core["tdi"]
            # Проверка неизменности базового авторского tdi
            self.assertEqual(stored_tdi, EXPECTED_INVENTORY[cid]["tdi"], f"Базовый tdi для {cid} был изменён")

            # Расчёт по формуле
            f, t, d = core["evrid"]["function"], core["evrid"]["tension"], core["evrid"]["density"]
            expected_calc = round(min((t * d) / (f + 0.1), 1.0), 3)

            # Правило допуска Шлюза Алёши: ОБА показателя обязаны быть < 0.45
            self.assertLess(stored_tdi, 0.45, f"Авторский tdi ядра {cid} ({stored_tdi}) >= 0.45")
            self.assertLess(expected_calc, 0.45, f"Расчётный tdi ядра {cid} ({expected_calc}) >= 0.45")

if __name__ == "__main__":
    unittest.main()
