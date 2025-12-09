import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-6 text-gray-200 prose prose-invert max-w-none">
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-4xl md:text-5xl font-sans font-bold text-cyber-cyan mt-10 mb-6 border-b border-cyber-cyan/30 pb-3 leading-tight">{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-3xl md:text-4xl font-sans font-bold text-cyber-pink mt-8 mb-5 leading-tight">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-2xl md:text-3xl font-sans font-bold text-white mt-6 mb-4 leading-tight">{line.replace('### ', '')}</h3>;
        }
        
        // Blockquotes
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-cyber-yellow pl-6 pr-4 py-4 italic text-cyber-yellow/90 bg-cyber-yellow/10 my-6 rounded-r text-lg leading-relaxed">
              {line.replace('> ', '')}
            </blockquote>
          );
        }
        
        // Lists
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          const listContent = line.replace(/^[\*\-] /, '');
          return (
            <div key={index} className="flex items-start gap-3 ml-2 my-2">
              <span className="text-cyber-cyan mt-2 text-lg flex-shrink-0">•</span>
              <span className="text-base md:text-lg leading-relaxed flex-1">{listContent}</span>
            </div>
          );
        }

        // Numbered lists
        const numberedMatch = line.trim().match(/^(\d+)\.\s(.+)$/);
        if (numberedMatch) {
          return (
            <div key={index} className="flex items-start gap-3 ml-2 my-2">
              <span className="text-cyber-cyan mt-2 text-lg flex-shrink-0 font-mono">{numberedMatch[1]}.</span>
              <span className="text-base md:text-lg leading-relaxed flex-1">{numberedMatch[2]}</span>
            </div>
          );
        }

        // Empty lines
        if (line.trim() === '') return <div key={index} className="h-2" />;

        // Paragraphs with basic bold parsing
        const parseBold = (text: string) => {
          const parts = text.split(/(\*\*.*?\*\*)/);
          return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
          });
        };

        return <p key={index} className="text-base md:text-lg leading-relaxed mb-4 text-gray-200">{parseBold(line)}</p>;
      })}
    </div>
  );
};
