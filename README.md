# Hindsight — AI Mentor with Hindsight Memory & Smart Hint System

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Hindsight-blue?logo=github&style=flat-square)](https://github.com/Rohith0750)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js-black?style=flat-square&logo=next.js)](https://github.com/Rohith0750/hindsight_hackthon_frontend)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green?style=flat-square&logo=node.js)](https://github.com/Rohith0750/hindsight_hackthon_backend)

**An intelligent AI learning mentor that remembers your mistakes and adapts hints over time** 🧠✨

</div>

---

## 📋 Table of Contents

- [About Hindsight](#-about-hindsight)
- [Core Features](#-core-features)
- [How Hindsight Works](#-how-hindsight-works)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [API Endpoints](#-api-endpoints)
- [Hindsight Memory Model](#-hindsight-memory-model)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Example Flow](#-example-flow)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🎯 About Hindsight

**Hindsight** is an AI-powered learning mentor that revolutionizes how students learn by incorporating adaptive, personalized hints. Unlike traditional tutoring systems that provide generic guidance, Hindsight:

✅ **Observes** user problem-solving attempts  
✅ **Tracks** mistakes and learning patterns  
✅ **Stores** hint usage history  
✅ **Remembers** past sessions and context  
✅ **Improves** hints based on failures  
✅ **Prevents** generic, unhelpful suggestions  
✅ **Provides** contextual, intelligent guidance  

### 🧠 The Hindsight Learning Engine

The core innovation of Hindsight is its **Hindsight Learning Engine** — a system that learns from past interactions:

```
Hints Taken → Stored
     ↓
Mistakes Logged → Analyzed
     ↓
Language Preference → Tracked
     ↓
Session Summaries → Generated
     ↓
Next Hints → Become Smarter
     ↓
Mentor Adapts → Based on Past Failures
```

This creates a virtuous cycle where every failed attempt makes the next hint more effective and personalized.

---

## ⭐ Core Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Mentor Chat** | Real-time conversational learning with intelligent responses |
| 🧠 **Hindsight Memory Engine** | Persistent learning memory that adapts to user patterns |
| 💡 **Smart Hint System** | Progressive, context-aware hints that improve over time |
| 📊 **Session Tracking** | Complete records of learning sessions and progress |
| ❌ **Mistake Detection** | Automatic analysis of errors and misconceptions |
| 🎯 **Context-Aware Hints** | Hints tailored to user's specific failure patterns |
| 🔀 **Progressive Hint Gating** | Structured hints that reveal information gradually |
| 📈 **Learning Adaptation** | AI model adapts based on historical learning patterns |
| 📝 **Attempt Analysis** | Deep analysis of submitted attempts and solutions |
| 💬 **Structured Feedback** | Organized, actionable feedback for each attempt |
| ⚡ **Real-Time Mentor Response** | Instant guidance without delays |
| 💾 **Persistent Learning Memory** | All learning data stored securely for future sessions |

---

## 🔄 How Hindsight Works

### Step-by-Step Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Submits Attempt                      │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend Analyzes Attempt                        │
│         (Format, Logic, Edge Cases, Performance)             │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│            AI Generates Contextual Hint                      │
│      (Using Hindsight Memory + Current Context)              │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│         Hint Usage Stored in Memory                          │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Mistake Logged & Analyzed                       │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│         Session Summary Generated                            │
│     (Concepts Covered, Mistakes, Progress)                   │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│       Hindsight Memory Updated                               │
│  (Patterns Identified, Next Hints Become Smarter)            │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│        Response Sent to Frontend                             │
│    (Hint + Feedback + Encouragement)                         │
└─────────────────────────────────────────────────────────────┘
```

### What Hindsight Remembers

Hindsight improves by remembering:

- 📌 **Hints Taken** — What guidance has been provided before
- ❌ **Wrong Answers** — Previous failed attempts and solutions
- 🗣️ **Learning Language** — User's preferred explanation style
- 📊 **Difficulty Level** — Appropriate challenge progression
- 🔗 **Concept Failure Patterns** — Which topics the user struggles with
- ⏱️ **Timestamps** — When concepts were learned for spaced repetition

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│         FRONTEND (Next.js + React + TypeScript)         │
│  • UI Components  • State Management  • Chat Interface  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│     BACKEND (Node.js + Express + REST APIs)             │
│  • Request Handling  • Authentication  • Routing        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│         HINDSIGHT ENGINE                                │
│  • Hint Generation • Memory Processing                  │
│  • Mistake Analysis • Context Building                  │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
  ┌──────────┐  ┌────────────┐  ┌──────────┐
  │ MongoDB  │  │ AI Model   │  │ Session  │
  │  Memory  │  │(OpenAI)    │  │  Store   │
  │  Store   │  │            │  │          │
  └──────────┘  └────────────┘  └──────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14+ with React 18+
- **Language:** TypeScript / JavaScript
- **Styling:** Tailwind CSS
- **State Management:** React Context + Hooks
- **UI Components:** Shadcn/ui
- **Icons:** Lucide Icons

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript / JavaScript
- **API Style:** REST with JSON
- **Middleware:** Express middleware for logging, CORS, authentication

### AI & NLP
- **LLM:** OpenAI API (GPT-4 / GPT-3.5)
- **Prompt Engineering:** Custom prompts for hint generation
- **Context Processing:** Hindsight memory integration
- **Response Generation:** Streaming responses for real-time feedback

### Database
- **Primary:** MongoDB (Atlas)
- **Collections:** Users, Sessions, Hints, Mistakes, Memory Store
- **Indexing:** Optimized queries for user lookups and session retrieval

### Deployment
- **Frontend:** Vercel
- **Backend:** Render / Railway / Heroku
- **Database:** MongoDB Atlas (Cloud)

---

## 🔌 API Endpoints

### Core Endpoints

#### 1. **POST /api/mentor**
Send a problem or question to the AI mentor

**Request:**
```json
{
  "userId": "user123",
  "attemptCode": "def binary_search(arr, target):\n    return -1",
  "problemId": "binary-search-101",
  "language": "python",
  "previousHints": ["Think about divide and conquer"]
}
```

**Response:**
```json
{
  "hint": "Try comparing the target with the middle element of the array",
  "hintLevel": 2,
  "encouragement": "You're on the right track!",
  "mistakeDetected": "Off-by-one error in loop boundary"
}
```

---

#### 2. **POST /api/hint**
Get a progressive hint for a specific problem

**Request:**
```json
{
  "userId": "user123",
  "problemId": "binary-search-101",
  "attemptCount": 3,
  "hintPreference": "detailed"
}
```

**Response:**
```json
{
  "hint": "Consider using two pointers (left and right)...",
  "suggestedApproach": "Two-pointer technique",
  "resources": ["binary-search-tutorial.md"],
  "nextStepHint": "What happens when left > right?"
}
```

---

#### 3. **POST /api/attempt**
Submit a problem attempt for analysis

**Request:**
```json
{
  "userId": "user123",
  "problemId": "binary-search-101",
  "submittedCode": "def binary_search(arr, target):\n    left, right = 0, len(arr)-1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
  "language": "python",
  "testResults": { "passed": 8, "failed": 2 }
}
```

**Response:**
```json
{
  "result": "Partial Success",
  "feedback": "Good logic, but check edge cases with empty arrays",
  "mistakesFound": ["didnt_handle_empty_array", "logic_overflow"],
  "nextProblem": "binary-search-advanced-202",
  "hindsightMemoryUpdated": true
}
```

---

#### 4. **GET /api/session/:userId**
Retrieve user's current session data

**Response:**
```json
{
  "sessionId": "session-abc123",
  "userId": "user123",
  "startTime": "2025-03-20T10:30:00Z",
  "problemsSolved": 5,
  "mistakesLogged": 12,
  "hintsUsed": 8,
  "estimatedMastery": 0.72,
  "learningPath": ["array-basics", "binary-search", "dynamic-programming"],
  "sessionSummary": {
    "topicsLearned": ["binary search", "two-pointer technique"],
    "weakAreas": ["edge case handling"],
    "progressScore": 78
  }
}
```

---

#### 5. **POST /api/summary**
Generate session summary and update Hindsight memory

**Request:**
```json
{
  "userId": "user123",
  "sessionId": "session-abc123",
  "endTime": "2025-03-20T11:45:00Z"
}
```

**Response:**
```json
{
  "summary": {
    "duration": 75,
    "problemsAttempted": 5,
    "successRate": 0.80,
    "topicsLearned": ["binary search", "pointers"],
    "mistakePatterns": ["off-by-one errors"],
    "nextSessionRecommendations": ["practice edge cases", "dynamic programming intro"]
  },
  "hindsightMemoryUpdated": true,
  "nextHintOptimization": "Will adapt hints to focus on edge case handling"
}
```

---

## 🧠 Hindsight Memory Model

The heart of Hindsight is its intelligent memory system that learns from every interaction:

### Memory Document Schema

```typescript
interface HindsightMemory {
  userId: string;
  sessions: SessionRecord[];
  mistakePatterns: {
    conceptId: string;
    mistakeType: string;
    frequency: number;
    lastOccurred: Date;
  }[];
  hintHistory: {
    attemptNumber: number;
    hint: string;
    effective: boolean;
    mistakeResolved: boolean;
  }[];
  learningProfile: {
    preferredLanguage: "detailed" | "concise" | "visual";
    conceptMastery: Record<string, number>; // 0-1 score
    difficultyLevel: "beginner" | "intermediate" | "advanced";
    learningStyle: string;
  };
  sessionSummaries: {
    date: Date;
    conceptsLearned: string[];
    mistakesFaced: string[];
    hintsUtilized: number;
    sessionNotes: string;
  }[];
}

interface SessionRecord {
  sessionId: string;
  startTime: Date;
  endTime: Date;
  problemsAttempted: number;
  mistakesLogged: string[];
  hintsUsed: string[];
  conceptsCovered: string[];
  languagePreference: string;
  difficulty: string;
  timestamp: Date;
}
```

### How Memory Improves Hints

1. **Previous Mistakes** → Avoid giving hints about already-mastered concepts
2. **Hint Effectiveness** → Refine language based on what worked before
3. **Learning Patterns** → Recognize when users are ready for advanced topics
4. **Preference Learning** → Adjust hint detail level based on user feedback
5. **Concept Mastery** → Track progress on individual concepts

---

## 🚀 Installation

### Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB Atlas account
- OpenAI API key
- Git

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Rohith0750/hindsight_hackthon_frontend.git
cd hindsight_hackthon_frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Rohith0750/hindsight_hackthon_backend.git
cd hindsight_hackthon_backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the server
npm start
```

Backend runs on [http://localhost:5000](http://localhost:5000) by default.

---

## ⚙️ Environment Variables

### Frontend (`.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Hindsight

# Auth
NEXT_PUBLIC_AUTH_PROVIDER=jwt

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=
```

### Backend (`.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hindsight

# AI/LLM
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

---

## 📦 Deployment

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables via Vercel Dashboard
# - NEXT_PUBLIC_API_URL=<backend-url>
```

Or connect GitHub repo to Vercel for auto-deployment.

### Deploy Backend to Render

1. **Create Render Account** → https://render.com
2. **Connect GitHub Repository**
3. **Create New Web Service**
4. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables** in Render Dashboard
6. **Deploy**

### MongoDB Atlas Setup

1. Create cluster on MongoDB Atlas
2. Create database user with strong password
3. Whitelist IP addresses
4. Copy connection string
5. Set `MONGO_URI` in backend `.env`

---

## 📚 Example Flow

### Scenario: User Learning Binary Search

**Session Start**
```
User: "I'm learning binary search, but I keep getting wrong answers"
```

**Attempt 1 - Generic Hint**
```
Hindsight Memory: (Empty)
AI Hint: "Think about dividing the search space in half"
Result: Still incorrect
```

**Attempt 2 - Improved Hint**
```
Hindsight Memory: (Recorded: missed middle element logic)
AI Hint: "You're close, but focus on calculating the middle index correctly: mid = (left + right) // 2"
Result: Still incorrect
```

**Attempt 3 - Context-Aware Hint**
```
Hindsight Memory: (Recorded: off-by-one error pattern)
AI Hint: "I noticed you're struggling with boundary conditions. 
         Try this: ensure your loop continues while left <= right, 
         not just left < right"
Result: ✅ Correct!
```

**Next Session (1 Week Later)**
```
User: "I want to practice binary search variants"
Hindsight Memory: (Remembers: previous off-by-one errors)

AI directly gives:
"Great! Since you've mastered the core concept last week, 
 let's focus on boundary conditions which were tricky before. 
 Here's a problem requiring careful edge case handling..."
```

---

## 📸 Screenshots

![Dashboard Placeholder](1.jpeg)
*AI Mentor chat, problem list, and learning progress tracking*

![Hint System Placeholder](h2.jpeg)
*Progressive hints and real-time feedback*

![Memory System Placeholder](h3.jpeg)
*Learning patterns and mistake analysis*

![Analytics Placeholder](h4.jpeg)
*Progress tracking and performance metrics*

---

## 🚀 Future Improvements

- [ ] **Difficulty Adaptation** — Automatically adjust problem difficulty based on performance
- [ ] **Learning Path Generation** — AI-generated personalized learning paths
- [ ] **Student Progress Dashboard** — Comprehensive analytics and insights
- [ ] **Weak Area Detection** — Automatic identification of struggle areas
- [ ] **Multi-User Support** — Group learning and peer collaboration
- [ ] **Teacher Analytics** — Insights for educators tracking student progress
- [ ] **Mobile App** — React Native app for iOS/Android
- [ ] **Voice-Based Hints** — Audio explanations for auditory learners
- [ ] **Gamification** — Points, badges, and leaderboards
- [ ] **Multi-Language Support** — Support for multiple programming languages and natural languages
- [ ] **Code Review Integration** — Real-time code quality feedback
- [ ] **Collaborative Learning** — Pair programming and group sessions

---

##  License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project for both personal and commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📧 Support

For issues, questions, or suggestions:

- **Open an Issue** on GitHub
- **Email:** [rohithsd0222@gmail.com]


---

<div align="center">

**Made with ❤️ by Rohith S D**

⭐ Star us on GitHub if you find Hindsight helpful!

</div>
