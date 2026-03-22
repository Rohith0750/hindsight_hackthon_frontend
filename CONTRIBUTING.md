# Contributing to Hindsight

Thank you for your interest in contributing to **Hindsight**! We welcome contributions from developers, designers, and enthusiasts who want to help improve this AI-powered learning platform.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Branching Strategy](#-branching-strategy)
- [Making Changes](#-making-changes)
- [Commit Guidelines](#-commit-guidelines)
- [Submitting a Pull Request](#-submitting-a-pull-request)
- [Code Style Guide](#-code-style-guide)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Features](#-suggesting-features)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful, constructive, and professional in all interactions.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Git
- GitHub account
- MongoDB Atlas account (for backend development)
- OpenAI API key (for AI features)

### Clone the Repository

**For the Frontend:**
```bash
git clone https://github.com/Rohith0750/hindsight_hackthon_frontend.git
cd hindsight_hackthon_frontend
```

**For the Backend:**
```bash
git clone https://github.com/Rohith0750/hindsight_hackthon_backend.git
cd hindsight_hackthon_backend
```

---

## 🛠️ Development Setup

### Frontend Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Backend runs on [http://localhost:5000](http://localhost:5000) by default.

---

## 🌿 Branching Strategy

### Branch Naming Conventions

Use descriptive branch names following this pattern:

```
<type>/<feature-name>
```

**Valid types:**
- `feat/` — New feature
- `fix/` — Bug fix
- `docs/` — Documentation
- `refactor/` — Code refactoring
- `test/` — Tests
- `chore/` — Maintenance tasks
- `perf/` — Performance improvements

**Examples:**
```bash
git checkout -b feat/smart-hint-system
git checkout -b fix/memory-persistence-issue
git checkout -b docs/api-endpoints
```

### Branch Rules

✅ **Do:**
- Create branches from `main`
- Use lowercase, hyphenated names
- Be descriptive and concise

❌ **Don't:**
- Push directly to `main`
- Use `feat/<name>` for all branches
- Use uppercase or underscores

---

## 💻 Making Changes

1. **Create and checkout your branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** and commit regularly (see [Commit Guidelines](#-commit-guidelines))

3. **Keep your branch up to date:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. **Test your changes thoroughly:**
   - Frontend: `npm run dev` and test in browser
   - Backend: `npm run dev` and test with API client
   - Run linting: `npm run lint`

---

## 📝 Commit Guidelines

Write clear, descriptive commit messages following the **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```bash
# Simple commit
git commit -m "feat(mentor): add adaptive hint generation"

# Detailed commit
git commit -m "fix(memory): resolve session data persistence issue

- Added proper MongoDB transaction handling
- Implemented retry logic for failed writes
- Updated schema validation

Fixes #42"
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **test**: Adding or updating tests
- **refactor**: Code restructuring without behavior changes
- **perf**: Performance improvements
- **chore**: Maintenance, dependencies, etc.
- **style**: Code formatting (linting)

---

## 🔀 Submitting a Pull Request

### Before Creating a PR

1. ✅ Ensure all tests pass: `npm test`
2. ✅ Run linting: `npm run lint`
3. ✅ Update documentation if needed
4. ✅ Verify your changes work locally
5. ✅ Keep commits clean and descriptive

### Creating a Pull Request

1. **Push your branch:**
   ```bash
   git push origin feat/your-feature-name
   ```

2. **Open a PR on GitHub** with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to related issues (use `Fixes #42`)
   - Screenshots (if UI changes)

3. **PR Template:**
   ```markdown
   ## Description
   Brief description of the changes.

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tested locally
   - [ ] All tests passing
   - [ ] No new warnings

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-reviewed my code
   - [ ] Comments added for complex logic
   - [ ] Documentation updated
   ```

### PR Review Process

- Maintainers will review your PR
- Address feedback and update your PR as needed
- Once approved, your PR will be merged
- Delete your branch after merging

---

## 📐 Code Style Guide

### Frontend (TypeScript/React)

```typescript
// Use TypeScript types
const getUserData = (userId: string): Promise<User> => {
  // ...
};

// React component naming
const UserDashboard: React.FC<DashboardProps> = ({ data }) => {
  return <div>{/* component content */}</div>;
};

// Hooks before jsx
const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  // ...
};
```

### Backend (TypeScript/Node.js)

```typescript
// Clear naming and typing
interface HintRequest {
  userId: string;
  problemId: string;
  attemptCount: number;
}

// Error handling
export const generateHint = async (req: HintRequest): Promise<string> => {
  try {
    // implementation
  } catch (error) {
    console.error('Hint generation failed:', error);
    throw new Error('Failed to generate hint');
  }
};
```

### General Guidelines

- 👁️ **Readability**: Write code others can easily understand
- 📝 **Comments**: Explain "why" not "what" (code shows what)
- 📏 **Line Length**: Keep lines under 100 characters
- 🎯 **Functions**: Keep them small and focused
- 🧪 **Tests**: Write tests for critical logic
- 📦 **Imports**: Organize imports alphabetically

### Formatting

- Use 2-space indentation
- Use semicolons (no ASI)
- Use single quotes for strings
- Use `const` by default, `let` when needed

---

## 🐛 Reporting Bugs

### Bug Report Template

When reporting a bug, include:

```markdown
## Description
Clear description of the bug.

## Steps to Reproduce
1. Step 1
2. Step 2
3. ...

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: (e.g., Windows, macOS, Linux)
- Node.js version
- Browser (if frontend issue)

## Screenshots
If applicable, add screenshots or videos.
```

---

## 💡 Suggesting Features

### Feature Request Template

When suggesting a feature, include:

```markdown
## Feature Description
What feature would you like?

## Use Case
Why would this be useful?

## Proposed Solution
How should it work?

## Alternative Solutions
Any other approaches?

## Additional Context
Any other relevant info?
```

---

## 📚 Additional Resources

- [Frontend Repository](https://github.com/Rohith0750/hindsight_hackthon_frontend)
- [Backend Repository](https://github.com/Rohith0750/hindsight_hackthon_backend)
- [Documentation](README.md)
- [Issues](https://github.com/Rohith0750/hindsight_hackthon_frontend/issues)

---

## ❓ Questions?

Have questions? Open an issue or reach out to the maintainers:
- 📧 Email: [your-email@example.com]
- 💬 GitHub Issues: Ask your question in the appropriate repository

---

**Thank you for contributing to Hindsight! Your efforts help make learning smarter. 🎉**
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
