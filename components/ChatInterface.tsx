import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Cpu } from './Icons';
import { ChatMessage, Script } from '../types';
import { createScriptAnalysisChat, sendMessageStream } from '../services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";

interface ChatInterfaceProps {
  script: Script;
  onClose: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ script, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: `Connection established. I have analyzed "${script.title}". Ask me anything about the script.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session when component mounts
    chatSessionRef.current = createScriptAnalysisChat(script.content);
  }, [script.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Create placeholder for AI response
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: '', isTyping: true }]);

      const streamResult = await sendMessageStream(chatSessionRef.current, userMsg.text);

      let fullText = '';
      
      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullText += textChunk;
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMsgId 
              ? { ...msg, text: fullText, isTyping: false } 
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "ERROR: Connection interrupted. Neural link unstable." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cyber-dark border-l border-cyber-cyan/30 shadow-[-10px_0_30px_rgba(0,0,0,0.8)]">
      {/* Chat Header */}
      <div className="p-4 border-b border-cyber-cyan/20 bg-cyber-black/80 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyber-pink animate-pulse" />
          <h3 className="font-mono text-cyber-cyan font-bold tracking-wider">AI ANALYST NODE</h3>
        </div>
        <button onClick={onClose} className="text-xs hover:text-cyber-pink transition-colors font-mono">[CLOSE_LINK]</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 border ${
              msg.role === 'user' 
                ? 'border-cyber-cyan bg-cyber-cyan/10 text-white rounded-tl-lg rounded-bl-lg rounded-br-lg' 
                : 'border-cyber-pink bg-cyber-pink/5 text-gray-300 rounded-tr-lg rounded-br-lg rounded-bl-lg'
            }`}>
              <div className="text-[10px] opacity-50 mb-1 uppercase tracking-widest">
                {msg.role === 'user' ? 'USER_ID_884' : 'NETRUNNER_AI'}
              </div>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.isTyping && <span className="inline-block w-2 h-4 bg-cyber-pink animate-pulse ml-1 align-middle"></span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-cyber-black border-t border-cyber-cyan/20">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query the script database..."
            className="w-full bg-cyber-dark border border-gray-700 focus:border-cyber-cyan text-white p-3 pr-10 font-mono text-sm outline-none transition-all placeholder-gray-600"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-cyber-cyan hover:text-white disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
