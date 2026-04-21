import React from 'react';

/**
 * VynexLogo – A premium SVG version of the VYNEX logo.
 * Replaces the neon green with the brand blue (#2563EB).
 */
export default function VynexLogo({ className = "h-8 w-auto", color = "#2563EB" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* The Icon: Stylized V with Up-Arrow */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto drop-shadow-sm"
      >
        <path
          d="M15 45L45 85L75 45"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M45 85L85 15M85 15H60M85 15V40"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* The Text */}
      <span className="text-2xl font-[900] tracking-tighter text-slate-900 uppercase">
        VYNEX
      </span>
    </div>
  );
}
