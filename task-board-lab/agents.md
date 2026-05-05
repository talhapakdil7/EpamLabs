# agents.md — Project Conventions for AI Assistants

This file defines the conventions for the **task-board-lab** project.
Follow these rules when generating code, creating spec files, or making any changes.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | React 18                            |
| Build tool   | Vite                                |
| Language     | TypeScript (strict mode)            |
| Persistence  | `localStorage` only — no backend    |
| Styling      | [e.g., Tailwind CSS / CSS Modules]  |
| Testing      | [e.g., Vitest + React Testing Library] |

**Key constraints:**
- There is no server, database, or API. All state is read from and written to `localStorage`.
- Do not introduce backend dependencies (Node servers, REST/GraphQL APIs, ORMs, etc.).
- Prefer native browser APIs over third-party libraries unless a library is already in `package.json`.

---

## Specification Structure

All product specifications live under `specs/` and follow a three-level hierarchy:

```
specs/
├── prds/          # Product Requirements Documents — project-level scope
├── epics/         # Epics — large features derived from a PRD
├── stories/       # User Stories — individual deliverables derived from an Epic
└── templates/     # Reusable markdown templates (do not edit these as specs)
    ├── prd-template.md
    ├── epic-template.md
    └── story-template.md
```

**Hierarchy:** PRD → Epic → Story. Every Epic must reference a parent PRD. Every Story must reference a parent Epic.

---

## Naming Conventions

### Spec Files

| Type    | Pattern                              | Example                          |
|---------|--------------------------------------|----------------------------------|
| PRD     | `specs/prds/prd-[slug].md`           | `specs/prds/prd-task-management.md` |
| Epic    | `specs/epics/epic-[###]-[slug].md`   | `specs/epics/epic-001-board-view.md` |
| Story   | `specs/stories/us-[###]-[slug].md`   | `specs/stories/us-012-add-task.md`   |

- Use **kebab-case** for all slugs.
- Use **zero-padded numbers** for IDs (e.g., `001`, `012`).
- Slugs should be short (2–4 words) and descriptive.

### Source Files

| Type               | Pattern                                   | Example                          |
|--------------------|-------------------------------------------|----------------------------------|
| React component    | `PascalCase.tsx`                          | `TaskCard.tsx`                   |
| Component folder   | `PascalCase/index.tsx`                    | `TaskBoard/index.tsx`            |
| Hook               | `use[Name].ts`                            | `useLocalStorage.ts`             |
| Utility / helper   | `camelCase.ts`                            | `formatDate.ts`                  |
| Type definitions   | `[name].types.ts`                         | `task.types.ts`                  |
| Test file          | `[name].test.ts(x)`                       | `TaskCard.test.tsx`              |

---

## File Organization

```
task-board-lab/
├── agents.md               # ← This file. Project conventions for AI assistants.
├── specs/                  # Product specifications (PRDs, Epics, Stories, Templates)
├── src/
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature-scoped components and logic
│   ├── hooks/              # Custom React hooks
│   ├── types/              # Shared TypeScript type definitions
│   ├── utils/              # Pure utility functions
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## General Coding Guidelines

- **TypeScript:** Always type props, state, and function signatures explicitly. Avoid `any`.
- **Components:** Keep components small and single-purpose. Lift state only as far as necessary.
- **localStorage:** Encapsulate all read/write operations in a custom hook (e.g., `useLocalStorage`). Do not call `localStorage` directly from components.
- **No side effects at module level:** All side effects belong inside `useEffect`.
- **Imports:** Use absolute imports from `src/` (configured via `tsconfig.json` paths) over deep relative paths.
- **Comments:** Only comment non-obvious logic. Self-documenting names are preferred.
