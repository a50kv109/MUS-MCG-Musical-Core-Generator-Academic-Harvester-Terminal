# Contributing to MUS-MCG

Thank you for your interest in contributing to **MUS-MCG (MCG-V3.0)** — *Musical Core Generator & Academic Harvester Terminal*!

---

## 1. Core Architectural Rules

1. **Single Source of Truth (SSOT):**  
   Never hardcode composer parameters or styles inside React components or standalone Python scripts. All 17 cores (and any proposed additions) must reside exclusively in:
   ```
   src/data/cores.json
   ```

2. **Zero-Dependency Python Standard Library Purity:**  
   Exported cores, `composer_core_generator.py`, and `academic_harvester.py` must run on clean Python 3.8+ using **only the standard library** (`json`, `math`, `random`, `unittest`). Never introduce external runtime dependencies such as NumPy, SciPy, or Pandas.

3. **Dual-TDI Field Invariance & Alyosha Gate:**  
   Every core must preserve:
   - `tdi`: The author's calibrated baseline tension index ($0.00 \le \text{tdi} < 0.45$).
   - `calculated_tdi`: Deterministically computed from the EVRID tensor:
     $$\text{TDI}_{\text{calc}} = \min\left(\frac{T \cdot D}{F + 0.1}, 1.0\right) < 0.45$$
   Both metrics must satisfy the Alyosha Gate stability criterion.

4. **No In-Browser Audio Dependencies:**  
   The application is an analytical parameter terminal and code generator; do not introduce web audio synthesis or player dependencies.

---

## 2. Proposing a New Musical Core

When submitting a new core entry for `src/data/cores.json`, provide all required fields:

```json
{
  "id": "composer_v1.0",
  "name": "COMPOSER NAME",
  "era": "HISTORICAL ERA",
  "type": "САКРАЛЬНОЕ" | "АКАДЕМИЧЕСКОЕ",
  "tdi": 0.20,
  "delta": 0.70,
  "status": "ГОТОВО",
  "evrid": {
    "function": 0.90,
    "tension": 0.20,
    "density": 0.50,
    "gravitation": 0.90
  },
  "nadi": {
    "ida": "Lower register voice description",
    "pingala": "Leading thematic voice description",
    "sushumna": "Central harmonic unison description"
  },
  "acoustic": {
    "freq": 432,
    "timbre": "Acoustic or vocal description",
    "reverb": "Acoustic space description"
  },
  "color": "bg-slate-900 border-slate-700 text-slate-200"
}
```

---

## 3. Pull Request & Verification Checklist

Before submitting a pull request, verify that all test suites pass cleanly:

```bash
# 1. Run Python SSOT and export test suite
python3 -B test_single_source_of_truth.py

# 2. Run TypeScript build verification
npm run build

# 3. Run ESLint code quality checks
npm run lint
```

Ensure no compiled artifacts (`dist/`, `__pycache__/`, `node_modules/`) are committed.
