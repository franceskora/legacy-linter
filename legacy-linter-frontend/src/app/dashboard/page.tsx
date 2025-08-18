// src/app/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

// Define the shape of the full package we get from the backend
interface RefactorPackage {
  analysis: string;
  refactored_code: string;
  audit_report: string;
  unit_test: string;
  diagram_prompt: string;
  image_url?: string;
}

// Define the shape for all possible message contents
type MessageContent = string | RefactorPackage;

interface Message {
  role: 'user' | 'ai';
  content: MessageContent;
  type: 'answer' | 'refactor_package' | 'clarification' | 'error' | 'user_input';
}

export default function HomePage() {
  const [inputCode, setInputCode] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Python');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [type]: true });
    setTimeout(() => setCopiedStates({ ...copiedStates, [type]: false }), 2000);
  };

  const handleModernize = async () => {
    if (!inputCode.trim()) return;
    
    setIsLoading(true);
    const newMessages: Message[] = [...messages, { role: 'user', content: inputCode, type: 'user_input' }];
    setMessages(newMessages);
    setInputCode('');
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/chat/', {
        legacy_code: inputCode,
        target_language: targetLanguage, 
      });

      setMessages([...newMessages, {
        role: 'ai',
        content: response.data.content,
        type: response.data.type
      }]);

    } catch (err) {
      setMessages([...newMessages, { role: 'ai', content: "An error occurred. Please ensure the backend is running.", type: 'error' }]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.type === 'user_input' || msg.type === 'clarification' || msg.type === 'answer' || msg.type === 'error') {
      return (
        <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
          <pre className="font-mono text-sm whitespace-pre-wrap">{msg.content as string}</pre>
        </div>
      );
    }

    if (msg.type === 'refactor_package' && typeof msg.content === 'object') {
      const content = msg.content as RefactorPackage;
      return (
        <div className="max-w-2xl w-full p-4 rounded-lg bg-slate-50 border space-y-4">
          {/* Analysis */}
          <div>
            <h3 className="font-semibold text-slate-800">1. Analysis</h3>
            <p className="text-sm mt-1 text-slate-600">{content.analysis}</p>
          </div>

          {/* Refactored Code */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-slate-800">2. Refactored Code ({targetLanguage})</h3>
              <button onClick={() => handleCopy(content.refactored_code, 'code')} className="px-3 py-1 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition-colors">
                {copiedStates['code'] ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-900 text-white p-3 rounded-md overflow-x-auto"><code className="font-mono text-sm">{content.refactored_code}</code></pre>
          </div>

          {/* Audit Report */}
          <div>
            <h3 className="font-semibold text-slate-800">3. Performance & Security Audit</h3>
            <p className="text-sm mt-1 text-slate-600 whitespace-pre-wrap">{content.audit_report}</p>
          </div>

          {/* Unit Test */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-slate-800">4. Generated Unit Test</h3>
              <button onClick={() => handleCopy(content.unit_test, 'test')} className="px-3 py-1 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition-colors">
                {copiedStates['test'] ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-900 text-white p-3 rounded-md overflow-x-auto"><code className="font-mono text-sm">{content.unit_test}</code></pre>
          </div>

          {/* Architectural Diagram */}
          {content.image_url && (
            <div>
              <h3 className="font-semibold text-slate-800">5. Architectural Diagram</h3>
              <img src={content.image_url} alt="Architectural Diagram" className="mt-2 rounded-md border" />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-16">
            <h2 className="text-2xl font-semibold">Start a Conversation</h2>
            <p>Paste your legacy code below to begin.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {renderMessageContent(msg)}
          </div>
        ))}
        {isLoading && <div className="text-center text-slate-500">Thinking...</div>}
      </div>

      <div className="mt-auto border-t border-slate-200 pt-4">
        <div className="flex items-start gap-4">
          <textarea
            className="w-full flex-1 p-3 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow resize-none"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Paste code or ask a question..."
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleModernize(); }}}
            rows={3}
          />
          <div className="flex flex-col gap-2 w-40">
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
            >
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Rust">Rust</option>
            </select>
            <button
              className="bg-sky-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-sky-700 disabled:bg-slate-400 transition-colors"
              onClick={handleModernize}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}