# MUS-MCG System Architecture & Technical Specifications

**MCG-V3.0: Musical Core Generator & Academic Harvester Terminal**  
*AAM-V2.1 / Hodge Core V5.1 Conceptual Framework*  
*Author & Architect:* Andrey Alekseevich Artsybashev (Kharkiv, Ukraine)  
*Machine ID / Signature:* `AAM-V1_ARTSYBASHEV_UA_KHARKIV_AIANALYSIS`

---

## 1. Architectural Overview & Single Source of Truth

The MUS-MCG system operates on a strict **Single Source of Truth (SSOT)** model. All 17 canonical composer cores are stored in a single validated JSON document:

```
                            ┌────────────────────────┐
                            │   src/data/cores.json  │
                            │ (Single Source of Truth│
                            │      17 Cores)         │
                            └───────────┬────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
     ┌────────────────────────┐                   ┌────────────────────────┐
     │      Browser / UI      │                   │     Python Modules     │
     │     (src/App.tsx)      │                   │(composer_core_generator│
     │                        │                   │  academic_harvester)   │
     │ • Interactive Matrix   │                   │                        │
     │ • Alyosha Gate Filter  │                   │ • Headless generation  │
     │ • Live JSON/ZIP Export │                   │ • CLI matrix analysis  │
     │ • Code Template Gen    │                   │ • External integrations│
     └────────────────────────┘                   └────────────────────────┘
```

> **Note on Audio:** The web application is an analytical terminal and code generator; it does **not** contain an in-browser audio synthesizer or audio playback engine.

---

### 1.1 Canonical Core Schema (`cores.json`)

Each composer core in `src/data/cores.json` implements the following structural schema:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g., `"rach_v2.0"`, `"bach_v2.1"`, `"crumb_v1.0"`). |
| `name` | `string` | Composer display name (e.g., `"РАХМАНИНОВ"`, `"BACH"`, `"КРАМБ"`). |
| `era` | `string` | Stylistic era (e.g., `"РОМАНТИЗМ"`, `"БАРОККО"`, `"АВАНГАРД"`). |
| `type` | `string` | Category classification (`"САКРАЛЬНОЕ"` or `"АКАДЕМИЧЕСКОЕ"`). |
| `tdi` | `number` | **Author's baseline Tension-Dissolution Index**, calibrated for MCG-V3.0 balance ($0.0 \le \text{tdi} < 0.45$). |
| `delta` | `number` | Resulting peak dynamic energy index $\delta \in [0.0, 1.0]$. |
| `status` | `string` | Readiness status (e.g., `"ГОТОВО"`). |
| `evrid` | `object` | 4-dimensional perception tensor: `function`, `tension`, `density`, `gravitation` $\in [0.0, 1.0]$. |
| `nadi` | `object` | 3-register voice energy channels: `ida`, `pingala`, `sushumna` (strings). |
| `acoustic`| `object` | Acoustic parameters: `freq` (Hz, e.g. 432, 440, 256), `timbre`, `reverb`. |
| `color` | `string` | Visual styling token for terminal UI representation. |

---

## 2. Mathematical & Heuristic Models

The mathematical apparatus of MCG-V3.0 consists of algorithmic models and compositional heuristics formulated by author Andrey Artsybashev. Terms such as *Hodge Core* and *AAM (Artsibashev Algebraic Morphology)* are theoretical concepts of the author's compositional system.

### 2.1 The EVRID Perception Tensor
Each core is characterized by a 4-dimensional normalized vector $\mathbf{EVRID} \in [0.0, 1.0]^4$:
- **$\mathbf{F}$ (Function):** Harmonic tonal stability and structural resolution.
- **$\mathbf{T}$ (Tension):** Harmonic and dramatic tension (dissonance factor).
- **$\mathbf{D}$ (Density):** Texture and polyphonic voice density.
- **$\mathbf{G}$ (Gravitation):** Pitch register pull towards foundational tonic bass.

### 2.2 Calculated Tension-Dissolution Index ($\text{TDI}_{\text{calc}}$)
The deterministic algorithmic TDI is derived dynamically from the EVRID tensor:
$$\text{TDI}_{\text{calc}} = \min\left(\frac{T \cdot D}{F + 0.1}, 1.0\right)$$
- If harmonic stability $F$ is high and tension $T$ / density $D$ are moderate, $\text{TDI}_{\text{calc}}$ remains low (consonant/stable).
- If tension and density are high while function is low, $\text{TDI}_{\text{calc}}$ approaches $1.0$ (dissonant/dense).

### 2.3 The $\delta$-Operator (Peak Dynamic Energy)
The cumulative energy peak is evaluated by:
$$\delta = 0.3 \cdot F + 0.2 \cdot T + 0.2 \cdot D + 0.3 \cdot G$$

### 2.4 S-CORE Invariant (Pythagoras Balance)
In generated autonomous Python packages, phrase balance is verified by the Euclidean norm:
$$\text{Resonance} = \sqrt{\text{Melody}^2 + \text{Texture}^2}$$
validating vector conservation between melodic contour and textural density.

### 2.5 NADI Energy Channels
The energy distribution of polyphonic voices follows a 3-register model:
- **Ida:** Contemplative, intuitive, lower/sub-bass register (e.g. Basso Profondo, Ison).
- **Pingala:** Dynamic, ascending, rhythmic lead register (e.g. Znamenny chant, thematic lead).
- **Sushumna:** Harmonizing central axis (e.g. Sobornost unison, harmonic foundation).

### 2.6 Alyosha Gate Verification Rule
The Alyosha Gate serves as a quality criterion for harmonic stability:
$$\text{TDI}_{\text{base}} < 0.45 \quad \text{and} \quad \text{TDI}_{\text{calc}} < 0.45$$
All 17 canonical cores in `src/data/cores.json` strictly pass the Alyosha Gate.

---

## 3. Python Runtime Architecture & Decoupling

### 3.1 Zero-Dependency Standard Library Philosophy
All Python modules in MUS-MCG (`composer_core_generator.py`, `academic_harvester.py`, and exported ZIP packages) strictly use the Python 3 standard library:
- `json` for serialization and SSOT reading
- `math` for Euclidean norms and rounding
- `random` for probabilistic generation seeds
- `unittest` for automated test suites

No external dependencies (NumPy, SciPy, etc.) are required.

### 3.2 Dynamic SSOT Discovery Mechanism
Python modules locate `src/data/cores.json` dynamically across multiple execution contexts:
1. Relative path `src/data/cores.json`
2. Parent path `../src/data/cores.json`
3. Direct file `cores.json` in the current working directory
4. Directory path relative to `__file__`
5. Embedded memory fallback ensuring resilience in isolated environments.

---

## 4. Frontend Terminal Architecture

- **React 19 + TypeScript:** Interactive parameter matrix, Alyosha Gate filtering, and real-time core inspection.
- **Tailwind CSS v4:** Modern dark aesthetic terminal styling (`#050811`, `#0f172a`, emerald accent `#10b981`).
- **JSZip Integration:** Client-side generation of fully autonomous 6-file ZIP archives per composer.
- **Zero Audio Dependency:** The frontend is strictly an analytical parameter workspace and code generator.
