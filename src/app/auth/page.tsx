"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Github } from "lucide-react";
import NeuralBackground from "@/components/NeuralBackground";

const codeSnippets = [
  {
    lang: "Python",
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1 # Fixed Bug: added - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1 # Fixed Bug: added + 1`,
  },
  {
    lang: "JavaScript",
    code: `function slidingWindow(s) {
  let map = {};
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    while (map[char]) { // Added missing window shrink logic
      delete map[s[left]];
      left++;
    }
    map[char] = true;
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
  },
  {
    lang: "C++",
    code: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int c : coins) {
            if (c <= i && dp[i-c] != INT_MAX)
                dp[i] = min(dp[i], dp[i-c] + 1); // Fixed Bug: added min()
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
  },
];

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [snippetIndex, setSnippetIndex] = useState(0);
  const { login, isAuthenticated, signup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  useEffect(() => {
    const interval = setInterval(
      () => setSnippetIndex((i) => (i + 1) % codeSnippets.length),
      4000,
    );
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    try {
      if (!email.trim() || !password || (mode === "signup" && !username.trim())) {
        alert("All fields required");
        setLoading(false);
        return;
      }
      if (mode === "signin") {
        await login(email, password);
      } else {
        await signup({ email, password, username });
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      <NeuralBackground />
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-teal/5 opacity-50" />
        <div className="relative z-10">
          <p className="font-display text-sm text-accent-teal mb-4 tracking-wider uppercase">
            CodeMind AI Coach
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={snippetIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-bg-code rounded-lg p-6 border border-border"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-fire-accent/60" />
                <span className="w-3 h-3 rounded-full bg-accent-teal/60" />
                <span className="w-3 h-3 rounded-full bg-accent-cyan/60" />
                <span className="ml-2 text-xs font-code text-text-secondary">
                  {codeSnippets[snippetIndex].lang}
                </span>
              </div>
              <pre className="font-code text-xs text-text-primary leading-relaxed whitespace-pre-wrap">
                {codeSnippets[snippetIndex].code}
              </pre>
            </motion.div>
          </AnimatePresence>
          <p className="mt-8 font-display text-2xl text-text-primary">
            Your AI mentor that{" "}
            <span className="text-accent-teal">never forgets</span>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-bg-card rounded-lg border border-border p-8">
          <h2 className="font-display text-2xl text-text-primary text-center mb-6">
            {mode === "signin" ? "Welcome Back" : "Join CodeMind"}
          </h2>

          {/* Tab toggle */}
          <div className="relative flex bg-bg-code rounded-md p-1 mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-display rounded-md relative z-10 transition-colors ${mode === m ? "text-text-primary" : "text-text-secondary"}`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
            <motion.div
              layoutId="auth-tab"
              className="absolute top-1 bottom-1 rounded-md bg-accent-teal/20 border border-accent-teal/30"
              animate={{ left: mode === "signin" ? "0%" : "50%" }}
              style={{ width: "50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          {/* GitHub */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-border text-text-primary font-body text-sm hover:bg-bg-code transition-colors mb-4"
          >
            <Github className="w-4 h-4" /> Continue with GitHub
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-secondary font-body">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Fields */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {mode === "signup" && (
                <motion.div
                  key="signup-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md bg-bg-code border border-border text-text-primary font-body text-sm placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-teal transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md bg-bg-code border border-border text-text-primary font-body text-sm placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-teal transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md bg-bg-code border border-border text-text-primary font-body text-sm placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-teal transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md bg-btn-run text-bg-main font-display font-semibold text-sm hover:shadow-[0_0_20px_hsl(168_62%_47%/0.3)] transition-all disabled:opacity-50"
            >
              {loading
                ? "Loading..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
