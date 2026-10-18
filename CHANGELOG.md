# Changelog

All notable changes to the **MUS-MCG (MCG-V3.0)** project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [3.0.0] - 2026-10-18

### Added
- **Single Source of Truth (`src/data/cores.json`):** Unified canonical database containing all 17 composer styles with full EVRID, NADI, acoustic, and dual-TDI parameter sets.
- **Automated Verification Suite (`test_single_source_of_truth.py`):** 9 automated unit tests verifying schema adherence, golden parameter invariance, SSOT consumption in React, generator, harvester, and full lifecycle execution of exported ZIP archives.
- **Complete Documentation Suite:**
  - `docs/ARCHITECTURE.md`: Canonical system architecture, data schemas, EVRID/TDI mathematical formulations, and Python/React decoupling.
  - `docs/TDI_SPECIFICATION.md`: Semantic contract separating baseline `tdi` and EVRID-derived `calculated_tdi` with full 17-core reconciliation table.
  - `docs/TESTING.md`: Detailed test suite inventory, QA protocols, and ZIP package execution instructions.
  - `docs/KNOWN_LIMITATIONS.md`: Boundaries on in-browser scope (no audio player), standard library exclusivity, and heuristic conceptual models.
  - `CONTRIBUTING.md`: Guidelines for proposing new composer cores matching the canonical schema.

### Changed
- **Zero-Dependency Python Export:** Completely removed NumPy and external library requirements from generated Python packages (`<prefix>_core.py`, `example.py`, `test_core.py`), ensuring execution in any standard Python 3.8+ environment.
- **Python Generator Decoupling (`composer_core_generator.py`):** Dynamically loads `src/data/cores.json` with multi-path resolution and provides both `tdi` and `calculated_tdi`.
- **Academic Harvester Refactoring (`academic_harvester.py`):** Integrated with SSOT data source, removing duplicated hardcoded dictionaries.
- **Documentation Verification & Audit Alignment (Pass 04.3):**
  - Unified canonical project title as *Musical Core Generator & Academic Harvester Terminal (`MUS-MCG` / `MCG-V3.0`)*.
  - Removed outdated claims of in-browser Web Audio playback/synthesizer; clarified application role as an analytical terminal and code generator.
  - Aligned schema documentation in `docs/ARCHITECTURE.md` with actual `src/data/cores.json` fields.
  - Updated `docs/TDI_SPECIFICATION.md` table to list the 17 actual cores with exact EVRID-calculated TDI values.
  - Updated `docs/TESTING.md` to precisely describe the 9 automated test cases in `test_single_source_of_truth.py`.

### Fixed
- Fixed TDI semantic ambiguity by preserving authorial aesthetic baseline under `tdi` and exposing deterministic EVRID metric under `calculated_tdi`.
- Fixed directory path resolution issues in Python scripts when executed from root or child directories.
- Cleaned up Git tracking with comprehensive `.gitignore`.

---

## [2.1.0] - Prior Release
- Initial AAM-V2.1 prototype with browser terminal interface and experimental core calculations.
