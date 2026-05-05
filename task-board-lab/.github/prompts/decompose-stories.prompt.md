---
description: 'Break Epic into User Stories'
mode: 'agent'
---

Read an existing Epic from `specs/epics/` and break it into 5–7 User Stories using the story template at `specs/templates/story-template.md`.

## Instructions

1. **Read the inputs first — in this order:**
   - `specs/templates/story-template.md` — use this as the exact structure for every Story file
   - `agents.md` — understand the tech stack, constraints, and naming conventions
   - The parent Epic in `specs/epics/` — ask the user which Epic to decompose if not specified
   - The PRD referenced in the Epic's header — read it to understand personas and success metrics

2. **Create 5–7 User Stories.** Analyse the Epic's In Scope list, Success Criteria, and User Stories placeholder to identify the smallest slices of work that each deliver independent user value. Number them sequentially within the Epic (e.g., `01`, `02`, …).

3. **Every story must satisfy ALL of the following:**

   - **Format:** `As a [named persona], I want [specific action], so that [concrete benefit].`
     Use the persona's first name from the PRD — never a generic label like "user" or "admin".
   - **Size:** Completable by one developer in **1–3 days**. If a story feels larger, split it.
   - **Acceptance Criteria:** 3–5 items in Given/When/Then format. Each must be independently testable. No vague language ("works correctly", "is fast").
   - **INVEST principles:** See validation rules below.

4. **Write Technical Notes** for any story that touches `localStorage`, shared state, or a non-obvious implementation detail. Reference specific component or hook names from `agents.md` conventions (e.g., `useLocalStorage`, `TaskCard.tsx`).

5. **Set story point estimates** using the Fibonacci scale: `1 / 2 / 3 / 5`. No story should exceed 5 points — split it if it does.

6. **Save each story** to `specs/stories/us-{epic###}.{##}-{slug}.md` — e.g., for Epic `001`, story 2: `us-001.02-add-task.md`.

---

## INVEST Validation Rules

Apply every rule to every story before saving. Fix any that fail.

| Principle | Rule |
|-----------|------|
| **Independent** | The story can be developed and demoed without another story being complete. If a dependency is unavoidable, document it in Technical Notes and minimise it. |
| **Negotiable** | The story describes *what* and *why*, not *how*. Implementation details in Technical Notes are hints, not mandates. |
| **Valuable** | The story delivers something a real user can see or experience on its own. Pure refactors or "plumbing" stories are not acceptable unless framed as enabling a user capability. |
| **Estimable** | The team has enough information to give a story point estimate with confidence. If not, create a spike story instead. |
| **Small** | Completable in 1–3 days by one developer. ≤ 5 story points. Split anything larger. |
| **Testable** | Every Acceptance Criterion can be verified by a test (unit, integration, or manual). No AC should contain subjective language. |

---

## Story Ordering

Order the stories in the logical sequence a developer would work through them:

1. **Foundation first** — data model, storage hooks, or types that other stories depend on
2. **Core user actions** — the primary happy-path interactions
3. **Edge cases and validation** — error states, empty states, input constraints
4. **UX polish** — feedback, transitions, accessibility
5. **Integration** — connecting this Epic's output to adjacent features

---

## Quality Checklist

Before saving any Story file, verify every item is true. Fix anything that is not.

- [ ] **Named persona** — every story uses a first name from the PRD, not a generic role
- [ ] **Correct format** — every story follows `As a / I want / so that` exactly
- [ ] **3–5 AC per story** — no story has fewer than 3 or more than 5 Acceptance Criteria
- [ ] **Given/When/Then** — every AC uses the Gherkin format, no vague language
- [ ] **Size ≤ 3 days / ≤ 5 points** — no story exceeds this; split any that do
- [ ] **INVEST passes** — all six principles satisfied for every story
- [ ] **Technical Notes present** — any story touching `localStorage` or shared state has Technical Notes
- [ ] **No placeholders remain** — zero unfilled brackets in any saved file
- [ ] **Files named correctly** — saved to `specs/stories/us-{epic###}.{##}-{slug}.md`
- [ ] **Epic back-reference** — every story's header references the correct parent Epic ID
- [ ] **Template structure preserved** — all sections from the story template are present

---

## Input

Ask the user which Epic to decompose if not already specified, then proceed.
