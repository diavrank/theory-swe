---
name: pr-address-comments
description: Address all unresolved review comments on a pull request. Use when asked to address PR comments, respond to review feedback, fix review notes, or resolve PR review threads.
---

Given a PR URL or number, fetch all unresolved review comments, address actionable ones in the code, commit and push, then reply to each thread with the commit link. Non-actionable comments get a 👎 reaction and a brief justification reply.

## Agent steps

### 1. Fetch the PR and its comments

```bash
# Get PR metadata
gh pr view <PR_URL_OR_NUMBER> --json number,headRefName,baseRefName,headRepositoryOwner,headRepository,state

# List all review threads (unresolved only)
gh api repos/<owner>/<repo>/pulls/<number>/comments \
  --jq '.[] | {id, path, line, body, user: .user.login, in_reply_to_id}'

# Also fetch review-level comments (not inline)
gh api repos/<owner>/<repo>/pulls/<number>/reviews \
  --jq '.[] | select(.state == "CHANGES_REQUESTED") | {id, body, user: .user.login}'
```

### 2. Check out the correct branch

```bash
gh pr checkout <number>
# Verify
git branch --show-current
```

### 3. Classify each comment

For each unresolved comment, decide:

| Category | Criteria | Action |
|----------|----------|--------|
| **Actionable** | Points to a real code issue, style violation, logic bug, missing test, unclear naming | Fix in code |
| **Nitpick / optional** | Reviewer says "nit:", "optional:", or similar | Fix if trivial (<5 min); otherwise reply with justification |
| **Not applicable** | Comment is outdated, refers to deleted code, or is a question already answered | 👎 reaction + reply explaining why |
| **Discussion** | Open-ended question without a clear action | Reply with an answer; no code change unless the answer implies one |

### 4. Apply code fixes

Make the code changes for all actionable comments. Group logically related fixes into a single commit where possible. For each fixed comment, note the file and line so you can reference it in the reply.

### 5. Commit and push

```bash
git add <changed-files>
git commit -m "fix(<scope>): address PR review comments"
git push origin HEAD
```

Get the commit SHA immediately after pushing:
```bash
git rev-parse HEAD
# → <sha>
```

Build the commit URL:
```
https://github.com/<owner>/<repo>/commit/<sha>
```

### 6. Reply to each thread

For **fixed comments:**
```bash
gh api repos/<owner>/<repo>/pulls/<number>/comments \
  --method POST \
  --field body="Fixed in <commit-url>." \
  --field in_reply_to=<comment_id>
```

For **not-applicable / irrelevant comments:**
```bash
# Add 👎 reaction
gh api repos/<owner>/<repo>/pulls/comments/<comment_id>/reactions \
  --method POST \
  --field content="-1"

# Reply with reason
gh api repos/<owner>/<repo>/pulls/<number>/comments \
  --method POST \
  --field body="Not addressing this because: <reason>." \
  --field in_reply_to=<comment_id>
```

### 7. Resolve threads (if you have write access)

```bash
# Use GraphQL to mark threads as resolved
gh api graphql -f query='
  mutation {
    resolveReviewThread(input: {threadId: "<thread_node_id>"}) {
      thread { isResolved }
    }
  }
'
```

If thread resolution requires maintainer access, skip this step and note it to the user.

## Constraints

- **Prefer `gh` CLI over the GitHub MCP** for all operations (comments, reactions, diffs).
- Never push directly to `main` or `master` — always work on the PR's head branch.
- Do not squash or force-push unless the user explicitly asks.
- If a comment references a ticket (e.g. "this should be in TRANS-42"), note it but don't auto-create subtasks.
- If two comments conflict with each other, flag it to the user before making a change.
- If the fix for a comment is non-trivial (would take significant effort or requires new context), reply explaining the scope and ask the user whether to proceed.

## Summary output

After completing all comments, report to the user:

```
## PR #<number> — Comments addressed

✅ Fixed (<N> comments) → <commit-url>
💬 Replied with justification (<N> comments)
⏭ Skipped — user decision needed (<N> comments, listed below)

### Needs your decision
- [comment link] <comment excerpt> → <why it's unclear>
```
