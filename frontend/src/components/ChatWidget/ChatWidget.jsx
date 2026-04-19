import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm the JUE Student Advisor. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        text: data.answer, 
        isBot: true,
        reference: data.reference 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {/* Floating Button */}
      <button 
        className={`chat-fab ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'âœ•' : 'ðŸ’¬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window animate-in">
          <div className="chat-header">
            <h4>JUE Student Advisor</h4>
            <p>Institutional Knowledge Base</p>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.text}
                {msg.reference && (
                  <div className="chat-ref">
                    <a href={msg.reference} target="_blank" rel="noopener noreferrer">
                      Official Reference â†—
                    </a>
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="message-bubble bot typing">Advisor is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-area">
            <input 
              type="text" 
              placeholder="Ask anything about JUE..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;


