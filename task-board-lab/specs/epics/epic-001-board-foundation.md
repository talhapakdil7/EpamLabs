# Epic: Board Foundation and Local Persistence

**Epic ID:** EPIC-001
**PRD Reference:** specs/prds/prd-personal-task-board.md
**Owner:** Frontend Team
**Status:** Backlog
**Target Release:** Sprint 1
**Last Updated:** 2026-05-05

---

## 1. Description

This epic delivers a complete, usable baseline board where a solo developer can create, edit, and delete tasks in To Do, In Progress, and Done columns, then trust the board to restore state after refresh. It addresses the core pain of losing task context and spending time reconstructing work state. Success means the board is usable day one without accounts, servers, or setup friction.

---

## 2. Primary Persona

- **Persona:** Maya
- **Why they benefit:** Maya gets a dependable single board that preserves her active tasks across sessions, reducing planning reset time each day.

---

## 3. Success Criteria

- [ ] A user can create, edit, and delete tasks in all three default columns and see updates reflected instantly in the UI.
- [ ] Board state restores correctly after browser refresh in 100% of manual smoke tests on current Chrome, Firefox, and Safari.
- [ ] The implementation contributes to the PRD metric Daily planning time reduction by eliminating manual reconstruction of task lists after reload.
- [ ] Unit and integration test coverage for task CRUD and persistence logic is at least 80%.

---

## 4. Scope & Complexity

### 4.1 Size Estimate

| Size | Criteria |
|------|----------|
| **S — Small** | 1–2 sprints, single team, minimal cross-team dependencies |
| **M — Medium** | 2–4 sprints, may touch multiple services or require design work |
| **L — Large** | 4+ sprints, cross-team coordination, architectural changes |

**This epic is:** M — It establishes the core data model, task lifecycle UI, and localStorage reliability that all later epics build upon.

### 4.2 In Scope
- Render the three default columns: To Do, In Progress, and Done.
- Implement task creation, editing, and deletion with required title field.
- Persist board and task data in localStorage and restore on page load.
- Handle empty and first-run board states with clear user feedback.

### 4.3 Out of Scope
- Drag-and-drop task movement and in-column reordering, which is covered in EPIC-002.
- Keyboard shortcut operations, which are covered in EPIC-003.
- Project tag grouping and filtering, which are covered in EPIC-004.

---

## 5. Dependencies

| # | Dependency                          | Type                     | Status             | Owner           |
|---|-------------------------------------|--------------------------|--------------------|-----------------|
| 1 | Column names and baseline task fields are approved before implementation starts. | Decision | In Progress | Product Owner |
| 2 | React 18 and Vite project workspace is available and buildable. | Technical | Done | Engineering |

---

## 6. User Stories

| Story ID  | Title                             | Status             | Notes              |
|-----------|-----------------------------------|--------------------|--------------------|
| TBD-001  | Board shell and default columns               | Backlog | To be filled during backlog refinement |
| TBD-002  | Task create, edit, and delete               | Backlog | To be filled during backlog refinement |
| TBD-003  | localStorage save and restore               | Backlog | To be filled during backlog refinement |

> Stories will be added and refined as this epic is broken down. Link each story back to this epic ID.

---

## Appendix

### Open Questions

| # | Question                          | Owner           | Due Date     | Resolution         |
|---|-----------------------------------|-----------------|--------------|--------------------|
| 1 | Should a newly created task default to To Do at the top or bottom of the column? | Product Owner | 2026-05-12 | Pending |

### Notes & Context
- PRD functional requirements mapped: FR-01, FR-02, FR-05
- Primary use case support: UC-01
