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

2. If `git pull` fails with `fetch-pack: invalid index-pack output` (network/MTU issue), use the SSH clone-replace recovery method:
```bash
# Step A: Clone fresh copy to a sibling folder
cd /Users/litseliu/Documents/Prototypes
git clone git@github.com:wulingteen/arbonova-website.git arbonova_fresh

# Step B: Replace .git directory (preserves untracked local files)
rm -rf /Users/litseliu/Documents/Prototypes/Arbonova_website/.git
cp -r /Users/litseliu/Documents/Prototypes/arbonova_fresh/.git /Users/litseliu/Documents/Prototypes/Arbonova_website/.git

# Step C: Sync new files (excluding untracked local files)
rsync -av --exclude='.git' --exclude='node_modules' \
  /Users/litseliu/Documents/Prototypes/arbonova_fresh/ \
  /Users/litseliu/Documents/Prototypes/Arbonova_website/

# Step D: Cleanup
rm -rf /Users/litseliu/Documents/Prototypes/arbonova_fresh
```

3. If there are merge conflicts after a normal pull, resolve them before proceeding with any edits.

## After Making Changes

4. Stage all changes:
```bash
git add -A
```

5. Commit with a descriptive message:
```bash
git commit -m "<descriptive message>"
```

// turbo
6. Push to remote:
```bash
git push origin main
```

## Important Rules

- **NEVER** skip the pull step. Always pull before editing.
- **ALWAYS** push after committing. Do not leave unpushed commits.
- The remote URL should be SSH: `git@github.com:wulingteen/arbonova-website.git`
- If `git pull` reports conflicts, resolve them first and commit the merge before making new changes.
- If `git push` is rejected (remote has newer commits), pull again, resolve any conflicts, then push.
