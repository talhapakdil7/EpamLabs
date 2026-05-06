# Architecture Overview — task-board-lab

**Project:** Personal Task Board  
**Version:** 1.0  
**Last Updated:** 2026-05-07  
**Audience:** AI Assistants, Developers

---

## Executive Summary

**task-board-lab** is a frontend-only, local-first task management board built for solo developers. The architecture prioritizes simplicity, performance, and offline-first persistence over distributed systems or cloud infrastructure.

### Key Design Principle

> **No Backend. No Dependencies. No Complexity.**

All task data lives in the browser's `localStorage`. The frontend is a self-contained single-page application with no external dependencies beyond React ecosystem.

---

## 1. System Architecture

### 1.1 Pattern: Frontend Monolith (SPAs)

**Rationale:**

- **Solo developer scope:** Personas (Maya, Ethan) work alone; multi-user collaboration is explicitly out of scope (PRD §7.2).
- **Performance constraint:** Render + state updates must complete within 100ms for typical board sizes (PRD §5.1).
- **Persistence model:** localStorage-only eliminates need for backend servers or databases.
- **Deployment simplicity:** Single production artifact (bundled HTML/CSS/JS) reduces operational overhead.

**Pattern trade-off:**

- ✅ **Advantages:** Minimal latency, instant offline availability, no ops/DevOps complexity, fast initial load.
- ❌ **Limitations:** Single-user only, no real-time sync across devices, data loss if browser storage is cleared.
- **Mitigation:** Accept limitations as out-of-scope (PRD §7.2); future multi-device support would require backend rearchitecture.

### 1.2 Key Components

```
┌─ React SPA ─────────────────────────────────────┐
│                                                 │
│  ┌──────────── Presentation Layer ──────────┐  │
│  │ • TaskBoard (container)                  │  │
│  │ • TaskCard (task display)                │  │
│  │ • Column (Kanban column)                 │  │
│  │ • TaskForm (create/edit)                 │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────── Feature Layer ───────────────┐  │
│  │ • BoardFeature (layout & orchestration)  │  │
│  │ • TaskFeature (CRUD logic)               │  │
│  │ • FilterFeature (project tag filtering)  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────── Hooks & Utilities ───────────┐  │
│  │ • useLocalStorage (persistence bridge)   │  │
│  │ • useDragDrop (drag/drop logic)          │  │
│  │ • useKeyboardShortcuts (accessibility)   │  │
│  │ • formatDate, validateTask, etc.         │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────── State Management ────────────┐  │
│  │ • React Context (app state)              │  │
│  │ • localStorage (persistence)             │  │
│  │ • useReducer (complex state updates)     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓ (via useLocalStorage hook)
┌─ Browser localStorage ──────────────────────────┐
│ • Tasks array (serialized JSON)                │
│ • Filter state (current project tag)           │
│ • UI preferences (column widths, etc.)         │
└─────────────────────────────────────────────────┘
```

**Component Roles:**

| Layer            | Component                                                           | Responsibility                                                              |
| ---------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Presentation** | TaskBoard, TaskCard, Column, TaskForm                               | Render UI, handle user input (clicks, keyboard), pass events to features    |
| **Features**     | BoardFeature, TaskFeature, FilterFeature                            | Business logic isolation, state orchestration, multi-component coordination |
| **Utilities**    | Hooks (useLocalStorage, useDragDrop, useKeyboardShortcuts), helpers | Cross-cutting concerns: persistence, I/O, formatting, validation            |
| **State**        | Context + useReducer + localStorage                                 | Centralized task state, column ordering, filter preferences                 |

### 1.3 Data Model

```typescript
// Core task shape
interface Task {
  id: string; // UUID or nanoid
  title: string;
  description?: string;
  projectTag?: string; // Free-text or constrained (TBD in PRD §A)
  dueDate?: ISO8601; // Optional deadline
  column: "todo" | "inProgress" | "done";
  order: number; // Position within column
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

// Board state shape
interface BoardState {
  tasks: Task[];
  columns: {
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  };
  filter?: {
    projectTag?: string; // Active project filter
  };
  ui?: {
    selectedTaskId?: string;
  };
}
```

**Persistence Strategy:**

- Store board state as single JSON blob in `localStorage['taskboard:state']`.
- Versioning: include `version: 1` field for forward-compatible migrations.
- Recovery: on load failure, fallback to empty board and show user-friendly error (UC-01 alternate flow).

### 1.4 Interaction Patterns

| User Action           | Flow                                                                                                  | Data Flow                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Create task**       | Form → TaskFeature.createTask() → Context reducer → useLocalStorage.set()                             | DOM event → Business logic → State → Persistence      |
| **Drag task**         | Drag event (onDragStart → onDrop) → useDragDrop hook → TaskFeature.moveTask() → Context → Persistence | Mouse event → Hook → Feature → State → Persistence    |
| **Keyboard shortcut** | useKeyboardShortcuts hook detects Cmd+K → TaskFeature.createTask()                                    | Keyboard event → Hook → Feature → State → Persistence |
| **Filter by project** | Filter button → FilterFeature.setProjectFilter() → Context → Persistence                              | Click event → Feature → State → Persistence           |
| **Page reload**       | useEffect hook on mount → useLocalStorage.get() → Context hydration                                   | App mount → Persistence read → State restore          |

---

## 2. Tech Stack

### 2.1 Frontend

| Layer                | Technology                 | Version  | Rationale                                                                                   |
| -------------------- | -------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| **Framework**        | React                      | 18.x     | Standard for SPAs; extensive library ecosystem; strong TypeScript support                   |
| **Language**         | TypeScript                 | 5.x      | Type safety (AGENTS.md §5: strict mode mandatory); reduces bugs in persistence logic        |
| **Build Tool**       | Vite                       | Latest   | Fast dev experience; minimal config; ESM-first; ~200KB smaller bundle than CRA              |
| **Styling**          | Tailwind CSS + CSS Modules | Latest   | Utility-first for rapid iteration; CSS Modules for component scoping; no CSS-in-JS overhead |
| **State Management** | React Context + useReducer | Built-in | No Redux/Zustand overhead; sufficient for board scope; localStorage bridge via custom hook  |
| **Persistence**      | Browser localStorage API   | Native   | No dependencies; all modern browsers support; 5-10MB quota per origin [typical]             |

### 2.2 Testing & QA

| Layer                    | Technology                            | Rationale                                                                                  |
| ------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Unit/Component Tests** | Vitest + React Testing Library        | AGENTS.md §5; Vitest is faster than Jest; RTL enforces user-centric testing                |
| **Coverage Target**      | ≥ 80% on touched logic (AGENTS.md §4) | Acceptable risk/effort balance for local-first app; prioritize persistence and state logic |
| **E2E (optional)**       | Cypress or Playwright                 | For baseline workflows; recommend deferred to post-MVP if time permits                     |

### 2.3 What We Deliberately Don't Use

| Category                                   | Why Not                                                                 | Alternative                                        |
| ------------------------------------------ | ----------------------------------------------------------------------- | -------------------------------------------------- |
| **Backend (Node, Python, Go)**             | Out of scope (PRD §7.2); localStorage is the source of truth            | None — clients are fully independent               |
| **Database (SQL, MongoDB)**                | Out of scope; no multi-device sync needed                               | localStorage persistence                           |
| **HTTP Client (axios, fetch)**             | No external APIs called for task data                                   | None required                                      |
| **Redux / Zustand**                        | Context + useReducer is sufficient; Redux adds cognitive overhead       | React Context + custom hooks                       |
| **CSS-in-JS (styled-components, emotion)** | Tailwind + CSS Modules reduce bundle; no dynamic style injection needed | Tailwind utility + scoped CSS Modules              |
| **Form libraries (react-hook-form)**       | TaskForm is simple (title, tag, date); no complex validation needed     | Native React controlled inputs + custom validation |
| **GraphQL**                                | No backend to query; would contradict "no dependencies" principle       | None required                                      |

### 2.4 Hard Constraints (AGENTS.md §5)

```
✗ No backend, APIs, servers
✗ No new dependencies without approval
✗ TypeScript strict mode mandatory (no `any` types)
✗ No direct localStorage calls (must use useLocalStorage hook)
✗ No module-level side effects (all effects in useEffect)
✗ Absolute imports only (via tsconfig paths)
```

**Compliance Checklist:**

- All component props and state are explicitly typed.
- All localStorage I/O is routed through `src/hooks/useLocalStorage.ts`.
- All async operations live inside `useEffect` hooks.
- No console-based telemetry or external CDN calls.

---

## 3. Deployment

### 3.1 CI/CD Strategy

**Pipeline Trigger:** Commits to `main` branch (GitHub Actions or equivalent).

```
1. Lint & Type Check
   └─ ESLint, TypeScript --noEmit (exit on error)

2. Unit Tests
   └─ Vitest (exit on <80% coverage on touched files)

3. Build
   └─ vite build (exit on bundle error)

4. Bundle Analysis
   └─ Report bundle size; warn if delta > 10KB [TBD threshold]

5. Deploy to Hosting
   └─ Push dist/ to hosting provider (see §3.2)
```

**Failure Behavior:**

- Linting or test failures block deployment (fail-fast).
- Bundle size warnings are reported but do not block deployment (informational).

### 3.2 Environments & Hosting

| Environment     | Purpose                       | Hosting                                           | Branch                      | Notes                                      |
| --------------- | ----------------------------- | ------------------------------------------------- | --------------------------- | ------------------------------------------ |
| **Development** | Local dev builds + hot reload | localhost:5173 (Vite dev server)                  | Any feature branch          | No deployment; dev-only                    |
| **Staging**     | Pre-production validation     | TBD (Vercel, Netlify, or static S3)               | `develop` or release branch | Optional; useful for manual smoke tests    |
| **Production**  | Live user access              | TBD (Vercel, Netlify, GitHub Pages, or static S3) | `main`                      | Single version; no versioning needed (SPA) |

**Hosting Considerations:**

- **Vercel/Netlify:** Zero-config, auto-deploys from git, built-in edge caching, HTTPS included. **Recommended for MVP.**
- **GitHub Pages:** Free, auto-deploys from repo, but limited to static HTML/JS (suitable for SPA). Requires `gh-pages` build step.
- **AWS S3 + CloudFront:** Lower cost at scale, but requires manual config (SSL certs, cache invalidation). **Recommend for mature product.**

### 3.3 Deployment Checklist

Before each production release:

- [ ] All acceptance criteria from the story are passing.
- [ ] Unit tests pass at ≥80% coverage (touched logic).
- [ ] No TypeScript errors (`tsc --noEmit`).
- [ ] No ESLint warnings/errors.
- [ ] Bundle size is acceptable (< 300KB gzipped estimated [TBD threshold]).
- [ ] localStorage migration logic is tested (if data model changes).
- [ ] Backwards compatibility verified (old task data loads without error).
- [ ] Smoke test: Create task → Move to Done → Refresh page → Verify task persists.

### 3.4 Rollback Strategy

**Approach:** Atomic deployment (single file bundle).

- **Instant rollback:** Point CDN to previous `dist/` snapshot via tag or commit hash.
- **Data safety:** Because data lives in user's browser, no server-side rollback risk.
- **User impact:** Users on older app versions continue to work; no forced updates.

**Example:** If production deploy at commit `abc123` introduces a bug, revert DNS or CDN rule to previous commit `def456` within < 5 minutes.

---

## 4. Key Architectural Decisions

### Decision 1: Frontend-Only (No Backend)

**Why?**

- Reduces complexity and operational overhead for solo developers (personas: Maya, Ethan).
- Aligns with PRD goal: _"reduce daily task-management overhead."_
- Eliminates server costs and DevOps burden.

**Trade-off:** Single-user only; no cross-device sync. Acceptable because multi-user is out of scope (PRD §7.2).

---

### Decision 2: localStorage as Source of Truth

**Why?**

- Simple, available in all modern browsers, no setup required.
- Sufficient quota (5-10MB typical) for up to 500 tasks (PRD NFR §5.3).
- Enables instant offline access and perception of speed (< 100ms interactions, PRD §5.1).

**Trade-off:** Data loss if browser cache is cleared or localStorage quota exceeded. Mitigation: (UC-01 alternate flow) show user-friendly error; graceful degradation in-session.

---

### Decision 3: React Context + useReducer (No Redux/Zustand)

**Why?**

- Context is built-in; no external dependencies (AGENTS.md §5).
- useReducer pattern scales to board complexity without Redux overhead.
- Easier for new contributors to onboard vs. Redux ecosystem.

**Trade-off:** DevTools support less mature than Redux; performance could degrade if state tree grows to thousands of tasks. Mitigation: Refactor to Context splitting or Zustand if performance becomes a bottleneck (measured at > 1000 tasks).

---

### Decision 4: Monolithic SPA (Not Micro-frontends)

**Why?**

- Scope is small enough (single feature: Kanban board).
- No separate teams or independent deployment cycles required.
- Monolith simplifies testing, build, and deployment.

**Trade-off:** Feature additions may slow build time; initial team size must remain small. Mitigation: Refactor to module federation if > 2-3 teams develop features independently.

---

## 5. Scalability & Growth

### 5.1 Current Constraints

| Constraint                    | Value           | Source           |
| ----------------------------- | --------------- | ---------------- |
| Max tasks (responsive)        | 500             | PRD NFR §5.3     |
| localStorage quota            | 5-10MB typical  | Browser platform |
| Render time (< 1.5s)          | 300 tasks       | PRD §5.1         |
| Interaction latency (< 100ms) | Up to 150 tasks | PRD §5.1         |
| Users per app instance        | 1               | Out of scope     |

### 5.2 Growth Roadmap (Post-MVP)

| Scenario                                | Architecture Change                                 | Trigger                         |
| --------------------------------------- | --------------------------------------------------- | ------------------------------- |
| **User reports slowdown at 300+ tasks** | Implement virtual scrolling (windowing) for columns | Measured performance regression |
| **Users request mobile access**         | Build React Native app or PWA + service worker      | Explicit stakeholder request    |
| **Users request cross-device sync**     | Add backend + authentication + cloud storage        | Explicit stakeholder request    |
| **Multiple teams using the board**      | Add multi-user + conflict resolution + backend      | Organizational expansion        |

**Note:** Post-MVP changes require new epic/PRD and explicit scope approval (AGENTS.md §1).

---

## 6. Security & Privacy

### 6.1 Data Storage

- **Location:** User's browser localStorage only; never transmitted.
- **Encryption:** None (localStorage is unencrypted by design; acceptable because data is not sensitive PII/health/financial). See PRD NFR §5.6.
- **Clearing:** User can clear via browser settings; app provides "Clear Board" action with confirmation (US-004.06).

### 6.2 Input Validation & Sanitization

- **Task title:** Max 255 characters; sanitize HTML (prevent script injection via task notes if rendered as rich text).
- **Project tags:** Validate against whitelist (if constrained) or max length (if free-text). See PRD §A open question #3.
- **Due dates:** Validate ISO8601 format server-side (if backend added in future).

**Current approach:** DOMPurify or React's built-in JSX escaping (sufficient for MVP).

### 6.3 No External Data Transmission

- No telemetry, analytics, or crash reporting (PRD §7.2).
- No CDN calls for fonts/icons (include locally or use system fonts).
- No third-party APIs called for task data.

---

## 7. Monitoring & Observability

### 7.1 Development Mode

- React DevTools browser extension (component props, state).
- Vite server logs (build warnings, HMR updates).
- Browser DevTools (Network tab for localStorage quota, Console for errors).

### 7.2 Production Mode (Minimal)

- **Client-side error logging:** None (out of scope for MVP).
- **Performance monitoring:** None (browser's web.dev tools sufficient for solo dev).
- **User feedback:** Optional feedback form in UI (low priority; deferred post-MVP).

---

## Appendix: Diagram Reference

### Component Hierarchy

```
<App>
  └─ <TaskBoard>
     ├─ <Column columnId="todo">
     │  └─ <TaskCard> (×n)
     ├─ <Column columnId="inProgress">
     │  └─ <TaskCard> (×n)
     └─ <Column columnId="done">
        └─ <TaskCard> (×n)
  └─ <TaskForm>
  └─ <FilterBar>
```

### State Flow (Redux-like Pattern)

```
User Action
  ↓
Event Handler (onClick, onDrag, onChange)
  ↓
Feature Function (e.g., TaskFeature.moveTask())
  ↓
Dispatch Action to Context Reducer
  ↓
Reducer computes new state
  ↓
useLocalStorage hook saves to browser
  ↓
Component re-renders with new props
```

---

## References

- **PRD:** [prd-personal-task-board.md](../../prds/prd-personal-task-board.md)
- **AGENTS.md:** [Development rules & naming conventions](../../agents.md)
- **Epics:** [epic-004-project-focus-maintenance.md](../../epics/epic-004-project-focus-maintenance.md) (primary MVP epic)
