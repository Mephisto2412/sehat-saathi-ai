import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, IntentType, ProcessingState, DocumentData, AshaPatient, RiskLevel } from './types';

// *** CRITICAL FIX: Ensure this points to './services/database' ***
import { db } from './services/database'; 

import { classifyIntent, generateRAGResponse, generateEmergencyResponse, analyzeHealthData } from './services/geminiService';
import DocumentSidebar from './components/DocumentSidebar';
import ChatMessageBubble from './components/ChatMessageBubble';
import ProcessingIndicator from './components/ProcessingIndicator';
import AshaDashboard from './components/AshaDashboard';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isOnline, setIsOnline] = useState(true); 
  
  // LIVE DATA STATES
  const [patients, setPatients] = useState<AshaPatient[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  
  // Check if db is initialized correctly before calling methods
  const [currentUserData, setCurrentUserData] = useState<AshaPatient>(() => {
    return db.getCurrentUser ? db.getCurrentUser() : {} as AshaPatient;
  });

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Namaste Rani Devi. I am Sehat Saathi. I can help with health questions and government schemes (money). Press the mic to speak.",
      timestamp: new Date(),
      intent: IntentType.GREETING
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [processingState, setProcessingState] = useState<ProcessingState>({ step: 'idle' });
  const [activeDocIds, setActiveDocIds] = useState<string[]>([]);
  
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // ==========================================
  // REAL-TIME SUBSCRIPTION HOOK
  // ==========================================
  useEffect(() => {
    // Safety check: if db isn't loaded correctly, don't run
    if (!db || !db.subscribeToPatients) {
      console.error("Database service not loaded correctly");
      return;
    }

    // 1. Subscribe to Patient Changes (Updates Dashboard & Chat Profile)
    const unsubPatients = db.subscribeToPatients((data) => {
      setPatients(data);
      const user = data.find(p => p.id === 'user_123');
      if (user) {
        setCurrentUserData(user); // Auto-update current user profile in memory
      }
    });

    // 2. Subscribe to Doc Changes
    const unsubDocs = db.subscribeToDocuments((data) => {
      setDocuments(data);
    });

    return () => {
      unsubPatients();
      unsubDocs();
    };
  }, []); // Runs once on mount

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, processingState]);

  // ... existing speech recognition code ...
  useEffect(() => {
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    if (webkitSpeechRecognition || SpeechRecognition) {
      const SpeechRecognitionObj = SpeechRecognition || webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionObj();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        handleSend(transcript); 
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = selectedLang; 
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition not supported in this browser.");
      }
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang; 
      utterance.onerror = (e) => console.error("Speech synthesis error", e);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (manualText?: string) => {
    const text = manualText || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setActiveDocIds([]); 

    if (!isOnline) {
      processOfflineMessage(text);
    } else {
      await processMessage(userMsg.content);
    }
  };

  const processOfflineMessage = (query: string) => {
    const lowerQ = query.toLowerCase();
    let response = "";
    let isEmergency = false;

    // Emergency Detection
    const emergencyKeywords = ["pain", "bleed", "emergency", "water", "broke", "fever", "hot", "uneasy", "dizzy", "headache"];
    const isEmergencyDetected = emergencyKeywords.some(keyword => lowerQ.includes(keyword));

    if (isEmergencyDetected) {
      response = "DANGER ALERT: Please go to the hospital or PHC immediately. Call 108. (Offline Mode Active)";
      isEmergency = true;
      
      // TRIGGER DB UPDATE
      const updatedUser = {
          ...currentUserData,
          risk_level: 'critical' as RiskLevel,
          last_contact: 'Just now',
          timeline: [{
              symptoms: [{ symptom: 'Emergency Reported (Offline)', severity: 'critical', timestamp: new Date().toISOString() }],
              medications: [],
              vitals: {},
              action_needed: 'critical',
              summary: 'Patient reported emergency symptoms in Offline Mode.',
              suspected_conditions: ['Emergency Alert'],
              concerns: [],
              lifestyle: {}
          }, ...currentUserData.timeline]
      };
      db.updatePatient(updatedUser);
      
    } else if (lowerQ.includes("hello") || lowerQ.includes("namaste")) {
      response = "Namaste. I am Sehat Saathi (Offline).";
    } else if (lowerQ.includes("money") || lowerQ.includes("scheme") || lowerQ.includes("rupee")) {
        response = "For financial scheme details, please connect to the internet.";
    } else {
      response = "I am currently offline. I can only detect emergencies. Please connect to the internet.";
    }

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        intent: IntentType.UNKNOWN,
        isEmergency: isEmergency
      };
      setMessages(prev => [...prev, botMsg]);
      speakText(response, selectedLang);
    }, 500);
  };

  const processMessage = async (query: string) => {
    try {
      setProcessingState({ step: 'detecting_intent', details: 'Understanding Request...' });
      const intent = await classifyIntent(query);
      
      let responseText = '';
      let usedDocs: DocumentData[] = [];
      let isEmergency = false;

      if (intent === IntentType.EMERGENCY) {
        setProcessingState({ step: 'synthesizing', details: 'Generating Alert...' });
        responseText = await generateEmergencyResponse(query, selectedLang);
        isEmergency = true;
      } 
      else if (intent === IntentType.SCHEMES) {
        setProcessingState({ step: 'retrieving_docs', details: `Checking Government Benefits...` });
        usedDocs = documents.filter(d => d.category === 'schemes' || d.category === 'personal');
        setActiveDocIds(usedDocs.map(d => d.id));
        await new Promise(r => setTimeout(r, 600));

        setProcessingState({ step: 'synthesizing', details: 'Explaining Benefits...' });
        const contextStrings = usedDocs.map(d => `FILE: ${d.filename}\nCONTENT:\n${d.content}`);
        responseText = await generateRAGResponse(query, contextStrings, intent, selectedLang);
      }
      else if (intent === IntentType.PERSONAL || intent === IntentType.MEDICAL) {
        setProcessingState({ step: 'retrieving_docs', details: `Checking Health Records...` });
        usedDocs = intent === IntentType.PERSONAL 
            ? documents.filter(d => d.category === 'personal') 
            : documents.filter(d => d.category === 'medical');
            
        setActiveDocIds(usedDocs.map(d => d.id));
        await new Promise(r => setTimeout(r, 600));

        setProcessingState({ step: 'synthesizing', details: 'Preparing Answer...' });
        const contextStrings = usedDocs.map(d => `FILE: ${d.filename}\nCONTENT:\n${d.content}`);
        responseText = await generateRAGResponse(query, contextStrings, intent, selectedLang);
      } 
      else {
        setProcessingState({ step: 'synthesizing', details: 'Thinking...' });
        responseText = await generateEmergencyResponse(query, selectedLang);
      }

      const botMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        intent: intent,
        usedDocs: usedDocs,
        isEmergency: isEmergency
      };

      setMessages(prev => [...prev, botMsg]);
      speakText(responseText, selectedLang);

      // Background Clinical Extraction & DB Update
      setProcessingState({ step: 'extracting_data', details: 'Updating Health Record...' });
      const extractedData = await analyzeHealthData(query);
      
      if (extractedData) {
          const updatedUser = {
              ...currentUserData,
              risk_level: extractedData.action_needed as RiskLevel,
              last_contact: 'Just now',
              timeline: [extractedData, ...currentUserData.timeline]
          };
          db.updatePatient(updatedUser);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: "Network error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setProcessingState({ step: 'complete' });
      setTimeout(() => setProcessingState({ step: 'idle' }), 2000);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (showDashboard) {
    return (
      <AshaDashboard 
        currentUser={currentUserData} 
        otherPatients={patients.filter(p => p.id !== 'user_123')} 
        onBack={() => setShowDashboard(false)} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-white font-sans">
      <div className="hidden md:block h-full shadow-xl z-10">
        <DocumentSidebar activeDocIds={activeDocIds} documents={documents} />
      </div>

      <div className="flex-1 flex flex-col h-full relative">
        <header className="bg-white border-b border-slate-100 p-4 flex justify-between items-center shadow-sm z-20">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white mr-3 shadow-sm">
              <span className="font-bold text-lg tracking-tight">SS</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">Sehat Saathi</h1>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setIsOnline(!isOnline)}
                   className={`text-[10px] flex items-center px-2 py-0.5 rounded-full border transition-all duration-300 ${isOnline ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`}
                 >
                   <span className={`w-1.5 h-1.5 rounded-full mr-1 ${isOnline ? 'bg-green-600 animate-pulse' : 'bg-slate-500'}`}></span>
                   {isOnline ? 'Internet Mode (Active)' : 'Offline Mode (Basic)'}
                 </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <button 
               onClick={() => setShowDashboard(true)}
               className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded font-medium border border-slate-200 transition"
             >
               View ASHA Dashboard
             </button>
             
             <select 
               value={selectedLang}
               onChange={(e) => setSelectedLang(e.target.value)}
               className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium text-slate-700"
             >
               <option value="en-IN">English (India)</option>
               <option value="hi-IN">Hindi (हिन्दी)</option>
               <option value="gu-IN">Gujarati (ગુજરાતી)</option>
               <option value="mr-IN">Marathi (मराठी)</option>
               <option value="bn-IN">Bengali (বাংলা)</option>
               <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
             </select>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 scrollbar-hide">
          <div className="max-w-3xl mx-auto">
             {!isOnline && (
               <div className="mb-4 p-2 bg-slate-200 text-slate-600 text-xs text-center rounded border border-slate-300">
                 You are Offline. I can only help with basic emergencies.
               </div>
             )}
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
            <ProcessingIndicator state={processingState} />
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto relative flex gap-2">
             <button
               onClick={toggleListening}
               className={`p-4 rounded-full transition-all flex-shrink-0 flex items-center justify-center w-14 h-14 ${
                 isListening 
                   ? 'bg-teal-500 text-white shadow-lg ring-4 ring-teal-200 animate-pulse' 
                   : 'bg-teal-50 text-teal-600 hover:bg-teal-100 border-2 border-teal-100'
               }`}
               title="Press to Speak"
             >
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 {isListening ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                 ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                 )}
               </svg>
             </button>

             <div className="relative flex-1 flex items-center">
               <input
                  ref={inputRef}
                  type="text"
                  className="w-full pl-5 pr-12 py-4 rounded-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm"
                  placeholder={isListening ? "Listening..." : "Type or Speak..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={processingState.step !== 'idle' && processingState.step !== 'complete'}
               />
               <button
                 onClick={() => handleSend()}
                 disabled={!inputValue.trim() || (processingState.step !== 'idle' && processingState.step !== 'complete')}
                 className="absolute right-2 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-10 h-10 flex items-center justify-center"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;