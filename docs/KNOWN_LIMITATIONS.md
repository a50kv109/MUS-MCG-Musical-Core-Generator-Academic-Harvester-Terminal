# Known Limitations and Boundaries

**Project:** MUS-MCG / MCG-V3.0  
**Title:** Musical Core Generator & Academic Harvester Terminal  
**Scope:** Architectural boundaries, environment constraints, and model limits

---

## 1. Functional & Audio Scope

1. **No In-Browser Audio Synthesis:**
   - MUS-MCG is an analytical parameter terminal, code generator, and package builder.
   - The application does **not** contain an audio synthesizer, Web Audio API playback engine, soundfont player, or MIDI output driver.
   - Any audio synthesis or performance based on generated cores must be conducted in downstream external digital audio workstations (DAWs) or Python audio engines.

2. **Zero External Runtime Dependencies:**
   - Standalone Python modules and exported ZIP cores use only the standard library (`math`, `json`, `random`, `unittest`).
   - No external scientific or audio frameworks (NumPy, SciPy, Librosa, PyTorch) are bundled or required.

---

## 2. Algorithmic & Modeling Boundaries

1. **Curated Stylistic Invariants:**
   - The 17 composer cores in `src/data/cores.json` encapsulate canonical, representative style parameters calibrated by the author.
   - They do not model stylistic evolution across different biographical periods of a composer (e.g., early vs. late Beethoven).

2. **Heuristic Nature of Theoretical Formulations:**
   - The EVRID tensor, $\delta$-peak dynamic operator, NADI channels, S-CORE Pythagoras invariant, and TDI metrics are authorial heuristic models and compositional concepts formulated by Andrey Artsybashev.
   - Metaphorical terms like "Hodge Core" and "AAM (Artsibashev Algebraic Morphology)" describe the conceptual architecture of the author's compositional theory, not formal mathematical theorems of differential geometry or algebraic topology.

3. **12-Tone Semitone Quantization:**
   - Melodic and scale definitions in core templates are quantized to standard 12-EDO chromatic semitones. Microtonal systems are not natively represented.

---

## 3. Environment Boundaries

1. **AI Studio / Web Sandbox:**
   - In containerized web preview environments, HMR WebSocket connections are disabled to comply with platform security policies.
   - All code generation and ZIP export operations are executed client-side in browser memory via JSZip.

2. **Single Source of Truth Modification Rule:**
   - `src/data/cores.json` is the sole source of truth. Any manual modification must be verified by running:
     ```bash
     python3 -B test_single_source_of_truth.py
     ```
