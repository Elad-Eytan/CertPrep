import React, { useState, useRef } from 'react';
import { Upload, FileJson, AlertCircle } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { RawQuestion, NormalizedQuestion } from '../types';
import { normalizeQuestions } from '../utils';

interface HomeProps {
  onStart: (questions: NormalizedQuestion[]) => void;
  onOpenLeaderboard: () => void;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const HomeView: React.FC<HomeProps> = ({ onStart, onOpenLeaderboard }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content) throw new Error("File is empty");

        const json = JSON.parse(content);
        
        let dataArray: any[] = [];

        // Relaxed Validation: Support root array OR object containing an array
        if (Array.isArray(json)) {
          dataArray = json;
        } else if (typeof json === 'object' && json !== null) {
           // Common pattern: { "questions": [...] } or { "data": [...] }
           const values = Object.values(json);
           const foundArray = values.find(v => Array.isArray(v));
           if (foundArray) {
             dataArray = foundArray as any[];
           }
        }

        if (dataArray.length === 0) {
           if (!Array.isArray(json)) {
              throw new Error("Invalid format: Root must be an array of questions.");
           }
           throw new Error("File contains no questions.");
        }

        // Filter: Find items that actually look like questions (must have a body)
        // We do not strict-check 'answer' here to allow for partial data, 
        // though the app logic handles missing answers safely (treats as no correct answer).
        const validItems = dataArray.filter((item: any) => 
          item && 
          typeof item === 'object' && 
          'body' in item
        );

        if (validItems.length === 0) {
           throw new Error("No valid questions found. Ensure the JSON array contains objects with a 'body' field.");
        }

        const normalized = normalizeQuestions(validItems as RawQuestion[]);
        
        if (normalized.length === 0) {
             throw new Error("Failed to process questions.");
        }

        // Shuffle and select 65 questions (or all if fewer than 65)
        const shuffled = shuffleArray(normalized);
        const selectedQuestions = shuffled.slice(0, 65);

        onStart(selectedQuestions);
      } catch (err: any) {
        console.error("JSON Parse Error:", err);
        setError(err.message || "Failed to parse JSON file.");
      } finally {
        setIsLoading(false);
        // Reset input to allow selecting the same file again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      }
    };
    reader.onerror = () => {
      setError("Error reading file.");
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-10 max-w-md mx-auto w-full">
      <div className="mb-8 text-center">
        <div className="bg-blue-100 p-4 rounded-2xl inline-flex mb-4">
          <FileJson className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">CertPrep Mobile</h1>
        <p className="text-slate-500">
          Load your exam dump JSON file to start practicing offline.
          <br/><span className="text-xs text-slate-400">(Auto-generates a 65-question random test)</span>
        </p>
      </div>

      <Card className="w-full p-6 mb-6">
        <div 
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <Upload className="w-8 h-8 text-slate-400 mb-3" />
          <span className="text-sm font-medium text-slate-700">Tap to select JSON file</span>
          <span className="text-xs text-slate-400 mt-1">.json files only</span>
        </div>

        {isLoading && (
          <p className="text-center text-blue-600 text-sm mt-4 font-medium animate-pulse">Processing file...</p>
        )}

        {error && (
          <div className="flex items-start gap-2 mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </Card>

      <Button variant="outline" className="w-full" onClick={onOpenLeaderboard}>
        View History & Leaderboard
      </Button>
    </div>
  );
};