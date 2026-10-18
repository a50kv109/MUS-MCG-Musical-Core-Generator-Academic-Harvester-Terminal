"""
==============================================================================
🎼 MCG-ANALYTICS: TRIAD ARCHITECTURAL ENGINE v1.0
Индивидуальный профиль | Объективные измерения | Стилистическая интерпретация
==============================================================================
Архитектор: Арцыбашев Андрей Алексеевич
Идентификатор: AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS

Интеграция концепций:
- SPECTRAL TRACKER: детерминированные топологические измерения (Graph Passport, λ₂, Spectral Gap, Entropy)
- TEMPORAL ANALYZER: детерминированные временные измерения переходов состояний (Trace, Confidence, δ-динамика)

ГЛАВНЫЙ ПРИНЦИП:
Не подгонять музыкальные ядра под единую норму, а исследовать каждое ядро с учётом
его индивидуального стиля. Различие между авторами — это суть стиля, а не ошибка.
==============================================================================
"""

import math
import json
import hashlib
from typing import Dict, List, Any, Tuple, Optional
from pathlib import Path

# ==============================================================================
# 1. ЧИСТЫЙ ДЕТЕРМИНИРОВАННЫЙ СПЕКТРАЛЬНЫЙ АЛГОРИТМ (JACOBI EIGENVALUES)
# Zero external dependencies — чистый Python без сторонних пакетов
# ==============================================================================

def compute_symmetric_eigenvalues(matrix: List[List[float]], tol: float = 1e-11, max_iter: int = 150) -> List[float]:
    """
    Детерминированное вычисление собственных значений вещественной симметричной матрицы (Лапласиана)
    методом вращений Якоби. Гарантирует абсолютную воспроизводимость без внешних библиотек.
    """
    n = len(matrix)
    if n == 0:
        return []
    if n == 1:
        return [float(matrix[0][0])]

    # Копия матрицы
    A = [row[:] for row in matrix]

    for _ in range(max_iter):
        # Поиск максимального внедиагонального элемента
        max_val = 0.0
        p, q = 0, 1
        for i in range(n):
            for j in range(i + 1, n):
                val = abs(A[i][j])
                if val > max_val:
                    max_val = val
                    p, q = i, j

        if max_val < tol:
            break

        app = A[p][p]
        aqq = A[q][q]
        apq = A[p][q]

        theta = 0.5 * math.atan2(2.0 * apq, aqq - app)
        c = math.cos(theta)
        s = math.sin(theta)

        for i in range(n):
            if i != p and i != q:
                a_ip = A[i][p]
                a_iq = A[i][q]
                A[i][p] = c * a_ip - s * a_iq
                A[p][i] = A[i][p]
                A[i][q] = s * a_ip + c * a_iq
                A[q][i] = A[i][q]

        A[p][p] = c * c * app - 2.0 * s * c * apq + s * s * aqq
        A[q][q] = s * s * app + 2.0 * s * c * apq + c * c * aqq
        A[p][q] = 0.0
        A[q][p] = 0.0

    vals = [A[i][i] for i in range(n)]
    # Очистка численного шума около 0.0
    vals = [0.0 if abs(v) < 1e-9 else round(v, 6) for v in vals]
    vals.sort()
    return vals


# ==============================================================================
# СЛОЙ 1: ИНДИВИДУАЛЬНЫЙ ПРОФИЛЬ КОМПОЗИТОРА (INDIVIDUAL COMPOSER PROFILE)
# Хранит индивидуальные инварианты, допуски и специфику стиля
# ==============================================================================

class ComposerProfile:
    """
    Индивидуальный профиль композитора:
    Определяет уникальные границы, эталонные векторы и эстетические инварианты конкретного автора.
    Не навязывает универсальную норму — каждый стиль оценивается по собственной метрической шкале.
    """
    def __init__(self, core_data: Dict[str, Any]):
        self.id = core_data["id"]
        self.name = core_data["name"]
        self.era = core_data.get("era", "НЕ УКАЗАНА")
        self.type = core_data.get("type", "АКАДЕМИЧЕСКОЕ")
        self.status = core_data.get("status", "ГОТОВО")

        # Канонические авторские параметры
        self.tdi_baseline = float(core_data["tdi"])
        self.delta_peak = float(core_data["delta"])

        # EVRID-тензор
        ev = core_data["evrid"]
        self.evrid = {
            "function": float(ev["function"]),
            "tension": float(ev["tension"]),
            "density": float(ev["density"]),
            "gravitation": float(ev["gravitation"])
        }

        # NADI каналы и акустическая матрица
        self.nadi = dict(core_data.get("nadi", {}))
        self.acoustic = dict(core_data.get("acoustic", {}))

        # Вычисление расчетных базовых показателей стиля
        f, t, d, g = self.evrid["function"], self.evrid["tension"], self.evrid["density"], self.evrid["gravitation"]
        self.calculated_tdi = round(min((t * d) / (f + 0.1), 1.0), 3)
        self.calculated_delta = round(0.3 * f + 0.2 * t + 0.2 * d + 0.3 * g, 3)

        # Индивидуальный профиль допусков стиля (Style-Specific Invariants & Tolerances)
        # Базируется на эстетике эпохи и школы композитора
        self.tolerances = self._build_style_tolerances()

    def _build_style_tolerances(self) -> Dict[str, Any]:
        """
        Формирует индивидуальный коридор допустимых отклонений для конкретного стиля.
        """
        is_sacred = (self.type == "САКРАЛЬНОЕ")
        is_baroque = ("БАРОККО" in self.era)
        is_romantic = ("РОМАНТИЗМ" in self.era)
        is_avantgarde = ("АВАНГАРД" in self.era or "СОВРЕМЕННАЯ" in self.era)

        # Специфические пороги для каждого направления:
        if is_sacred:
            # Сакральная монолитность: строгий контроль диссонанса, высокая гравитация
            max_tdi = max(0.25, self.tdi_baseline + 0.08)
            min_lambda_2 = 0.40  # высокая связность полифонического хора
            max_entropy = 1.35   # упорядоченность и каноничность
            primary_invariant = "МОНОЛИТНОСТЬ_ХОРА_И_ГРАВИТАЦИЯ"
        elif is_baroque:
            # Барокко: полифоническая плотность, точная функциональная логика
            max_tdi = max(0.32, self.tdi_baseline + 0.08)
            min_lambda_2 = 0.50  # высокая контрапунктическая связность голосов
            max_entropy = 1.45   # структурированная полифония
            primary_invariant = "СТРОГИЙ_КОНТРАПУНКТ_И_АРХИТЕКТОНИКА"
        elif is_romantic:
            # Романтизм: эмоциональный размах, динамическая волна
            max_tdi = max(0.44, self.tdi_baseline + 0.10)
            min_lambda_2 = 0.25  # гибкая ладовая дифференциация
            max_entropy = 1.55   # богатство гармонических красок
            primary_invariant = "ЭКСПРЕССИВНАЯ_ВОЛНА_И_ТЕМБРОВАЯ_ПЛОТНОСТЬ"
        elif is_avantgarde:
            # Авангард / Модерн: исследование сонорики, расширенная энтропия
            max_tdi = 0.449      # в рамках Шлюза Алёши (< 0.45)
            min_lambda_2 = 0.10  # разреженные или кластерные связи
            max_entropy = 1.80   # высокая энтропия и спектральное разнообразие
            primary_invariant = "СОНОРНЫЙ_КЛАСТЕР_И_СПЕКТРАЛЬНАЯ_ДИФФУЗИЯ"
        else:
            max_tdi = 0.38
            min_lambda_2 = 0.30
            max_entropy = 1.40
            primary_invariant = "КЛАССИЧЕСКИЙ_БАЛАНС"

        return {
            "max_tdi_allowed": round(max_tdi, 3),
            "min_lambda_2": round(min_lambda_2, 3),
            "max_spectral_entropy": round(max_entropy, 3),
            "primary_invariant": primary_invariant,
            "target_delta_range": [round(max(0.0, self.delta_peak - 0.15), 3), round(min(1.0, self.delta_peak + 0.15), 3)]
        }

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "era": self.era,
            "type": self.type,
            "evrid": self.evrid,
            "tdi_baseline": self.tdi_baseline,
            "calculated_tdi": self.calculated_tdi,
            "delta_peak": self.delta_peak,
            "calculated_delta": self.calculated_delta,
            "acoustic": self.acoustic,
            "nadi": self.nadi,
            "tolerances": self.tolerances
        }


# ==============================================================================
# СЛОЙ 2: ИЗМЕРИТЕЛЬНЫЙ ДВИЖОК (DETERMINISTIC MEASUREMENT ENGINE)
# Беспристрастные измерения: Спектральный Паспорт + Временные переходы состояний
# Никаких оценочных суждений — строгие воспроизводимые вычисления с Trace & Confidence
# ==============================================================================

class GraphPassport:
    """
    Спектральный паспорт графа (по канону Spectral Tracker).
    Содержит инварианты спектра Лапласиана графа топологии ядра.
    """
    def __init__(self, lambda_2: float, spectral_gap: float, entropy: float, eigenvalues: List[float]):
        self.lambda_2 = round(lambda_2, 4)
        self.spectral_gap = round(spectral_gap, 4)
        self.entropy = round(entropy, 4)
        self.eigenvalues = [round(x, 4) for x in eigenvalues]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "lambda_2": self.lambda_2,
            "spectral_gap": self.spectral_gap,
            "entropy": self.entropy,
            "eigenvalues": self.eigenvalues
        }

    def __repr__(self) -> str:
        return f"GraphPassport(λ₂={self.lambda_2}, gap={self.spectral_gap}, entropy={self.entropy})"


class SpectralMeasurementEngine:
    """
    Спектральный измерительный движок (адаптирован из Spectral Tracker Андрея Арцыбашева).
    Строит матрицу Лапласиана топологических взаимодействий и вычисляет Спектральный Паспорт.
    """
    @staticmethod
    def build_core_laplacian(evrid: Dict[str, float]) -> Tuple[List[List[float]], List[str]]:
        """
        Строит матрицу Лапласиана 4-полюсного графа EVRID (F, T, D, G) с весами взаимодействий:
        - F-T: оппозиция напряжения и функции (t * (1 - f))
        - T-D: диссонансно-фактурная связь (t * d)
        - D-G: гравитационное укоренение плотности (d * g)
        - G-F: гармоническое замыкание тоники и устоя (g * f)
        - F-D: фактурно-функциональная основа (f * d)
        - T-G: динамический перепад напряжения и гравитации (|t - g|)
        """
        nodes = ["F", "T", "D", "G"]
        f, t, d, g = evrid["function"], evrid["tension"], evrid["density"], evrid.get("gravitation", evrid.get("gravity", 0.5))

        # Матрица смежности W с весами ребер
        w_FT = max(0.01, round(t * (1.0 - f * 0.5), 3))
        w_TD = max(0.01, round(t * d, 3))
        w_DG = max(0.01, round(d * g, 3))
        w_GF = max(0.01, round(g * f, 3))
        w_FD = max(0.01, round(f * d, 3))
        w_TG = max(0.01, round(abs(t - g) * 0.8, 3))

        W = [
            [0.0,  w_FT, w_FD, w_GF],
            [w_FT, 0.0,  w_TD, w_TG],
            [w_FD, w_TD, 0.0,  w_DG],
            [w_GF, w_TG, w_DG, 0.0 ]
        ]

        # Лапласиан: L = D_deg - W
        n = 4
        L = [[0.0] * n for _ in range(n)]
        for i in range(n):
            deg = sum(W[i])
            for j in range(n):
                if i == j:
                    L[i][j] = deg
                else:
                    L[i][j] = -W[i][j]

        return L, nodes

    @classmethod
    def analyze_profile(cls, profile: ComposerProfile) -> GraphPassport:
        """
        Вычисляет объективный спектральный паспорт для профиля композитора.
        """
        L, _ = cls.build_core_laplacian(profile.evrid)
        eigenvalues = compute_symmetric_eigenvalues(L)

        n = len(eigenvalues)
        lambda_2 = eigenvalues[1] if n >= 2 else 0.0
        spectral_gap = (eigenvalues[2] - eigenvalues[1]) if n >= 3 else 0.0

        # Спектральная энтропия: H = - sum(p * ln(p))
        trace = sum(eigenvalues)
        entropy = 0.0
        if trace > 1e-9:
            positive_eigs = [e for e in eigenvalues if e > 1e-9]
            for e in positive_eigs:
                p = e / trace
                entropy -= p * math.log(p)

        return GraphPassport(lambda_2=lambda_2, spectral_gap=spectral_gap, entropy=entropy, eigenvalues=eigenvalues)


class TemporalMeasurement:
    """
    Временное инженерное измерение (по канону Temporal Analyzer).
    Содержит детерминированные параметры перехода состояний, Trace и Confidence.
    """
    def __init__(self,
                 state_from: Dict[str, float],
                 state_to: Dict[str, float],
                 delta_dynamics: float,
                 phase_velocity: float,
                 stability: float,
                 trace_hash: str,
                 confidence: float):
        self.state_from = state_from
        self.state_to = state_to
        self.delta_dynamics = round(delta_dynamics, 4)
        self.phase_velocity = round(phase_velocity, 4)
        self.stability = round(stability, 4)
        self.trace_hash = trace_hash
        self.confidence = round(confidence, 4)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "state_from": self.state_from,
            "state_to": self.state_to,
            "delta_dynamics": self.delta_dynamics,
            "phase_velocity": self.phase_velocity,
            "stability": self.stability,
            "trace_hash": self.trace_hash,
            "confidence": self.confidence
        }


class TemporalMeasurementEngine:
    """
    Временной измерительный движок (адаптирован из Temporal Analyzer Андрея Арцыбашева).
    Измеряет строго детерминированные переходы состояний во времени с фиксацией Trace и Confidence.
    """
    @staticmethod
    def measure_transition(state_a: Dict[str, float], state_b: Dict[str, float], dt: float = 1.0) -> TemporalMeasurement:
        """
        Измеряет объективный переход между двумя гармоническими состояниями EVRID.
        """
        keys = ["function", "tension", "density", "gravitation"]
        va = [state_a.get(k, 0.5) for k in keys]
        vb = [state_b.get(k, 0.5) for k in keys]

        # Евклидово фазовое смещение (phase velocity)
        displacement_sq = sum((vb[i] - va[i]) ** 2 for i in range(4))
        phase_velocity = math.sqrt(displacement_sq) / max(0.001, dt)

        # Динамика δ-оператора
        delta_a = 0.3 * va[0] + 0.2 * va[1] + 0.2 * va[2] + 0.3 * va[3]
        delta_b = 0.3 * vb[0] + 0.2 * vb[1] + 0.2 * vb[2] + 0.3 * vb[3]
        delta_diff = delta_b - delta_a

        # Стабильность: 1.0 - нормализованное фазовое смещение
        stability = max(0.0, 1.0 - phase_velocity / 2.0)

        # Вычисление строгой трассировки (Trace Hash) для абсолютной воспроизводимости
        payload = f"{va}->{vb}:{dt}:{delta_diff:.6f}"
        trace_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]

        # Детерминированный показатель доверия (Confidence)
        # В каноне Temporal Analyzer: высокий при физически достижимых переходах без разрывов
        confidence = max(0.0, min(1.0, 1.0 - abs(phase_velocity - 0.2) * 0.5))

        return TemporalMeasurement(
            state_from=state_a,
            state_to=state_b,
            delta_dynamics=delta_diff,
            phase_velocity=phase_velocity,
            stability=stability,
            trace_hash=trace_hash,
            confidence=confidence
        )


# ==============================================================================
# СЛОЙ 3: ИНТЕРПРЕТАЦИОННЫЙ СЛОЙ (INTERPRETATION & COMPARATIVE LAYER)
# Сопоставление с индивидуальным профилем, расчет стилистической дистанции
# Не ставит оценки "ошибка/норма", а исследует авторский почерк
# ==============================================================================

class StylisticInterpretationEngine:
    """
    Интерпретационный слой:
    Оценивает музыкальные измерения ОТНОСИТЕЛЬНО индивидуального профиля композитора.
    Различие численных параметров трактуется как эстетическая характеристика стиля,
    а не как отклонение от абстрактного шаблона.
    """
    def __init__(self, profiles: List[ComposerProfile]):
        self.profiles = {p.id: p for p in profiles}

    def evaluate_core_alignment(self, core_id: str) -> Dict[str, Any]:
        """
        Проводит глубокую стилистическую интерпретацию ядра по его индивидуальному профилю.
        """
        if core_id not in self.profiles:
            raise KeyError(f"Core '{core_id}' not found in registered profiles.")

        profile = self.profiles[core_id]
        passport = SpectralMeasurementEngine.analyze_profile(profile)

        # Тестовый переход состояния (релаксация к устойчивому устою)
        relaxed_evrid = {
            "function": min(1.0, profile.evrid["function"] * 1.05),
            "tension": max(0.0, profile.evrid["tension"] * 0.90),
            "density": profile.evrid["density"],
            "gravitation": min(1.0, profile.evrid["gravitation"] * 1.02)
        }
        temporal = TemporalMeasurementEngine.measure_transition(profile.evrid, relaxed_evrid)

        # Оценка соответствия СОБСТВЕННЫМ допускам профиля:
        tols = profile.tolerances
        tdi_compliant = (profile.calculated_tdi <= tols["max_tdi_allowed"])
        lambda_compliant = (passport.lambda_2 >= tols["min_lambda_2"])
        entropy_compliant = (passport.entropy <= tols["max_spectral_entropy"])

        # Индивидуальный вердикт стиля (индивидуальная формулировка авторского стиля)
        verdict = {
            "composer": profile.name,
            "core_id": profile.id,
            "primary_invariant": tols["primary_invariant"],
            "spectral_passport": passport.to_dict(),
            "temporal_measurement": temporal.to_dict(),
            "profile_tolerances": tols,
            "style_coherence": {
                "tdi_in_tolerance": tdi_compliant,
                "connectivity_sufficient": lambda_compliant,
                "entropy_in_bounds": entropy_compliant,
                "coherence_score": round((int(tdi_compliant) + int(lambda_compliant) + int(entropy_compliant)) / 3.0, 3)
            },
            "interpretation_summary": self._generate_stylistic_summary(profile, passport)
        }
        return verdict

    def _generate_stylistic_summary(self, profile: ComposerProfile, passport: GraphPassport) -> str:
        """
        Генерирует содержательное текстовое резюме авторского почерка.
        """
        name = profile.name
        l2 = passport.lambda_2
        ent = passport.entropy
        tdi = profile.calculated_tdi
        delta = profile.calculated_delta

        return (
            f"Стиль '{name}' демонстрирует характерную топологическую связность λ₂={l2} "
            f"и спектральную энтропию H={ent}. Индивидуальный показатель динамики δ={delta} "
            f"в сочетании с TDI={tdi} отражает авторский инвариант: {profile.tolerances['primary_invariant']}."
        )

    def calculate_distance_matrix(self) -> Dict[str, Dict[str, float]]:
        """
        Вычисляет евклидово-спектральную дистанцию между всеми зарегистрированными стилями.
        Показывает топологическое родство и контраст композиторов без усреднения.
        """
        keys = list(self.profiles.keys())
        matrix: Dict[str, Dict[str, float]] = {k: {} for k in keys}

        # Предварительно извлекаем фичи: [F, T, D, G, λ₂, H, δ]
        features: Dict[str, List[float]] = {}
        for k in keys:
            p = self.profiles[k]
            passp = SpectralMeasurementEngine.analyze_profile(p)
            features[k] = [
                p.evrid["function"],
                p.evrid["tension"],
                p.evrid["density"],
                p.evrid["gravitation"],
                passp.lambda_2,
                passp.entropy,
                p.calculated_delta
            ]

        for i, k1 in enumerate(keys):
            for j, k2 in enumerate(keys):
                if i == j:
                    matrix[k1][k2] = 0.0
                elif j < i:
                    matrix[k1][k2] = matrix[k2][k1]
                else:
                    dist = math.sqrt(sum((features[k1][idx] - features[k2][idx]) ** 2 for idx in range(len(features[k1]))))
                    matrix[k1][k2] = round(dist, 4)

        return matrix


# ==============================================================================
# ФАБРИКА И АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ ИЗ CORES.JSON
# ==============================================================================

def create_triad_engine(cores_path: Optional[Path] = None) -> Tuple[List[ComposerProfile], StylisticInterpretationEngine]:
    """
    Загружает 17 ядер из cores.json и возвращает инициализированную Триадную Систему.
    """
    if cores_path is None:
        base = Path(__file__).resolve().parent
        cores_path = base / "src" / "data" / "cores.json"
        if not cores_path.exists():
            cores_path = base / "cores.json"

    with open(cores_path, "r", encoding="utf-8") as f:
        cores_list = json.load(f)

    profiles = [ComposerProfile(c) for c in cores_list]
    engine = StylisticInterpretationEngine(profiles)
    return profiles, engine


if __name__ == "__main__":
    profiles, engine = create_triad_engine()
    print("=" * 70)
    print("🎼 MCG-ANALYTICS: ТРИАДНАЯ АРХИТЕКТУРА ИНИЦИАЛИЗИРОВАНА")
    print(f"Загружено профилей композиторов: {len(profiles)}")
    print("=" * 70)

    # Проверка ключевых представителей разных эпох
    test_cases = ["bach_v2.1", "rach_v2.0", "paart_v1.0", "crumb_v1.0"]
    for cid in test_cases:
        res = engine.evaluate_core_alignment(cid)
        print(f"\n[КОМПОЗИТОР: {res['composer']} ({cid})]")
        print(f"  Первичный инвариант: {res['primary_invariant']}")
        print(f"  Спектральный паспорт: λ₂={res['spectral_passport']['lambda_2']}, Gap={res['spectral_passport']['spectral_gap']}, H={res['spectral_passport']['entropy']}")
        print(f"  Временное измерение: Vel={res['temporal_measurement']['phase_velocity']}, Conf={res['temporal_measurement']['confidence']}, Trace={res['temporal_measurement']['trace_hash']}")
        print(f"  Когерентность стилю: {res['style_coherence']['coherence_score']} (TDI допуск: {res['style_coherence']['tdi_in_tolerance']})")
        print(f"  Резюме: {res['interpretation_summary']}")
