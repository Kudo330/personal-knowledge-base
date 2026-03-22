import React, { useState } from 'react';

const HiddenButton = ({ 
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
        relative inline-flex items-center px-6 py-3 rounded-lg
        bg-gradient-to-r from-gray-900 to-gray-800
        text-white font-medium
        transition-all duration-300 ease-out
        hover:shadow-2xl hover:shadow-purple-500/20
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden
        group
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {/* 紫色滑动光晕 */}
      <span 
        className={`absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/30 to-purple-600/0 transform transition-transform duration-500 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}
      />
      
      {/* 渐变暗角效果 */}
      <span 
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 rounded-lg"
      />
      
      {/* 悬停时出现的细顶部线条 */}
      <span 
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </button>
  );
};

export default HiddenButton;
