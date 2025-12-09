import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-2 font-mono uppercase tracking-widest text-sm font-bold transition-all duration-200 clip-path-slant flex items-center justify-center gap-2 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-cyber-cyan text-black hover:bg-white hover:shadow-[0_0_15px_rgba(0,243,255,0.6)]",
    secondary: "bg-cyber-pink text-black hover:bg-white hover:shadow-[0_0_15px_rgba(255,0,255,0.6)]",
    outline: "bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-dim hover:text-white",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Button Shine Effect */}
      <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
    </button>
  );
};
