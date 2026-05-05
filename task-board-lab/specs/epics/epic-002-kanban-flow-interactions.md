# Epic: Kanban Flow Interactions

**Epic ID:** EPIC-002
**PRD Reference:** specs/prds/prd-personal-task-board.md
**Owner:** Frontend Team
**Status:** Backlog
**Target Release:** Sprint 2
**Last Updated:** 2026-05-05

---

## 1. Description

This epic delivers fast visual task movement so developers can manage execution flow directly on the board through drag-and-drop and in-column reordering. It turns the static board into an active workflow tool that supports quick reprioritization during coding sessions. Success means task state changes are smooth, persistent, and predictable without opening edit dialogs.

---

## 2. Primary Persona

- **Persona:** Ethan
- **Why they benefit:** Ethan can quickly move and reorder work items while shipping features, reducing friction between planning and coding.

---

## 3. Success Criteria

- [ ] A user can drag a task between To Do, In Progress, and Done, with status saved immediately after drop.
- [ ] A user can reorder tasks within a column and the order remains intact after page refresh.
- [ ] The implementation contributes to the PRD metric Task status update completion by making state transitions frictionless during normal work.
- [ ] Drag-and-drop and reorder flows maintain less than 2% interaction error rate in test sessions.

---

## 4. Scope & Complexity

### 4.1 Size Estimate

| Size | Criteria |
|------|----------|
| **S — Small** | 1–2 sprints, single team, minimal cross-team dependencies |
| **M — Medium** | 2–4 sprints, may touch multiple services or require design work |
| **L — Large** | 4+ sprints, cross-team coordination, architectural changes |

**This epic is:** M — It introduces complex interaction behavior, ordering logic, and persistence guarantees across multiple columns.

### 4.2 In Scope
- Enable drag-and-drop movement of tasks across all three columns.
- Enable drag-and-drop reordering within each column.
- Persist moved and reordered positions in localStorage.
- Provide clear visual drop indicators and invalid-drop handling.

### 4.3 Out of Scope
- Task create, edit, and delete forms, which are covered in EPIC-001.
- Keyboard-based movement shortcuts, which are covered in EPIC-003.
- Project tag filtering and board reset actions, which are covered in EPIC-004.

---

## 5. Dependencies

| # | Dependency                          | Type                     | Status             | Owner           |
|---|-------------------------------------|--------------------------|--------------------|-----------------|
| 1 | EPIC-001 must provide stable task schema and localStorage persistence baseline. | Technical | Blocked | Frontend Team |
| 2 | Interaction design for drag handles and drop targets is approved. | Design | In Progress | UX Designer |

---

## 6. User Stories

| Story ID  | Title                             | Status             | Notes              |
|-----------|-----------------------------------|--------------------|--------------------|
| TBD-004  | Drag task between columns               | Backlog | To be filled during backlog refinement |
| TBD-005  | Reorder tasks within column               | Backlog | To be filled during backlog refinement |
| TBD-006  | Persist order and movement state               | Backlog | To be filled during backlog refinement |

> Stories will be added and refined as this epic is broken down. Link each story back to this epic ID.

---

## Appendix

### Open Questions

| # | Question                          | Owner           | Due Date     | Resolution         |
|---|-----------------------------------|-----------------|--------------|--------------------|
| 1 | Should dropped tasks always append to bottom, or preserve nearest index by pointer position? | Engineering | 2026-05-12 | Pending |

### Notes & Context
- PRD functional requirements mapped: FR-03, FR-07
- Primary use case support: UC-02
