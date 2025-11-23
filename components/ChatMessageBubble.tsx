import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, IntentType } from '../types';

interface Props {
  message: ChatMessage;
}

const ChatMessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  const isEmergency = message.isEmergency;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(message.content);
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const getIntentColor = (intent?: IntentType) => {
      switch(intent) {
          case IntentType.EMERGENCY: return 'bg-red-100 text-red-700';
          case IntentType.SCHEMES: return 'bg-purple-100 text-purple-700';
          case IntentType.PERSONAL: return 'bg-blue-100 text-blue-700';
          case IntentType.MEDICAL: return 'bg-teal-100 text-teal-700';
          default: return 'bg-slate-100 text-slate-600';
      }
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-[90%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Avatar / Name */}
        <div className="flex items-center mb-1 ml-1 gap-2">
          <span className={`text-xs font-medium ${isUser ? 'text-slate-400' : 'text-teal-600'}`}>
            {isUser ? 'Rani Devi' : 'Sehat Saathi'}
          </span>
          {!isUser && (
             <button 
               onClick={handleSpeak}
               className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${isSpeaking ? 'text-teal-600' : 'text-slate-400'}`}
               title="Read Aloud"
             >
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                 {isSpeaking ? (
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                 ) : (
                    <path d="M8 5v14l11-7z"/>
                 )}
               </svg>
             </button>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`px-5 py-4 rounded-2xl shadow-sm text-lg md:text-xl leading-relaxed overflow-hidden relative group font-medium
            ${isUser 
              ? 'bg-slate-800 text-white rounded-br-none' 
              : isEmergency
                ? 'bg-red-50 text-red-900 border-l-4 border-red-500 rounded-bl-none'
                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
            }
          `}
        >
          {isEmergency && !isUser && (
             <div className="flex items-center gap-2 font-bold text-red-600 mb-2 pb-2 border-b border-red-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                EMERGENCY ALERT
             </div>
          )}
          
          <div className="prose prose-lg max-w-none prose-p:my-1 prose-headings:my-2">
             <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Call ASHA Card - Only for emergencies */}
          {isEmergency && !isUser && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-red-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Call ASHA Worker</p>
                  <p className="text-xs text-slate-500">Mrs. Sunita • Village 4</p>
                </div>
              </div>
              <a 
                href="tel:108" 
                className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                Call Now
              </a>
            </div>
          )}
        </div>

        {/* Meta Info (Intent & Sources) */}
        {!isUser && message.intent && (
          <div className="mt-2 flex flex-wrap gap-2 items-center">
            {/* Intent Badge */}
            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold ${getIntentColor(message.intent)}`}>
              {message.intent.replace('_', ' ')}
            </span>

            {/* Sources Used */}
            {message.usedDocs && message.usedDocs.length > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span>• Info from:</span>
                {message.usedDocs.map(doc => (
                  <span key={doc.id} className="underline decoration-slate-300 hover:text-slate-600 cursor-help" title={doc.filename}>
                    {doc.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageBubble;