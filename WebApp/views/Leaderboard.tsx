import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../types';
import { getLeaderboard, clearLeaderboard } from '../services/storage';
import { Button, Card, Badge } from '../components/ui';
import { ArrowLeft, Trash2, Calendar, CheckCircle } from 'lucide-react';

interface LeaderboardProps {
  onBack: () => void;
}

export const LeaderboardView: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getLeaderboard());
  }, []);

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your history?")) {
        clearLeaderboard();
        setEntries([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" size="sm" onClick={onBack} className="px-0 w-8">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
        </Button>
        <h1 className="text-lg font-bold text-slate-900">Leaderboard</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {entries.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No quiz history yet.</p>
             </div>
        ) : (
            <div className="space-y-3 max-w-md mx-auto">
                {entries.map((entry) => (
                    <Card key={entry.runId} className="p-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant={entry.accuracy >= 70 ? 'success' : 'warning'}>
                                    {entry.accuracy}%
                                </Badge>
                                <span className="text-sm text-slate-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(entry.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-sm font-medium text-slate-700">
                                {entry.correct} / {entry.totalAnswered} Correct
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-xs text-slate-400">
                                 {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </div>
                        </div>
                    </Card>
                ))}
            </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
          <Button 
            variant="ghost" 
            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleClear}
            disabled={entries.length === 0}
          >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear History
          </Button>
      </div>
    </div>
  );
};
