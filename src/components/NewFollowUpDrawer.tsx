import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Check, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Student } from '../types';
import { studentsApi, followUpsApi } from '../api/services';

interface NewFollowUpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  defaultStudentId?: string;
  students?: Student[];
}

export function NewFollowUpDrawer({ isOpen, onClose, onSaved, defaultStudentId, students: propStudents }: NewFollowUpDrawerProps) {
  const [studentsList, setStudentsList] = useState<Student[]>(propStudents || []);
  const [studentId, setStudentId] = useState(defaultStudentId || '');
  const [parentPhone, setParentPhone] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('16:00');
  const [objective, setObjective] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (propStudents && propStudents.length > 0) {
        setStudentsList(propStudents);
      } else {
        studentsApi.list().then(res => {
          if (res.data) setStudentsList(res.data);
        }).catch(() => {});
      }
    }
  }, [isOpen, propStudents]);

  useEffect(() => {
    if (defaultStudentId) {
      setStudentId(defaultStudentId);
    }
  }, [defaultStudentId]);

  const handleStudentChange = (id: string) => {
    setStudentId(id);
    const found = studentsList.find(s => s.id === id);
    if (found) {
      setParentPhone(found.parentPhone || '');
      setDraftMessage(`Hi ${found.parentName || 'Parent'}, Amit here from TutorTrack regarding ${found.name}'s upcoming classes...`);
    } else {
      setParentPhone('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      setError('Please select a student');
      return;
    }
    if (!objective.trim()) {
      setError('Objective is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await followUpsApi.create({
        studentId,
        dueDate,
        dueTime,
        objective,
        parentPhone,
        draftMessage,
      });

      onClose();
      setObjective('');
      setDraftMessage('');
      if (onSaved) {
        onSaved();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create follow-up task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-slate-900">
                    New Follow-up Task
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form id="followup-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Select Student */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Select Student *</label>
                  <select
                    required
                    value={studentId}
                    onChange={(e) => handleStudentChange(e.target.value)}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="">Select a student...</option>
                    {studentsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.course} • {s.grade})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parent WhatsApp / Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Parent WhatsApp / Phone</label>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                {/* Due Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Due Date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Due Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Follow-up Objective */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Follow-up Objective *</label>
                  <textarea
                    rows={3}
                    required
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="What needs to be addressed or reminded?"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                  />
                </div>

                {/* Pre-filled WhatsApp Message */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">Pre-filled WhatsApp Message</label>
                    <button
                      type="button"
                      onClick={() => {
                        const student = studentsList.find(s => s.id === studentId);
                        if (student) {
                          setDraftMessage(`Hi ${student.parentName || 'Parent'}, Amit here from TutorTrack. Hope you're having a good day! Just a gentle reminder regarding ${student.name}'s upcoming session.`);
                        }
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                    >
                      Use template
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    placeholder="Draft text to send with a single click..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                  />
                </div>
              </form>

              {/* Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="submit"
                  form="followup-form"
                  disabled={loading}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm rounded-lg shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{loading ? 'Creating...' : 'Create Scheduled Follow-up'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

