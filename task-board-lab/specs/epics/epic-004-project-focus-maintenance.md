# Epic: Project Focus and Board Maintenance Controls

**Epic ID:** EPIC-004
**PRD Reference:** specs/prds/prd-personal-task-board.md
**Owner:** Frontend Team
**Status:** Backlog
**Target Release:** Sprint 4
**Last Updated:** 2026-05-05

---

## 1. Description

This epic delivers project-level focus controls and maintenance actions so solo developers can manage work across multiple projects without clutter. It adds project tagging, filtering or grouping, and safe board reset behavior to keep long-running boards manageable. Success means users can isolate relevant work quickly and intentionally clean up state when needed.

---

## 2. Primary Persona

- **Persona:** Ethan
- **Why they benefit:** Ethan can isolate one project at a time while still keeping all tasks in one board, reducing noise and planning fatigue.

---

## 3. Success Criteria

- [ ] A user can assign a project tag to a task and view tasks filtered or grouped by project tag.
- [ ] A user can trigger clear-board action only after explicit confirmation and receives completion feedback.
- [ ] The implementation contributes to the PRD metric Daily planning time reduction by reducing time spent scanning unrelated tasks.
- [ ] At least 95% of filtered-view interactions render correct task subsets in QA validation.

---

## 4. Scope & Complexity

### 4.1 Size Estimate

| Size | Criteria |
|------|----------|
| **S — Small** | 1–2 sprints, single team, minimal cross-team dependencies |
| **M — Medium** | 2–4 sprints, may touch multiple services or require design work |
| **L — Large** | 4+ sprints, cross-team coordination, architectural changes |

**This epic is:** S — It extends existing task fields and board controls with focused UI behavior and minimal deep architectural change.

### 4.2 In Scope
- Add project tag field support in task create and edit flows.
- Implement project-based filtering or grouping for board visibility control.
- Implement reset or clear-board action with explicit confirmation guard.
- Persist tag metadata and filter preferences in localStorage.

### 4.3 Out of Scope
- External project management integrations, which remain outside MVP scope in the PRD.
- Multi-user boards or shared workspaces, which remain outside MVP scope in the PRD.
- Drag-and-drop behavior and keyboard shortcuts, which are covered in EPIC-002 and EPIC-003.

---

## 5. Dependencies

| # | Dependency                          | Type                     | Status             | Owner           |
|---|-------------------------------------|--------------------------|--------------------|-----------------|
| 1 | EPIC-001 must provide stable task editing and persistence flows. | Technical | Blocked | Frontend Team |
| 2 | Product decision on tag model type, free text or constrained list, is finalized. | Decision | In Progress | Product Owner |

---

## 6. User Stories

| Story ID  | Title                             | Status             | Notes              |
|-----------|-----------------------------------|--------------------|--------------------|
| TBD-010  | Add and persist project tags               | Backlog | To be filled during backlog refinement |
| TBD-011  | Filter or group board by project               | Backlog | To be filled during backlog refinement |
| TBD-012  | Confirm and execute board reset               | Backlog | To be filled during backlog refinement |

> Stories will be added and refined as this epic is broken down. Link each story back to this epic ID.

---

## Appendix

### Open Questions

| # | Question                          | Owner           | Due Date     | Resolution         |
|---|-----------------------------------|-----------------|--------------|--------------------|
| 1 | Should filter preference be session-only or restored on next app load? | Product Owner | 2026-05-12 | Pending |

### Notes & Context
- PRD functional requirements mapped: FR-06, FR-08
- Primary use case support: UC-01 project-focused organization
