# Epic: Keyboard Productivity and Accessible Task Actions

**Epic ID:** EPIC-003
**PRD Reference:** specs/prds/prd-personal-task-board.md
**Owner:** Frontend Team
**Status:** Backlog
**Target Release:** Sprint 3
**Last Updated:** 2026-05-05

---

## 1. Description

This epic delivers keyboard-first workflows that let solo developers execute common board actions without leaving the keyboard, while also providing accessible alternatives to pointer-driven interactions. It improves speed for power users and keeps core task movement reachable for users who cannot rely on drag-and-drop. Success means keyboard actions are discoverable, reliable, and materially adopted.

---

## 2. Primary Persona

- **Persona:** Maya
- **Why they benefit:** Maya can create and move tasks faster during focused coding blocks, reducing interaction overhead and context switching.

---

## 3. Success Criteria

- [ ] A user can create a task, move a selected task left or right between columns, and mark a task done using documented keyboard shortcuts.
- [ ] All shortcut-enabled actions have non-pointer, keyboard-accessible paths that satisfy WCAG 2.1 AA keyboard expectations.
- [ ] The implementation contributes to the PRD metric Interaction efficiency by enabling growth in keyboard-assisted actions per week.
- [ ] Shortcut conflict rate stays below 1% across supported browsers in QA validation.

---

## 4. Scope & Complexity

### 4.1 Size Estimate

| Size | Criteria |
|------|----------|
| **S — Small** | 1–2 sprints, single team, minimal cross-team dependencies |
| **M — Medium** | 2–4 sprints, may touch multiple services or require design work |
| **L — Large** | 4+ sprints, cross-team coordination, architectural changes |

**This epic is:** S — It is a focused enhancement on top of existing board interactions with limited architectural risk.

### 4.2 In Scope
- Define and implement default keyboard shortcuts for core board actions.
- Add focus management and selected-task behavior needed for keyboard movement.
- Provide visible shortcut hints in the UI for discoverability.
- Ensure accessible non-pointer alternatives for task state changes.

### 4.3 Out of Scope
- Pointer-based drag-and-drop implementation, which is covered in EPIC-002.
- Project tag grouping and filtering, which are covered in EPIC-004.
- Task data model and localStorage foundation work, which are covered in EPIC-001.

---

## 5. Dependencies

| # | Dependency                          | Type                     | Status             | Owner           |
|---|-------------------------------------|--------------------------|--------------------|-----------------|
| 1 | EPIC-001 must expose stable task identifiers and state update handlers. | Technical | Blocked | Frontend Team |
| 2 | Final shortcut map decision for macOS and Windows is approved. | Decision | In Progress | Product Owner |

---

## 6. User Stories

| Story ID  | Title                             | Status             | Notes              |
|-----------|-----------------------------------|--------------------|--------------------|
| TBD-007  | Add task and select task with keyboard               | Backlog | To be filled during backlog refinement |
| TBD-008  | Move selected task with shortcuts               | Backlog | To be filled during backlog refinement |
| TBD-009  | Show shortcut hints and accessibility behavior               | Backlog | To be filled during backlog refinement |

> Stories will be added and refined as this epic is broken down. Link each story back to this epic ID.

---

## Appendix

### Open Questions

| # | Question                          | Owner           | Due Date     | Resolution         |
|---|-----------------------------------|-----------------|--------------|--------------------|
| 1 | Which default keys should be reserved to avoid collisions with browser defaults? | Engineering | 2026-05-12 | Pending |

### Notes & Context
- PRD functional requirements mapped: FR-04, accessibility requirements in section 5.5
- Primary use case support: UC-02 alternate interaction path
