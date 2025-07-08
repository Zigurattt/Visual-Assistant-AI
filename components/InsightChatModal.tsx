import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { useLanguage } from '../hooks/useLanguage';
import { ai } from '../services/geminiService';
import { CloseIcon, SendIcon, BrainCircuitIcon } from './icons';
import Loader from './Loader';

// Define message type
interface Message {
    role: 'user' | 'model';
    text: string;
}

// Props
interface InsightChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: { name: string; description: string; } | null;
}

const InsightChatModal: React.FC<InsightChatModalProps> = ({ isOpen, onClose, currentItem }) => {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Function to scroll to the bottom of the chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]); // also on isLoading change to scroll to the typing indicator

    const streamResponse = useCallback(async (stream) => {
        let text = '';
        // Add a placeholder for the streaming message
        setMessages(prev => [...prev, { role: 'model', text: '' }]);
        
        for await (const chunk of stream) {
            text += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text };
                return newMessages;
            });
        }
    }, []);

    // Effect to initialize or reset chat when modal opens/closes or item changes
    useEffect(() => {
        if (isOpen && currentItem) {
            const startChat = async () => {
                setIsLoading(true);

                if (!ai) {
                    console.error("Gemini AI not configured. Cannot start insight chat.");
                    const initialPrompt = t.insightChatInitialPrompt(currentItem.name);
                     setMessages([
                        { role: 'user', text: initialPrompt },
                        { role: 'model', text: "I can't seem to connect. Please ensure the AI is configured correctly." }
                    ]);
                    setIsLoading(false);
                    return;
                }
                
                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash-preview-04-17',
                    config: {
                        systemInstruction: t.insightChatSystemInstruction(language),
                    },
                });
                chatRef.current = newChat;

                const initialPrompt = t.insightChatInitialPrompt(currentItem.name);
                setMessages([{ role: 'user', text: initialPrompt }]);
                
                try {
                    const stream = await newChat.sendMessageStream({ message: initialPrompt });
                    await streamResponse(stream);
                } catch (error) {
                    console.error("Error starting insight chat:", error);
                    setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble finding my inner voice right now." }]);
                } finally {
                    setIsLoading(false);
                }
            };
            startChat();
        } else {
            // Reset on close
            setMessages([]);
            setInput('');
            chatRef.current = null;
        }
    }, [isOpen, currentItem, t, language, streamResponse]);


    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: userMessage.text });
            await streamResponse(stream);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I've lost my train of thought... Could you repeat that?" }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, streamResponse]);
    
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col p-6 relative transition-all duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
               <BrainCircuitIcon className="w-7 h-7 text-cyan-500" />
               <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.insightChatTitle}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto pr-2 space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && <BrainCircuitIcon className="w-8 h-8 p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-cyan-500 flex-shrink-0" />}
                    <div className={`max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-cyan-500 text-white rounded-br-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'}`}>
                       {/* Render text with line breaks */}
                       <p className="whitespace-pre-wrap">{msg.text || '...'}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Initial Loading State */}
          {isLoading && messages.length <= 1 && (
            <div className="absolute inset-0 top-20 flex flex-col items-center justify-center">
                 <Loader text={t.insightChatLoading} />
            </div>
          )}
          
          {/* Input Form */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.insightChatPlaceholder}
                  disabled={isLoading}
                  className="flex-grow px-4 py-2 bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-600 rounded-full text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50"
              />
              <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  aria-label={t.sendButton}
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-cyan-500 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <SendIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
};

export default InsightChatModal;