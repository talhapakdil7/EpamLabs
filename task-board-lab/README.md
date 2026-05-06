# Personal Task Board

A lightweight, local-first Kanban board for solo developers built with React, Vite, and TypeScript.

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Testing

```bash
npm run test
npm run test:ui  # Opens Vitest UI
```

## Architecture

### Technology Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript (strict mode)
- **Persistence:** localStorage (browser-local, no backend)
- **Styling:** Tailwind CSS
- **Testing:** Vitest + React Testing Library

### Key Principles

- **No Backend:** All data persists in browser localStorage
- **No Dependencies:** No new packages added beyond React ecosystem
- **Strict TypeScript:** `any` is forbidden
- **localStorage Encapsulation:** All persistence goes through `useLocalStorage` hook

### Project Structure

```
src/
├── components/       # React UI components
│   ├── TaskBoard.tsx       # Main container orchestrating board logic
│   ├── Column.tsx          # Kanban column display
│   ├── TaskCard.tsx        # Individual task display
│   └── TaskForm.tsx        # Task creation/edit modal
├── hooks/            # Custom React hooks
│   └── useLocalStorage.ts  # Browser storage abstraction
├── types/            # TypeScript definitions
│   └── task.types.ts       # Task and BoardState interfaces
├── utils/            # Utility functions
│   └── helpers.ts    # Validation, formatting, ID generation
├── specs/            # Test specifications mapped to user stories
│   ├── us-004.01.test.ts   # US-004.01 acceptance criteria tests
│   └── epic-001.test.ts    # EPIC-001 foundation tests
├── App.tsx
├── main.tsx
└── index.css
```

## Features

### EPIC-001: Board Foundation (✅ Implemented)

- **Three Kanban columns:** To Do, In Progress, Done
- **Task CRUD:** Create, read, edit, delete tasks
- **Persistence:** All board state saved to localStorage and restored on refresh
- **Task Metadata:** Optional description, due date support

### US-004.01: Add Project Tag During Task Creation (✅ Implemented)

**Acceptance Criteria:**

- [x] **AC-1:** Optional project tag field in task creation form
- [x] **AC-2:** Project tag saved with task and displayed on board
- [x] **AC-3:** Tasks created without tag work normally
- [x] **AC-4:** Whitespace trimmed from project tags

**Implementation Details:**

- `TaskForm.tsx` includes projectTag input field with placeholder
- `trimProjectTag()` utility trims whitespace and returns undefined for empty strings
- `Task` type includes optional `projectTag` field
- `TaskCard` displays project tag as blue badge when present
- All tag values go through `useLocalStorage` hook for persistence

## Data Model

### Task

```typescript
interface Task {
  id: string;              // UUID
  title: string;           // Required
  description?: string;    // Optional
  projectTag?: string;     // Optional - supports US-004.01
  dueDate?: string;        // Optional (ISO8601)
  column: 'todo' | 'inProgress' | 'done';
  order: number;           // Position within column
  createdAt: string;       // ISO8601 timestamp
  updatedAt: string;       // ISO8601 timestamp
}
```

### BoardState

```typescript
interface BoardState {
  tasks: Task[];
  columnOrder: Array<'todo' | 'inProgress' | 'done'>;
  filterProject?: string;  // For EPIC-004
}
```

## Conventions

### Component Naming

- React components: `PascalCase.tsx`
- Custom hooks: `use[Name].ts`
- Utils/helpers: `camelCase.ts`

### Code Quality

- TypeScript strict mode enabled
- No use of `any` type
- All components properly typed
- Test coverage for utilities and key logic

### localStorage Usage

All persistence operations go through the `useLocalStorage` hook. Components must NOT call `localStorage` directly.

```typescript
// ✅ Correct
const [boardState, setBoardState] = useLocalStorage('task-board-state', initialState);

// ❌ Wrong - don't do this
localStorage.getItem('task-board-state');
```

## Specification Documents

All features map back to specification documents in `specs/`:

- `specs/prds/prd-personal-task-board.md` — Product requirements
- `specs/epics/epic-001-board-foundation.md` — EPIC-001 scope
- `specs/epics/epic-004-project-focus-maintenance.md` — EPIC-004 scope
- `specs/stories/us-004.01-add-project-tag-on-create.md` — This story

## Testing

Test files map to user stories and epics:

- `src/utils/helpers.test.ts` — Helper function tests
- `src/hooks/useLocalStorage.test.ts` — localStorage hook tests
- `src/specs/us-004.01.test.ts` — US-004.01 acceptance criteria verification
- `src/specs/epic-001.test.ts` — EPIC-001 foundation tests

Run tests with:

```bash
npm test
```

## Next Steps

Upcoming epics will add:

- **EPIC-002:** Drag-and-drop task movement between columns
- **EPIC-003:** Keyboard shortcuts for power users
- **EPIC-004 (cont'd):** Project filtering, board reset controls

## License

MIT
