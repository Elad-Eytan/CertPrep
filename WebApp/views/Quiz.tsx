import React, { useState, useEffect, useMemo } from 'react';
import { NormalizedQuestion, UserAnswer } from '../types';
import { isAnswerCorrect } from '../utils';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, ChevronLeft, HelpCircle } from 'lucide-react';

interface QuizProps {
  questions: NormalizedQuestion[];
  initialRetryIds: string[];
  onComplete: (answers: UserAnswer[]) => void;
  onExit: () => void;
}

export const QuizView: React.FC<QuizProps> = ({ questions, initialRetryIds, onComplete, onExit }) => {
  const activeQuestions = useMemo(() => {
    if (initialRetryIds.length > 0) {
      return questions.filter(q => initialRetryIds.includes(q.id));
    }
    return questions;
  }, [questions, initialRetryIds]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState<UserAnswer[]>([]);

  const current = activeQuestions[currentIndex];
  const progress = ((currentIndex + 1) / activeQuestions.length) * 100;

  useEffect(() => {
    setSelected([]);
    setIsSubmitted(false);
    setShowExplanation(false);
    window.scrollTo(0, 0);
  }, [currentIndex]);

  const toggleOption = (key: string) => {
    if (isSubmitted) return;
    if (current.type === 'SINGLE') {
      setSelected([key]);
    } else {
      setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    }
  };

  const handleAction = () => {
    if (!isSubmitted) {
      const isCorrect = isAnswerCorrect(selected, current.correctAnswers);
      setSessionAnswers(prev => [...prev, {
        questionId: current.id,
        selectedOptions: selected,
        isCorrect,
        timestamp: Date.now()
      }]);
      setIsSubmitted(true);
    } else {
      if (currentIndex < activeQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete(sessionAnswers);
      }
    }
  };

  return (
    <div className="flex flex-col h-full fade-in">
      {/* Top Navigation */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={onExit} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              {current.topic}
            </span>
            <span className="text-sm font-black text-slate-900 leading-none">
              Question {currentIndex + 1} <span className="text-slate-300">/</span> {activeQuestions.length}
            </span>
          </div>
          <div className="w-10"></div>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 px-6 py-8 space-y-8">
        <h2 className="text-xl font-bold text-slate-900 leading-tight">
          {current.body}
        </h2>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            {current.type === 'SINGLE' ? 'Single Choice' : `Multiple Choice (${current.correctAnswers.length})`}
          </p>
          
          {current.options.map((opt) => {
            const isSel = selected.includes(opt.key);
            const isCor = current.correctAnswers.includes(opt.key);
            
            let variant = "bg-white border-slate-200 text-slate-700 hover:border-blue-300";
            if (isSubmitted) {
              if (isCor) variant = "bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500";
              else if (isSel) variant = "bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500";
              else variant = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
            } else if (isSel) {
              variant = "bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600";
            }

            return (
              <button
                key={opt.key}
                disabled={isSubmitted}
                onClick={() => toggleOption(opt.key)}
                className={`w-full text-left p-5 rounded-3xl border-2 transition-all duration-200 flex items-start gap-4 active:scale-[0.98] ${variant}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSel ? 'bg-current border-transparent' : 'border-slate-300'
                }`}>
                  {isSubmitted && isCor ? <CheckCircle2 className="w-4 h-4 text-white" /> :
                   isSubmitted && isSel && !isCor ? <XCircle className="w-4 h-4 text-white" /> :
                   <span className={`text-[10px] font-black ${isSel ? 'text-white' : 'text-slate-400'}`}>{opt.key}</span>}
                </div>
                <span className="text-sm font-semibold leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="space-y-4 pt-4 pb-12 animate-slide-up">
            {showExplanation ? (
              <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                  <BookOpen className="w-4 h-4" />
                  Explanation
                </div>
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {current.explanation || "No explanation provided for this question."}
                </p>
              </div>
            ) : (
              <button 
                onClick={() => setShowExplanation(true)}
                className="w-full flex items-center justify-center gap-2 py-4 text-blue-600 font-bold text-sm hover:bg-blue-50 rounded-2xl transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                View Detailed Explanation
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Footer */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 z-30 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <button 
          onClick={handleAction}
          disabled={!isSubmitted && selected.length === 0}
          className={`w-full h-16 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
            !isSubmitted 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 disabled:bg-slate-200 disabled:shadow-none' 
              : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
          }`}
        >
          {!isSubmitted ? 'Check Answer' : currentIndex < activeQuestions.length - 1 ? 'Next Question' : 'Finish Session'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};