/**
 * ==============================================================================
 * 🎼 MCG-ANALYTICS: CLIENT ENGINE (Vite / TypeScript)
 * ==============================================================================
 * Полная реализация Триадной Архитектуры:
 * 1. Индивидуальный профиль (Individual Profile)
 * 2. Объективный измерительный движок (Spectral Tracker + Temporal Analyzer)
 * 3. Интерпретационный слой (Stylistic Interpretation & Comparative Matrix)
 *
 * Чистая детерминированная реализация без внешних математических зависимостей.
 * Соответствует эталонной логике в mcg_analytics.py
 * ==============================================================================
 */

export interface EvridTensor {
  function: number;
  tension: number;
  density: number;
  gravitation: number;
}

export interface GraphPassport {
  lambda_2: number;
  spectral_gap: number;
  entropy: number;
  eigenvalues: number[];
}

export interface TemporalMeasurement {
  state_from: EvridTensor;
  state_to: EvridTensor;
  delta_dynamics: number;
  phase_velocity: number;
  stability: number;
  trace_hash: string;
  confidence: number;
}

export interface StyleTolerances {
  max_tdi_allowed: number;
  min_lambda_2: number;
  max_spectral_entropy: number;
  primary_invariant: string;
  target_delta_range: [number, number];
}

export interface StyleInterpretation {
  composer: string;
  core_id: string;
  primary_invariant: string;
  passport: GraphPassport;
  temporal: TemporalMeasurement;
  tolerances: StyleTolerances;
  coherence: {
    tdi_in_tolerance: boolean;
    connectivity_sufficient: boolean;
    entropy_in_bounds: boolean;
    coherence_score: number;
  };
  summary: string;
}

/**
 * ЧИСТЫЙ ДЕТЕРМИНИРОВАННЫЙ АЛГОРИТМ ВРАЩЕНИЙ ЯКОБИ
 * Для вещественных симметричных матриц (Лапласиан графа).
 */
export function computeSymmetricEigenvalues(matrix: number[][], tol = 1e-10, maxIter = 150): number[] {
  const n = matrix.length;
  if (n === 0) return [];
  if (n === 1) return [matrix[0][0]];

  // Создаем копию матрицы
  const A = matrix.map(row => [...row]);

  for (let iter = 0; iter < maxIter; iter++) {
    let maxVal = 0.0;
    let p = 0;
    let q = 1;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const val = Math.abs(A[i][j]);
        if (val > maxVal) {
          maxVal = val;
          p = i;
          q = j;
        }
      }
    }

    if (maxVal < tol) break;

    const app = A[p][p];
    const aqq = A[q][q];
    const apq = A[p][q];

    const theta = 0.5 * Math.atan2(2.0 * apq, aqq - app);
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    for (let i = 0; i < n; i++) {
      if (i !== p && i !== q) {
        const a_ip = A[i][p];
        const a_iq = A[i][q];
        A[i][p] = c * a_ip - s * a_iq;
        A[p][i] = A[i][p];
        A[i][q] = s * a_ip + c * a_iq;
        A[q][i] = A[i][q];
      }
    }

    A[p][p] = c * c * app - 2.0 * s * c * apq + s * s * aqq;
    A[q][q] = s * s * app + 2.0 * s * c * apq + c * c * aqq;
    A[p][q] = 0.0;
    A[q][p] = 0.0;
  }

  const vals = A.map((_, i) => A[i][i]);
  const cleaned = vals.map(v => (Math.abs(v) < 1e-9 ? 0.0 : Math.round(v * 10000) / 10000));
  cleaned.sort((a, b) => a - b);
  return cleaned;
}

/**
 * Построение матрицы Лапласиана 4-полюсного графа EVRID
 */
export function buildCoreLaplacian(evrid: EvridTensor): number[][] {
  const f = evrid.function;
  const t = evrid.tension;
  const d = evrid.density;
  const g = evrid.gravitation;

  const w_FT = Math.max(0.01, Math.round(t * (1.0 - f * 0.5) * 1000) / 1000);
  const w_TD = Math.max(0.01, Math.round(t * d * 1000) / 1000);
  const w_DG = Math.max(0.01, Math.round(d * g * 1000) / 1000);
  const w_GF = Math.max(0.01, Math.round(g * f * 1000) / 1000);
  const w_FD = Math.max(0.01, Math.round(f * d * 1000) / 1000);
  const w_TG = Math.max(0.01, Math.round(Math.abs(t - g) * 0.8 * 1000) / 1000);

  const W = [
    [0.0,  w_FT, w_FD, w_GF],
    [w_FT, 0.0,  w_TD, w_TG],
    [w_FD, w_TD, 0.0,  w_DG],
    [w_GF, w_TG, w_DG, 0.0 ]
  ];

  const n = 4;
  const L: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    const deg = W[i].reduce((sum, v) => sum + v, 0);
    for (let j = 0; j < n; j++) {
      if (i === j) {
        L[i][j] = deg;
      } else {
        L[i][j] = -W[i][j];
      }
    }
  }
  return L;
}

/**
 * Спектральный анализ (Spectral Tracker engine)
 */
export function analyzeSpectralPassport(evrid: EvridTensor): GraphPassport {
  const L = buildCoreLaplacian(evrid);
  const eigenvalues = computeSymmetricEigenvalues(L);

  const n = eigenvalues.length;
  const lambda_2 = n >= 2 ? eigenvalues[1] : 0.0;
  const spectral_gap = n >= 3 ? Math.max(0, eigenvalues[2] - eigenvalues[1]) : 0.0;

  const trace = eigenvalues.reduce((acc, v) => acc + v, 0);
  let entropy = 0.0;
  if (trace > 1e-9) {
    for (const e of eigenvalues) {
      if (e > 1e-9) {
        const p = e / trace;
        entropy -= p * Math.log(p);
      }
    }
  }

  return {
    lambda_2: Math.round(lambda_2 * 10000) / 10000,
    spectral_gap: Math.round(spectral_gap * 10000) / 10000,
    entropy: Math.round(entropy * 10000) / 10000,
    eigenvalues: eigenvalues.map(v => Math.round(v * 10000) / 10000)
  };
}

/**
 * Временные измерения переходов состояний (Temporal Analyzer engine)
 */
export function measureTemporalTransition(
  stateA: EvridTensor,
  stateB: EvridTensor,
  dt = 1.0
): TemporalMeasurement {
  const va = [stateA.function, stateA.tension, stateA.density, stateA.gravitation];
  const vb = [stateB.function, stateB.tension, stateB.density, stateB.gravitation];

  const displacementSq = va.reduce((sum, val, idx) => sum + Math.pow(vb[idx] - val, 2), 0);
  const phase_velocity = Math.sqrt(displacementSq) / Math.max(0.001, dt);

  const delta_a = 0.3 * va[0] + 0.2 * va[1] + 0.2 * va[2] + 0.3 * va[3];
  const delta_b = 0.3 * vb[0] + 0.2 * vb[1] + 0.2 * vb[2] + 0.3 * vb[3];
  const delta_dynamics = delta_b - delta_a;

  const stability = Math.max(0.0, 1.0 - phase_velocity / 2.0);

  // Хэш воспроизводимости (Trace)
  let hashVal = 0;
  const str = `${va.join(',')}|${vb.join(',')}|${dt}|${delta_dynamics.toFixed(4)}`;
  for (let i = 0; i < str.length; i++) {
    hashVal = (hashVal << 5) - hashVal + str.charCodeAt(i);
    hashVal |= 0;
  }
  const trace_hash = Math.abs(hashVal).toString(16).padStart(12, '0').slice(0, 12);

  const confidence = Math.max(0.0, Math.min(1.0, 1.0 - Math.abs(phase_velocity - 0.2) * 0.5));

  return {
    state_from: stateA,
    state_to: stateB,
    delta_dynamics: Math.round(delta_dynamics * 10000) / 10000,
    phase_velocity: Math.round(phase_velocity * 10000) / 10000,
    stability: Math.round(stability * 10000) / 10000,
    trace_hash: trace_hash,
    confidence: Math.round(confidence * 10000) / 10000
  };
}

/**
 * Получение индивидуальных допусков стиля для конкретного автора
 */
export function getStyleTolerances(core: any): StyleTolerances {
  const isSacred = core.type === 'САКРАЛЬНОЕ';
  const isBaroque = core.era?.includes('БАРОККО');
  const isRomantic = core.era?.includes('РОМАНТИЗМ');
  const isAvantgarde = core.era?.includes('АВАНГАРД') || core.era?.includes('СОВРЕМЕННАЯ');

  let max_tdi = 0.38;
  let min_lambda_2 = 0.30;
  let max_entropy = 1.40;
  let primary_invariant = 'КЛАССИЧЕСКИЙ_БАЛАНС';

  if (isSacred) {
    max_tdi = Math.max(0.25, core.tdi + 0.08);
    min_lambda_2 = 0.40;
    max_entropy = 1.35;
    primary_invariant = 'МОНОЛИТНОСТЬ_ХОРА_И_ГРАВИТАЦИЯ';
  } else if (isBaroque) {
    max_tdi = Math.max(0.32, core.tdi + 0.08);
    min_lambda_2 = 0.50;
    max_entropy = 1.45;
    primary_invariant = 'СТРОГИЙ_КОНТРАПУНКТ_И_АРХИТЕКТОНИКА';
  } else if (isRomantic) {
    max_tdi = Math.max(0.44, core.tdi + 0.10);
    min_lambda_2 = 0.25;
    max_entropy = 1.55;
    primary_invariant = 'ЭКСПРЕССИВНАЯ_ВОЛНА_И_ТЕМБРОВАЯ_ПЛОТНОСТЬ';
  } else if (isAvantgarde) {
    max_tdi = 0.449;
    min_lambda_2 = 0.10;
    max_entropy = 1.80;
    primary_invariant = 'СОНОРНЫЙ_КЛАСТЕР_И_СПЕКТРАЛЬНАЯ_ДИФФУЗИЯ';
  }

  return {
    max_tdi_allowed: Math.round(max_tdi * 1000) / 1000,
    min_lambda_2: Math.round(min_lambda_2 * 1000) / 1000,
    max_spectral_entropy: Math.round(max_entropy * 1000) / 1000,
    primary_invariant,
    target_delta_range: [
      Math.round(Math.max(0.0, core.delta - 0.15) * 1000) / 1000,
      Math.round(Math.min(1.0, core.delta + 0.15) * 1000) / 1000
    ]
  };
}

/**
 * Интерпретация соответствия стилю по индивидуальным критериям
 */
export function evaluateStyleInterpretation(core: any): StyleInterpretation {
  const evrid: EvridTensor = {
    function: core.evrid.function,
    tension: core.evrid.tension,
    density: core.evrid.density,
    gravitation: core.evrid.gravitation ?? core.evrid.gravity ?? 0.5
  };

  const passport = analyzeSpectralPassport(evrid);
  const tolerances = getStyleTolerances(core);

  // Тестовый переход состояния
  const relaxed: EvridTensor = {
    function: Math.min(1.0, evrid.function * 1.05),
    tension: Math.max(0.0, evrid.tension * 0.90),
    density: evrid.density,
    gravitation: Math.min(1.0, evrid.gravitation * 1.02)
  };
  const temporal = measureTemporalTransition(evrid, relaxed);

  const calcTdi = Math.round(Math.min((evrid.tension * evrid.density) / (evrid.function + 0.1), 1.0) * 1000) / 1000;
  const tdi_in_tolerance = calcTdi <= tolerances.max_tdi_allowed;
  const connectivity_sufficient = passport.lambda_2 >= tolerances.min_lambda_2;
  const entropy_in_bounds = passport.entropy <= tolerances.max_spectral_entropy;

  const score = Math.round(((tdi_in_tolerance ? 1 : 0) + (connectivity_sufficient ? 1 : 0) + (entropy_in_bounds ? 1 : 0)) / 3.0 * 100) / 100;

  const summary = `Стиль '${core.name}' (${core.era || 'классика'}) обладает топологической связностью λ₂=${passport.lambda_2} при энтропии H=${passport.entropy}. Первичный инвариант: ${tolerances.primary_invariant}.`;

  return {
    composer: core.name,
    core_id: core.id,
    primary_invariant: tolerances.primary_invariant,
    passport,
    temporal,
    tolerances,
    coherence: {
      tdi_in_tolerance,
      connectivity_sufficient,
      entropy_in_bounds,
      coherence_score: score
    },
    summary
  };
}

/**
 * Топологическая стилистическая дистанция между двумя ядрами
 */
export function calculateStylisticDistance(coreA: any, coreB: any): number {
  const evA: EvridTensor = {
    function: coreA.evrid.function,
    tension: coreA.evrid.tension,
    density: coreA.evrid.density,
    gravitation: coreA.evrid.gravitation ?? coreA.evrid.gravity ?? 0.5
  };
  const evB: EvridTensor = {
    function: coreB.evrid.function,
    tension: coreB.evrid.tension,
    density: coreB.evrid.density,
    gravitation: coreB.evrid.gravitation ?? coreB.evrid.gravity ?? 0.5
  };

  const passA = analyzeSpectralPassport(evA);
  const passB = analyzeSpectralPassport(evB);

  const deltaA = 0.3 * evA.function + 0.2 * evA.tension + 0.2 * evA.density + 0.3 * evA.gravitation;
  const deltaB = 0.3 * evB.function + 0.2 * evB.tension + 0.2 * evB.density + 0.3 * evB.gravitation;

  const featA = [evA.function, evA.tension, evA.density, evA.gravitation, passA.lambda_2, passA.entropy, deltaA];
  const featB = [evB.function, evB.tension, evB.density, evB.gravitation, passB.lambda_2, passB.entropy, deltaB];

  const distSq = featA.reduce((sum, val, idx) => sum + Math.pow(val - featB[idx], 2), 0);
  return Math.round(Math.sqrt(distSq) * 1000) / 1000;
}
