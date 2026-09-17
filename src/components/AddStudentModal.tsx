import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Check, Loader2, AlertCircle } from 'lucide-react';
import { studentsApi } from '../api/services';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded?: () => void;
  onSaved?: () => void;
}

export function AddStudentModal({ isOpen, onClose, onStudentAdded, onSaved }: AddStudentModalProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Grade 10 • ICSE');
  const [course, setCourse] = useState('Physics & Math');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+91 98765 43210');
  const [schedule, setSchedule] = useState('Tue, Thu, Sat • 5:00 PM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);

    try {
      await studentsApi.create({
        name,
        grade,
        course,
        parentName,
        parentPhone,
        schedule,
      });

      onClose();
      setName('');
      if (onStudentAdded) {
        onStudentAdded();
      }
      if (onSaved) {
        onSaved();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to enroll student. Please check input formats.');
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
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col font-['Inter']"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-slate-900">
                    Add New Student
                  </h2>
                  <p className="text-xs text-slate-500">Enroll a student into your teaching roster</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samarth Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Grade & Board *</label>
                  <input
                    type="text"
                    required
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Subjects / Course *</label>
                  <input
                    type="text"
                    required
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Parent Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh Patel"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Parent Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Schedule & Batch</label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 h-10 rounded-lg text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{loading ? 'Adding...' : 'Add Student'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

