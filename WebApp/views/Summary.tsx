
import React from 'react';
import { RefreshCw, RotateCcw, Trophy } from 'lucide-react';
import { UserAnswer, NormalizedQuestion } from '../types';

interface SummaryProps {
  questions: NormalizedQuestion[];
  userAnswers: UserAnswer[];
  onRetry: (ids: string[]) => void;
  onHome: () => void;
  onHistory: () => void;
}

export const SummaryView: React.FC<SummaryProps> = ({ questions, userAnswers, onRetry, onHome, onHistory }) => {
  const correct = userAnswers.filter(a => a.isCorrect).length;
  const total = userAnswers.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const incorrectIds = userAnswers.filter(a => !a.isCorrect).map(a => a.questionId);

  return (
    <div className="flex-1 flex flex-col p-8 fade-in space-y-8">
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
          <Trophy className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Well Done!</h1>
        <p className="text-slate-500 font-medium italic">"Every expert was once a beginner."</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
          <p className="text-3xl font-black text-blue-600">{accuracy}%</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accuracy</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
          <p className="text-3xl font-black text-slate-900">{correct}<span className="text-slate-300 text-xl">/{total}</span></p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Correct</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 py-4">
        {incorrectIds.length > 0 && (
          <button 
            onClick={() => onRetry(incorrectIds)}
            className="w-full h-16 bg-blue-600 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            Retry Mistakes ({incorrectIds.length})
          </button>
        )}
        
        <button 
          onClick={onHome}
          className="w-full h-16 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold text-base flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Start New Practice
        </button>

        <button 
          onClick={onHistory}
          className="w-full h-16 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
        >
          View Full Progress History
        </button>
      </div>
    </div>
  );
};
