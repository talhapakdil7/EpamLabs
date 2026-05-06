# Coding Standards & Quality Guidelines — task-board-lab

**Version:** 1.0  
**Last Updated:** 2026-05-07  
**Scope:** TypeScript, React, testing, and general code quality for task-board-lab  
**Audience:** Developers, AI assistants

---

## 1. Overview

This document establishes code quality standards for task-board-lab. All code must adhere to these standards to ensure:

- **Readability:** Easy onboarding for new contributors
- **Maintainability:** Clear intent and minimal cognitive load
- **Type Safety:** Strict TypeScript prevents runtime errors
- **Testability:** Code structure supports comprehensive testing
- **Compliance:** Meets AGENTS.md hard constraints

> **Golden Rule:** Code is read far more often than written. Optimize for clarity and consistency.

---

## 2. Naming Conventions

### 2.1 Spec Files

| Type        | Pattern                | Example                                  | Notes                            |
| ----------- | ---------------------- | ---------------------------------------- | -------------------------------- |
| PRD         | `prd-[slug].md`        | `prd-personal-task-board.md`             | Kebab-case slug, 2-3 words       |
| Epic        | `epic-[###]-[slug].md` | `epic-001-board-foundation.md`           | Zero-padded 3-digit ID           |
| Story       | `us-[###]-[slug].md`   | `us-004.01-add-project-tag-on-create.md` | Zero-padded, support sub-stories |
| Task/Commit | Reference story ID     | `us-004.01: Add project tag input`       | Link every commit to a story     |

**Rationale:** Consistent ID schemes enable easy tracing and search across specs.

### 2.2 React Components

| Type               | Pattern                | Example                            | Context                               |
| ------------------ | ---------------------- | ---------------------------------- | ------------------------------------- |
| Component (file)   | `PascalCase.tsx`       | `TaskCard.tsx`                     | Reusable, standalone component        |
| Component (folder) | `PascalCase/index.tsx` | `TaskBoard/index.tsx`              | Complex component with internal utils |
| Props interface    | `[ComponentName]Props` | `TaskCardProps`                    | Always explicit, no implicit `any`    |
| State interface    | `[FeatureName]State`   | `BoardState`                       | Reducer state shape                   |
| Event handler      | `handle[Event]`        | `handleTaskDrop`, `handleAddClick` | Prefix all handlers with `handle`     |
| Callback prop      | `on[Event]`            | `onTaskMove`, `onFilterChange`     | Callback props always start with `on` |

**Examples:**

```typescript
// ✅ GOOD: Clear naming with prefix
const handleTaskDrop = (taskId: string, targetColumn: string) => {
  // ...
};

const onFilterChange = (projectTag: string) => {
  setFilter(projectTag);
};

// ❌ BAD: Ambiguous, no prefix
const taskDrop = () => {};
const filter = () => {};
```

### 2.3 Custom Hooks

| Type            | Pattern                                    | Example                                |
| --------------- | ------------------------------------------ | -------------------------------------- |
| Hook (file)     | `use[Name].ts`                             | `useLocalStorage.ts`                   |
| Hook (function) | `use[Name]()`                              | `useLocalStorage()`                    |
| Return state    | `[state, setState]` or `{ state, action }` | `const [tasks, setTasks] = useBoard()` |

**Rules:**

- Always start with `use` prefix (React convention).
- Return explicit types, never `any`.
- Document with JSDoc if return type is complex.

**Example:**

```typescript
// ✅ GOOD
export function useLocalStorage<T>(
  key: string,
): [T | null, (value: T) => void] {
  const [value, setValue] = useState<T | null>(null);

  return [value, setValue];
}

// ❌ BAD: Missing return type, uses any
export function useLocalStorage(key) {
  return [value, setValue];
}
```

### 2.4 Utilities & Helpers

| Type          | Pattern            | Example                                         |
| ------------- | ------------------ | ----------------------------------------------- |
| Pure function | `camelCase`        | `formatDate`, `validateTask`, `calculateDueIn`  |
| Constant      | `UPPER_SNAKE_CASE` | `DEFAULT_COLUMN_COUNT`, `MAX_TASK_TITLE_LENGTH` |
| Enum          | `PascalCase`       | `TaskStatus`, `SortOrder`                       |
| Type alias    | `PascalCase`       | `TaskId`, `ColumnType`                          |

**Examples:**

```typescript
// ✅ GOOD
const MAX_TASK_TITLE_LENGTH = 255;

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US");
}

enum TaskStatus {
  Todo = "todo",
  InProgress = "inProgress",
  Done = "done",
}

type TaskId = string & { readonly __brand: "TaskId" };

// ❌ BAD: Inconsistent naming
const maxTaskTitleLength = 255;
function FormatDate() {}
const TASK_STATUS = { todo: "todo" };
```

### 2.5 File & Folder Organization

```
src/
├── components/          # Reusable, stateless UI components
│   ├── TaskCard.tsx
│   ├── Column.tsx
│   └── TaskForm.tsx
│
├── features/            # Feature-scoped components and logic
│   ├── board/
│   │   ├── BoardContainer.tsx    # Smart component
│   │   ├── BoardLayout.tsx        # Presentation component
│   │   ├── useBoardState.ts       # Feature hook
│   │   └── board.types.ts         # Feature types
│   ├── tasks/
│   │   ├── TaskActions.tsx
│   │   ├── useTaskActions.ts
│   │   └── task.types.ts
│   └── filter/
│       ├── FilterBar.tsx
│       ├── useFilterState.ts
│       └── filter.types.ts
│
├── hooks/               # Shared, cross-feature hooks
│   ├── useLocalStorage.ts
│   ├── useDragDrop.ts
│   ├── useKeyboardShortcuts.ts
│   └── hooks.types.ts
│
├── types/               # Shared type definitions
│   ├── task.types.ts
│   ├── board.types.ts
│   ├── common.types.ts
│   └── index.ts         # Barrel export
│
├── utils/               # Pure utility functions
│   ├── formatDate.ts
│   ├── validateTask.ts
│   ├── calculateDue.ts
│   └── index.ts         # Barrel export
│
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

**Folder Naming Rules:**

- Feature folders are lowercase (`board/`, `tasks/`).
- Component files are PascalCase (`TaskCard.tsx`).
- Hook/utility files are camelCase (`useLocalStorage.ts`, `formatDate.ts`).
- Type files are suffixed with `.types.ts` (e.g., `task.types.ts`).

---

## 3. Code Organization

### 3.1 Component Structure

```typescript
// ✅ GOOD: Clear organization, in order

import React, { useState, useCallback } from 'react';
import { TaskCardProps } from './TaskCard.types';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { formatDate } from 'utils/formatDate';
import styles from './TaskCard.module.css';

// Type definitions (if small; else move to .types.ts)
interface TaskCardState {
  isEditing: boolean;
}

// Component
export const TaskCard: React.FC<TaskCardProps> = ({ task, onMove, onDelete }) => {
  const [state, setState] = useState<TaskCardState>({ isEditing: false });

  const handleEdit = useCallback(() => {
    setState({ isEditing: true });
  }, []);

  const handleSave = useCallback((title: string) => {
    // Save logic
    setState({ isEditing: false });
  }, []);

  return (
    <div className={styles.card}>
      {/* JSX */}
    </div>
  );
};

// Exports
export default TaskCard;
```

**Organization Rules:**

1. Imports (external, then internal)
2. Type definitions (if small)
3. Constants
4. Component definition
5. Event handlers (alphabetical or by flow)
6. Render logic
7. Named exports + default export

### 3.2 Hook Structure

```typescript
// ✅ GOOD: Clear flow

import { useState, useEffect, useCallback } from "react";

// Type definitions
interface UseLocalStorageReturn<T> {
  value: T | null;
  setValue: (value: T) => void;
  clear: () => void;
}

// Hook implementation
export function useLocalStorage<T>(key: string): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setValue(JSON.parse(stored));
      } catch (error) {
        console.error(`Failed to parse localStorage[${key}]:`, error);
      }
    }
  }, [key]);

  // Persist to localStorage
  const handleSetValue = useCallback(
    (newValue: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
      } catch (error) {
        console.error(`Failed to persist to localStorage[${key}]:`, error);
      }
    },
    [key],
  );

  const handleClear = useCallback(() => {
    localStorage.removeItem(key);
    setValue(null);
  }, [key]);

  return { value, setValue: handleSetValue, clear: handleClear };
}
```

**Hook Rules:**

- Return explicit interface, never implicit `any` or tuple.
- Use `useCallback` for stable function references.
- Handle errors gracefully (don't throw in hooks).
- Keep all side effects inside `useEffect`.

### 3.3 Feature Organization

Large features should follow this structure:

```
features/board/
├── index.ts              # Public exports only
├── BoardContainer.tsx    # Smart component (connects to state, passes props)
├── BoardLayout.tsx       # Presentational component (pure UI)
├── useBoardState.ts      # Feature hook (state + actions)
├── board.types.ts        # Feature types
├── board.utils.ts        # Feature-specific utilities (if needed)
└── board.test.tsx        # Feature tests
```

**Separation of Concerns:**

- **Container:** Handles state, actions, side effects
- **Presentational:** Pure render logic, no business logic
- **Hook:** Encapsulates state management
- **Types:** All interfaces and types
- **Utils:** Helper functions scoped to feature

---

## 4. TypeScript Standards

### 4.1 Type Requirements (Strict Mode Mandatory)

| Item                | Rule                                | Example                                      |
| ------------------- | ----------------------------------- | -------------------------------------------- |
| **Function params** | All must be explicitly typed        | `function add(a: number, b: number): number` |
| **Function return** | Always explicit (no implicit `any`) | `(): Promise<Task[]>`                        |
| **Component props** | Always via `Props` interface        | `TaskCardProps`                              |
| **State**           | Always via interface or type        | `useState<TaskState>()`                      |
| **Event handlers**  | Typed via event parameter           | `(e: React.ChangeEvent<HTMLInputElement>)`   |
| **Any type**        | Forbidden                           | Use `unknown` if truly dynamic, then narrow  |

**Examples:**

```typescript
// ✅ GOOD: All types explicit
interface TaskCardProps {
  task: Task;
  onMove: (taskId: string, column: string) => void;
  onDelete: (taskId: string) => Promise<void>;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onMove, onDelete }) => {
  const handleMove = (column: string): void => {
    onMove(task.id, column);
  };

  return <div onClick={() => handleMove('done')}>Move</div>;
};

// ❌ BAD: Implicit types, any used
export const TaskCard = ({ task, onMove, onDelete }: any) => {
  const handleMove = (column) => {
    onMove(task.id, column);
  };

  return <div onClick={() => handleMove('done')}>Move</div>;
};
```

### 4.2 Type Patterns

**Optional Props:**

```typescript
// ✅ GOOD: Use optional marker in interface
interface TaskProps {
  title: string;
  description?: string;  // Optional
  dueDate?: Date;        // Optional
}

// Component handles undefined safely
export const Task: React.FC<TaskProps> = ({ title, description, dueDate }) => {
  return (
    <div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {dueDate && <p>Due: {formatDate(dueDate)}</p>}
    </div>
  );
};
```

**Union Types (for variants):**

```typescript
// ✅ GOOD: Discriminated union for type safety
type TaskStatus = "todo" | "inProgress" | "done";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

// ✅ GOOD: Use type guard for narrowing
function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "To Do";
    case "inProgress":
      return "In Progress";
    case "done":
      return "Done";
  }
}
```

**Generics (for reusable utilities):**

```typescript
// ✅ GOOD: Generic hook for reusable persistence
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  // ...
  return [value, setValue];
}

// Usage is type-safe:
const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
```

### 4.3 Type Hierarchy

```typescript
// ✅ GOOD: Clear type hierarchy

// Core domain types
type TaskId = string & { readonly __brand: "TaskId" };
type ColumnId = "todo" | "inProgress" | "done";

interface Task {
  id: TaskId;
  title: string;
  column: ColumnId;
  order: number;
}

// Feature-specific types
interface BoardState {
  tasks: Task[];
  selectedTaskId: TaskId | null;
}

interface BoardActions {
  addTask: (title: string) => void;
  moveTask: (taskId: TaskId, column: ColumnId) => void;
}

interface UseBoardReturn {
  state: BoardState;
  actions: BoardActions;
}

// Component props
interface BoardProps {
  onTasksChange?: (tasks: Task[]) => void;
}
```

---

## 5. Comments & Documentation

### 5.1 When to Comment

| Scenario               | Do This                           | Example                                                                               |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| **Complex logic**      | Explain the "why", not the "what" | `// Debounce save to reduce localStorage writes`                                      |
| **Non-obvious intent** | Add JSDoc for public functions    | `/** Validates task title and returns error msg or null */`                           |
| **Edge case handling** | Document assumptions              | `// If localStorage unavailable, tasks persist in-memory only (UC-01 alternate flow)` |
| **TODO/FIXME**         | Link to story or issue            | `// TODO: implement auto-save (US-004.02)`                                            |
| **Obvious code**       | Don't comment                     | `const isValid = title.length > 0; // ✅ No comment needed`                           |

### 5.2 JSDoc Format

````typescript
/**
 * Moves a task to a new column and persists the change.
 *
 * @param taskId - The task to move
 * @param targetColumn - The destination column (must be valid)
 * @returns Promise that resolves when persistence is complete
 * @throws Error if taskId not found or targetColumn invalid
 *
 * @example
 * ```
 * await moveTask('task-123', 'done');
 * ```
 */
export async function moveTask(
  taskId: TaskId,
  targetColumn: ColumnId,
): Promise<void> {
  // ...
}
````

**JSDoc Rules:**

- Use for all **public** functions and components.
- Include `@param`, `@returns`, `@throws` if applicable.
- Add `@example` if behavior is non-obvious.
- Keep it concise (< 50 words for simple functions).

### 5.3 Inline Comments

```typescript
// ✅ GOOD: Explains "why", not "what"
const DEBOUNCE_DELAY_MS = 500; // Reduce localStorage write frequency (see PERF-001)

if (tasks.length > 300) {
  // Enable virtual scrolling for large boards to stay within render budget (< 100ms)
  return <VirtualizedColumn tasks={tasks} />;
}

// ❌ BAD: Obvious, wastes space
const result = [];  // Create empty array
for (let i = 0; i < items.length; i++) { // Loop through items
  result.push(items[i]); // Add to result
}
```

---

## 6. Error Handling

### 6.1 Error Handling Strategy

**Principle:** Fail gracefully; never let errors silently break the app.

```typescript
// ✅ GOOD: Try-catch with recovery
export function loadTasksFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem("taskboard:state");
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return validateTasks(parsed.tasks) || [];
  } catch (error) {
    console.error("Failed to load tasks from storage:", error);
    // Return empty board; user can recreate tasks
    return [];
  }
}

// ✅ GOOD: Validate before use
function validateTasks(data: unknown): Task[] | null {
  if (!Array.isArray(data)) return null;

  return data.filter((item): item is Task => {
    return (
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "string" &&
      typeof item.title === "string"
    );
  });
}

// ❌ BAD: Silent failure
function loadTasks() {
  const data = JSON.parse(localStorage.getItem("taskboard:state"));
  return data.tasks; // Crashes if parse fails or data invalid
}
```

### 6.2 Error Messages

**Rules:**

- Be specific: _"localStorage quota exceeded (> 5MB)"_ not _"error"_
- Include context: _"Failed to save task 'task-123' to localStorage"_
- Suggest recovery: _"Try clearing completed tasks or refresh browser"_

```typescript
// ✅ GOOD: Specific, actionable
try {
  localStorage.setItem(key, JSON.stringify(value));
} catch (error) {
  if (error instanceof DOMException && error.code === 22) {
    // QuotaExceededError
    console.error(
      "localStorage quota exceeded. Clear old tasks or refresh browser.",
    );
  } else {
    console.error("Failed to persist task data:", error);
  }
}

// ❌ BAD: Generic, unhelpful
console.error("Storage error");
```

### 6.3 Types of Errors

| Type            | Strategy                                    | Example                                            |
| --------------- | ------------------------------------------- | -------------------------------------------------- |
| **Validation**  | Validate early, return null or error object | `validateTask()` returns error message or null     |
| **Storage**     | Catch, log, fallback to in-memory           | localStorage quota exceeded → keep in-memory state |
| **Network**     | N/A for MVP (no backend)                    | —                                                  |
| **User action** | Show user-friendly UI message               | "Task title is required" in form                   |
| **Unknown**     | Log with context, continue if possible      | Unexpected JSON shape → skip invalid item          |

---

## 7. Testing Standards

### 7.1 Coverage Requirements

| Area                                 | Minimum Coverage | Rationale                                 |
| ------------------------------------ | ---------------- | ----------------------------------------- |
| **Persistence (useLocalStorage)**    | 90%              | Critical path; storage failures break app |
| **State management**                 | 85%              | Core business logic                       |
| **Utilities (formatDate, validate)** | 85%              | Pure functions; deterministic             |
| **Components**                       | 70%              | UI testing is slower; focus on logic      |
| **Hooks**                            | 80%              | Side effects are error-prone              |

**Rule:** Coverage of _touched logic_ must be ≥ 80% before story is considered Done (AGENTS.md §4).

### 7.2 Test Structure

```typescript
// ✅ GOOD: Clear arrange-act-assert, good naming

import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  // Setup & teardown
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Test 1: Happy path
  it("should persist and retrieve value from localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>("key", "initial"),
    );

    act(() => {
      result.current.setValue("updated");
    });

    expect(localStorage.getItem("key")).toBe(JSON.stringify("updated"));
    expect(result.current.value).toBe("updated");
  });

  // Test 2: Edge case — error handling
  it("should handle corrupted localStorage gracefully", () => {
    localStorage.setItem("key", "not-valid-json");

    const { result } = renderHook(() =>
      useLocalStorage<string>("key", "fallback"),
    );

    expect(result.current.value).toBe("fallback");
  });

  // Test 3: Error case
  it("should recover when localStorage quota is exceeded", () => {
    const { result } = renderHook(() => useLocalStorage<string>("key", ""));

    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError", "QuotaExceededError");
    });

    expect(() => {
      act(() => result.current.setValue("large-value"));
    }).not.toThrow();
  });
});
```

**Test Organization Rules:**

1. **Describe block** per module/hook
2. **Setup/teardown** in beforeEach/afterEach
3. **Test name** describes behavior, not implementation
4. **Arrange-Act-Assert** pattern per test
5. **Happy path → Edge cases → Error cases**

### 7.3 Test Naming

| Pattern                                 | Example                                     | When              |
| --------------------------------------- | ------------------------------------------- | ----------------- |
| `should [verb] when [condition]`        | `should save task when title is valid`      | Most common       |
| `should [verb]`                         | `should return empty array`                 | Simple behavior   |
| `should throw [error] when [condition]` | `should throw error when title is empty`    | Error cases       |
| `should handle [scenario]`              | `should handle localStorage quota exceeded` | Complex scenarios |

```typescript
// ✅ GOOD: Clear, action-oriented
it("should move task to done column and persist change", async () => {});
it("should throw error when task ID not found", () => {});
it("should restore board state from localStorage on app load", () => {});

// ❌ BAD: Vague or implementation-focused
it("works", () => {});
it("test move", () => {});
it("modifies state and calls dispatch", () => {});
```

### 7.4 Mocking Strategy

**Mock only external dependencies, not implementation:**

```typescript
// ✅ GOOD: Mock localStorage (external), not useLocalStorage internals
jest.mock("localStorage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// ✅ GOOD: Mock async API (not yet used, but pattern for future)
jest.mock("api/taskService", () => ({
  fetchTasks: jest.fn().mockResolvedValue([]),
}));

// ❌ BAD: Over-mocking; testing the mock, not the code
jest.mock("useLocalStorage", () => ({
  useLocalStorage: jest.fn().mockReturnValue([null, jest.fn()]),
}));
// This defeats the purpose of the test!
```

---

## 8. Quality Criteria & Pre-commit Checklist

### 8.1 Code Quality Checklist

Before pushing code, verify:

- [ ] **TypeScript:** `tsc --noEmit` passes (no errors)
- [ ] **Linting:** `eslint src/` passes (no errors or warnings)
- [ ] **Tests:** All tests pass; coverage ≥ 80% for touched logic
- [ ] **Naming:** Follows conventions in Section 2
- [ ] **Comments:** Public functions have JSDoc; logic comments explain "why"
- [ ] **Error Handling:** All errors caught and logged; no silent failures
- [ ] **localStorage:** All I/O goes through `useLocalStorage` hook
- [ ] **No side effects:** All side effects in `useEffect`
- [ ] **No any types:** All variables and params explicitly typed
- [ ] **No console logs:** Only `console.error()` for errors; remove debug logs

### 8.2 Story Acceptance Checklist

Before marking a story Done, verify:

- [ ] **AC 1–N:** All acceptance criteria met and demonstrable
- [ ] **Technical Notes:** All suggestions from story addressed or documented
- [ ] **Tests:** Tests written; ≥ 80% coverage on touched logic
- [ ] **Code Review:** Changes reviewed by at least one peer
- [ ] **Documentation:** JSDoc added; complex logic commented
- [ ] **No regressions:** Existing tests still pass
- [ ] **Definition of Done:** All items from AGENTS.md §4 checked

### 8.3 Linting & Formatting

```bash
# TypeScript check (strict mode)
tsc --noEmit

# Lint (ESLint)
eslint src/ --fix  # Auto-fix some issues

# Format (Prettier, if configured)
prettier --write src/
```

**ESLint Config (Recommended):**

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/strict"
  ],
  "rules": {
    "no-any": "error",
    "@typescript-eslint/explicit-function-return-types": "error",
    "no-console": ["error", { "allow": ["error", "warn"] }]
  }
}
```

---

## 9. Performance Guidelines

### 9.1 React Performance

| Guideline                                | Reason                                 | Example                                                 |
| ---------------------------------------- | -------------------------------------- | ------------------------------------------------------- |
| Use `React.memo` for pure components     | Prevent unnecessary re-renders         | `export const TaskCard = React.memo(({ task }) => ...)` |
| Use `useCallback` for handler closures   | Maintain referential equality for deps | `const handleMove = useCallback(() => {}, [deps])`      |
| Use `useMemo` for expensive computations | Avoid recalculating on every render    | `const sorted = useMemo(() => sort(tasks), [tasks])`    |
| Avoid inline objects as props            | Breaks memo due to new reference       | ❌ `<Task config={{ color: 'red' }} />`                 |
| Batch state updates                      | Reduce render cycles                   | Use `useTransition` or update reducer                   |

```typescript
// ✅ GOOD: Memoized component + callback
interface TaskCardProps {
  task: Task;
  onMove: (taskId: string) => void;
}

export const TaskCard = React.memo(({ task, onMove }: TaskCardProps) => {
  const handleMove = useCallback(() => {
    onMove(task.id);
  }, [task.id, onMove]);

  return <div onClick={handleMove}>{task.title}</div>;
});

// ❌ BAD: Inline object, new handler every render
export const TaskCard = ({ task, onMove }: TaskCardProps) => {
  const config = { color: 'red' }; // New object every render!

  return (
    <div onClick={() => onMove(task.id)}> {/* New function every render! */}
      {task.title}
    </div>
  );
};
```

### 9.2 Storage Performance

| Guideline                                     | Target | Notes                                 |
| --------------------------------------------- | ------ | ------------------------------------- |
| Serialize board state at most once per action | < 10ms | Batch writes; debounce if needed      |
| Load state on mount in < 50ms                 | < 50ms | For 300 tasks typical                 |
| Keep total board size < 1MB                   | < 1MB  | Roughly 5000 tasks; well within quota |

---

## 10. Accessibility & Semantic HTML

### 10.1 Keyboard Navigation

**Requirement:** All interactions must have keyboard alternatives (PRD NFR §5.5, AGENTS.md §6).

```typescript
// ✅ GOOD: Keyboard support
const TaskCard = ({ task, onMove }: TaskCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onMove(task.id);
      e.preventDefault();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => onMove(task.id)}
    >
      {task.title}
    </div>
  );
};

// ❌ BAD: No keyboard support
<div onClick={() => onMove(task.id)}>
  {task.title}
</div>
```

### 10.2 Semantic HTML

- Use `<button>` for buttons, not `<div>`.
- Use `<input>`, `<label>`, `<form>` for forms.
- Add `aria-label` or `aria-labelledby` for icon buttons.
- Use proper heading hierarchy (`<h1>`, `<h2>`, etc.).

---

## 11. Common Pitfalls & How to Avoid

| Pitfall                          | Problem                                   | Solution                                              |
| -------------------------------- | ----------------------------------------- | ----------------------------------------------------- |
| Calling `localStorage` directly  | Breaks encapsulation; hard to test        | Always use `useLocalStorage` hook                     |
| Using `any` type                 | Defeats TypeScript; causes runtime errors | Use `unknown` then narrow, or `<T>` generic           |
| Side effects outside `useEffect` | Can run on every render; memory leaks     | Keep all side effects in `useEffect`                  |
| Inline event handlers            | New function every render; breaks memo    | Use `useCallback` or move to named function           |
| Missing error handling           | Silent failures; user confusion           | Always wrap I/O in try-catch; log errors              |
| Not testing edge cases           | Missing bugs in production                | Write tests for happy path + edge cases + errors      |
| Importing from deep paths        | Brittle; refactoring is painful           | Use absolute imports via `tsconfig` paths             |
| Ambiguous prop names             | Hard to understand intent                 | Use `handle*` for event handlers, `on*` for callbacks |

---

## References

- **AGENTS.md:** [Hard constraints and naming conventions](../../agents.md)
- **Architecture:** [System design and tech stack](./overview.md)
- **PRD:** [Product requirements and success metrics](../../specs/prds/prd-personal-task-board.md)
- **Accessibility:** [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- **TypeScript:** [Strict Mode Handbook](https://www.typescriptlang.org/docs/handbook/strict-mode.html)
