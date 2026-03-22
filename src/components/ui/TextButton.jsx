import React, { useState } from 'react';

const TextButton = ({ 
  children, 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative inline-flex items-center px-4 py-2
        text-lg font-medium
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        group
        ${className}
      `}
      style={{
        color: isHovered ? 'transparent' : '#a855f7',
        background: isHovered ? 'linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6, #3b82f6)' : 'transparent',
        backgroundClip: isHovered ? 'text' : 'border-box',
        WebkitBackgroundClip: isHovered ? 'text' : 'border-box',
        textShadow: isHovered ? '0 0 8px rgba(168, 85, 247, 0.6)' : 'none',
      }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {/* 打字光标效果 */}
      {isHovered && (
        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-purple-500 animate-pulse"></span>
      )}
      
      {/* 霓虹发光效果 */}
      <span 
        className={`absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isHovered ? 'animate-pulse' : ''
        }`}
        style={{
          background: 'linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6, #3b82f6)',
          filter: 'blur(8px)',
          zIndex: -1,
        }}
      />
    </button>
  );
};

export default TextButton;
