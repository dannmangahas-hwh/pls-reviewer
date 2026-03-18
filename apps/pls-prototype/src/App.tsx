import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  TrendingUp, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_DATA } from './data';
import { View } from './types';
import { Header } from './components/Header';
import { SubjectGrid } from './components/SubjectGrid';
import { QuestionCard } from './components/QuestionCard';

export default function App() {
  const [view, setView] = useState<View>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Derived Data
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(MOCK_DATA.map(q => q.year)));
    return years.sort((a, b) => b - a);
  }, []);

  const yearlyQuestions = useMemo(() => {
    if (!selectedYear) return [];
    return MOCK_DATA.filter(q => q.year === selectedYear);
  }, [selectedYear]);

  const subTopics = useMemo(() => {
    if (!selectedSubject) return [];
    const topics = MOCK_DATA
      .filter(q => q.subject === selectedSubject)
      .reduce((acc, q) => {
        const existing = acc.find(t => t.name === q.sub_topic);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ name: q.sub_topic, count: 1 });
        }
        return acc;
      }, [] as { name: string; count: number }[]);
    
    return topics.sort((a, b) => b.count - a.count);
  }, [selectedSubject]);

  const questions = useMemo(() => {
    if (!selectedSubject || !selectedSubTopic) return [];
    return MOCK_DATA.filter(q => q.subject === selectedSubject && q.sub_topic === selectedSubTopic);
  }, [selectedSubject, selectedSubTopic]);

  const topicStats = useMemo(() => {
    if (questions.length === 0) return null;
    const years = questions.map(q => q.year);
    return {
      count: questions.length,
      earliestYear: Math.min(...years)
    };
  }, [questions]);

  const getPriority = (count: number) => {
    if (count >= 10) return { label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' };
    if (count >= 5) return { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    return { label: 'Medium', color: 'bg-blue-100 text-blue-700 border-blue-200' };
  };

  // Handlers
  const handleSubjectClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setView('sub-topics');
    window.scrollTo(0, 0);
  };

  const handleSubTopicClick = (topicName: string) => {
    setSelectedSubTopic(topicName);
    setView('questions');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (view === 'questions') {
      setView('sub-topics');
      setSelectedSubTopic(null);
    } else if (view === 'sub-topics') {
      setView('subjects');
      setSelectedSubject(null);
    }
  };

  const handleHome = () => {
    setView('subjects');
    setSelectedSubject(null);
    setSelectedSubTopic(null);
    setSelectedYear(null);
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onHome={handleHome} onViewChange={setView} currentView={view} />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'yearly' && (
            <motion.div
              key="yearly"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-navy-900">Past Bar Examinations</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                  Browse historical bar exam questions and suggested answers organized by year.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => handleYearClick(year)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      selectedYear === year 
                        ? 'bg-navy-900 text-white shadow-lg scale-105' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-gold-500 hover:text-gold-600'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              {selectedYear && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h3 className="text-xl font-bold text-navy-900">
                      Questions from {selectedYear}
                    </h3>
                    <span className="text-sm text-slate-500 font-medium">
                      {yearlyQuestions.length} Questions found
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    {yearlyQuestions.map((q) => (
                      <QuestionCard 
                        key={q.id} 
                        question={q} 
                        isExpanded={expandedQuestion === q.id}
                        onToggle={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'subjects' && (
            <SubjectGrid onSelectSubject={handleSubjectClick} />
          )}

          {view === 'sub-topics' && (
            <motion.div
              key="sub-topics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-navy-900">{selectedSubject}</h2>
                  <p className="text-sm text-slate-500">Select a sub-topic to view historical questions</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                {subTopics.length > 0 ? (
                  subTopics.map((topic) => {
                    const priority = getPriority(topic.count);
                    return (
                      <button
                        key={topic.name}
                        onClick={() => handleSubTopicClick(topic.name)}
                        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="flex-grow">
                          <h3 className="font-bold text-slate-800 mb-1">{topic.name}</h3>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center text-xs font-medium text-slate-500">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Appeared {topic.count} times
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${priority.color}`}>
                            {priority.label}
                          </span>
                          <ChevronRight className="w-5 h-5 text-slate-300" />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No data available for this subject yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-navy-700 uppercase tracking-widest mb-1">
                    <span>{selectedSubject}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>{selectedSubTopic}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-navy-900">Historical Questions</h2>
                </div>
              </div>

              {topicStats && (
                <div className="bg-navy-50 border border-navy-100 p-6 rounded-2xl flex items-center gap-4">
                  <div className="bg-navy-900 p-3 rounded-xl text-white">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-navy-900 font-bold text-lg">
                      This topic showed <span className="text-gold-500">{topicStats.count}</span> {topicStats.count === 1 ? 'time' : 'times'} since {topicStats.earliestYear} to 2025.
                    </p>
                    <p className="text-sm text-slate-500">Based on analyzed historical Bar Exam questions.</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {questions.map((q) => (
                  <QuestionCard 
                    key={q.id} 
                    question={q} 
                    isExpanded={expandedQuestion === q.id}
                    onToggle={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 mb-2">PLS BAR © 2026 • Philippine Bar Exam Reviewer</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">A tool for aspiring lawyers</p>
        </div>
      </footer>
    </div>
  );
}
