# Domain Glossary — task-board-lab

**Version:** 1.0  
**Last Updated:** 2026-05-07  
**Scope:** Business terms, product concepts, and domain-specific vocabulary for task-board-lab  
**Audience:** AI Assistants, Developers, Product Managers

---

## Quick Navigation

This glossary defines domain-specific terms for the Personal Task Board project. Terms are organized alphabetically and linked where helpful.

---

## Terms

### Board (aka "Kanban Board" or "Personal Task Board")

**Definition:**  
The primary user interface and data container for the task-board-lab application. The board displays all tasks organized into three **Kanban columns** (To Do, In Progress, Done) and provides controls for filtering, creating, and managing tasks.

**Context:**  
The "board" is the core metaphor of the product. It reflects the Kanban workflow model used by both personas (Maya, Ethan) to visualize work state at a glance. The board is the single, persistent artifact that survives browser refreshes and represents the complete **board state**.

**Related Terms:**  
[Kanban Column](#kanban-column), [Board State](#board-state), [Task](#task)

**Example Usage:**

> "The board displays tasks across three columns: To Do, In Progress, and Done."  
> "Users can filter the board by project tag to focus on one project at a time."

---

### Board State

**Definition:**  
The complete, serializable snapshot of the Personal Task Board at any point in time, including all **tasks**, column order, filter preferences, and UI state (e.g., selected task). Board state is persisted to `localStorage` and restored on app load.

**Context:**  
Board state is the unit of persistence in the app. Because task-board-lab uses **local persistence** (no backend), the entire board state must fit within browser `localStorage` quota (~5-10MB, PRD §5.3). Understanding board state structure is critical for storage optimization and migration planning.

**Data Model:**

```typescript
interface BoardState {
  version: number; // For forward-compatible migrations
  tasks: Task[]; // All tasks (flat array)
  columns: {
    todo: TaskId[]; // Task IDs in each column (for order)
    inProgress: TaskId[];
    done: TaskId[];
  };
  filter?: {
    projectTag?: string; // Active project filter
  };
  ui?: {
    selectedTaskId?: TaskId; // Currently selected task (for keyboard)
  };
  lastUpdated: ISO8601; // For debugging and syncing
}
```

**Related Terms:**  
[Local Persistence](#local-persistence), [Task](#task), [Project Tag](#project-tag)

**Example Usage:**

> "Board state is saved to localStorage after every task move."  
> "If localStorage quota is exceeded, the app keeps the current board state in memory but cannot persist."

---

### Column (aka "Kanban Column" or "Workflow Column")

**Definition:**  
One of three fixed workflow stages in the Personal Task Board: **To Do**, **In Progress**, or **Done**. Each column displays tasks assigned to that workflow state and supports drag-and-drop reordering.

**Context:**  
Columns represent the user's mental model of work: tasks start in To Do, move to In Progress when active, and complete in Done. This three-stage model is core to the Kanban metaphor and simplifies decision-making for solo developers (PRD FR-01). Columns are not customizable (out of scope, PRD §7.2).

**Column Identifiers:**

- `"todo"` — Backlog and planned work
- `"inProgress"` — Currently being worked on
- `"done"` — Completed work

**Related Terms:**  
[Task](#task), [Board](#board-kanban-board-or-personal-task-board), [Workflow State](#workflow-state)

**Example Usage:**

> "The user dragged a task from the To Do column to the In Progress column."  
> "Tasks in the Done column can optionally be auto-archived after a period [Assumption, PRD Appendix A]."

---

### Local Persistence

**Definition:**  
The strategy of storing all task data exclusively in the user's browser using the `localStorage` API, with no backend server, database, or cloud sync. All board state is serialized to JSON and stored with a single key.

**Context:**  
Local persistence is a **hard project constraint** (AGENTS.md §5, PRD §5.2). It enables:

- **Instant load times:** No network round-trip
- **Offline availability:** Board works without internet
- **Privacy:** Task data never leaves the browser
- **Simplicity:** No ops, auth, or backend infrastructure

**Trade-offs:**

- Single-user only (multi-device sync explicitly out of scope, PRD §7.2)
- Data loss if browser cache is cleared
- Limited to ~5-10MB per browser origin (sufficient for up to 500 tasks, PRD §5.3)

**Storage Details:**

- **Key:** `taskboard:state` (or similar)
- **Format:** JSON (serialized board state)
- **Recovery:** On load error, fallback to empty board (UC-01 alternate flow)

**Related Terms:**  
[Board State](#board-state), [Task](#task)

**Example Usage:**

> "The app uses localStorage for persistence; there is no backend API."  
> "If localStorage quota is exceeded, the app shows an error and keeps state in-memory only."

---

### Project Tag

**Definition:**  
Optional metadata attached to a **task** that categorizes the work by project or initiative. Project tags enable filtering and grouping tasks to focus on a single project's work.

**Context:**  
Project tags address the core user need: solo developers (Maya, Ethan) juggle 2-3 projects simultaneously and need to filter and focus their attention (PRD §1.3, §6, personas). Tags are free-text by default [Assumption, PRD Appendix A, Q3]. Tags can be added during task creation (US-004.01), edited later (US-004.02), and filtered via the **board** (US-004.03).

**Tag Constraints (TBD):**

- Max length: 50 characters [Assumed]
- Case-sensitive or insensitive? [Pending, PRD Appendix A, Q3]
- Constrained list or free-text? [Pending, PRD Appendix A, Q3]

**Related Terms:**  
[Task](#task), [Filter (Board Filter)](#filter-board-filter), [Board](#board-kanban-board-or-personal-task-board)

**Example Usage:**

> "The task is tagged with project 'mobile-redesign'."  
> "Users can filter the board to show only tasks tagged 'client-xyz'."  
> "A task can have only one project tag [Assumption, pending PRD Appendix A, Q3]."

---

### Task

**Definition:**  
The atomic unit of work in the Personal Task Board. A task represents a discrete piece of work with a title, optional metadata (project tag, due date, notes), a **workflow state** (column), and an order within that column.

**Context:**  
Tasks are the core domain entity. Users create tasks (PR-02), move them between **columns** (FR-03), edit metadata (US-004.02), and delete them (FR-02). Each task has a unique ID and timestamps for audit/recovery purposes.

**Task Data Model:**

```typescript
interface Task {
  id: TaskId; // Unique identifier (UUID or nanoid)
  title: string; // Required; max 255 chars [Assumed]
  description?: string; // Optional long-form notes
  projectTag?: string; // Optional categorization
  dueDate?: ISO8601; // Optional deadline
  column: "todo" | "inProgress" | "done"; // Current workflow state
  order: number; // Position within column (for ordering)
  createdAt: ISO8601; // Task creation timestamp
  updatedAt: ISO8601; // Last modification timestamp
  status?: "active" | "archived"; // Future: for auto-archive [TBD]
}
```

**Task Lifecycle:**

1. **Create** — User creates task in To Do column (FR-02, US-004.01)
2. **Edit** — User updates title, project tag, due date (FR-02, US-004.02)
3. **Move** — User moves task between columns via drag-drop or keyboard (FR-03, FR-04)
4. **Reorder** — User reorders task within a column (FR-07)
5. **Complete** — Task moves to Done column
6. **Archive** — (Optional) Task auto-archives or is deleted [TBD, PRD Appendix A, Q1]

**Related Terms:**  
[Column](#column-aka-kanban-column-or-workflow-column), [Board State](#board-state), [Workflow State](#workflow-state), [Project Tag](#project-tag)

**Example Usage:**

> "A task titled 'Implement login form' is in the In Progress column."  
> "The task is tagged with 'project-alpha' and due on 2026-05-15."  
> "Moving the task to Done triggers a localStorage persist."

---

### Workflow State

**Definition:**  
The current status of a **task** within the Personal Task Board workflow. Workflow states are fixed to the three **Kanban columns**: To Do, In Progress, Done.

**Context:**  
Workflow state is the primary dimension for task filtering and visualization. It answers the question: "What is this task's current status?" A task always has exactly one workflow state at any time.

**Valid Workflow States:**

- **To Do** — Planned but not yet started
- **In Progress** — Currently being worked on
- **Done** — Complete and closed

**Related Terms:**  
[Task](#task), [Column](#column-aka-kanban-column-or-workflow-column), [Board](#board-kanban-board-or-personal-task-board)

**Example Usage:**

> "The task's workflow state is 'In Progress'."  
> "Changing workflow state requires moving the task to a different column."  
> "The success metric tracks transitions to Done state weekly (PRD §6)."

---

### Filter (Board Filter)

**Definition:**  
A mechanism to display only **tasks** matching a specific **project tag**, reducing visual noise and allowing users to focus on one project at a time.

**Context:**  
Filtering directly supports the core user goal: solo developers manage 2-3 projects and need to switch focus without losing visibility of other work. Filters are optional and can be cleared (US-004.04). Filter preferences are persisted across sessions (US-004.05).

**Filter Types (Current):**

- **Project tag filter:** Show only tasks with a specific project tag [FR-06, US-004.03]

**Filter Interactions:**

- Apply filter — Click project tag or use keyboard shortcut (FR-04)
- Clear filter — Show all tasks regardless of tag (US-004.04)
- Restore filter preference — Load saved filter on app reload (US-004.05)

**Related Terms:**  
[Project Tag](#project-tag), [Board](#board-kanban-board-or-personal-task-board), [Board State](#board-state)

**Example Usage:**

> "The user applied a filter to show only tasks tagged 'client-redesign'."  
> "Clearing the filter reveals all tasks across all projects."  
> "The app restores the user's last active filter on reload."

---

## Concepts & Principles

### Kanban Model

**Definition:**  
A visual workflow management system that organizes work into discrete columns representing workflow stages. In task-board-lab, the model is simplified to three columns: To Do, In Progress, Done.

**Rationale for task-board-lab:**

- Simple enough for solo developers to adopt without training
- Aligns with natural work progression
- Enables visual "at a glance" status clarity

**Related to:** [Column](#column-aka-kanban-column-or-workflow-column), [Board](#board-kanban-board-or-personal-task-board), [Workflow State](#workflow-state)

---

### Solo Developer Workflow

**Definition:**  
The work pattern of a single developer managing multiple projects simultaneously, characterized by frequent context switching, need for quick task visibility, and preference for lightweight tools.

**Personas:**

- **Maya** — Freelance full-stack developer balancing client and personal work
- **Ethan** — Indie SaaS founder shipping alone, values keyboard efficiency

**Key Needs (from PRD):**

- Reduce planning overhead (25 min → 10 min per day)
- No setup complexity
- Fast keyboard-driven interactions
- Local, no-login persistence

**Related to:** All core features (FR-01 through FR-08)

---

### Specification-Driven Development (SDD)

**Definition:**  
The development methodology used in task-board-lab (AGENTS.md §1): all code is traceable to an approved specification; no feature is implemented without a corresponding story in `specs/stories/`.

**Specification Chain:**  
PRD → Epic → Story → Code

**Key Rule:**

> "No code without a spec. No spec without a parent. No deviation without a comment."

**Related to:** AGENTS.md, project planning, quality assurance

---

## Assumptions & TBD Items

### Pending Clarifications (from PRD Appendix A)

| Item                         | Question                                                         | Status  | Impact                                          |
| ---------------------------- | ---------------------------------------------------------------- | ------- | ----------------------------------------------- |
| **Auto-archive timing**      | Should completed tasks auto-archive after a configurable period? | Pending | Affects Done column UX and storage management   |
| **Keyboard shortcut schema** | What exact keyboard shortcuts on macOS vs Windows?               | Pending | Affects FR-04 implementation and US-003 stories |
| **Project tag constraints**  | Free-text or constrained list?                                   | Pending | Affects Project Tag data model and validation   |

### Implicit Assumptions

| Assumption                     | Basis                                   | Risk                                                        |
| ------------------------------ | --------------------------------------- | ----------------------------------------------------------- |
| Users manage 2-3 projects      | Personas (PRD §2)                       | Lower limit might reduce filter value                       |
| Task volume < 500 items        | Performance target (PRD §5.1, §5.3)     | Larger boards may need virtual scrolling                    |
| Users are keyboard-comfortable | Personas technical proficiency (PRD §2) | Keyboard shortcuts may be underused by less technical users |
| localStorage quota sufficient  | ~5-10MB typical                         | Data loss if quota exceeded (mitigated by error handling)   |
| Modern desktop browsers        | PRD §3 UC-01, §7.3                      | Mobile or legacy browser users unsupported                  |

---

## References

- **PRD:** [prd-personal-task-board.md](../../prds/prd-personal-task-board.md) — Full product requirements
- **AGENTS.md:** [Development workflow and constraints](../../agents.md)
- **Architecture:** [System design](../architecture/overview.md)
- **Specs:** [Epic and story details](../../specs/)
