---
description: 'Generate a PRD from project brief'
mode: 'agent'
---

Using the PRD template in `specs/templates/prd-template.md`, create a complete PRD from the project brief provided by the user.

## Instructions

1. **Read the template first.** Open `specs/templates/prd-template.md` and use it as the exact structure for the output. Preserve all section headings and table formats.

2. **Read project conventions.** Open `agents.md` to understand the tech stack, constraints, and naming conventions before writing any content.

3. **Generate a complete PRD.** Replace every placeholder with specific, real content derived from the brief. Do not leave any `[DESCRIPTION HERE]` or unfilled bracket values in the output. If information is missing from the brief, make a reasonable assumption and label it `[Assumed]`.

4. **Apply these content rules:**
   - **Problem Statement:** Must include at least one quantified pain point (e.g., "users spend X minutes", "Y% drop-off"). If no numbers are in the brief, estimate and mark it `[Assumed]`.
   - **User Personas:** Every persona must have a first name and specific role (e.g., "Maya, freelance designer") — not a generic label like "Admin User". Include goals and pain points specific to this product.
   - **Functional Requirements:** Every row must have a priority (High / Medium / Low) and a one-line rationale in the Notes column.
   - **Success Metrics:** Every metric must be SMART. Format: `[Metric]: [baseline] → [target] by [timeframe]`.
   - **Scope:** In Scope and Out of Scope must each have at least 3 items. Out of Scope items must include a brief reason why they are excluded.

5. **Save the output** to `specs/prds/prd-{feature-name}.md` where `{feature-name}` is a short kebab-case slug derived from the brief (e.g., `prd-task-management.md`).

---

## Quality Checklist

Before saving, verify every item is true. Fix anything that is not.

- [ ] **Problem has numbers** — Problem Statement contains at least one quantified data point or `[Assumed]` estimate
- [ ] **Personas are named** — Each persona has a first name and a specific role
- [ ] **Metrics are SMART** — Every Success Metric has a baseline, target, and timeframe
- [ ] **Scope is clear** — In Scope ≥ 3 items; Out of Scope ≥ 3 items with reasons
- [ ] **No placeholders remain** — Zero unfilled brackets in the saved file
- [ ] **FR priorities assigned** — Every Functional Requirement row has High / Medium / Low
- [ ] **File saved correctly** — Saved to `specs/prds/prd-{feature-name}.md` in kebab-case
- [ ] **Template structure preserved** — All 7 sections present in the correct order

---

## Project Brief

Ask the user for their project brief if not already provided, then generate the PRD.
