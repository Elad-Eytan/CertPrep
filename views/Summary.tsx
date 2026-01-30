import React from 'react';
import { UserAnswer, NormalizedQuestion, LeaderboardEntry } from '../types';
import { Button, Card, cn } from '../components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { RefreshCw, RotateCcw, Home, Trophy } from 'lucide-react';

interface SummaryProps {
  questions: NormalizedQuestion[];
  userAnswers: UserAnswer[];
  onRetryIncorrect: (ids: string[]) => void;
  onNewQuiz: () => void;
  onViewLeaderboard: () => void;
}

export const SummaryView: React.FC<SummaryProps> = ({ 
  questions, 
  userAnswers, 
  onRetryIncorrect, 
  onNewQuiz,
  onViewLeaderboard 
}) => {
  // Calculate Stats
  const total = userAnswers.length;
  const correct = userAnswers.filter(a => a.isCorrect).length;
  const incorrect = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  const incorrectIds = userAnswers.filter(a => !a.isCorrect).map(a => a.questionId);

  const data = [
    { name: 'Correct', value: correct, color: '#22c55e' }, // green-500
    { name: 'Incorrect', value: incorrect, color: '#ef4444' }, // red-500
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar">
      <div className="p-6 flex-1 max-w-md mx-auto w-full">
        
        <div className="text-center mb-8 mt-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Quiz Complete!</h2>
            <p className="text-slate-500">Here is how you performed</p>
        </div>

        {/* Score Card */}
        <Card className="p-6 mb-6 flex flex-col items-center shadow-lg shadow-slate-200/50">
            <div className="h-48 w-full mb-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-extrabold text-slate-900">{accuracy}%</span>
                    <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Accuracy</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-green-50 border border-green-100 p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">{correct}</div>
                    <div className="text-xs text-green-700 font-medium uppercase">Correct</div>
                </div>
                <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-red-600">{incorrect}</div>
                    <div className="text-xs text-red-700 font-medium uppercase">Incorrect</div>
                </div>
            </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
            {incorrect > 0 && (
                <Button 
                    onClick={() => onRetryIncorrect(incorrectIds)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Retry Incorrect ({incorrect})
                </Button>
            )}

            <Button onClick={onNewQuiz} className="w-full" variant="outline">
                <RefreshCw className="w-5 h-5 mr-2" />
                Start New Quiz
            </Button>
            
             <Button onClick={onViewLeaderboard} className="w-full" variant="ghost">
                <Trophy className="w-5 h-5 mr-2" />
                View Leaderboard
            </Button>
        </div>
      </div>
    </div>
  );
};
