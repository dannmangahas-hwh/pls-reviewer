import React from 'react';
import { Calendar, Award, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarQuestion } from '../types';

interface QuestionCardProps {
  question: BarQuestion;
  isExpanded: boolean;
  onToggle: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, isExpanded, onToggle }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm font-bold text-navy-900">
          <Calendar className="w-4 h-4 text-slate-400" />
          {question.year} Bar Exam
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <Award className="w-4 h-4 text-gold-500" />
          Chair: {question.bar_chair}
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="legal-text text-lg leading-relaxed text-slate-800 mb-6 italic border-l-4 border-navy-700 pl-6 py-2 whitespace-pre-wrap">
        "{question.question_text}"
      </div>

      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm font-bold text-navy-900"
      >
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {isExpanded ? 'Hide Suggested Answer' : 'View Suggested Answer'}
        </span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-6 bg-navy-900 text-white rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-3">Suggested Answer</h4>
              <p className="legal-text leading-relaxed opacity-90 whitespace-pre-wrap">
                {question.suggested_answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
