# Temporal Analyzer — Implementation Notes

**Status:** REFERENCE ONLY (Implementation-Defined)

**Purpose:** Documents the specific engineering decisions, data types, formats, and protocols chosen for the reference implementation of Temporal Analyzer. These are not strictly enforced by the canonical architecture, but are recommended for ecosystem compatibility.

---

## 1. Identifiers

- **Decision:** Use `UUID v4` for all identifiers (`ObservationId`, `StateId`, `TraceId`, `ResultId`).
- **Architectural Reason:** The architecture requires global uniqueness and traceability; UUID v4 satisfies this efficiently without central coordination.

## 2. Confidence Scale

- **Decision:** Represent Confidence as a `Float` in the continuous range `[0.0, 1.0]`.
- **Architectural Reason:** The architecture requires confidence to be deterministic and comparable. A normalized float is a standard engineering convention.
- **Limitation:** `Confidence` is a deterministic heuristic score derived from observation completeness and system stability, rather than a rigorous frequentist or Bayesian statistical confidence interval.

## 3. Time Representation

- **Decision:** Represent `Duration` and `Interval` as `Float` values representing seconds. Represent `TimePoint` as ISO 8601 Strings or high-precision UNIX timestamps.
- **Architectural Reason:** The public contract only requires temporal ordering and interval arithmetic.

## 4. Proposed Public Metrics (Requires Architectural Approval)

The following metric types are proposed for the initial implementation. *Note: As this defines the public ontology of what the library actually measures, this enumeration requires final approval from the Architecture Board.*

- `TREND` — Directional change magnitude.
- `DELAY` — Temporal lag between variable responses.
- `CORRELATION` — Statistical/mathematical association (measures mathematical co-variation across synchronized time axes, without asserting causal relationships).
- `SYNCHRONIZATION` — Phase/temporal alignment.
- `STABILITY` — Resistance to perturbation over the interval.
- `TRANSITION` — Regime change magnitude.
- `AMPLITUDE` — Absolute magnitude of the state change.

## 5. Serialization and Schemas

- **Decision:** Use `JSON` as the primary serialization format.
- **Decision:** Validate external structures using `JSON Schema (draft-07)`.
- **Architectural Reason:** The architecture mandates that Results must be serializable and self-contained. JSON provides the broadest compatibility for the Engineering Workbench and external tooling.

## 6. Type System Primitives

- **Numeric:** Implemented as IEEE 754 64-bit floating-point numbers (`Float64`).
- **Integer:** Implemented as 32-bit signed integers (`Int32`).
- **Boolean:** Standard `True/False` logical types.
- **String:** UTF-8 encoding.

## 7. MUS-MCG Integration Adapter & Strict Validation

- **MUSMCGAdapter (`src/temporal_analyzer/mus_mcg_adapter.py`):**
  - Cleanly separates static composer profiles (e.g. core definitions from `cores.json`) from dynamic temporal observations.
  - Computes a SHA-256 integrity hash of the profile (`profile_hash`) to verify provenance and ensure tracking without mutating static base datasets.
  - *Limitation on Immutability:* SHA-256 confirms whether content matches the computed fingerprint at initialization, but does *not* automatically enforce runtime deep immutability on Python dictionaries/objects in memory.
- **Strict Validation (`src/temporal_analyzer/core/validator.py`):**
  - Enforces chronological ordering of observations (out-of-order observations raise explicit validation errors rather than being silently sorted).
  - Validates numeric finiteness (rejects NaN / Infinity values) to guarantee deterministic calculations.
