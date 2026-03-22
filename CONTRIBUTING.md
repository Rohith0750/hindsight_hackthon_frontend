# CONTRIBUTING.md

## 🚀 Setup

1. **Clone the Main Repository**
   ```bash
   https://github.com/GauravKesh/hindsight_hackathon.git
   cd hindsight_hackathon
   ```

* ❌ **No fork required**
* ❌ **No upstream setup needed**

---

## 🌿 Branching Strategy

### ⚠️ Rules
* ❌ **Do NOT push to `main`**
* ❌ **Do NOT use `feat/<name>`**
* ✅ **Use your username as the branch name**

```bash
git checkout -b <your-username>
```

---

## 🧪 Local Compatibility Branch (MANDATORY)

1. **Create the local branch:**
   ```bash
   git checkout -b <your-username>-local
   ```
2. **Sync with latest `main`:**
   ```bash
   git checkout main
   git pull origin main
   ```
3. **Merge into local branch:**
   ```bash
   git checkout <your-username>-local
   git merge main
   ```
4. **Test and merge back:**
   ```bash
   git checkout <your-username>
   git merge <your-username>-local
   ```

> [!CAUTION]
> **Never** create a Pull Request (PR) from the `-local` branch.

---

## 🔄 Sync Before Push (MANDATORY)

Keep your branch up to date with the latest changes:

```bash
git checkout main
git pull origin main
git checkout <your-username>
git merge main
```

### 💾 Stash (Optional)
If you have uncommitted changes while switching branches:
```bash
git stash -u
git stash pop
```

---

## 💻 Workflow Summary

1.  **Create branch** (`<your-username>`)
2.  **Make changes**
3.  **Create local branch** (`-local`)
4.  **Merge latest main**
5.  **Test everything**
6.  **Merge back** to your username branch
7.  **Push & create PR**

---

## 📤 Push

```bash
git add .
git commit -m "feat: <message>"
git push origin <your-username>
```

---

## 🔀 Pull Request

* **Target:** `PR` → `main`
* **Include in Description:**
    * **What** changed
    * **Why** it changed

---

## 🧹 Commit Convention

| Prefix | Description |
| :--- | :--- |
| `feat:` | Add a new feature |
| `fix:` | Resolve a bug |
| `doc:` | Update documentation |

---

## ⚠️ Final Rules
* ❌ **No direct push to `main`.**
* ❌ **No PR from `-local` branches.**
* ✅ **Always sync with the latest `main`.**
* ✅ **Only push code that has been tested.**

---

## 🛠️ Troubleshooting

### ❌ Error: "untracked working tree files would be overwritten by merge"

**What it means:** You have files in your local working directory that are not committed (untracked), and the remote branch has added those same files. Git refuses to pull because it would silently delete your local copies.

**Example error:**
```
error: The following untracked working tree files would be overwritten by merge:
        src/app/(dashboard)/gamification/boss-battle/page.tsx
        src/app/(dashboard)/gamification/interview-sim/page.tsx
        src/app/(dashboard)/gamification/skill-tree/page.tsx
        src/app/(dashboard)/gamification/streaks/page.tsx
Please move or remove them before you merge.
Aborting
```

**How to fix it:**

**Option A — You don't need your local copies (safe to discard):**
```bash
# Remove the untracked files listed in the error, then pull
git checkout main
git clean -fd -- "src/app/(dashboard)/gamification/"
git pull origin main
```

**Option B — You want to keep your local changes:**
```bash
# Stash ALL untracked and modified files first, then pull, then restore
git stash -u
git pull origin main
git stash pop
```
> After `git stash pop`, manually merge any conflicts between your local changes and the pulled version.

**Option C — Move your files and merge manually:**
```bash
# Copy your files to a safe location outside the repo, pull, then merge manually
cp -r "src/app/(dashboard)/gamification/" /tmp/my-gamification-backup/
git pull origin main
# Now manually merge your changes from /tmp/my-gamification-backup/ into the pulled files
```

**Prevention:** Always run `git status` before starting work and commit or stash any local changes before pulling updates from `main`.
