import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Check, Sparkles } from 'lucide-react';
import { mockStudents } from '../data';

interface NewFollowUpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (followUp: any) => void;
  defaultStudentId?: string;
}

export function NewFollowUpDrawer({ isOpen, onClose, onSave, defaultStudentId }: NewFollowUpDrawerProps) {
  const [studentId, setStudentId] = useState(defaultStudentId || '');
  const [parentPhone, setParentPhone] = useState('');
  const [dueDate, setDueDate] = useState('2024-10-24');
  const [dueTime, setDueTime] = useState('16:00');
  const [objective, setObjective] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleStudentChange = (id: string) => {
    setStudentId(id);
    const found = mockStudents.find(s => s.id === id);
    if (found) {
      setParentPhone(found.parentPhone);
      setDraftMessage(`Hi ${found.parentName}, Amit here from TutorTrack regarding ${found.name}'s upcoming classes...`);
    } else {
      setParentPhone('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      if (onSave) {
        onSave({
          studentId,
          parentPhone,
          dueDate,
          dueTime,
          objective,
          draftMessage,
        });
      }
    }, 600);
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form id="followup-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                {/* Select Student */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Select Student</label>
                  <select
                    value={studentId}
                    onChange={(e) => handleStudentChange(e.target.value)}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="">Select a student...</option>
                    {mockStudents.map((s) => (
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
                    <label className="text-xs font-semibold text-slate-700">Due Date</label>
                    <div className="relative">
                      <input
                        type="date"
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
                  <label className="text-xs font-semibold text-slate-700">Follow-up Objective</label>
                  <textarea
                    rows={3}
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
                        const student = mockStudents.find(s => s.id === studentId);
                        if (student) {
                          setDraftMessage(`Hi ${student.parentName}, Amit here from TutorTrack. Hope you're having a good day! Just a gentle reminder regarding ${student.name}'s upcoming session.`);
                        }
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
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
                  disabled={isSuccess}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm rounded-lg shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSuccess ? 'Follow-up Created!' : 'Create Scheduled Follow-up'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
