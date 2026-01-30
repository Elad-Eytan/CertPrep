import React, { useState, useEffect, useMemo } from 'react';
import { NormalizedQuestion, UserAnswer } from '../types';
import { isAnswerCorrect } from '../utils';
import { Button, Card, Badge, cn } from '../components/ui';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';

interface QuizProps {
  questions: NormalizedQuestion[];
  initialRetryIds?: string[]; // IDs of questions to retry
  onComplete: (answers: UserAnswer[]) => void;
  onExit: () => void;
}

export const QuizView: React.FC<QuizProps> = ({ questions, initialRetryIds, onComplete, onExit }) => {
  // Filter questions if in retry mode
  const activeQuestions = useMemo(() => {
    if (initialRetryIds && initialRetryIds.length > 0) {
      return questions.filter(q => initialRetryIds.includes(q.id));
    }
    return questions;
  }, [questions, initialRetryIds]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);

  const currentQuestion = activeQuestions[currentIndex];
  const progress = ((currentIndex + 1) / activeQuestions.length) * 100;

  // Reset state on question change
  useEffect(() => {
    setSelectedOptions([]);
    setIsSubmitted(false);
    setShowExplanation(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex]);

  const handleOptionToggle = (key: string) => {
    if (isSubmitted) return;

    if (currentQuestion.type === 'SINGLE') {
      setSelectedOptions([key]);
    } else {
      setSelectedOptions(prev => 
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
    }
  };

  const handleSubmit = () => {
    const isCorrect = isAnswerCorrect(selectedOptions, currentQuestion.correctAnswers);
    const answerEntry: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptions,
      isCorrect,
      timestamp: Date.now()
    };

    setAnswers(prev => [...prev, answerEntry]);
    setIsSubmitted(true);
    
    // Auto-show explanation if wrong? Maybe not, usually annoying. 
    // User can click "Show Explanation".
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const isOptionSelected = (key: string) => selectedOptions.includes(key);
  const isCorrectKey = (key: string) => currentQuestion.correctAnswers.includes(key);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" onClick={onExit} className="px-0 w-8 h-8">
               <span className="sr-only">Exit</span>
               <XCircle className="w-6 h-6 text-slate-400" />
             </Button>
             <span className="text-sm font-semibold text-slate-700">
                {currentQuestion.topic} <span className="text-slate-400 font-normal">#{currentQuestion.index}</span>
             </span>
          </div>
          <span className="text-sm font-medium text-slate-500">
            {currentIndex + 1} / {activeQuestions.length}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 no-scrollbar">
        {/* Question Body */}
        <div className="text-lg font-medium text-slate-900 leading-relaxed mb-6 whitespace-pre-line">
          {currentQuestion.body}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {currentQuestion.type === 'SINGLE' ? 'Select One Option' : 'Select All That Apply'}
            </div>
            {currentQuestion.options.map((option) => {
                const isSelected = isOptionSelected(option.key);
                const isCorrect = isCorrectKey(option.key);
                
                // Determine styling based on state
                let variantClass = "border-slate-200 bg-white hover:bg-slate-50";
                let icon = null;

                if (isSubmitted) {
                    if (isCorrect) {
                        variantClass = "border-green-500 bg-green-50 text-green-900";
                        icon = <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />;
                    } else if (isSelected && !isCorrect) {
                         variantClass = "border-red-500 bg-red-50 text-red-900";
                         icon = <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
                    } else if (!isSelected && !isCorrect) {
                        variantClass = "opacity-60";
                    }
                } else if (isSelected) {
                    variantClass = "border-blue-500 bg-blue-50 ring-1 ring-blue-500";
                }

                return (
                    <div 
                        key={option.key}
                        onClick={() => handleOptionToggle(option.key)}
                        className={cn(
                            "relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all",
                            variantClass
                        )}
                    >
                        <div className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full border mr-3 shrink-0 mt-0.5",
                            isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300 bg-white",
                            isSubmitted && isCorrect && "border-green-500 bg-green-500",
                            isSubmitted && isSelected && !isCorrect && "border-red-500 bg-red-500"
                        )}>
                            {isSubmitted ? (
                                isCorrect ? <CheckCircle2 className="w-4 h-4 text-white" /> : 
                                (isSelected ? <XCircle className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-slate-500">{option.key}</span>)
                            ) : (
                                <span className="text-xs font-bold">{option.key}</span>
                            )}
                        </div>
                        <span className="text-sm font-medium flex-1">{option.text}</span>
                        {isSubmitted && icon && <div className="ml-2">{icon}</div>}
                    </div>
                );
            })}
        </div>

        {/* Explanation Section */}
        {isSubmitted && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {showExplanation ? (
                    <Card className="p-5 bg-blue-50 border-blue-100">
                        <div className="flex items-center gap-2 mb-3 text-blue-800 font-semibold">
                            <BookOpen className="w-5 h-5" />
                            <h3>Explanation</h3>
                        </div>
                        <div className="prose prose-sm text-slate-700 whitespace-pre-line leading-relaxed">
                            {currentQuestion.explanation || "No explanation provided."}
                        </div>
                    </Card>
                ) : (
                    <Button variant="ghost" className="w-full text-blue-600" onClick={() => setShowExplanation(true)}>
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Show Explanation
                    </Button>
                )}
            </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-20 pb-safe">
        {!isSubmitted ? (
            <Button 
                className="w-full shadow-lg shadow-blue-200" 
                size="lg" 
                onClick={handleSubmit}
                disabled={selectedOptions.length === 0}
            >
                Submit Answer
            </Button>
        ) : (
            <Button 
                className="w-full shadow-lg shadow-blue-200" 
                size="lg" 
                onClick={handleNext}
            >
                {currentIndex < activeQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
        )}
      </div>
    </div>
  );
};
