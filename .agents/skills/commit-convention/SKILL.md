---
name: commit-convention
description: Standardize commit message format and PR title using the project convention. Use when asked to format a commit, write a commit message, check commit convention, or format a Pull Request (PR) title.
---

Enforce the Gencise commit message and PR title convention. Applies to both `git commit -m` messages and GitHub PR titles.

## Convention

```
action_type(scope): summary 
```

**Example:**
```
fix(docker): update rabbitmq service configuration [INFRA-36]
```

## Action types

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A regular bug fix |
| `hotfix` | A critical / production fix |
| `chore` | Maintenance task (update deps, config files, CI, etc.) |
| `refactor` | Tech debt cleanup — no behavior change |
| `docs` | Adding or updating documentation, TSDoc, conventions |

## Scope

The module or area being changed. Examples: `ingestion`, `users`, `emails`, `mailboxes`, `docker`, `api`, `auth`, `workers`, `ui`, `db`.

Use the most specific relevant module. If multiple unrelated modules are touched, consider splitting the commit; if they're tightly coupled, pick the primary one.

## Agent steps

1. If the user provides a branch name or description, infer the action type and scope from context.
2. Write the summary in **imperative mood**, lowercase, no period at the end (e.g. "add retry logic", not "Added retry logic.").
3. Keep the full message under 72 characters when possible.
4. Present the formatted message and ask the user to confirm before running `git commit`.

## Applying to PR titles

PR titles follow the same format. When formatting a PR title:
- Use `gh pr edit --title "..."` to update an existing PR.
- Use `gh pr create --title "..."` when creating a new one.

## Examples

```
feat(ingestion): add document classification pipeline [TRANS-8]
fix(emails): handle missing attachment headers [MAIL-22]
hotfix(api): prevent null pointer on empty payload [SUPP-99]
chore(docker): upgrade rabbitmq to 3.13 [INFRA-36]
refactor(workers): extract retry logic into base class [TRANS-41]
docs(auth): document OAuth flow in CONTRIBUTING.md [INFRA-10]
```
