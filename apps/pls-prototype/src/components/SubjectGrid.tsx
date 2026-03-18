import React from 'react';
import { ChevronRight, Scale, Briefcase, Users, Gavel, FileText, ShieldCheck, Building2, ReceiptText } from 'lucide-react';
import { motion } from 'motion/react';
import { SUBJECTS } from '../data';

const iconMap: Record<string, React.ReactNode> = {
  Scale: <Scale className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Gavel: <Gavel className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  ReceiptText: <ReceiptText className="w-6 h-6" />,
};

interface SubjectGridProps {
  onSelectSubject: (name: string) => void;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({ onSelectSubject }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-8"
  >
    <div className="text-center max-w-2xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-navy-900">Choose Your Subject</h2>
      <p className="text-slate-600">Analyze historical patterns from 2006 to 2025. Master the topics that matter most based on frequency and chair trends.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {SUBJECTS.map((subject) => (
        <button
          key={subject.name}
          onClick={() => onSelectSubject(subject.name)}
          className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-navy-700 transition-all text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            {React.cloneElement(iconMap[subject.icon] as React.ReactElement, { className: "w-24 h-24" })}
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-navy-700 mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">
              {iconMap[subject.icon]}
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-2">{subject.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2">{subject.description}</p>
            
            <div className="mt-6 flex items-center text-sm font-semibold text-navy-700 group-hover:translate-x-1 transition-transform">
              Start Reviewing <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </button>
      ))}
    </div>
  </motion.div>
);
