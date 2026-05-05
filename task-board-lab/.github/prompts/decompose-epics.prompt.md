---
description: 'Decompose PRD into Epics'
mode: 'agent'
---

Read an existing PRD from `specs/prds/` and decompose it into 3–4 well-scoped Epics using the Epic template at `specs/templates/epic-template.md`.

## Instructions

1. **Read the inputs first — in this order:**
   - `specs/templates/epic-template.md` — use this as the exact structure for every Epic file
   - `agents.md` — understand tech stack, naming conventions, and constraints
   - The target PRD in `specs/prds/` — ask the user which PRD to decompose if not specified

2. **Identify 3–4 Epics.** Analyse the PRD's Functional Requirements, Use Cases, and Scope sections to group work into logical, high-level capabilities. Each Epic must satisfy **all four** of these properties:

   - **End-to-end value** — delivers a complete, usable capability on its own (not just a backend task or a UI task in isolation)
   - **Independently deployable** — can be built, tested, and shipped without requiring another Epic to be complete first (note dependencies, but minimise them)
   - **Mapped to a Success Metric** — explicitly references at least one metric from the PRD's Success Metrics section that it moves
   - **Clear boundaries** — has an explicit In Scope and Out of Scope list so there is no ambiguity about what is included

3. **Assign sequential IDs** starting from `001`. Number them in the logical delivery order (foundational Epics first).

4. **Set S/M/L size estimates** based on these criteria:
   - **S** — 1–2 sprints, single team, no cross-Epic dependencies
   - **M** — 2–4 sprints, may touch multiple areas, light dependencies
   - **L** — 4+ sprints, cross-team coordination or architectural changes required

5. **Fill every field** in the Epic template with specific content from the PRD. Do not leave any unfilled placeholders. If a field cannot be determined from the PRD, make a reasonable assumption and label it `[Assumed]`.

6. **Save each Epic** to `specs/epics/epic-{###}-{slug}.md` using zero-padded numbers and kebab-case slugs (e.g., `epic-001-board-view.md`).

---

## Decomposition Rules

- **No infrastructure-only Epics.** Every Epic must be user-visible or directly enable a user-facing capability.
- **No overlapping scope.** If two Epics could claim the same feature, assign it to the one where it fits most naturally and explicitly exclude it from the other's Out of Scope.
- **Dependencies flow forward.** If Epic B depends on Epic A, Epic A must have a lower number and its Status must be resolved before Epic B starts.
- **Avoid splitting a single user journey across Epics.** A user should be able to complete a meaningful task end-to-end within one Epic.

---

## Quality Checklist

Before saving any Epic file, verify every item is true. Fix anything that is not.

- [ ] **End-to-end value** — each Epic delivers a usable capability on its own
- [ ] **Metric mapped** — each Epic references at least one PRD Success Metric it moves
- [ ] **No overlapping scope** — In Scope lists across all Epics are mutually exclusive
- [ ] **Dependencies documented** — all cross-Epic dependencies are listed in the Dependencies table with status and owner
- [ ] **Size estimated** — every Epic has an S / M / L estimate with a rationale
- [ ] **No placeholders remain** — zero unfilled brackets in any saved file
- [ ] **Files named correctly** — saved to `specs/epics/epic-{###}-{slug}.md` in kebab-case
- [ ] **Template structure preserved** — all 6 sections from the epic template are present in each file
- [ ] **User Stories section present** — placeholder table included, marked as "To be filled during backlog refinement"

---

## Input

Ask the user which PRD to decompose if not already specified, then proceed.
