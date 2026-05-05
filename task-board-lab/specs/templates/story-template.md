# User Story: [SHORT TITLE]

**Story ID:** [US-###]
**Epic:** [EPIC-### — Epic Title]
**Author:** [NAME]
**Status:** [Backlog | Ready | In Progress | In Review | Done]
**Sprint:** [Sprint # or Unassigned]
**Last Updated:** [YYYY-MM-DD]

---

## 1. User Story

<!-- Follow the standard format: As a [persona], I want [action] so that [benefit].
     - [persona]  → use a named persona from the PRD, not a generic "user"
     - [action]   → describe what they want to do, not how the system does it
     - [benefit]  → state the real outcome or value, not just the feature itself -->

> As a **[PERSONA]**,
> I want **[ACTION OR CAPABILITY]**,
> so that **[BENEFIT OR OUTCOME]**.

---

## 2. Acceptance Criteria

<!-- Write 3–5 specific, testable conditions that must ALL be true for this story to be accepted.
     Use "Given / When / Then" (Gherkin) format for clarity and test-readiness.
     Avoid vague language like "works correctly" or "is fast enough" — be precise. -->

- [ ] **AC-1:** Given [precondition], when [action], then [expected result].
- [ ] **AC-2:** Given [precondition], when [action], then [expected result].
- [ ] **AC-3:** Given [precondition], when [action], then [expected result].
- [ ] **AC-4 (optional):** Given [precondition], when [action], then [expected result].
- [ ] **AC-5 (optional):** Given [precondition], when [action], then [expected result].

---

## 3. Technical Notes

<!-- Optional. Provide implementation hints, constraints, or pointers that help the
     developer without over-specifying the solution. Leave blank if not needed. -->

- **Affected components:** [e.g., AuthService, UserProfileAPI, LoginPage component]
- **API / Data considerations:** [e.g., Requires new endpoint `POST /api/v1/sessions`, must return JWT]
- **Edge cases to watch:** [e.g., Expired tokens, concurrent login sessions, empty states]
- **Security / compliance notes:** [e.g., Passwords must never be logged; rate-limit to 5 attempts/min]
- **External dependencies:** [e.g., Requires Feature Flag X to be enabled in staging]

---

## 4. Estimation

<!-- Choose one estimation method and remove the other.
     Use story points for relative complexity, or days for time-based planning. -->

| Field              | Value                                      |
|--------------------|--------------------------------------------|
| **Story Points**   | `[ 1 / 2 / 3 / 5 / 8 / 13 ]`              |
| **Effort (days)**  | `[X days]`                                 |
| **Complexity**     | `[ Low / Medium / High ]`                  |
| **Uncertainty**    | `[ Low / Medium / High ]`                  |

> **Notes:** [Any caveats affecting the estimate, e.g., "High uncertainty pending API design decision"]

---

<!--
=============================================================
  INVEST VALIDATION CHECKLIST — remove before finalizing
=============================================================

Review each principle before marking this story as "Ready".

[ ] INDEPENDENT
    Can this story be developed and delivered without requiring another story
    to be completed first? If not, consider splitting or reordering.

[ ] NEGOTIABLE
    Is this story a conversation-starter, not a rigid contract? The details
    (especially Technical Notes) should be open to discussion with the team.

[ ] VALUABLE
    Does this story deliver clear value to the persona or the business on its own?
    If it only has value when combined with other stories, consider merging them.

[ ] ESTIMABLE
    Does the team have enough information to estimate this story with reasonable
    confidence? If not, add a spike story to resolve the unknowns first.

[ ] SMALL
    Can this story be completed within a single sprint (ideally ≤ 3–5 days)?
    If not, split it into smaller stories that each deliver independent value.

[ ] TESTABLE
    Can each Acceptance Criterion be verified by a test (automated or manual)?
    Vague AC ("user-friendly", "fast") must be made specific before sprint start.

=============================================================
-->

---

## Appendix

### Definition of Done
<!-- Check that ALL of the following are satisfied before closing this story. -->

- [ ] All Acceptance Criteria are met and verified
- [ ] Code reviewed and approved by at least one peer
- [ ] Unit and/or integration tests written and passing
- [ ] No new linter errors or warnings introduced
- [ ] Relevant documentation updated (API docs, README, etc.)
- [ ] Product Owner has accepted the story

### Related Links
<!-- Designs, tickets, PRD sections, ADRs, Slack threads, etc. -->
- [LINK OR REFERENCE]
