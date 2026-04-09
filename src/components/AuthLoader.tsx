"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_STEPS = [
  "Initializing Secure Tunnel...",
  "Syncing Neural Patterns...",
  "Verifying Cryptographic Identity...",
  "Establishing Connection...",
  "Optimizing CodeMind Workspace...",
];

interface ParticleData {
  id: number;
  duration: number;
  delay: number;
  xOffset: number;
}

export default function AuthLoader() {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    // We delay the state updates slightly to avoid the 'cascading renders' warning
    // and ensure we are safely in the client-side lifecycle.
    const timeout = setTimeout(() => {
      setMounted(true);
      setParticles([...Array(6)].map((_, i) => ({
        id: i,
        duration: 2 + Math.random(),
        delay: i * 0.3,
        xOffset: Math.sin(i) * 20,
      })));
    }, 0);

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1500);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-main/90 backdrop-blur-md"
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-t-2 border-r-2 border-accent-teal/30 rounded-full"
        />
        
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-b-2 border-l-2 border-accent-cyan/40 rounded-full"
        />

        {/* Pulse Core */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              "0 0 20px rgba(45, 212, 191, 0)",
              "0 0 40px rgba(45, 212, 191, 0.4)",
              "0 0 20px rgba(45, 212, 191, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 bg-accent-teal rounded-full flex items-center justify-center"
        >
          <div className="w-4 h-4 bg-bg-main rounded-sm rotate-45" />
        </motion.div>

        {/* Floating Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            animate={{
              y: [0, -40, 0],
              x: [0, p.xOffset, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
            className="absolute w-1 h-1 bg-accent-cyan rounded-full"
            style={{
              top: '50%',
              left: '50%',
            }}
          />
        ))}
      </div>

      <div className="mt-8 text-center flex flex-col items-center gap-2">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-display text-accent-teal text-sm tracking-widest uppercase"
        >
          Authenticating
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-text-secondary font-code text-xs w-64 h-4"
          >
            {"> "} {LOADING_STEPS[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="mt-12 w-48 h-1 bg-bg-code rounded-full overflow-hidden border border-border/50">
        <motion.div
          animate={{ 
            left: ["-100%", "100%"]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative h-full w-1/2 bg-gradient-to-r from-transparent via-accent-teal to-transparent"
        ></motion.div>
      </div>
    </motion.div>
  );
}
