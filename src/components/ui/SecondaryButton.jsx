import React, { useState, useRef } from 'react';

const SecondaryButton = ({ 
  children, 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      className={`
        relative inline-flex items-center px-6 py-3 rounded-lg
        bg-white/10 backdrop-blur-sm
        text-white font-medium
        border border-white/20
        transition-all duration-300 ease-out
        hover:bg-white/20 hover:border-white/40
        focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden
        group
        animate-fade-in
        ${className}
      `}
      style={{
        '--x': `${position.x}px`,
        '--y': `${position.y}px`,
      }}
      {...props}
    >
      <span className="relative z-10 group-hover:underline group-hover:underline-offset-4 transition-all duration-300">
        {children}
      </span>
      <svg 
        className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
      
      {/* 动态光晕 */}
      <span 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.2) 0%, transparent 70%)',
        }}
      />
    </button>
  );
};

export default SecondaryButton;
