# Testing and Quality Assurance Protocols

**Project:** MUS-MCG / MCG-V3.0  
**Title:** Musical Core Generator & Academic Harvester Terminal  
**Frameworks:** Python `unittest`, Node / TypeScript compile & lint

---

## 1. Test Architecture Overview

MUS-MCG provides a dual verification pipeline:
1. **Python Single Source of Truth (SSOT) & Export Verification:** Automated regression tests covering all 17 composer cores, field schemas, mathematical invariance, and export package generation.
2. **TypeScript Compilation & Lint Verification:** Static analysis and build validation for the React SPA.

---

## 2. Automated Test Suite: `test_single_source_of_truth.py`

The test runner validates 9 critical quality criteria:

| Test Case | Description | Pass Criteria |
|---|---|---|
| `test_01_json_validity_and_count` | Verifies existence, JSON validity, and presence of exactly 17 cores in `src/data/cores.json`. | Exactly 17 valid records. |
| `test_02_unique_identifiers` | Confirms all core IDs are unique. | No duplicate keys in 17 records. |
| `test_03_required_fields_and_types` | Validates root schema keys (`id`, `name`, `era`, `type`, `tdi`, `delta`, `status`, `evrid`, `nadi`, `acoustic`, `color`) and value boundaries $\in [0.0, 1.0]$. | Zero missing keys, valid types and intervals. |
| `test_04_frozen_inventory_parameters` | Asserts exact numerical match against the golden canonical inventory (`EXPECTED_INVENTORY`). | Strict equality of names, TDI, $\delta$, and EVRID. |
| `test_05_react_reads_cores_json` | Verifies `src/App.tsx` imports from `src/data/cores.json` and contains no legacy hardcoded lists. | Pure import present; duplicate arrays absent. |
| `test_06_composer_core_generator_reads_cores_json` | Validates SSOT loading and TDI dual contract (`tdi` vs `calculated_tdi`) in generator module. | Matches all 17 cores and returns expected TDI values. |
| `test_07_academic_harvester_reads_cores_json` | Verifies academic classes (`MartynovCore`, `CrumbCore`, etc.) load from SSOT with separate TDI fields. | Preserves baseline TDI and provides calculated TDI. |
| `test_08_zip_export_integrity` | Synthesizes ZIP packages for sample cores (`rach_v2.0`, `bach_v2.1`, `crumb_v1.0`), unpacks them into a clean sandbox, and executes `example.py` and `test_core.py` in a separate process. | All 6 files present; scripts execute with returncode 0. |
| `test_09_tdi_semantic_separation_all_17_cores` | Checks dynamic recalculation of TDI from EVRID and verifies Alyosha Gate threshold ($< 0.45$) across all 17 cores. | Both baseline and calculated TDI $< 0.45$ for all 17 cores. |

### Running the Python Suite
```bash
python3 -B test_single_source_of_truth.py
```
Expected output:
```
Ran 9 tests in ~0.25s
OK
```

---

## 3. Export Package Autonomous Testing

When a user downloads a composer ZIP archive (e.g., `rach_core.zip`), the archive includes its own self-contained test suite:

- `test_core.py`: 7 automated unit tests checking:
  - Vector initialization and metadata consistency
  - EVRID tensor range compliance $[0.0, 1.0]$
  - Separation of baseline `tdi` and `calculated_tdi`
  - Alyosha Gate compliance ($\text{TDI} < 0.45$)
  - $\delta$-operator peak energy evaluation
  - S-CORE Pythagoras invariant ($\text{Resonance} = \sqrt{\text{Melody}^2 + \text{Texture}^2}$)
- `example.py`: Demonstration script showing generation of musical parameters with zero third-party dependencies.

### Verification Inside Unpacked Archive:
```bash
python3 -B example.py
python3 -B -m unittest test_core.py
```

---

## 4. Frontend Compilation & Linting

### Type Checking & Build
```bash
npm run build
```
Runs Vite build and TypeScript validation to ensure zero bundling warnings or syntax errors.

### Linting
```bash
npm run lint
```
Executes ESLint validation across all TypeScript and React components.
