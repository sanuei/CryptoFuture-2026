import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-4 font-mono text-gray-300">
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-sans font-bold text-cyber-cyan mt-6 mb-4 border-b border-cyber-cyan/30 pb-2">{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-sans font-bold text-cyber-pink mt-5 mb-3">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold text-white mt-4">{line.replace('### ', '')}</h3>;
        }
        
        // Blockquotes
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-cyber-yellow pl-4 italic text-cyber-yellow bg-cyber-yellow/10 p-2 my-4">
              {line.replace('> ', '')}
            </blockquote>
          );
        }
        
        // Lists
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          return (
            <div key={index} className="flex items-start gap-2 ml-4">
              <span className="text-cyber-cyan mt-1">►</span>
              <span>{line.replace(/^[\*\-] /, '')}</span>
            </div>
          );
        }

        // Empty lines
        if (line.trim() === '') return <br key={index} />;

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

        return <p key={index} className="leading-relaxed opacity-90">{parseBold(line)}</p>;
      })}
    </div>
  );
};
