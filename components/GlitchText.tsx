import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  animate?: boolean;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  as: Tag = 'span', 
  className = '',
  animate = false
}) => {
  return (
    <Tag className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      {animate && (
        <>
          <span className="absolute top-0 left-0 -ml-[2px] text-cyber-cyan opacity-70 animate-glitch hidden group-hover:block" style={{ animationDelay: '0.1s' }}>{text}</span>
          <span className="absolute top-0 left-0 ml-[2px] text-cyber-pink opacity-70 animate-glitch hidden group-hover:block" style={{ animationDelay: '-0.1s' }}>{text}</span>
        </>
      )}
    </Tag>
  );
};
