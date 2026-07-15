---
name: pr-description
description: Add or update a pull request description using the standard template. Use when asked to write a PR description, fill out a PR body, document a pull request, or update PR details.
---

Generate and apply a structured PR description based on the changes in the branch. Uses `gh` CLI to fetch diff context and update the PR body.

## Template

```markdown
## What?
- <summary of what was implemented, derived from the diff>

## Why?
- <reason this change is necessary — usually the ticket goal>

## Testing
- <steps to reproduce the flow covered by this PR>

## Screenshots
<!-- Add any relevant screenshots here -->
```

## Agent steps

1. **Identify the PR.** If the user provides a PR URL or number, use it. Otherwise run:
   ```bash
   gh pr view --json number,title,headRefName,baseRefName,body
   ```

2. **Get the diff and commit log** to understand what changed:
   ```bash
   gh pr diff
   gh pr view --json commits --jq '.commits[].messageHeadline'
   ```

3. **Draft each section:**
   - **What?** — bullet list of the main changes (features added, bugs fixed, configs updated). Derive from the diff, not just the commit messages. Be specific.
   - **Why?** — the motivation. If a Jira ticket ID is available, state the ticket goal. If the user provides context, use it.
   - **Testing** — numbered steps a reviewer can follow to verify the change locally. Include setup if needed (env vars, seed data, specific endpoints to hit).
   - **Screenshots** — leave the placeholder as-is unless the user provides images.

4. **Show the draft to the user** and ask for confirmation or edits before applying.

5. **Apply the description:**
   ```bash
   gh pr edit <number> --body "$(cat <<'EOF'
   <formatted body>
   EOF
   )"
   ```

## Constraints

- Prefer `gh` CLI over any GitHub MCP tool.
- Do not invent ticket goals — use the diff and any context the user provides.
- Keep bullet points concise (one idea per bullet).
- Testing steps must be actionable — avoid vague entries like "test the feature."
