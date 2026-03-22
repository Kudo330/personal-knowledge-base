import React, { useState, useRef } from 'react';

const PrimaryButton = ({ 
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
        relative inline-flex items-center px-8 py-4 rounded-xl
        bg-gradient-to-r from-indigo-500 to-purple-600
        text-white font-semibold text-lg
        transition-all duration-300 ease-out
        hover:shadow-2xl hover:shadow-indigo-500/30
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden
        group
        ${className}
      `}
      style={{
        '--x': `${position.x}px`,
        '--y': `${position.y}px`,
      }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <svg 
        className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
      
      {/* 光晕效果 */}
      <span 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
      />
    </button>
  );
};

export default PrimaryButton;
