"""
==============================================================================
🧪 TEST SUITE: MCG-ANALYTICS TRIAD ARCHITECTURE
==============================================================================
Тестирование трёхслойной архитектуры:
1. Индивидуальный профиль (Individual Profile)
2. Объективный измерительный движок (Deterministic Measurement Engine)
3. Интерпретационный слой (Stylistic Interpretation Layer)
==============================================================================
"""

import unittest
import json
import math
from pathlib import Path

from mcg_analytics import (
    create_triad_engine,
    compute_symmetric_eigenvalues,
    ComposerProfile,
    SpectralMeasurementEngine,
    TemporalMeasurementEngine,
    StylisticInterpretationEngine,
    GraphPassport,
    TemporalMeasurement
)

class TestAnalyticsTriadArchitecture(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.profiles, cls.engine = create_triad_engine()

    def test_01_all_17_cores_profile_integrity(self):
        """Проверка 1: Все 17 композиторских ядер загружены в профили без потерь параметров"""
        self.assertEqual(len(self.profiles), 17, "Должно быть ровно 17 профилей композиторов")
        for p in self.profiles:
            self.assertIn(p.id, self.engine.profiles)
            self.assertTrue(0.0 <= p.tdi_baseline <= 1.0)
            self.assertTrue(0.0 <= p.calculated_tdi <= 1.0)
            self.assertTrue(0.0 <= p.delta_peak <= 1.0)
            self.assertTrue(0.0 <= p.calculated_delta <= 1.0)
            # Проверка индивидуальных допусков
            tols = p.tolerances
            self.assertIn("max_tdi_allowed", tols)
            self.assertIn("min_lambda_2", tols)
            self.assertIn("max_spectral_entropy", tols)
            self.assertIn("primary_invariant", tols)

    def test_02_measurement_engine_determinism(self):
        """Проверка 2: Измерительный движок выдаёт строго идентичные спектральные результаты при повторах"""
        profile = next(p for p in self.profiles if p.id == "bach_v2.1")
        p1 = SpectralMeasurementEngine.analyze_profile(profile)
        p2 = SpectralMeasurementEngine.analyze_profile(profile)

        self.assertEqual(p1.lambda_2, p2.lambda_2)
        self.assertEqual(p1.spectral_gap, p2.spectral_gap)
        self.assertEqual(p1.entropy, p2.entropy)
        self.assertEqual(p1.eigenvalues, p2.eigenvalues)

    def test_03_spectral_passport_mathematical_properties(self):
        """Проверка 3: Математические инварианты спектра Лапласиана соблюдаются для всех 17 ядер"""
        for p in self.profiles:
            passport = SpectralMeasurementEngine.analyze_profile(p)
            eigs = passport.eigenvalues
            self.assertEqual(len(eigs), 4, f"Ядро {p.id} должно иметь 4 собственных значения для EVRID-графа")
            # Первое собственное значение Лапласиана всегда 0
            self.assertAlmostEqual(eigs[0], 0.0, places=4, msg=f"λ₁ для {p.id} должно быть равно 0")
            # Алгебраическая связность λ₂ > 0 для связного графа
            self.assertGreater(passport.lambda_2, 0.0, f"λ₂ для {p.id} должна быть > 0")
            # Спектральная щель неотрицательна
            self.assertGreaterEqual(passport.spectral_gap, 0.0, f"Спектральная щель для {p.id} < 0")
            # Спектральная энтропия положительна
            self.assertGreater(passport.entropy, 0.0, f"Спектральная энтропия для {p.id} <= 0")

    def test_04_temporal_measurement_engine(self):
        """Проверка 4: Временной движок рассчитывает фазовую скорость, Trace и Confidence"""
        s_a = {"function": 0.8, "tension": 0.3, "density": 0.6, "gravitation": 0.8}
        s_b = {"function": 0.85, "tension": 0.25, "density": 0.6, "gravitation": 0.82}
        meas = TemporalMeasurementEngine.measure_transition(s_a, s_b, dt=1.0)

        self.assertIsInstance(meas, TemporalMeasurement)
        self.assertTrue(0.0 <= meas.stability <= 1.0)
        self.assertTrue(0.0 <= meas.confidence <= 1.0)
        self.assertEqual(len(meas.trace_hash), 16, "Трассировочный хэш должен иметь длину 16")

        # Проверка неизменности хэша для идентичных входов
        meas2 = TemporalMeasurementEngine.measure_transition(s_a, s_b, dt=1.0)
        self.assertEqual(meas.trace_hash, meas2.trace_hash)

    def test_05_stylistic_differentiation_non_uniformity(self):
        """Проверка 5: Принцип индивидуальности — численные различия Баха, Рахманинова и Пярта подтверждают уникальность стиля"""
        p_bach = next(p for p in self.profiles if p.id == "bach_v2.1")
        p_rach = next(p for p in self.profiles if p.id == "rach_v2.0")
        p_paart = next(p for p in self.profiles if p.id == "paart_v1.0")
        p_crumb = next(p for p in self.profiles if p.id == "crumb_v1.0")

        pass_bach = SpectralMeasurementEngine.analyze_profile(p_bach)
        pass_rach = SpectralMeasurementEngine.analyze_profile(p_rach)
        pass_paart = SpectralMeasurementEngine.analyze_profile(p_paart)
        pass_crumb = SpectralMeasurementEngine.analyze_profile(p_crumb)

        # Бах имеет высокую контрапунктическую связность
        self.assertGreater(pass_bach.lambda_2, pass_paart.lambda_2, "Связность Баха должна превышать разреженность Пярта")
        # Рахманинов имеет более высокий δ-пик, чем Пярт
        self.assertGreater(p_rach.delta_peak, p_paart.delta_peak, "Романтический размах Рахманинова выше минималистического устоя Пярта")
        # Крамб имеет расширенный спектр напряженности
        self.assertGreater(p_crumb.calculated_tdi, p_paart.calculated_tdi, "Авангардная напряженность Крамба выше сакрального покоя Пярта")

    def test_06_individual_tolerance_evaluation(self):
        """Проверка 6: Каждое ядро валидируется по собственным индивидуальным допускам, а не по единому шаблону"""
        for p in self.profiles:
            eval_result = self.engine.evaluate_core_alignment(p.id)
            self.assertEqual(eval_result["composer"], p.name)
            self.assertTrue(eval_result["style_coherence"]["tdi_in_tolerance"], f"TDI ядра {p.id} выходит за индивидуальный допуск")
            self.assertTrue(eval_result["style_coherence"]["connectivity_sufficient"], f"Связность λ₂ ядра {p.id} ниже допустимой нормы")
            self.assertGreaterEqual(eval_result["style_coherence"]["coherence_score"], 0.66)

    def test_07_stylistic_distance_matrix_symmetry(self):
        """Проверка 7: Матрица стилистической дистанции симметрична и имеет нулевую диагональ"""
        dist_matrix = self.engine.calculate_distance_matrix()
        ids = list(dist_matrix.keys())
        self.assertEqual(len(ids), 17)

        for i in ids:
            self.assertEqual(dist_matrix[i][i], 0.0, f"Дистанция ядра {i} к самому себе должна быть 0.0")
            for j in ids:
                self.assertEqual(dist_matrix[i][j], dist_matrix[j][i], f"Матрица несимметрична для пары ({i}, {j})")

if __name__ == "__main__":
    unittest.main()
