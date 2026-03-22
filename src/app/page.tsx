"use client";

import { motion } from 'framer-motion';
import { Brain, Flame, Target, ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const stats = [
  { label: 'Problems', target: 2400, suffix: '+' },
  { label: 'Pattern Accuracy', target: 98, suffix: '%' },
  { label: 'Forever Memory', target: 0, suffix: '', text: '∞' },
];

const features = [
  { icon: Brain, title: 'Hindsight Memory', desc: 'Your AI mentor remembers every mistake, every pattern, every breakthrough — forever.' },
  { icon: Flame, title: 'Pattern Detection', desc: 'Automatically identifies recurring mistakes and weak spots across all your coding sessions.' },
  { icon: Target, title: 'Personalized Paths', desc: 'AI-generated learning paths that adapt to your unique strengths and weaknesses in real-time.' },
];

const CountUp = ({ target, suffix, text }: { target: number; suffix: string; text?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (text) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(interval);
  }, [target, text]);
  if (text) return <span>{text}</span>;
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const TYPEWRITER_TEXT = ['Code. Fail. Learn. Repeat', '— But Smarter.'];

const TypewriterHeading = () => {
  const fullText = TYPEWRITER_TEXT.join('\n');
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setDisplayed(fullText.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, 48);
    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <>
      {displayed.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          {i < displayed.split('\n').length - 1 && <br />}
        </span>
      ))}
      <span
        className={`inline-block w-[3px] h-[0.85em] ml-1 align-middle bg-accent-teal rounded-sm ${
          done ? 'animate-[blink_1s_step-end_infinite]' : ''
        }`}
        aria-hidden
      />
    </>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-main dot-grid-bg">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-bg-main/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-accent-teal">{'</>'} CodeMind</span>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-body text-text-secondary hover:text-text-primary transition-colors">Sign In</Link>
            <Link href="/auth" className="text-sm font-body px-4 py-2 rounded-md bg-btn-run text-bg-main font-semibold hover:shadow-[0_0_20px_hsl(168_62%_47%/0.3)] transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="pt-32 pb-20 px-6 max-w-5xl mx-auto text-center"
      >
        <motion.h1
          variants={item}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-accent-teal to-accent-cyan bg-clip-text text-transparent"
        >
          <TypewriterHeading />
        </motion.h1>
        <motion.p variants={item} className="mt-6 text-lg md:text-xl font-body text-text-secondary max-w-2xl mx-auto">
          An AI mentor that remembers your every mistake, detects patterns, and builds a personalized path to mastery.
        </motion.p>
        <motion.div variants={item} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-btn-run text-bg-main font-display font-semibold text-sm hover:shadow-[0_0_24px_hsl(168_62%_47%/0.4)] transition-all"
          >
            Start Coding Free <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-md border border-accent-cyan text-accent-cyan font-display text-sm hover:bg-accent-cyan/10 transition-all"
          >
            See How It Works
          </a>
        </motion.div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-12 border-y border-border"
      >
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                <CountUp target={s.target} suffix={s.suffix} text={s.text} />
              </p>
              <p className="text-sm font-body text-text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map(f => (
            <motion.div
              key={f.title}
              variants={item}
              className="bg-bg-card rounded-lg p-6 border border-border hover:border-accent-teal/40 transition-colors"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-lg bg-accent-teal/10 flex items-center justify-center text-accent-teal mb-4"
              >
                <f.icon className="w-6 h-6" />
              </motion.div>
              <h3 className="font-display text-lg font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-sm font-body text-text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center">
        <p className="text-sm font-body text-text-secondary">© 2026 CodeMind. Built with Hindsight Memory.</p>
      </footer>
    </div>
  );
}
