import React from 'react';
import { ProcessingState } from '../types';

interface Props {
  state: ProcessingState;
}

const ProcessingIndicator: React.FC<Props> = ({ state }) => {
  if (state.step === 'idle' || state.step === 'complete') return null;

  // JARGON REMOVED: Replaced technical terms with user-friendly text
  const steps = [
    { id: 'detecting_intent', label: 'Understanding Request', color: 'bg-purple-500' },
    { id: 'retrieving_docs', label: 'Checking Records', color: 'bg-blue-500' },
    { id: 'synthesizing', label: 'Preparing Answer', color: 'bg-green-500' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === state.step);

  return (
    <div className="mx-4 mb-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center space-x-3 text-sm">
        <div className="flex space-x-1">
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
        <span className="font-medium text-slate-600">{state.details || 'Processing...'}</span>
      </div>
      
      {/* Visual Progress Bar */}
      <div className="flex items-center mt-3 space-x-1">
         {steps.map((s, idx) => {
            const isActive = s.id === state.step;
            const isPast = idx < currentStepIndex;
            
            return (
                <div key={s.id} className="flex-1 flex flex-col items-center">
                    <div className={`h-1 w-full rounded-full transition-colors duration-300 ${isActive ? s.color : (isPast ? 'bg-slate-300' : 'bg-slate-100')}`}></div>
                    <span className={`text-[10px] mt-1 ${isActive ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
                        {s.label}
                    </span>
                </div>
            )
         })}
      </div>
    </div>
  );
};

export default ProcessingIndicator;