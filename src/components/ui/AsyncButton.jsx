import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const AsyncButton = ({ 
  children, 
  onClick, 
  isLoading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const [displayText, setDisplayText] = useState(children);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const loadingText = '生成中';
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < loadingText.length) {
            setDisplayText(loadingText.slice(0, prev + 1));
            return prev + 1;
          } else {
            setDisplayText('生成');
            return 0;
          }
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      setDisplayText(children);
      setCurrentIndex(0);
    }
  }, [isLoading, children]);

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center px-6 py-3 rounded-lg
        bg-gradient-to-r from-blue-500 to-purple-600
        text-white font-medium
        transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-blue-500/25
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      <Star className="w-4 h-4 mr-2" />
      <span className="relative z-10">{displayText}</span>
      {isLoading && (
        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 animate-pulse"></span>
      )}
    </button>
  );
};

export default AsyncButton;
