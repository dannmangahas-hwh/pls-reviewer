import React from 'react';
import { Scale } from 'lucide-react';
import { View } from '../types';

interface HeaderProps {
  onHome: () => void;
  onViewChange: (view: View) => void;
  currentView: View;
}

export const Header: React.FC<HeaderProps> = ({ onHome, onViewChange, currentView }) => (
  <header className="bg-navy-900 text-white sticky top-0 z-50 shadow-lg">
    <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
        <div className="bg-gold-500 p-1.5 rounded">
          <Scale className="w-6 h-6 text-navy-900" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">PLS BAR</h1>
          <p className="text-[10px] uppercase tracking-widest opacity-70 font-semibold">Bar Exam Reviewer</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <button 
          onClick={() => onViewChange('subjects')}
          className={`transition-opacity ${currentView === 'subjects' ? 'opacity-100 text-gold-500' : 'opacity-80 hover:opacity-100'}`}
        >
          Subjects
        </button>
        <button 
          onClick={() => onViewChange('yearly')}
          className={`transition-opacity ${currentView === 'yearly' ? 'opacity-100 text-gold-500' : 'opacity-80 hover:opacity-100'}`}
        >
          Past Exams
        </button>
      </div>
    </div>
  </header>
);
