import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, MessageSquare, Terminal } from 'lucide-react';
import { ApiClient } from '../../services/ApiClient';
import { useApp } from '../../context/AppContext';
import { useLocation } from 'react-router-dom';

export default function ChatbotWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    { role: 'assistant', text: 'Namaste. I am your SkyVoyage Elite Concierge. How may I elevate your journey today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const { state } = useApp();
  const location = useLocation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const userMsg = message;
    setMessage('');
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const data = await ApiClient.sendChatMessage(userMsg);
      setHistory(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'assistant', text: 'Our celestial proxy is experiencing turbulence. Please try again shortly.', isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Hide completely when in strict booking flows
  if (state.currentStep === 'seats' || location.pathname === '/booking') return null;

  return (
    <>
      {/* Trigger */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-10 right-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-dark text-xl cursor-pointer shadow-[0_15px_40px_rgba(212,175,55,0.4)] z-[2000] hover:scale-110 transition-transform animate-in fade-in zoom-in duration-500"
        >
          <Bot size={28} />
        </button>
      )}

      {/* Window */}
      {isOpen && (
        <div className="fixed bottom-10 right-10 w-96 h-[600px] glass-panel rounded-[32px] overflow-hidden z-[2000] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-primary p-6 py-8 flex items-center justify-between text-dark">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">🕊️</div>
              <div>
                <h5 className="font-black leading-none text-sm tracking-widest uppercase">SkyBot</h5>
                <span className="text-[9px] font-black uppercase opacity-60">AI Concierge</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col bg-[#01040a]/50">
            {history.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
              >
                <div className={`p-5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-xl border ${
                  msg.role === 'user' 
                    ? 'bg-primary text-dark rounded-tr-none font-bold italic' 
                    : 'bg-white/5 text-slate-200 rounded-tl-none border-white/5'
                } ${msg.isError ? 'border-red-500/30' : ''}`}>
                  {msg.isError && <span className="text-[8px] font-black uppercase text-red-500 block mb-1">Network Turbulence</span>}
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-xl flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-dark border-t border-white/5 flex gap-4">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query the Concierge..." 
              className="flex-1 bg-transparent text-sm font-bold text-white outline-none border-b border-white/20 focus:border-primary transition-all py-2" 
            />
            <button 
              onClick={handleSend}
              className="bg-primary/20 text-primary w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary hover:text-dark transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
