import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CalendarCheck, Clock, Edit, Check, Loader2, AlertCircle } from 'lucide-react';
import { classNotesApi } from '../api/services';

interface FastTeachingLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  onSaved?: () => void;
}

export function FastTeachingLogger({ isOpen, onClose, student, onSaved }: FastTeachingLoggerProps) {
  const [duration, setDuration] = useState('60m');
  const [performance, setPerformance] = useState<'Excellent' | 'Good Understanding' | 'Needs Practice' | 'Struggling'>('Good Understanding');
  const [topic, setTopic] = useState('Definite Integrals - Area Under Curves');
  const [homework, setHomework] = useState('Complete NCERT Exercise 7.4 Q1-12; practice substitution theorem');
  const [tutorNote, setTutorNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student?.course) {
      if (student.course.includes('Physics')) {
        setTopic('Mechanics - Work, Energy & Power Review');
        setHomework('Exercise 4.2 numericals 1 through 8');
      } else if (student.course.includes('Chemistry')) {
        setTopic('Acid-Base Titration & Equilibrium Calculations');
        setHomework('Review lab practical observations & titration chart');
      } else {
        setTopic('Definite Integrals - Area Under Curves');
        setHomework('Complete NCERT Exercise 7.4 Q1-12; practice substitution theorem');
      }
    }
  }, [student]);

  const handleAddTopicTag = (tag: string) => {
    const cleanTag = tag.replace('+', '').trim();
    setTopic(prev => prev ? `${prev}, ${cleanTag}` : cleanTag);
  };

  const handleSave = async () => {
    if (!student?.id) {
      setError('No student selected for note');
      return;
    }
    if (!topic.trim()) {
      setError('Topic is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const subject = student.course ? student.course.split('&')[0].trim() : 'General';

      await classNotesApi.create({
        studentId: student.id,
        topic,
        understanding: performance,
        duration,
        subject,
        homework,
        tutorNote,
      });

      onClose();
      if (onSaved) {
        onSaved();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save class note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          
          <motion.div 
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-['Inter']"
          >
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4 bg-white flex items-start justify-between border-b border-slate-100 relative">
              <div className="flex flex-col relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Fast Teaching Logger</span>
                </div>
                <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-slate-900 flex items-center gap-2">
                  📝 New Class Note — {student?.name || 'Student'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{student?.grade} • Fill in essential details in under 30 seconds.</p>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-[11px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full flex items-center gap-1">
                  ⏱️ &lt;30s flow
                </span>
                <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md transition-colors cursor-pointer">
                   <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="px-6 py-5 overflow-y-auto flex flex-col gap-6">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                 <div className="flex-1 bg-white p-3 rounded-lg shadow-xs flex items-center gap-3">
                    <CalendarCheck className="w-5 h-5 text-indigo-600" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Session Date</span>
                      <span className="text-sm font-semibold text-slate-900">Today</span>
                    </div>
                 </div>
                 <div className="flex-1 bg-white p-3 rounded-lg shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Duration</span>
                         <span className="text-sm font-semibold text-slate-900">{duration.replace('m', ' mins')}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                      {['45m', '60m', '90m'].map(d => (
                        <button 
                          key={d}
                          type="button"
                          onClick={() => setDuration(d)}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                            duration === d ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>

              {/* Topic Covered */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-900">Topic Covered <span className="text-rose-500">*</span></label>
                  <span className="text-xs text-slate-400">Click suggestion to append</span>
                </div>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Definite Integrals - Area Under Curves"
                  className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                />
                <div className="flex flex-wrap gap-2 mt-1">
                  {['+ Derivatives', '+ Integration by Parts', '+ Limits', '+ Sample Paper'].map(tag => (
                    <button 
                      key={tag} 
                      type="button"
                      onClick={() => handleAddTopicTag(tag)}
                      className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors border border-slate-200/60 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Performance */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-semibold text-slate-900">Student Performance</label>
                  <span className="text-emerald-600 text-xs font-medium">
                    {performance === 'Excellent' ? 'Superb focus & problem retention' :
                     performance === 'Good Understanding' ? 'Solid grasp, active retention' :
                     performance === 'Needs Practice' ? 'Concept clear, numerical practice needed' :
                     'High difficulty, repeat session recommended'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'Excellent' as const, icon: '🌟', label: 'Excellent' },
                    { id: 'Good Understanding' as const, icon: '✅', label: 'Good' },
                    { id: 'Needs Practice' as const, icon: '⚠️', label: 'Needs Practice' },
                    { id: 'Struggling' as const, icon: '❌', label: 'Struggling' },
                  ].map(p => (
                    <button 
                      key={p.id}
                      type="button"
                      onClick={() => setPerformance(p.id)}
                      className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        performance === p.id 
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                          : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{p.icon}</span>
                      <span className="text-[11px] font-bold text-center leading-tight">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Homework & Practice */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-900">Homework &amp; Practice Assigned</label>
                  <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">Next Class Ready</span>
                </div>
                <textarea 
                  rows={2}
                  value={homework}
                  onChange={(e) => setHomework(e.target.value)}
                  placeholder="Enter assigned problems, textbook chapters or worksheet details..."
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all" 
                />
              </div>

              {/* Tutor Private Observation */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600">Private Tutor Note (Optional)</label>
                <input 
                  type="text"
                  value={tutorNote}
                  onChange={(e) => setTutorNote(e.target.value)}
                  placeholder="e.g. Needs more attention during algebra fractions test"
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
               <button 
                 type="button"
                 onClick={onClose} 
                 className="px-5 h-11 rounded-lg text-slate-600 font-semibold text-sm hover:bg-slate-200 transition-colors cursor-pointer"
               >
                 Cancel
               </button>
               <button 
                 type="button"
                 disabled={loading}
                 onClick={handleSave} 
                 className="px-5 h-11 rounded-lg bg-indigo-600 text-white font-semibold text-sm shadow-xs hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
                 <span>{loading ? 'Saving...' : 'Save Class Note'}</span>
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

