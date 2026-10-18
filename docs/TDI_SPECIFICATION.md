# Specification: Tension-Dissolution Index (TDI)

**Project:** MUS-MCG / MCG-V3.0  
**Title:** Musical Core Generator & Academic Harvester Terminal  
**Status:** Approved Standard (Turn 03 Implementation Decision)  
**Author & Architect:** Andrey Alekseevich Artsybashev (Kharkiv, Ukraine)

---

## 1. Context & Problem Definition

In early iterations of MCG-V3.0, the concept of **TDI (Tension-Dissolution Index)** was used in two overlapping contexts:
1. An **authorial, calibrated baseline** embedded in the composer profile (e.g., Rachmaninoff = 0.21, Bach = 0.12, Crumb = 0.42), representing overall stylistic harmonic balance and Alyosha Gate qualification.
2. A **dynamically calculated metric** derived from the four-dimensional EVRID perception tensor.

This resulted in semantic ambiguity: external consumers could confuse the static aesthetic baseline with the dynamic algorithmic evaluation.

---

## 2. The Adopted Solution (Architecture Decision B)

To preserve backward compatibility, authorial artistic calibration, and mathematical consistency, MCG-V3.0 implements a **dual-field contract**:

### 2.1 Contract Schema

In `src/data/cores.json`:
```json
{
  "id": "rach_v2.0",
  "name": "РАХМАНИНОВ",
  "era": "РОМАНТИЗМ",
  "type": "САКРАЛЬНОЕ",
  "tdi": 0.21,
  "delta": 0.78,
  "evrid": {
    "function": 0.95,
    "tension": 0.25,
    "density": 0.60,
    "gravitation": 0.90
  }
}
```

In Python adapters (`composer_core_generator.py`, `academic_harvester.py`, and exported ZIP packages):
```python
# Author baseline is preserved under 'tdi'
tdi_baseline = core["tdi"]

# Algorithmic calculation is explicitly exposed under 'calculated_tdi'
f, t, d = core["evrid"]["function"], core["evrid"]["tension"], core["evrid"]["density"]
calculated_tdi = round(min((t * d) / (f + 0.1), 1.0), 3)
```

---

## 3. Field Definitions & Semantics

### 3.1 `tdi` (Authorial Baseline TDI)
- **Role:** Stylistic tension-balance benchmark calibrated by the author.
- **Range:** $0.00 \le \text{tdi} < 0.45$ (for all approved cores).
- **Semantics:** Reflects authorial calibration of harmonic dissonance and texture balance.
- **Status:** Creative and heuristic aesthetic parameter, not a formal topological invariant.

### 3.2 `calculated_tdi` (Algorithmic EVRID-Derived Metric)
- **Role:** Deterministic evaluation of tension-density product relative to tonal stability.
- **Range:** $0.00 \le \text{calculated\_tdi} \le 1.00$.
- **Formula:**
  $$\text{TDI}_{\text{calc}} = \min\left(\frac{T \cdot D}{F + 0.1}, 1.0\right)$$
  where:
  - $T$ = Tension $\in [0.0, 1.0]$
  - $D$ = Density $\in [0.0, 1.0]$
  - $F$ = Function (stability) $\in [0.0, 1.0]$
  - $+0.1$ prevents division by zero when $F = 0$.

### 3.3 Alyosha Gate Criteria
To qualify as an approved, harmonically stable core within the MCG-V3.0 system, a style must satisfy:
$$\text{TDI}_{\text{base}} < 0.45 \quad \text{и} \quad \text{TDI}_{\text{calc}} < 0.45$$

---

## 4. Reconciliation Table across All 17 Canonical Cores

All 17 cores from `src/data/cores.json` verified against baseline and calculated formulas:

| ID | Композитор | Эпоха | Тип | Базовый `tdi` | Расчётный `tdi` | Шлюз Алёши ($< 0.45$) |
|---|---|---|---|---|---|---|
| `rach_v2.0` | РАХМАНИНОВ | РОМАНТИЗМ | САКРАЛЬНОЕ | 0.210 | 0.143 | **PASS** |
| `chesnokov_v1.0` | ЧЕСНОКОВ | РОМАНТИЗМ | САКРАЛЬНОЕ | 0.180 | 0.110 | **PASS** |
| `bort_v1.2` | БОРТНЯНСЬКИЙ | КЛАССИЦИЗМ | САКРАЛЬНОЕ | 0.120 | 0.053 | **PASS** |
| `arkh_v1.1` | АРХАНГЕЛЬСЬКИЙ | ДУХОВНОЕ | САКРАЛЬНОЕ | 0.150 | 0.087 | **PASS** |
| `kuznetsov_v1.0` | КУЗНЕЦОВ | СОВРЕМЕННОЕ | САКРАЛЬНОЕ | 0.170 | 0.153 | **PASS** |
| `grechaninov_v1.0` | ГРЕЧАНІНОВ | РОМАНТИЗМ | САКРАЛЬНОЕ | 0.170 | 0.153 | **PASS** |
| `palest_v1.0` | ПАЛЕСТРИНА | ВОЗРОЖДЕНИЕ | САКРАЛЬНОЕ | 0.050 | 0.045 | **PASS** |
| `kuku_v2.0` | КУКУЗЕЛЬ | ВИЗАНТИЯ | САКРАЛЬНОЕ | 0.040 | 0.062 | **PASS** |
| `bach_v2.1` | BACH | БАРОККО | АКАДЕМИЧЕСКОЕ | 0.120 | 0.259 | **PASS** |
| `moz_v3.0` | MOZART | КЛАССИЦИЗМ | АКАДЕМИЧЕСКОЕ | 0.080 | 0.180 | **PASS** |
| `glin_v1.5` | ГЛИНКА | РОМАНТИЗМ | АКАДЕМИЧЕСКОЕ | 0.160 | 0.111 | **PASS** |
| `tchai_v1.2` | ЧАЙКОВСКИЙ | РОМАНТИЗМ | АКАДЕМИЧЕСКОЕ | 0.240 | 0.269 | **PASS** |
| `martynov_v1.0` | МАРТЫНОВ | МИНИМАЛИЗМ | САКРАЛЬНОЕ | 0.140 | 0.069 | **PASS** |
| `richter_v1.0` | РИХТЕР | ПОСТМИНИМАЛИЗМ | АКАДЕМИЧЕСКОЕ | 0.210 | 0.184 | **PASS** |
| `piazzolla_v1.0` | ПЬЯЦЦОЛЛА | ТАНГО-НУЭВО | АКАДЕМИЧЕСКОЕ | 0.320 | 0.302 | **PASS** |
| `paart_v1.0` | ПЯРТ | МИНИМАЛИЗМ | САКРАЛЬНОЕ | 0.080 | 0.040 | **PASS** |
| `crumb_v1.0` | КРАМБ | АВАНГАРД | АКАДЕМИЧЕСКОЕ | 0.420 | 0.448 | **PASS** |

---

## 5. Guidelines for Integrators

1. **Reading Baseline:** Access `core["tdi"]` for the author's calibrated reference index.
2. **Reading Calculated:** Access `core["calculated_tdi"]` for the EVRID-derived dynamic metric.
3. **Filtering:** Apply both thresholds ($\text{TDI} < 0.45$) to guarantee harmonic stability as specified by the Alyosha Gate.
