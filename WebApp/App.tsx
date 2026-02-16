import React, { useState, useEffect } from 'react';
import { NormalizedQuestion, UserAnswer, LeaderboardEntry } from './types';
import { saveRun } from './services/storage';

import { HomeView } from './views/Home';
import { QuizView } from './views/Quiz';
import { SummaryView } from './views/Summary';
import { LeaderboardView } from './views/Leaderboard';

type ViewState = 'HOME' | 'QUIZ' | 'SUMMARY' | 'LEADERBOARD';

export default function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [questions, setQuestions] = useState<NormalizedQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [retryIds, setRetryIds] = useState<string[]>([]);

  const startQuiz = (loadedQuestions: NormalizedQuestion[]) => {
    setQuestions(loadedQuestions);
    setUserAnswers([]);
    setRetryIds([]);
    setView('QUIZ');
  };

  const finishQuiz = (answers: UserAnswer[]) => {
    setUserAnswers(prev => [...prev, ...answers]);
    
    const correctCount = answers.filter(a => a.isCorrect).length;
    const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
    
    const entry: LeaderboardEntry = {
      runId: Date.now().toString(),
      date: new Date().toISOString(),
      totalAnswered: answers.length,
      correct: correctCount,
      accuracy
    };
    saveRun(entry);
    setView('SUMMARY');
  };

  const retryIncorrect = (ids: string[]) => {
    setRetryIds(ids);
    setUserAnswers([]);
    setView('QUIZ');
  };

  const reset = () => {
    setQuestions([]);
    setUserAnswers([]);
    setRetryIds([]);
    setView('HOME');
  };

  return (
    <div className="app-container">
      {view === 'HOME' && (
        <HomeView onStart={startQuiz} onShowHistory={() => setView('LEADERBOARD')} />
      )}
      
      {view === 'QUIZ' && (
        <QuizView 
          questions={questions} 
          initialRetryIds={retryIds}
          onComplete={finishQuiz} 
          onExit={reset} 
        />
      )}

      {view === 'SUMMARY' && (
        <SummaryView 
          questions={questions}
          userAnswers={userAnswers}
          onRetry={retryIncorrect}
          onHome={reset}
          onHistory={() => setView('LEADERBOARD')}
        />
      )}

      {view === 'LEADERBOARD' && (
        <LeaderboardView onBack={() => setView(questions.length > 0 ? 'SUMMARY' : 'HOME')} />
      )}
    </div>
  );
}