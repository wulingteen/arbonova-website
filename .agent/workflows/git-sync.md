---
description: Standard git pull-edit-push workflow to prevent conflicts across multiple machines
---

# Git Sync Workflow

This workflow MUST be followed **every time** before and after modifying any files in this project.

## Before Making Changes

// turbo
1. Pull the latest changes from remote:
```bash
git pull origin main
```

2. If there are merge conflicts, resolve them before proceeding with any edits.

## After Making Changes

3. Stage all changes:
```bash
git add -A
```

4. Commit with a descriptive message:
```bash
git commit -m "<descriptive message>"
```

// turbo
5. Push to remote:
```bash
git push origin main
```

## Important Rules

- **NEVER** skip the pull step. Always pull before editing.
- **ALWAYS** push after committing. Do not leave unpushed commits.
- If `git pull` reports conflicts, resolve them first and commit the merge before making new changes.
- If `git push` is rejected (remote has newer commits), pull again, resolve any conflicts, then push.
