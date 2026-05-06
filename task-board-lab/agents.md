# AGENTS.md — GenAI Instructions for task-board-lab

This file defines how AI coding assistants must behave in this repository.
Read it fully before writing any code, spec, or configuration.

---

## 0. Quick Start for Agents

### Current Project Phase
**Phase:** Specification & Planning (Pre-Implementation)  
**Status:** Epics and EPIC-004 stories are detailed and ready for review; EPIC-001, EPIC-002, EPIC-003 await refinement sprint  
**Start Implementation:** When EPIC-001 is marked `Ready` and Sprint 1 begins

### Key Resources
- **Product Requirements:** [prd-personal-task-board.md](specs/prds/prd-personal-task-board.md) — Start here to understand user personas, goals, and success metrics
- **Architecture & Conventions:** [memory-banks/architecture/overview.md](memory-banks/architecture/overview.md), [memory-banks/conventions/coding-standards.md](memory-banks/conventions/coding-standards.md)
- **Domain Glossary:** [memory-banks/domain/glossary.md](memory-banks/domain/glossary.md) — Understand project terminology
- **Specifications Chain:** Always trace feature requests to PRD → Epic → Story (see Section 2)

### What You Must Know Before Coding
1. **SDD Rule:** No code without a spec in `specs/stories/`. Do not invent requirements.
2. **localStorage Only:** All persistence is browser-local. No backend, no servers, no external APIs.
3. **Strict TypeScript:** `any` is forbidden. All types explicit.
4. **No New Packages:** Do not add `package.json` dependencies without explicit approval.
5. **Story Status:** Only implement stories with `Status: Ready` or `Status: In Progress` (see Section 3.1).

---

## 1. Development Philosophy: Specification-Driven Development (SDD)

This project follows **Specification-Driven Development**. Every feature must trace back to an approved spec in `specs/`. You do not invent requirements — you fulfill them.

> **The rule:** No code without a spec. No spec without a parent. No deviation without a comment.

---

## 2. Spec Hierarchy

```
specs/
├── prds/          # Product Requirements Documents — project-level scope & personas
├── epics/         # Epics — large feature areas derived from a PRD
├── stories/       # User Stories — individual deliverables derived from an Epic
└── templates/     # Reusable authoring templates — do NOT treat these as specs
```

**Chain:** PRD → Epic → Story

Every piece of code must be traceable to a Story → Epic → PRD chain.

---

## 3. Before Writing Any Code

Follow these steps in order. Do not skip them.

### Step 1 — Identify the Story
- Find the user story in `specs/stories/` for the feature being requested.
- Read **Story ID**, **Epic reference**, and **Status**.
- Only implement stories with `Status: Ready` or `Status: In Progress`.
- Do **not** implement `Backlog` stories unless explicitly instructed.

### Step 2 — Read Up the Chain
- Open the parent epic in `specs/epics/` and read **Scope**, **Dependencies**, and **Out of Scope**.
- Open `specs/prds/prd-personal-task-board.md` and confirm the story maps to the relevant **Functional Requirements** and **personas**.

### Step 3 — Check Dependencies
- Verify that all epic-level dependencies in the epic's **Section 5** are marked `Done`.
- If any dependency is `Blocked` or `In Progress`, stop and report instead of guessing.

---

## 4. Implementing a Story

### Acceptance Criteria are the contract
Each story has Acceptance Criteria in Given/When/Then (Gherkin) format. Treat them as a test specification:
- Every AC must be satisfiable by the code you produce.
- Do not add behavior not described in ACs without flagging it as an assumption.
- If an AC is ambiguous, surface the ambiguity before proceeding.

### Technical Notes are hints, not blueprints
The **Technical Notes** section suggests affected components, edge cases, and data shape. They are starting points — apply judgment, but do not silently ignore them.

### Definition of Done
Before considering a story complete, verify every item in the **Appendix > Definition of Done** checklist:
- All ACs met and verifiable
- Tests written and passing (≥ 80% coverage for touched logic)
- No new linter or TypeScript errors
- `localStorage` interactions go through `useLocalStorage` hook only

---

## 5. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Language | TypeScript (strict mode) |
| Persistence | `localStorage` only — no backend |
| Styling | Tailwind CSS / CSS Modules |
| Testing | Vitest + React Testing Library |

### Hard Constraints

| Constraint | Rule |
|---|---|
| **No backend** | All persistence is `localStorage` only. No servers, APIs, ORMs, or external network calls for task data. |
| **No new dependencies** | Do not add packages to `package.json` without explicit approval. Prefer native browser APIs or existing packages first. |
| **TypeScript strict** | All props, state, hooks, and function signatures must be explicitly typed. `any` is forbidden. |
| **localStorage encapsulation** | All `localStorage` reads/writes must go through `useLocalStorage.ts`. Components must not call `localStorage` directly. |
| **No module-level side effects** | All side effects belong inside `useEffect`. |
| **Absolute imports** | Use absolute imports from `src/` (via `tsconfig.json` paths) over deep relative paths. |

---

## 6. Naming Conventions

### Spec Files

| Type | Pattern | Example |
|---|---|---|
| PRD | `specs/prds/prd-[slug].md` | `prd-personal-task-board.md` |
| Epic | `specs/epics/epic-[###]-[slug].md` | `epic-001-board-foundation.md` |
| Story | `specs/stories/us-[###]-[slug].md` | `us-004.01-add-project-tag-on-create.md` |

- Use **kebab-case** for all slugs.
- Use **zero-padded numbers** for IDs (e.g., `001`, `004.01`).
- Slugs should be short (2–4 words) and descriptive.

### Source Files

| Type | Pattern | Example |
|---|---|---|
| React component | `PascalCase.tsx` | `TaskCard.tsx` |
| Component folder | `PascalCase/index.tsx` | `TaskBoard/index.tsx` |
| Custom hook | `use[Name].ts` | `useLocalStorage.ts` |
| Utility / helper | `camelCase.ts` | `formatDate.ts` |
| Type definitions | `[name].types.ts` | `task.types.ts` |
| Test file | `[name].test.ts(x)` | `TaskCard.test.tsx` |

---

## 7. File Organization

```
task-board-lab/
├── AGENTS.md               ← This file. GenAI instructions (SDD workflow + conventions).
├── memory-banks/           ← Knowledge base for team conventions and project state
│   ├── architecture/       ← System architecture docs (e.g., overview.md)
│   ├── conventions/        ← Shared coding standards and patterns
│   ├── domain/             ← Domain glossary and terminology
│   ├── roles/              ← Team role definitions [TBD]
│   └── workflows/          ← Development process and workflows
├── specs/                  ← All product specifications (source of truth for features)
│   ├── prds/               ← Product Requirements Documents
│   ├── epics/              ← Epic-level feature definitions
│   ├── stories/            ← User stories (implementation units)
│   └── templates/          ← Reusable spec authoring templates
├── src/                    ← React application source (created during Sprint 1)
│   ├── components/         ← Reusable UI components
│   ├── features/           ← Feature-scoped components and logic
│   ├── hooks/              ← Custom React hooks (including useLocalStorage)
│   ├── types/              ← Shared TypeScript type definitions
│   ├── utils/              ← Pure utility functions
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .github/                ← GitHub Actions and CI/CD configuration
```

> **Note:** The `src/` directory will be created during Sprint 1 (EPIC-001) implementation. Specs and planning are primary deliverables during current phase.

---

## 8. Current Product Snapshot

> Last Updated: May 7, 2026 | **Current Phase: Specification & Planning (Pre-Implementation)**

### PRD
- **File:** `specs/prds/prd-personal-task-board.md`
- **Status:** Draft (v1.0)
- **Personas:** 
  - Maya: Solo full-stack developer, needs fast task management without configuration overhead
  - Ethan: Indie SaaS founder, values keyboard efficiency and instant board responsiveness
- **Key Metrics Target:** Reduce daily planning time from 25 min to 10 min by week 8; improve task completion rate to 85% by week 10
- **Open Questions:** 3 pending (auto-archive timing, keyboard shortcut schema, project tag constraints) — see PRD Appendix A

### Epics

| Epic ID | Title | Status | Sprint | Size | FR Coverage | Stories |
|---------|-------|--------|--------|------|-------------|---------|
| EPIC-001 | Board Foundation and Local Persistence | Backlog | Sprint 1 | Medium | FR-01, FR-02, FR-05 | TBD |
| EPIC-002 | Kanban Flow Interactions | Backlog | Sprint 2 | Medium | FR-03, FR-07 | TBD |
| EPIC-003 | Keyboard Productivity and Accessible Task Actions | Backlog | Sprint 3 | Medium | FR-04, NFR-5.5 | TBD |
| EPIC-004 | Project Focus and Board Maintenance Controls | Backlog | Sprint 4 | Medium | FR-06, FR-08 | 6 stories (detailed) |

### Stories — EPIC-004 (Most Detailed; Others TBD During Sprint Refinement)

| Story ID | Title | Status | Points | Effort | Complexity |
|----------|-------|--------|--------|--------|-----------|
| US-004.01 | Add Project Tag During Task Creation | Backlog | 2 | 1.5 days | Low |
| US-004.02 | Edit and Remove Project Tag | Backlog | 3 | 1.5 days | Low |
| US-004.03 | Filter Board by Project Tag | Backlog | 5 | 2.5 days | Medium |
| US-004.04 | Clear Project Filter | Backlog | 2 | 0.5 days | Low |
| US-004.05 | Restore Filter Preference | Backlog | 3 | 1 day | Low |
| US-004.06 | Clear Board with Confirmation | Backlog | 3 | 1 day | Low |

**EPIC-004 Total:** 18 story points, ~8 days effort

### Key Functional Requirements (from PRD)

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-01 | Three default Kanban columns: To Do, In Progress, Done | High | Spec'd (EPIC-001) |
| FR-02 | Create, edit, delete tasks with title + optional metadata | High | Spec'd (EPIC-001) |
| FR-03 | Drag-and-drop task movement between columns | High | Spec'd (EPIC-002) |
| FR-04 | Keyboard shortcuts for task actions | Medium | Spec'd (EPIC-003) |
| FR-05 | localStorage persistence and state restoration | High | Spec'd (EPIC-001) |
| FR-06 | Filter/group tasks by project tag | Medium | Spec'd (EPIC-004) |
| FR-07 | Reorder tasks within a column | Medium | Spec'd (EPIC-002) |
| FR-08 | Reset/clear board with confirmation | Low | Spec'd (EPIC-004) |

---

## 9. Authoring New Specs

When asked to write a PRD, Epic, or Story, always start from the template:

| Type | Template |
|---|---|
| PRD | `specs/templates/prd-template.md` |
| Epic | `specs/templates/epic-template.md` |
| Story | `specs/templates/story-template.md` |

**Rules:**
- Every Epic must reference a parent PRD in the `PRD Reference:` header field.
- Every Story must reference a parent Epic in the `Epic:` header field.
- Validate stories against the **INVEST checklist** embedded in `story-template.md` before marking `Ready`.
- Mark unconfirmed assumptions with `[Assumed]` inline throughout the spec.
- Do not mark a story `Ready` if any Appendix open question is still `Pending` and blocks implementation.

---

## 10. What You Must Never Do

- Create a backend, REST API, GraphQL endpoint, or database connection.
- Call `localStorage` directly from a component (use `useLocalStorage.ts`).
- Implement features not backed by an approved story in `specs/stories/`.
- Add telemetry, analytics, or external data transmission of any kind.
- Add multi-user, auth, cloud-sync, or external integration features — all are explicitly out of PRD scope.
- Add packages to `package.json` without explicit approval.

---

## 11. When in Doubt

1. Re-read the story's **Acceptance Criteria**.
2. Re-read the parent epic's **In Scope / Out of Scope**.
3. Re-read the PRD's **Functional Requirements** table.
4. If still uncertain — surface the ambiguity. Do not assume and silently proceed.
