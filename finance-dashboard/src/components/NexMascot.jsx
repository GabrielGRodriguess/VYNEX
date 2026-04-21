import React from 'react';
import { motion } from 'framer-motion';

/**
 * NexMascot – High-fidelity SVG-based mascot for VYNEX.
 * Standardized moods: 'neutral', 'happy', 'thinking', 'alert'.
 */
export default function NexMascot({ mood = 'neutral', size = 80, animate = true, className = '' }) {
  // Color Palette
  const colors = {
    primary: '#2563EB',     // Blue 600
    secondary: '#3B82F6',   // Blue 500
    accent: '#60A5FA',      // Blue 400
    white: '#FFFFFF',
    slate: '#64748B',
    rose: '#F43F5E',        // Alert
    emerald: '#10B981',     // Success
  };

  // Animation variants
  const breatheTransition = {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  };

  const thinkingTransition = {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animate ? {
          y: mood === 'thinking' ? [0, -4, 0] : [0, -2, 0],
          rotate: mood === 'thinking' ? [-2, 2, -2] : 0
        } : {}}
        transition={mood === 'thinking' ? thinkingTransition : breatheTransition}
        className="w-full h-full drop-shadow-xl"
      >
        {/* Outer Glow / Halo */}
        <circle cx="50" cy="50" r="45" fill={colors.primary} fillOpacity="0.05" />
        
        {/* Main Body - Spherical / Futuristic */}
        <defs>
          <linearGradient id="bodyGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.primary} />
          </linearGradient>
          
          <filter id="innerShadow">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="3" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.2" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Head / Body Sphere */}
        <circle cx="50" cy="50" r="38" fill="url(#bodyGradient)" filter="url(#innerShadow)" />
        
        {/* Glass Face Overlay */}
        <path 
          d="M25 45C25 33.9543 33.9543 25 45 25H55C66.0457 25 75 33.9543 75 45V55C75 66.0457 66.0457 75 55 75H45C33.9543 75 25 66.0457 25 55V45Z" 
          fill="white" 
          fillOpacity="0.1"
          style={{ backdropFilter: 'blur(4px)' }}
        />

        {/* Eyes / Sensors */}
        {mood === 'thinking' ? (
          <>
            <motion.rect 
              x="38" y="45" width="8" height="3" rx="1.5" fill="white"
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.rect 
              x="54" y="45" width="8" height="3" rx="1.5" fill="white"
              animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        ) : mood === 'alert' ? (
          <>
            <circle cx="40" cy="48" r="4" fill={colors.rose} />
            <circle cx="60" cy="48" r="4" fill={colors.rose} />
          </>
        ) : mood === 'happy' ? (
          <>
            <path d="M35 50C35 50 38 45 42 45C46 45 49 50 49 50" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M51 50C51 50 54 45 58 45C62 45 65 50 65 50" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <motion.circle 
              cx="40" cy="48" r="3" fill="white" 
              animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 1] }}
            />
            <motion.circle 
              cx="60" cy="48" r="3" fill="white" 
              animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 1] }}
            />
          </>
        )}

        {/* Mouth / Communication Light */}
        <motion.rect 
          x="42" y="60" width="16" height="4" rx="2" 
          fill={mood === 'alert' ? colors.rose : mood === 'happy' ? colors.emerald : 'white'}
          fillOpacity={mood === 'thinking' ? 0.3 : 0.8}
          animate={mood === 'thinking' ? { scaleX: [0.8, 1.2, 0.8] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        />

        {/* Tech Decor / Antennas */}
        <path d="M50 12V22" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="10" r="3" fill={colors.accent} />
      </motion.svg>
      
      {/* Dynamic Aura Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-blue-400/20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}
