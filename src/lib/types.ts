export interface Problem {
  id: string;
  _id?: string;
  title: string;
  difficulty: string;
  tags: string[];
  slug?: string;
  topic?: string;
  acceptance?: number;
  description: string;
  examples: ProblemExample[];
  constraints: string | string[];
  starterCode?: Record<string, string>;
  starter_code?: Record<string, string>;
  aiPriority?: 'High' | 'Medium' | null;
  aiReason?: string;
  status?: 'solved' | 'attempted' | 'unsolved';
  test_cases?: { input: string; output: string; is_hidden: boolean; _id?: string }[];
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation: string;
  _id?: string;
}

export interface UserProfile {
  id: string;
  _id?: string;        // MongoDB ObjectId from backend
  username: string;
  name?: string;       // display name alias from backend
  email: string;
  avatar: string;
  streak: number;
  xp: number;
  level: string;
  role?: string;       // e.g. "user" | "admin"
  languages?: LanguageProficiency[];
  solvedCount?: number;
  totalAttempts?: number;
}

export interface LanguageProficiency {
  name: string;
  proficiency: number;
}

export interface MistakePattern {
  id: string;
  name: string;
  frequency: number;
  lastSeen: string;
  trend: number[];
  relatedProblems: string[];
  severity: 'high' | 'medium' | 'low';
}

export interface Submission {
  id: string;
  problemId: string;
  problem_id?: string;
  problemTitle: string;
  verdict: string;
  runtime: string;
  memory: string;
  language: string;
  timestamp: string;
  createdAt?: string;
  code: string;
}

export interface LearningPathNode {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
  problemIds: string[];
  x: number;
  y: number;
  connections: string[];
}

export interface MistakeEvent {
  problemId: string;
  mistakeType: string;
  code: string;
  timestamp: string;
  language: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  actionLabel: string;
  actionLink: string;
}

export interface SessionSummary {
  problemId: string;
  duration: number;
  attempts: number;
  verdict: string;
  mistakesDetected: string[];
}

export interface CoachContext {
  recentMistakes: MistakePattern[];
  personalizedTips: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface TestResult {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export interface Boss {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hp: number;
  hpRemaining: number;
  timeLeft: { days: number; hours: number; minutes: number };
  rewards: string[];
  topContributors: Contributor[];
  problem: {
    id: string;
    title: string;
    tags: string[];
  };
}

export interface Contributor {
  rank: number;
  username: string;
  hits: number;
  avatar: string;
  isYou?: boolean;
}

export interface SkillNode {
  id: string;
  title: string;
  icon: string;
  status: 'locked' | 'available' | 'in-progress' | 'mastered';
  xpRequired: number;
  xpEarned: number;
  prerequisites: string[];
  problemCount: number;
  description: string;
  tier: number;
}

export interface StreakActivity {
  date: string;
  solved: number;
  frozen: boolean;
}

export interface TestCaseResult {
  testCase?: string | number;
  passed: boolean;
  actual?: string;
  expected?: string;
  input?: string;
}

export interface JudgeResponse {
  verdict: string;
  testResults?: TestCaseResult[];
  runtime?: string;
  memory?: string;
  error?: string;
}

export interface CoachResponse {
  message?: string;
  response?: string;
  data?: { message?: string };
  redirect_to_hint_gate?: boolean;
}
