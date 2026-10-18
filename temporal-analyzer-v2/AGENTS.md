# AI Agent Guidelines

Welcome, Artificial Intelligence Assistant.

When operating within this repository, you must adhere strictly to the rules defined in `docs/REPOSITORY_CONSTITUTION.md` and `docs/CANONICAL_SPECIFICATION.md`. 

**The architecture is FROZEN.** Do not redesign, optimize, or attempt to change the core ontology, constraints, or boundary definitions without explicit user instruction.

## Implementation Rules
When asked to write code for the Temporal Analyzer, follow these constraints:
1. **Pure Functions Only:** The core analysis logic must have no side effects.
2. **Stateless Execution:** Do not maintain state between independent analysis calls.
3. **Deterministic Algorithms:** Identical inputs must yield identical results.
4. **No Domain Knowledge:** Never introduce domain-specific logic, interpretations, warnings, or diagnosis into the core library.

## Engineering Workflow Note
*Candidate Engineering Process:*
The engineering workflow used to create this repository (Ontology → Architecture → Contract → Specification → Independent Review → Architecture Freeze → Implementation) is considered the **Recommended Engineering Workflow** for future E-OS foundational libraries. Agents assisting in new E-OS libraries should follow this rigorous sequence.
