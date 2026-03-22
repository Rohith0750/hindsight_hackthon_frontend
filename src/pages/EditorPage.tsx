"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useProblem } from '@/hooks/useProblems';
import { useAICoach } from '@/hooks/useAICoach';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { hindsightClient } from '@/lib/hindsight';
import { Play, Send, Terminal, ChevronDown, Brain, CheckCircle2, XCircle } from 'lucide-react';
import type { TestResult } from '@/lib/types';
import Editor from '@monaco-editor/react';

const languages = ['python', 'javascript', 'cpp'];

const EditorPage = () => {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { data: problem, isLoading } = useProblem(id);
  const { user } = useAuth();
  const { messages, sendMessage, isLoading: aiLoading } = useAICoach(id || '', user?.id || '');

  const [tab, setTab] = useState<'description' | 'coach' | 'submissions'>('description');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [mistakeToast, setMistakeToast] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (problem?.starterCode?.[language]) setCode(problem.starterCode[language]);
  }, [problem, language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setConsoleOpen(true);
    const results = await api.runCode(code, language);
    setTestResults(results);
    setRunning(false);
  }, [code, language]);

  const handleSubmit = useCallback(async () => {
    if (!problem) return;
    setSubmitting(true);
    const result = await api.submitCode(problem.id, code, language);
    setSubmitting(false);

    if (result.verdict !== 'Accepted') {
      // TODO: Wire to real Hindsight SDK
      await hindsightClient.storeMistake(user?.id || '', {
        problemId: problem.id,
        mistakeType: result.verdict,
        code,
        timestamp: new Date().toISOString(),
        language,
      });
      setMistakeToast(`Pattern detected: ${result.verdict}. Added to your learning profile.`);
      setTimeout(() => setMistakeToast(null), 6000);
    }

    setConsoleOpen(true);
    setTestResults([{
      id: 'submit',
      input: 'Full test suite',
      expectedOutput: '-',
      actualOutput: result.verdict,
      passed: result.verdict === 'Accepted',
    }]);
  }, [problem, code, language, user]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    sendMessage(chatInput);
    setChatInput('');
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><div className="w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" /></div>;
  if (!problem) return <div className="text-text-secondary font-body text-center mt-20">Problem not found</div>;

  const tabs = ['description', 'coach', 'submissions'] as const;

  return (
    <div className="h-[calc(100vh-64px-2rem)] flex flex-col lg:flex-row gap-4 -mt-2">
      {/* Left Panel */}
      <div className="lg:w-[40%] flex flex-col min-h-0 bg-bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-display text-lg font-bold text-text-primary">{problem.title}</h1>
            <span className={`text-xs font-display px-2 py-0.5 rounded ${
              problem.difficulty === 'Easy' ? 'bg-accent-teal/20 text-accent-teal'
              : problem.difficulty === 'Medium' ? 'bg-fire-accent/20 text-fire-accent'
              : 'bg-destructive/20 text-destructive'
            }`}>{problem.difficulty}</span>
          </div>
          <div className="flex gap-1.5">
            {problem.tags.map(t => (
              <span key={t} className="text-xs font-body px-2 py-0.5 rounded bg-bg-code text-text-secondary">{t}</span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-display capitalize transition-colors border-b-2 ${
                tab === t ? 'border-accent-teal text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t === 'coach' ? 'AI Coach' : t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {tab === 'description' && (
            <div className="font-body text-sm text-text-secondary leading-relaxed space-y-4">
              <p className="whitespace-pre-wrap">{problem.description}</p>
              {problem.examples.map((ex, i) => (
                <div key={i} className="bg-bg-code rounded-md p-3 font-code text-xs">
                  <p className="text-text-primary font-semibold mb-1">Example {i + 1}:</p>
                  <p><span className="text-accent-cyan">Input:</span> {ex.input}</p>
                  <p><span className="text-accent-teal">Output:</span> {ex.output}</p>
                  {ex.explanation && <p className="text-text-secondary mt-1">{ex.explanation}</p>}
                </div>
              ))}
              <div>
                <p className="text-text-primary font-display text-xs font-semibold mb-1">Constraints:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {problem.constraints.map((c, i) => <li key={i} className="text-xs font-code">{c}</li>)}
                </ul>
              </div>
            </div>
          )}

          {tab === 'coach' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-3 mb-3">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-lg p-3 text-sm font-body ${
                      msg.role === 'ai'
                        ? 'bg-bg-card border-l-2 border-accent-teal text-text-primary'
                        : 'bg-btn-submit text-text-primary'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {aiLoading && (
                  <div className="flex gap-1 px-3">
                    <span className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-accent-teal rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-accent-teal rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2 mt-auto">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask your AI mentor..."
                  className="flex-1 px-3 py-2 rounded-md bg-bg-code border border-border text-text-primary font-body text-sm placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-teal"
                />
                <button onClick={handleSendChat} className="px-3 py-2 rounded-md bg-btn-run text-bg-main">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {tab === 'submissions' && (
            <div className="space-y-2">
              <p className="text-xs font-body text-text-secondary">Your recent submissions for this problem will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Editor */}
      <div className="lg:w-[60%] flex flex-col min-h-0">
        {/* Language selector + toolbar */}
        <div className="flex items-center justify-between bg-bg-card rounded-t-lg border border-border px-4 py-2">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="bg-bg-code border border-border rounded-md px-3 py-1.5 text-xs font-display text-text-primary focus:outline-none focus:border-accent-teal"
          >
            {languages.map(l => <option key={l} value={l}>{l === 'cpp' ? 'C++' : l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-btn-run text-bg-main font-display text-xs font-semibold hover:shadow-[0_0_20px_hsl(168_62%_47%/0.3)] transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3" /> {running ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-btn-submit border border-accent-cyan text-text-primary font-display text-xs font-semibold disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              onClick={() => setConsoleOpen(!consoleOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border text-text-secondary text-xs font-display hover:text-text-primary"
            >
              <Terminal className="w-3 h-3" />
              <ChevronDown className={`w-3 h-3 transition-transform ${consoleOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 min-h-0 border-x border-border">
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={v => setCode(v || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: 'Fira Code, monospace',
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              padding: { top: 12 },
            }}
          />
        </div>

        {/* Console */}
        <AnimatePresence>
          {consoleOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 180 }}
              exit={{ height: 0 }}
              className="bg-bg-card border border-border rounded-b-lg overflow-hidden"
            >
              <div className="p-3 h-full overflow-y-auto">
                <p className="text-xs font-display text-text-secondary mb-2">Test Results</p>
                {testResults.length === 0 && <p className="text-xs font-body text-text-secondary">Run your code to see results</p>}
                {testResults.map(r => (
                  <div key={r.id} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                    {r.passed ? <CheckCircle2 className="w-4 h-4 text-accent-teal" /> : <XCircle className="w-4 h-4 text-fire-accent" />}
                    <span className="text-xs font-code text-text-primary">{r.input}</span>
                    <span className="text-xs font-code text-text-secondary ml-auto">→ {r.actualOutput}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mistake Toast */}
      <AnimatePresence>
        {mistakeToast && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 max-w-sm bg-bg-card border border-border border-l-4 border-l-fire-accent rounded-lg p-4 shadow-xl z-50"
          >
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-fire-accent shrink-0" />
              <div>
                <p className="text-sm font-display text-text-primary">🧠 {mistakeToast}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const getServerSideProps = async () => ({ props: {} });

export const dynamic = 'force-dynamic';

export default EditorPage;
