"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useProblem } from "@/hooks/useProblems";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useAuth } from "@/hooks/useAuth";
import { useAICoach } from "@/hooks/useAICoach";
import { api } from "@/lib/api-client";
import { hindsightClient } from "@/lib/hindsight";
import type { Submission, TestCaseResult, Problem } from "@/lib/types";
import {
  Play,
  Terminal,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Loader2,
  BookOpen,
  Code2,
  Lightbulb,
  ArrowLeft,
  Send,
  MessageSquare,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";

/* ─── Types ─────────────────────────────────────────────────────── */
type Language = "python" | "javascript" | "cpp" | "java";
type Tab = "description" | "hints" | "submissions" | "mentor";

/* ─── Constants ──────────────────────────────────────────────────── */
const LANGUAGES: { value: Language; label: string; monacoLang: string }[] = [
  { value: "python", label: "Python 3", monacoLang: "python" },
  { value: "javascript", label: "JavaScript", monacoLang: "javascript" },
  { value: "cpp", label: "C++17", monacoLang: "cpp" },
  { value: "java", label: "Java", monacoLang: "java" },
];

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  easy: { label: "Easy", color: "#00b8a3" },
  medium: { label: "Medium", color: "#ffa116" },
  hard: { label: "Hard", color: "#ff375f" },
};

/* ─── Generic fallback starter code ─────────────────────────────── */
const getFallbackCode = (lang: Language): string => {
  switch (lang) {
    case "python":
      return `def solution():\n    # write your code\n    pass\n`;
    case "javascript":
      return `function solution() {\n    // write your code\n}\n`;
    case "cpp":
      return `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // write your code\n    return 0;\n}\n`;
    case "java":
      return `class Solution {\n    public void solve() {\n        // write your code\n    }\n}\n`;
  }
};

/**
 * Resolve starter code: prefer backend's starter_code for the given language,
 * fall back to a generic template.
 */
const resolveStarterCode = (problem: Problem | undefined, lang: Language): string =>
  problem?.starter_code?.[lang] ?? getFallbackCode(lang);

/* ─── Helpers ────────────────────────────────────────────────────── */
const normaliseConstraints = (raw?: string | string[]): string[] => {
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
};

/* ─── Sub-components ─────────────────────────────────────────────── */
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const cfg = DIFFICULTY_CONFIG[difficulty?.toLowerCase()] ?? DIFFICULTY_CONFIG.medium;
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, background: `${cfg.color}1a` }}
    >
      {cfg.label}
    </span>
  );
}

function TagChip({ tag }: { tag: string }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-[#2d2d2d] text-[#a0a0a0] font-medium border border-[#3a3a3a]">
      {tag}
    </span>
  );
}

function ExampleBlock({ input, output, index }: { input: string; output: string; index: number }) {
  return (
    <div className="rounded-lg overflow-hidden border border-[#2d2d2d] text-sm font-mono">
      <div className="px-3 py-1.5 bg-[#1e1e1e] text-[#737373] text-xs font-sans font-medium">
        Example {index + 1}
      </div>
      <div className="px-4 py-3 bg-[#191919] space-y-1.5">
        <div>
          <span className="text-[#737373]">Input:{"  "}</span>
          <span className="text-[#e0e0e0]">{input}</span>
        </div>
        <div>
          <span className="text-[#737373]">Output: </span>
          <span className="text-[#e0e0e0]">{output}</span>
        </div>
      </div>
    </div>
  );
}

interface HintGateState {
  status: 'initial' | 'loading' | 'active' | 'unlocked';
  questions: string[];
  passed: boolean[];
  feedback: string;
  hint: string;
}

interface HintGateViewProps {
  state: HintGateState;
  onRequest: () => void;
  onSubmitAnswer: (qIdx: number, answer: string) => void;
  answering: boolean;
}

function HintGateView({ state, onRequest, onSubmitAnswer, answering }: HintGateViewProps) {
  const [currentAnswer, setCurrentAnswer] = useState('');

  if (state.status === 'initial') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[#a0a0a0]">Stuck? Earn a hint by demonstrating your understanding of the concepts.</p>
        <button
          onClick={onRequest}
          className="w-full py-2 bg-[#ffa116] hover:bg-[#ffb84d] text-[#0f0f0f] rounded-md text-sm font-semibold transition-all"
        >
          Request Hint Gate
        </button>
      </div>
    );
  }

  if (state.status === 'loading') {
    return (
      <div className="flex flex-col items-center py-8 gap-3">
        <Loader2 className="animate-spin text-[#ffa116]" size={24} />
        <p className="text-sm text-[#737373]">Opening the gate...</p>
      </div>
    );
  }

  if (state.status === 'unlocked') {
    return (
      <div className="p-4 rounded-lg bg-[#1a2e1a] border border-[#2d5a2d] text-[#4ec94e] text-sm space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <CheckCircle2 size={16} />
          Hint Unlocked!
        </div>
        <p>Well done! You have proven your understanding. Here is your hint:</p>
        <div className="p-4 bg-[#0f0f0f] border border-[#2d5a2d] rounded-md text-white italic font-serif">
          &ldquo;{state.hint || 'No hint available'}&rdquo;
        </div>
        <p className="text-xs text-[#737373]">You can also ask the Mentor for more details in the chat.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-[#737373] italic">&ldquo;{state.feedback}&rdquo;</p>
      {state.questions.map((q: string, i: number) => (
        <div key={i} className={`p-4 rounded-lg border ${state.passed[i] ? 'bg-[#1a2e1a] border-[#2d5a2d]' : 'bg-[#1a1a1a] border-[#2a2a2a]'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">Concept Question {i + 1}</span>
            {state.passed[i] && <CheckCircle2 size={14} className="text-[#4ec94e]" />}
          </div>
          <p className="text-sm text-white mb-4">{q}</p>
          {!state.passed[i] && (
            <div className="space-y-3">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your explanation here..."
                className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-md p-3 text-sm focus:outline-none focus:border-[#ffa116] min-h-[80px]"
              />
              <button
                onClick={() => {
                  onSubmitAnswer(i, currentAnswer);
                  if (state.passed[i]) setCurrentAnswer('');
                }}
                disabled={answering || !currentAnswer.trim()}
                className="px-4 py-2 bg-[#2d2d2d] hover:bg-[#3a3a3a] text-white rounded-md text-xs font-semibold disabled:opacity-50"
              >
                {answering ? <Loader2 size={12} className="animate-spin" /> : 'Submit Answer'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TestResultRow({ result }: { result: TestCaseResult & { id?: string; actualOutput?: string } }) {
  const passed: boolean = result.passed;
  return (
    <div
      className={`flex items-start gap-3 rounded-lg p-3 text-sm border ${passed
        ? "bg-[#1a2e1a] border-[#2d5a2d] text-[#4ec94e]"
        : "bg-[#2e1a1a] border-[#5a2d2d] text-[#ff6b6b]"
        }`}
    >
      {passed ? (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
      ) : (
        <XCircle size={16} className="mt-0.5 shrink-0" />
      )}
      <div className="flex-1 font-mono">
        <div className="font-sans font-semibold mb-1">
          {passed
            ? "Accepted"
            : result.id === "submit"
              ? result.actualOutput
              : "Wrong Answer"}
        </div>
        {result.actualOutput && result.id !== "submit" && (
          <div className="text-[#a0a0a0] text-xs mt-0.5">Output: {result.actualOutput}</div>
        )}
        {result.expected && (
          <div className="text-[#737373] text-xs mt-0.5">Expected: {result.expected}</div>
        )}
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function EditorPage() {
  const params = useParams();
  const slug = params?.id as string;
  const router = useRouter();

  const { data: problem, isLoading } = useProblem(slug);
  const { user } = useAuth();
  const problemIdForCoach = problem?.id || problem?._id || '';
  const { messages, sendMessage, isLoading: aiLoading } = useAICoach(problemIdForCoach, user?.id || '');
  const { data: pastSubmissions } = useSubmissions(problemIdForCoach);

  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [testResults, setTestResults] = useState<(TestCaseResult & { id?: string; actualOutput?: string })[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [answeringHint, setAnsweringHint] = useState(false);
  const [hintGate, setHintGate] = useState<{
    status: 'initial' | 'loading' | 'active' | 'unlocked';
    questions: string[];
    passed: boolean[];
    feedback: string;
    hint: string;
  }>({
    status: 'initial',
    questions: [],
    passed: [false, false],
    feedback: '',
    hint: ''
  });

  /* Scroll chat to bottom */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Start session on mount */
  useEffect(() => {
    if (problem && user) {
      const problemId = problem.id || problem._id || '';
      api.startSession(user.id, problemId, problem.title, problem.topic || 'General Problem Solving')
        .catch(err => console.error('Failed to start session:', err));
    }
  }, [problem, user]);

  /* Load starter code whenever language or problem changes */
  useEffect(() => {
    setCode(resolveStarterCode(problem, language));
  }, [problem, language]);

  const handleRequestHintGate = useCallback(async () => {
    const problemId = problem?.id || problem?._id || '';
    if (!user || !problemId) return;
    setHintGate((s) => ({ ...s, status: 'loading' }));
    try {
      const res = await api.requestHintGate(user.id, problem?.title || 'General Problem', problem?.topic || 'General');
      setHintGate({
        status: 'active',
        questions: res.questions,
        passed: [false, false],
        feedback: res.message,
        hint: ''
      });
    } catch {
      setHintGate((s) => ({ ...s, status: 'initial', feedback: 'Failed to open hint gate.' }));
    }
  }, [problem, user]);

  const handleSubmitHintAnswer = useCallback(async (qIdx: number, answer: string) => {
    const problemId = problem?.id || problem?._id || '';
    if (!user || !problemId) return;
    setAnsweringHint(true);
    try {
      const res = await api.submitHintAnswer(user.id, qIdx, answer);
      const newPassed = [...hintGate.passed];
      newPassed[qIdx] = res.passed;

      setHintGate((s) => ({
        ...s,
        status: res.hint_unlocked ? 'unlocked' : 'active',
        passed: newPassed,
        feedback: res.feedback,
        hint: res.hint || s.hint
      }));
    } finally {
      setAnsweringHint(false);
    }
  }, [problem, user, hintGate.passed]);

  /**
   * Only show languages that the backend actually provides starter_code for.
   * Falls back to the full list when starter_code is absent (e.g. during load).
   */
  const availableLanguages = problem?.starter_code
    ? LANGUAGES.filter((l) => l.value in (problem.starter_code!))
    : LANGUAGES;

  const monacoLang = LANGUAGES.find((l) => l.value === language)?.monacoLang ?? language;

  /* ── Run ────────────────────────────────────────────────────────── */
  const handleRun = useCallback(async () => {
    if (!code || code.trim() === "" || code.trim() === "pass") {
      setConsoleOpen(true);
      setTestResults([{ id: 'error', passed: false, actualOutput: 'Code cannot be empty or just "pass"' }]);
      return;
    }
    setRunning(true);
    setConsoleOpen(true);
    setTestResults([]);
    try {
      const problemId = problem?.id || problem?._id || '';
      const res = await api.submitCode(problemId, code, language, user?.id, true);

      if (res.testResults) {
        setTestResults(res.testResults.map((r: TestCaseResult) => ({
          id: `test-${r.testCase}`,
          passed: r.passed,
          actualOutput: r.actual,
          expected: r.expected,
          input: r.input
        })));
      } else {
        setTestResults([{ id: "run", actualOutput: res.verdict, passed: res.verdict === "accepted" || res.verdict === "Accepted" }]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResults([{ id: 'error', passed: false, actualOutput: msg }]);
    } finally {
      setRunning(false);
    }
  }, [code, language, problem, user]);

  /* ── Submit ─────────────────────────────────────────────────────── */
  const handleSubmit = useCallback(async () => {
    if (!problem) return;
    if (!code || code.trim() === "" || code.trim() === "pass") {
      setConsoleOpen(true);
      setTestResults([{ id: 'error', passed: false, actualOutput: 'Please write a solution before submitting' }]);
      return;
    }
    setSubmitting(true);
    setConsoleOpen(true);
    setTestResults([]);
    try {
      const problemId = problem.id || problem._id || '';
      const res = await api.submitCode(problemId, code, language, user?.id);

      const accepted = res.verdict === "accepted" || res.verdict === "Accepted";
      if (res.testResults) {
        setTestResults(res.testResults.map((r: TestCaseResult) => ({
          id: `test-${r.testCase}`,
          passed: r.passed,
          actualOutput: r.actual,
          expected: r.expected,
          input: r.input
        })));
      } else {
        setTestResults([{ id: "submit", actualOutput: res.verdict, passed: accepted }]);
      }

      if (!accepted) {
        await hindsightClient.storeMistake(user?.id ?? "", {
          problemId: problemId,
          mistakeType: res.verdict,
          code,
          timestamp: new Date().toISOString(),
          language,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResults([{ id: 'error', passed: false, actualOutput: msg }]);
    } finally {
      setSubmitting(false);
    }
  }, [problem, code, language, user]);

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const content = chatInput;
    setChatInput('');
    const response = await sendMessage(content) as { redirect_to_hint_gate?: boolean } | null;
    if (response && response.redirect_to_hint_gate) {
      setActiveTab('hints');
      if (hintGate.status === 'initial') {
        handleRequestHintGate();
      }
    }
  };

  /* ── Loading / error ────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0f0f]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#ffa116]" />
          <p className="text-[#737373] text-sm">Loading problem…</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0f0f]">
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-white">Problem not found</p>
          <p className="text-[#737373] text-sm">Check the URL or go back to problem list.</p>
        </div>
      </div>
    );
  }

  const constraints = normaliseConstraints(problem.constraints);
  const consoleHeight = consoleOpen ? "240px" : "42px";

  return (
    <div
      className="flex flex-col h-screen bg-[#0f0f0f] text-[#e0e0e0]"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* ── Top navbar ───────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 h-11 border-b border-[#2a2a2a] bg-[#1a1a1a] shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/problems")} className="flex items-center gap-1.5 text-[#737373] hover:text-white transition-colors text-xs">
            <ArrowLeft size={14} />
            Problems
          </button>
          <span className="text-[#2a2a2a]">|</span>
          <span className="text-white text-sm font-semibold truncate max-w-[280px]">
            {problem.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={running || submitting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold
              bg-[#2d2d2d] hover:bg-[#3a3a3a] text-[#e0e0e0] transition-all border border-[#3a3a3a]
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
            Run
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || running}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold
              bg-[#ffa116] hover:bg-[#ffb84d] text-[#0f0f0f] transition-all
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </header>

      {/* ── Main split ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: problem panel ──────────────────────────────────── */}
        <aside
          className="w-[420px] min-w-[320px] flex flex-col border-r border-[#2a2a2a] bg-[#141414] overflow-hidden"
          style={{ fontFamily: "'Geist', 'Inter', sans-serif" }}
        >
          {/* Tabs */}
          <div className="flex border-b border-[#2a2a2a] bg-[#1a1a1a] shrink-0">
            {(
              [
                { id: "description", icon: BookOpen, label: "Description" },
                { id: "mentor", icon: MessageSquare, label: "Mentor" },
                { id: "hints", icon: Lightbulb, label: "Hints" },
                { id: "submissions", icon: Code2, label: "Submissions" },
              ] as const
            ).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all border-b-2 ${activeTab === id
                  ? "border-[#ffa116] text-white"
                  : "border-transparent text-[#737373] hover:text-[#b0b0b0]"
                  }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab body */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === "description" && (
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="space-y-2">
                  <h1 className="text-lg font-bold text-white leading-tight">{problem.title}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <DifficultyBadge difficulty={problem.difficulty} />
                    {problem.tags?.map((tag, i) => <TagChip key={i} tag={tag} />)}
                  </div>
                </div>

                <hr className="border-[#2a2a2a]" />

                <p className="text-[#c0c0c0] text-sm leading-relaxed">{problem.description}</p>

                {(problem.examples?.length ?? 0) > 0 && (
                  <div className="space-y-3">
                    {problem.examples!.map((ex, i) => (
                      <ExampleBlock key={ex._id ?? i} input={ex.input} output={ex.output} index={i} />
                    ))}
                  </div>
                )}

                {constraints.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                      Constraints
                    </h3>
                    <ul className="space-y-1">
                      {constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#c0c0c0]">
                          <span className="text-[#ffa116] mt-0.5">•</span>
                          <code className="font-mono text-xs">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {problem.topic && (
                  <div className="text-xs text-[#737373]">
                    Topic: <span className="text-[#a0a0a0] capitalize">{problem.topic}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "hints" && (
              <div className="flex-1 overflow-y-auto p-5">
                  <HintGateView
                    state={hintGate}
                    onRequest={handleRequestHintGate}
                    onSubmitAnswer={handleSubmitHintAnswer}
                    answering={answeringHint}
                  />
              </div>
            )}

            {activeTab === "mentor" && (
              <div className="flex flex-col flex-1 overflow-hidden bg-[#141414]">
                {/* messages scroll area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-lg p-3 text-sm font-sans ${msg.role === 'ai'
                        ? 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#e0e0e0]'
                        : 'bg-[#ffa116] text-[#0f0f0f] font-medium'
                        }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex gap-1.5 px-3 py-2">
                      <span className="w-1.5 h-1.5 bg-[#ffa116] rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[#ffa116] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-[#ffa116] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                {/* chat input — always pinned at bottom */}
                <div className="shrink-0 p-3 border-t border-[#2a2a2a] bg-[#1a1a1a]">
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      placeholder="Ask the mentor..."
                      className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ffa116]"
                    />
                    <button
                      onClick={handleSendChat}
                      disabled={aiLoading || !chatInput.trim()}
                      className="p-2 bg-[#2d2d2d] hover:bg-[#3a3a3a] text-white rounded-md disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {!pastSubmissions || pastSubmissions.length === 0 ? (
                  <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 text-sm text-[#737373]">
                    No submissions yet. Submit your solution to see results here.
                  </div>
                ) : (
                  pastSubmissions.map((s: Submission, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${s.verdict === 'accepted' || s.verdict === 'Accepted' ? 'bg-[#4ec94e]' : 'bg-[#ff6b6b]'}`} />
                        <span className="text-white font-medium">{s.verdict}</span>
                      </div>
                      <div className="flex gap-4 text-[#737373]">
                        <span>{s.language}</span>
                        <span>{new Date(s.createdAt || s.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>


        {/* ── RIGHT: editor + console ───────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-3 h-10 border-b border-[#2a2a2a] bg-[#1a1a1a] shrink-0">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="appearance-none bg-[#2d2d2d] border border-[#3a3a3a] text-[#e0e0e0] text-xs
                  rounded-md pl-3 pr-7 py-1.5 focus:outline-none focus:border-[#ffa116]
                  cursor-pointer hover:bg-[#363636] transition-colors"
              >
                {availableLanguages.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
              />
            </div>

            <button
              onClick={() => setConsoleOpen(!consoleOpen)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition-all border ${consoleOpen
                ? "bg-[#1e2a1e] border-[#2d5a2d] text-[#4ec94e]"
                : "bg-[#2d2d2d] border-[#3a3a3a] text-[#737373] hover:text-white"
                }`}
            >
              <Terminal size={13} />
              Console
            </button>
          </div>

          {/* Monaco editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={monacoLang}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "line",
                padding: { top: 16, bottom: 16 },
                scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                suggestOnTriggerCharacters: true,
                tabSize: 4,
                wordWrap: "on",
                lineDecorationsWidth: 8,
                overviewRulerBorder: false,
              }}
            />
          </div>

          {/* Slide-up console */}
          <div
            className="border-t border-[#2a2a2a] bg-[#141414] overflow-hidden transition-all duration-300 ease-in-out shrink-0"
            style={{ height: consoleHeight }}
          >
            {/* Console header — always visible */}
            <div className="flex items-center justify-between px-4 h-[42px] border-b border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <Terminal size={13} className="text-[#737373]" />
                <span className="text-xs font-medium text-[#737373]">Test Results</span>
                {testResults.length > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#2d2d2d] text-[#a0a0a0]">
                    {testResults.filter((r) => r.passed).length}/{testResults.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setConsoleOpen(!consoleOpen)}
                className="text-[#737373] hover:text-white transition-colors"
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${consoleOpen ? "rotate-0" : "rotate-180"}`}
                />
              </button>
            </div>

            {/* Console body */}
            {consoleOpen && (
              <div className="p-3 space-y-2 overflow-y-auto" style={{ height: "calc(240px - 42px)" }}>
                {running && (
                  <div className="flex items-center gap-2 text-sm text-[#737373]">
                    <Loader2 size={14} className="animate-spin" />
                    Running test cases…
                  </div>
                )}
                {!running && testResults.length === 0 && (
                  <p className="text-sm text-[#4a4a4a] text-center py-4">
                    Run your code to see results here
                  </p>
                )}
                {!running && testResults.map((r, i) => (
                  <TestResultRow key={r.id ?? i} result={r} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}