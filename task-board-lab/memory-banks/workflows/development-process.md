# Development Workflow — task-board-lab

**Version:** 1.0  
**Last Updated:** 2026-05-07  
**Scope:** End-to-end development process, version control, code review, testing, and deployment  
**Audience:** Developers, AI assistants, engineering leads

---

## 1. Overview: Idea to Production

The development workflow for task-board-lab follows **Specification-Driven Development (SDD)** with continuous integration and careful code review. Every change is traceable to a user story in `specs/stories/`.

```
Product Idea
    ↓
PRD (specs/prds/)
    ↓
Epic (specs/epics/)
    ↓
User Story (specs/stories/) — Status: Ready or In Progress
    ↓
Feature Branch (feature/us-###-slug)
    ↓
Local Development + Testing
    ↓
Pull Request (to main or develop)
    ↓
Code Review (checklist verification)
    ↓
Merge & CI/CD Pipeline
    ↓
Automated Tests + Build + Deploy
    ↓
Production Release
    ↓
Monitoring & Feedback
```

**Key Principle:**  
No feature is implemented without a story spec marked `Ready` or `In Progress`. No story is merged without code review and ≥80% test coverage.

---

## 2. Git Flow Branching Strategy

### 2.1 Branch Structure

```
main
  ├─ (protected; production-ready code)
  └─ stable release tags (v1.0.0, v1.0.1)

develop
  ├─ (protected; next release staging)
  └─ pre-release testing & integration

feature/us-###-[slug]
  ├─ Story ID + slug from specs/stories/ filename
  ├─ Example: feature/us-001-board-foundation
  └─ Pull from develop; merge back to develop

bugfix/[description]
  ├─ For production bugs
  ├─ Pull from main; merge to main + develop
  └─ Example: bugfix/localStorage-quota-error

hotfix/v[version]-[description]
  ├─ Critical production fixes only
  ├─ Pull from main with tag; merge to main + develop
  └─ Example: hotfix/v1.0.1-fix-task-corruption
```

### 2.2 Branch Naming Conventions

| Type    | Pattern                           | Example                               | Notes                   |
| ------- | --------------------------------- | ------------------------------------- | ----------------------- |
| Feature | `feature/us-[###]-[slug]`         | `feature/us-004.01-add-project-tag`   | Must reference story ID |
| Bug     | `bugfix/[description]`            | `bugfix/localStorage-migration-error` | Lowercase, kebab-case   |
| Hotfix  | `hotfix/v[version]-[description]` | `hotfix/v1.0.1-filter-reset-crash`    | Include version tag     |
| Chore   | `chore/[description]`             | `chore/upgrade-vite-dependencies`     | Non-feature work        |

**Rules:**

- Use **lowercase** and **kebab-case**.
- Include **story ID** for features (traceability).
- Keep names **short** but **descriptive** (< 50 chars).
- Delete branches after merge.

### 2.3 Branch Protection

**Main branch protections:**

```
main
├─ Require code review (1+ approver)
├─ Dismiss stale reviews when new commits pushed
├─ Require status checks to pass (CI/CD pipeline)
└─ Require branches to be up to date before merge
```

**Develop branch protections:**

```
develop
├─ Require code review (1+ approver)
├─ Require status checks to pass
└─ Allow squash merges (keep develop history clean)
```

---

## 3. Pull Request (PR) Process

### 3.1 Creating a PR

**Before opening a PR:**

1. **Verify story status**

   ```bash
   # Check that your story is Ready or In Progress
   # Reference: specs/stories/us-###-[slug].md
   # Status should be: "Ready" or "In Progress"
   ```

2. **Ensure code quality**

   ```bash
   npm run lint       # ESLint (no errors)
   npm run type-check # TypeScript strict (no errors)
   npm run test       # Tests passing + ≥80% coverage on touched logic
   npm run build      # Production build succeeds
   ```

3. **Update commit history**

   ```bash
   # Interactive rebase to clean up commits
   git rebase -i origin/develop

   # Squash or reorder commits so story is atomic
   # Goal: 1-3 commits per logical story unit
   ```

4. **Create PR with template**

   ```markdown
   ## Story Reference

   Resolves: US-###-[slug]
   Story URL: specs/stories/us-###-[slug].md

   ## Description

   Brief summary of what this PR implements. Link to epic if helpful.

   ## Acceptance Criteria

   - [ ] AC 1: [from story]
   - [ ] AC 2: [from story]
   - [ ] AC 3: [from story]

   ## Testing

   - [ ] Unit tests added (≥80% coverage)
   - [ ] Manual testing on browser completed
   - [ ] Edge cases tested (see Technical Notes)

   ## Checklist

   - [ ] No new `any` types
   - [ ] All localStorage I/O via useLocalStorage hook
   - [ ] No module-level side effects
   - [ ] JSDoc added for public functions
   - [ ] No console logs except error()
   - [ ] No new dependencies added
   ```

### 3.2 PR Review Checklist (for Reviewers)

**Verify requirements are met (SDD compliance):**

- [ ] **Story reference:** PR links to story in specs/stories/
- [ ] **Status check:** Story marked "Ready" or "In Progress" (not Backlog)
- [ ] **Epic coverage:** Story's epic dependencies are all marked "Done"
- [ ] **All ACs satisfied:** Every acceptance criterion in the story is demonstrable

**Code quality checks:**

- [ ] **TypeScript:** No `any` types; all props/returns explicitly typed
- [ ] **Linting:** No ESLint warnings; `npm run lint` passes
- [ ] **localStorage:** All I/O through `useLocalStorage` hook only
- [ ] **Side effects:** All effects inside `useEffect`; no module-level side effects
- [ ] **Error handling:** All I/O wrapped in try-catch; errors logged

**Testing checks:**

- [ ] **Coverage:** ≥80% on touched logic (run `npm run test -- --coverage`)
- [ ] **Edge cases:** Story's Technical Notes are tested
- [ ] **Regressions:** Existing tests still pass
- [ ] **Manual QA:** Feature tested in browser; happy path + error path

**Documentation checks:**

- [ ] **JSDoc:** Public functions have JSDoc with @param, @returns
- [ ] **Comments:** Complex logic explained; "why" not "what"
- [ ] **Naming:** Follows conventions (Section 6, AGENTS.md)

**Accessibility checks (if UI change):**

- [ ] **Keyboard accessible:** Feature works with keyboard; no keyboard traps
- [ ] **ARIA labels:** Icon buttons have aria-label or aria-labelledby
- [ ] **Semantic HTML:** Uses proper tags (button, form, input)

**Performance checks (if relevant):**

- [ ] **Bundle size:** No unexpected growth (< 10KB delta)
- [ ] **Render time:** < 100ms for typical interactions
- [ ] **Memory leaks:** No dangling subscriptions or timers

### 3.3 Code Review Standards

**Review philosophy:**  
Focus on **intent** and **correctness**, not style (linter handles style). Be constructive and educational.

**Required approval:** 1 approver minimum (can be peer or lead)

**Review feedback:**

- Use GitHub suggestion feature for small fixes (reviewee can commit directly)
- Request changes only if blocking
- Comment praise for good solutions (morale boost)

**Example review comment (good):**

```
❌ This uses any type for task, but we need strict typing.
✅ Can you add a type annotation? E.g., task: Task
```

**Example review comment (bad):**

```
❌ This is bad code.
```

---

## 4. Testing Strategy

### 4.1 Testing Pyramid

```
         /\
        /  \
       /    \
      / E2E  \         ← End-to-end (optional, low volume)
     /________\
    /          \
   /            \
  / Integration  \    ← Hook + component integration
 /________________\
/                  \
/ Unit Tests        \  ← Pure functions, hooks, logic
/____________________\

Target Split (effort + ROI):
- 70% Unit Tests (fast, isolated)
- 20% Integration Tests (realistic flows)
- 10% E2E Tests (critical paths only)
```

### 4.2 Coverage Requirements

| Category                          | Minimum | Rationale                              |
| --------------------------------- | ------- | -------------------------------------- |
| **Touched logic**                 | 80%     | Acceptable risk/effort for features    |
| **Persistence (useLocalStorage)** | 90%     | Critical; storage failures break app   |
| **State management**              | 85%     | Core business logic                    |
| **Utilities (pure functions)**    | 85%     | Deterministic; easy to test            |
| **Components**                    | 70%     | UI testing is slower; prioritize logic |

**Enforcement:**

- PR blocks if coverage drops below target on touched files
- Coverage report uploaded to PR artifacts
- `npm run test -- --coverage` to check locally

### 4.3 Testing Standards

**Test file location:**

```
src/
├── components/
│   ├── TaskCard.tsx
│   └── TaskCard.test.tsx       ← Same folder
├── features/board/
│   ├── useBoardState.ts
│   └── useBoardState.test.ts   ← Same folder
└── utils/
    ├── formatDate.ts
    └── formatDate.test.ts      ← Same folder
```

**Test structure (Vitest + React Testing Library):**

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  // Setup
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Happy path
  it("should persist value to localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>("key", "initial"),
    );

    act(() => {
      result.current.setValue("updated");
    });

    expect(localStorage.getItem("key")).toBe(JSON.stringify("updated"));
  });

  // Edge case
  it("should handle corrupted JSON gracefully", () => {
    localStorage.setItem("key", "invalid-json");

    const { result } = renderHook(() =>
      useLocalStorage<string>("key", "fallback"),
    );

    expect(result.current.value).toBe("fallback");
  });

  // Error case
  it("should recover when localStorage quota exceeded", () => {
    const { result } = renderHook(() => useLocalStorage<string>("key", ""));

    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });

    expect(() => {
      act(() => result.current.setValue("large"));
    }).not.toThrow();
  });
});
```

**Test naming:**

- ✅ `should [verb] when [condition]` — "should save task when title is valid"
- ✅ `should throw [error] when [condition]` — "should throw error when ID not found"
- ❌ `test 1`, `works`, `component test`

### 4.4 Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test -- --coverage

# Run single test file
npm run test -- TaskCard.test.tsx

# Update snapshots (if using)
npm run test -- --update
```

---

## 5. Deployment Process

### 5.1 CI/CD Pipeline (GitHub Actions)

**Trigger:** Push to `main` or `develop` branch

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      # 1. Lint & Type Check
      - run: npm run lint
      - run: npm run type-check

      # 2. Unit Tests
      - run: npm run test
      - run: npm run test -- --coverage

      # 3. Build
      - run: npm run build

      # 4. Bundle Analysis
      - run: npm run bundle-size

  deploy:
    needs: test-and-build
    if: github.ref == 'refs/heads/main' # Production only
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - run: npm run deploy:prod
```

**Pipeline Stages:**

| Stage               | Command              | Pass/Fail              | Time |
| ------------------- | -------------------- | ---------------------- | ---- |
| **Lint**            | `npm run lint`       | Fail on error          | ~30s |
| **Type Check**      | `npm run type-check` | Fail on error          | ~45s |
| **Tests**           | `npm run test`       | Fail if < 80% coverage | ~60s |
| **Build**           | `npm run build`      | Fail on error          | ~60s |
| **Bundle Analysis** | Report size delta    | Warn (no block)        | ~15s |
| **Deploy**          | Push to hosting      | Fail on error          | ~90s |

**Total pipeline time:** ~5 minutes (typical)

### 5.2 Deployment Environments

| Environment    | Branch             | Hosting           | URL                                     | When                             |
| -------------- | ------------------ | ----------------- | --------------------------------------- | -------------------------------- |
| **Production** | `main`             | Vercel/Netlify/S3 | `https://taskboard.example.com`         | Auto on main merge               |
| **Staging**    | `develop`          | Vercel/Netlify/S3 | `https://staging.taskboard.example.com` | Auto on develop merge (optional) |
| **Local**      | Any feature branch | Localhost:5173    | `http://localhost:5173`                 | `npm run dev`                    |

### 5.3 Deployment Checklist

Before deploying to production:

**Story completion:**

- [ ] All acceptance criteria met and demonstrable
- [ ] ≥80% test coverage on touched logic
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code reviewed and approved

**Data & Storage:**

- [ ] localStorage migration logic tested (if data model changed)
- [ ] Backwards compatibility verified (old task data loads without error)
- [ ] No data loss scenarios

**Quality:**

- [ ] Smoke test: Create task → Move to Done → Refresh → Verify persists
- [ ] localStorage quota scenario tested (if relevant)
- [ ] Error messages are user-friendly
- [ ] No console errors in browser

**Documentation:**

- [ ] Story marked "Done" in specs/
- [ ] Release notes updated (if applicable)
- [ ] Known issues documented

### 5.4 Rollback Procedure

**Instant Rollback (< 5 minutes):**

```bash
# 1. Identify problematic commit
git log --oneline main | head -10

# 2. Revert to previous working commit
git revert <commit-hash>
git push origin main  # Triggers CI/CD deployment

# OR: Fast rollback via CDN/hosting provider
# Point to previous stable dist/ snapshot via:
# - AWS CloudFront invalidation + rollback
# - Vercel "Deployments" tab → "Promote" previous version
# - Netlify "Deploys" tab → click previous deployment
```

**No server-side impact:**
Because all data lives in user's browser (`localStorage`), rollback has no database corruption risk. Users on old version continue working; no forced updates.

**Communication:**

```
When rolling back:
1. Alert team in Slack/Discord: "Rolling back to [commit] due to [issue]"
2. Update status page (if external monitoring)
3. Post retrospective within 24 hours
```

**Post-rollback:**

1. Investigate root cause
2. Create bugfix branch: `bugfix/[description]`
3. Fix issue + add tests
4. Code review + merge to develop
5. Verify fix locally
6. Redeploy to main

---

## 6. Release Management

### 6.1 Versioning Scheme

Follow **Semantic Versioning** (SemVer): `MAJOR.MINOR.PATCH`

```
v1.0.0
 │ │ │
 │ │ └─ PATCH: Bug fixes, non-breaking (v1.0.1)
 │ └──── MINOR: New features, backwards-compatible (v1.1.0)
 └────── MAJOR: Breaking changes (v2.0.0)
```

### 6.2 Creating a Release

```bash
# 1. Ensure develop is up to date and all tests pass
git checkout develop
git pull origin develop
npm run test

# 2. Create release branch
git checkout -b release/v1.1.0

# 3. Update version in package.json
# "version": "1.1.0"

# 4. Create changelog entry
# Add new features/fixes to CHANGELOG.md under "v1.1.0"

# 5. Commit version bump
git commit -m "chore: bump version to v1.1.0"

# 6. Merge to main
git checkout main
git merge --no-ff release/v1.1.0

# 7. Tag release
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main --tags

# 8. Merge back to develop
git checkout develop
git merge --no-ff main

# 9. Delete release branch
git branch -d release/v1.1.0
```

### 6.3 Release Notes Template

```markdown
# Release Notes — v1.1.0

**Release Date:** 2026-06-15

## Features

- ✨ Add project tag filtering (US-004.03)
- ✨ Restore filter preference on app reload (US-004.05)

## Bug Fixes

- 🐛 Fix localStorage quota error recovery (bugfix/quota-error)
- 🐛 Prevent task corruption on concurrent updates

## Performance

- ⚡ Reduce bundle size by 15KB (optimization pass)
- ⚡ Improve drag-drop responsiveness (<50ms latency)

## Breaking Changes

None

## Known Issues

- Drag-drop not supported on iOS Safari < 13 (workaround: use keyboard)

## Migration Guide

No migrations needed. Old task data loads automatically.
```

---

## 7. Monitoring & Feedback

### 7.1 Post-Deployment Monitoring

**After pushing to production:**

1. **Check error logs** (first 30 minutes)

   ```bash
   # Monitor browser console (if telemetry enabled)
   # Check for new errors or warnings
   ```

2. **Smoke test**
   - Create a task manually
   - Move task between columns
   - Refresh page → verify persistence
   - Clear browser cache → verify recovery

3. **Performance check**
   - Load app in browser
   - Measure Time to First Paint (< 1.5s)
   - Measure interaction latency (< 100ms)

### 7.2 User Feedback Channels

- **In-app feedback form** (optional, low priority)
- **GitHub Issues** (for bugs/feature requests)
- **Email/Slack** (direct user contact)

---

## 8. Quick Reference: Common Commands

```bash
# Development
npm run dev                # Start dev server (localhost:5173)
npm run build              # Production build
npm run preview            # Preview production build locally

# Quality
npm run lint               # ESLint check
npm run lint:fix           # Auto-fix linting issues
npm run type-check         # TypeScript strict check
npm run test               # Run tests
npm run test:watch         # Tests in watch mode
npm run test -- --coverage # Coverage report

# Git flow
git checkout -b feature/us-###-slug          # Start feature
git push origin feature/us-###-slug          # Push for PR
git checkout develop && git pull             # Update before merge
git checkout -b release/v1.0.0 develop       # Start release

# Deployment (CI/CD runs these automatically)
npm run build && npm run deploy:prod         # Deploy to production
```

---

## References

- **AGENTS.md:** [Hard constraints and SDD methodology](../../agents.md)
- **Coding Standards:** [Testing strategy and code review checklist](../conventions/coding-standards.md)
- **Architecture:** [Deployment environments](../architecture/overview.md)
- **Specs:** [Stories and acceptance criteria](../../specs/)
- **Git Flow:** [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- **Semantic Versioning:** [SemVer.org](https://semver.org/)
