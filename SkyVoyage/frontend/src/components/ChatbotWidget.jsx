import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const INITIAL_MESSAGE = {
  role: "assistant", 
  content: "Hi! I'm SkyAI, your SkyVoyage concierge. How can I help you today? I can assist with bookings, flight info, baggage, visas, or anything travel-related! ✈️"
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('skyai_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [INITIAL_MESSAGE];
  });
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('skyai_messages', JSON.stringify(messages));
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMsg = { role: "user", content: inputText.trim() };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chatbot/message', {
        message: inputText.trim(),
        messages: newMessages
      });
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: response.data.response || "Sorry, I couldn't understand that."
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm sorry, I am currently experiencing turbulence and couldn't process your request."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 9999,
          width: 64, height: 64, borderRadius: '50%',
          background: '#C8A84B', color: '#111827',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'rotate(180deg) scale(0.9)' : 'scale(1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#d6b658'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#C8A84B'}
      >
        {isOpen ? '✕' : '✈️'}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 108, right: 32, zIndex: 9998,
          width: 380, height: 550, background: '#ffffff',
          borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'system-ui, -apple-system, sans-serif',
          animation: 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {/* Header */}
          <div style={{
            background: '#0A0F1A', color: '#f0ece4',
            padding: '16px 20px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', borderBottom: '2px solid #C8A84B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981' }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: '0.05em' }}>SkyAI Concierge</h3>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: 18 }}>
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1, padding: 20, overflowY: 'auto',
            background: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: 16
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex', gap: 12,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: '#C8A84B', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#111827'
                  }}>✈️</div>
                )}
                <div style={{
                  background: msg.role === 'user' ? '#0A0F1A' : '#ffffff',
                  color: msg.role === 'user' ? '#ffffff' : '#111827',
                  padding: '12px 16px', borderRadius: 12,
                  borderBottomRightRadius: msg.role === 'user' ? 2 : 12,
                  borderBottomLeftRadius: msg.role === 'assistant' ? 2 : 12,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  fontSize: 14, lineHeight: 1.5,
                  border: msg.role === 'assistant' ? '1px solid rgba(0,0,0,0.05)' : 'none'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: 12, alignSelf: 'flex-start', maxWidth: '85%' }}>
                 <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: '#C8A84B', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#111827'
                  }}>✈️</div>
                  <div style={{
                    background: '#ffffff', padding: '12px 16px', borderRadius: 12,
                    borderBottomLeftRadius: 2, boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    display: 'flex', alignItems: 'center', gap: 4, height: 45
                  }}>
                    <div className="typing-dot" style={{ width: 6, height: 6, background: '#9CA3AF', borderRadius: '50%', animation: 'typing 1.4s infinite 0.2s' }} />
                    <div className="typing-dot" style={{ width: 6, height: 6, background: '#9CA3AF', borderRadius: '50%', animation: 'typing 1.4s infinite 0.4s' }} />
                    <div className="typing-dot" style={{ width: 6, height: 6, background: '#9CA3AF', borderRadius: '50%', animation: 'typing 1.4s infinite 0.6s' }} />
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: 16, background: '#ffffff', borderTop: '1px solid #E5E7EB',
            display: 'flex', gap: 8
          }}>
            <input 
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 20,
                border: '1px solid #D1D5DB', outline: 'none', fontSize: 14,
                background: '#F3F4F6', color: '#111827'
              }}
            />
            <button 
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: inputText.trim() && !isLoading ? '#C8A84B' : '#E5E7EB',
                color: inputText.trim() && !isLoading ? '#111827' : '#9CA3AF',
                border: 'none', cursor: inputText.trim() && !isLoading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <style>{`
            @keyframes typing { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-3px); opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
          `}</style>
        </div>
      )}
    </>
  );
}
