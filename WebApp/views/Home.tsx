import React, { useRef, useState } from 'react';
import { Upload, FileText, History, Info, CheckCircle } from 'lucide-react';
import { normalizeQuestions } from '../utils';
import { RawQuestion, NormalizedQuestion } from '../types';

interface HomeProps {
  onStart: (qs: NormalizedQuestion[]) => void;
  onShowHistory: () => void;
}

export const HomeView: React.FC<HomeProps> = ({ onStart, onShowHistory }) => {
  const [error, setError] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        let data = Array.isArray(content) ? content : (content.questions || Object.values(content).find(v => Array.isArray(v)));
        
        if (!data || !Array.isArray(data)) throw new Error("Could not find question list in JSON.");
        
        const normalized = normalizeQuestions(data as RawQuestion[]);
        if (normalized.length === 0) throw new Error("No valid questions found.");
        
        onStart(normalized);
      } catch (err: any) {
        setError(err.message || "Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 flex flex-col p-8 fade-in">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200 rotate-3">
          <FileText className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">CertPrep Pro</h1>
          <p className="text-slate-500 text-sm font-medium">Practice smarter, pass faster.</p>
        </div>

        <div 
          className={`w-full group relative ${isHovering ? 'scale-105' : ''} transition-all duration-300`}
          onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
          onDragLeave={() => setIsHovering(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsHovering(false);
            const file = e.dataTransfer.files[0];
            if (file) processFile(file);
          }}
        >
          <input 
            type="file" 
            ref={inputRef} 
            className="hidden" 
            accept=".json" 
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} 
          />
          <button 
            onClick={() => inputRef.current?.click()}
            className="w-full aspect-square max-h-64 border-4 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50 flex flex-col items-center justify-center space-y-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-700">Drop Exam JSON</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">or tap to browse</p>
            </div>
          </button>
        </div>

        {error && (
          <div className="w-full p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3 animate-bounce">
            <Info className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold text-left">{error}</p>
          </div>
        )}
      </div>

      <div className="pt-8 space-y-4">
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
          <div className="h-px flex-1 bg-slate-100"></div>
          <span>Previous Sessions</span>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>
        
        <button 
          onClick={onShowHistory}
          className="w-full h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center px-6 gap-4 hover:bg-slate-50 transition-colors group"
        >
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <History className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
          </div>
          <span className="font-bold text-slate-700 flex-1 text-left">View Leaderboard</span>
          <CheckCircle className="w-5 h-5 text-slate-200" />
        </button>
      </div>
    </div>
  );
};