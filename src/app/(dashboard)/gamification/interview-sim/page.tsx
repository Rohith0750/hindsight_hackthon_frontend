"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  ChevronRight,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Timer,
} from "lucide-react";

const INTERVIEW_DURATION = 45 * 60;

interface Message {
  id: number;
  role: "ai" | "user";
  content: string;
  timestamp: string;
}

type Phase = "intro" | "active" | "completed";

const MOCK_PROBLEM = {
  title: "LRU Cache",
  difficulty: "Medium",
  description: [
    "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    "Implement the LRUCache class:",
    "- LRUCache(int capacity): Initializes the LRU cache with positive size capacity.",
    "- int get(int key): Returns the value of the key if it exists, otherwise returns -1.",
    "- void put(int key, int value): Updates the value of the key if it exists, or inserts the key-value pair. If the cache is full, evict the least recently used key.",
  ].join("\n"),
  constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "0 <= value <= 10^5"],
  followUps: [
    "What is the time complexity of your get and put operations?",
    "How would you handle thread-safety in a multi-threaded environment?",
    "Why would you choose a doubly linked list over a singly linked list here?",
  ],
};

const INTRO_FEATURES = [
  "45-minute timed session",
  "Interactive Q&A with AI",
  "Performance feedback at the end",
];



function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function createTimestamp() {
  return new Date().toLocaleTimeString();
}

function createIntroMessage(): Message {
  return {
    id: Date.now(),
    role: "ai",
    content: `Hi! I'm your AI interviewer for today. We have 45 minutes together. Let's start with a classic system design problem.\n\nI'll present you with the **${MOCK_PROBLEM.title}** problem. Take your time to think out loud. Ready?`,
    timestamp: createTimestamp(),
  };
}

export default function InterviewSimPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [timeLeft, setTimeLeft] = useState(INTERVIEW_DURATION);
  const [messages, setMessages] = useState<Message[]>(() => [createIntroMessage()]);
  const [input, setInput] = useState("");

  const [muted, setMuted] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase !== "active") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(currentTime => {
        if (currentTime <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setPhase("completed");
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  useEffect(() => {
    return () => {
      clearTypingTimeout();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [clearTypingTimeout]);

  const sendMessage = useCallback(() => {
    const trimmedInput = input.trim();

    if (!trimmedInput || isAiTyping) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmedInput,
      timestamp: createTimestamp(),
    };

    setMessages(currentMessages => [...currentMessages, userMessage]);
    setInput("");
    setIsAiTyping(true);

    typingTimeoutRef.current = setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: "That's an interesting approach. Can you elaborate more on the time complexity of that solution?",
        timestamp: createTimestamp(),
      };

      setMessages(currentMessages => [...currentMessages, aiMessage]);
      setIsAiTyping(false);
      typingTimeoutRef.current = null;
    }, 1500);
  }, [input, isAiTyping]);

  const startInterview = useCallback(() => {
    clearTypingTimeout();
    setPhase("active");
    setTimeLeft(INTERVIEW_DURATION);
    setMessages([createIntroMessage()]);

    setInput("");
    setIsAiTyping(false);
  }, [clearTypingTimeout]);

  const resetInterview = useCallback(() => {
    clearTypingTimeout();
    setPhase("intro");
    setTimeLeft(INTERVIEW_DURATION);
    setMessages([createIntroMessage()]);

    setInput("");
    setIsAiTyping(false);
  }, [clearTypingTimeout]);

  const timerColor =
    timeLeft < 5 * 60
      ? "text-destructive"
      : timeLeft < 15 * 60
        ? "text-fire-accent"
        : "text-accent-teal";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-text-primary">
            <Brain className="h-6 w-6 text-accent-cyan" />
            Interview Simulation
          </h1>
          <p className="mt-1 font-body text-sm text-text-secondary">
            45-minute timed mock interview with an AI interviewer
          </p>
        </div>

        {phase === "active" && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-card px-4 py-2">
            <Timer className={`h-5 w-5 ${timerColor}`} />
            <span className={`font-display text-xl font-bold tabular-nums ${timerColor}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            <div className="flex flex-col items-center rounded-xl border border-border bg-bg-card p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-cyan/40 bg-accent-cyan/10 text-lg font-display font-bold text-accent-cyan">
                AI
              </div>
              <h2 className="mb-2 font-display text-lg font-bold text-text-primary">
                AI Interviewer Ready
              </h2>
              <p className="mb-6 font-body text-sm text-text-secondary">
                You&apos;ll get a real problem, follow-up questions, and a short review at the end.
              </p>

              <ul className="mb-8 w-full space-y-2 text-left">
                {INTRO_FEATURES.map(feature => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 font-body text-sm text-text-secondary"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={startInterview}
                className="flex items-center gap-2 rounded-lg bg-accent-cyan px-8 py-3 font-display text-sm font-semibold text-bg-main transition-colors hover:bg-accent-cyan/80"
              >
                <Play className="h-4 w-4" />
                Start Interview
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-bg-card p-5">
                <p className="mb-2 font-display text-xs text-text-secondary">Today&apos;s Problem</p>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-text-primary">
                    {MOCK_PROBLEM.title}
                  </h3>
                  <span className="shrink-0 rounded bg-fire-accent/20 px-2 py-0.5 font-display text-xs text-fire-accent">
                    {MOCK_PROBLEM.difficulty}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line font-body text-sm text-text-secondary">
                  {MOCK_PROBLEM.description}
                </p>
                <div className="mt-4">
                  <p className="mb-1 font-display text-xs text-text-secondary">Constraints</p>
                  <ul className="space-y-1">
                    {MOCK_PROBLEM.constraints.map(constraint => (
                      <li key={constraint} className="font-code text-xs text-text-secondary">
                        - {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-bg-code p-4">
                <p className="mb-2 font-display text-xs text-text-primary">
                  Follow-up Questions Preview
                </p>
                {MOCK_PROBLEM.followUps.map(question => (
                  <p
                    key={question}
                    className="border-b border-border/50 py-1 font-body text-xs text-text-secondary last:border-0"
                  >
                    - {question}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === "active" && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid h-[calc(100vh-220px)] min-h-[500px] gap-4 lg:grid-cols-[1fr_340px]"
          >
            <div className="overflow-y-auto rounded-xl border border-border bg-bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-base font-bold text-text-primary">
                    {MOCK_PROBLEM.title}
                  </h2>
                  <span className="rounded bg-fire-accent/20 px-2 py-0.5 font-display text-xs text-fire-accent">
                    {MOCK_PROBLEM.difficulty}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={resetInterview}
                  className="flex items-center gap-1 font-body text-xs text-text-secondary transition-colors hover:text-destructive"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              <p className="whitespace-pre-line font-body text-sm leading-relaxed text-text-secondary">
                {MOCK_PROBLEM.description}
              </p>

              <div className="mt-4">
                <p className="mb-2 font-display text-xs text-text-secondary">Constraints</p>
                <ul className="space-y-1">
                  {MOCK_PROBLEM.constraints.map(constraint => (
                    <li
                      key={constraint}
                      className="rounded bg-bg-code px-2 py-1 font-code text-xs text-text-secondary"
                    >
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col rounded-xl border border-border bg-bg-card">
              <div className="flex items-center justify-between border-b border-border p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-accent-teal" />
                  <span className="font-display text-xs text-text-primary">AI Interviewer</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMuted(currentMuted => !currentMuted)}
                  aria-label={muted ? "Unmute interviewer audio" : "Mute interviewer audio"}
                  className="rounded-md p-1.5 transition-colors hover:bg-bg-code"
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted ? (
                    <MicOff className="h-3.5 w-3.5 text-destructive" />
                  ) : (
                    <Mic className="h-3.5 w-3.5 text-accent-teal" />
                  )}
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-3">
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 font-body text-sm ${
                        message.role === "ai"
                          ? "rounded-tl-none border border-border bg-bg-code text-text-primary"
                          : "rounded-tr-none border border-accent-teal/30 bg-accent-teal/20 text-text-primary"
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                      <p className="mt-1 text-right text-xs text-text-secondary">
                        {message.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isAiTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-xl rounded-tl-none border border-border bg-bg-code px-3 py-2">
                      <div className="flex h-4 items-center gap-1">
                        {[0, 0.2, 0.4].map(delay => (
                          <motion.div
                            key={delay}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay }}
                            className="h-1.5 w-1.5 rounded-full bg-accent-teal"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>

              <div className="border-t border-border p-3">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={event => setInput(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your response..."
                    className="flex-1 rounded-md border border-border bg-bg-code px-3 py-2 font-body text-sm text-text-primary transition-colors placeholder:text-text-secondary/60 focus:border-accent-teal focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    aria-label="Send message"
                    disabled={!input.trim() || isAiTyping}
                    className="rounded-md bg-accent-teal px-3 py-2 text-bg-main transition-colors hover:bg-accent-teal/80 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1.5 font-body text-xs text-text-secondary">
                  Think out loud. The AI evaluates your reasoning, not just the final answer.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "completed" && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-lg rounded-xl border border-border bg-bg-card p-8 text-center"
          >
            <p className="mb-4 font-display text-lg text-accent-teal">Session finished</p>
            <h2 className="mb-2 font-display text-xl font-bold text-text-primary">
              Interview Complete!
            </h2>
            <p className="mb-6 font-body text-sm text-text-secondary">
              You&apos;ve completed your 45-minute mock interview session.
            </p>

            <div className="mb-8 grid grid-cols-2 gap-3">
              {[
                { label: "Questions Answered", value: messages.filter(message => message.role === "user").length },
                { label: "Time Used", value: "45:00" },
              ].map(stat => (
                <div key={stat.label} className="rounded-lg bg-bg-code p-3">
                  <p className="font-display text-lg font-bold text-text-primary">{stat.value}</p>
                  <p className="mt-1 font-body text-xs text-text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-lg border border-accent-teal/20 bg-accent-teal/10 p-4 text-left">
              <p className="mb-1 font-display text-xs text-accent-teal">AI Feedback</p>
              <p className="font-body text-sm text-text-secondary">
                Good effort. You demonstrated a solid understanding of hash maps. Practice the full doubly linked-list implementation to strengthen the O(1) guarantee on every operation.
              </p>
            </div>

            <button
              type="button"
              onClick={resetInterview}
              className="mx-auto flex items-center gap-2 rounded-lg bg-accent-teal px-6 py-3 font-display text-sm font-semibold text-bg-main transition-colors hover:bg-accent-teal/80"
            >
              <RotateCcw className="h-4 w-4" />
              Try Another Problem
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
