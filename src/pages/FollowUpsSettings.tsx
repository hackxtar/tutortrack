import { useState, type FormEvent } from 'react';
import { 
  MessageSquare, Settings as SettingsIcon, AlertTriangle, Clock, 
  Calendar, CheckCircle2, PhoneCall, Plus, Save, Bell, User, MessageCircle, Sparkles 
} from 'lucide-react';
import { mockStudents } from '../data';

interface FollowUpsProps {
  onOpenNewFollowUp?: () => void;
  onNavigateToStudent?: (studentId: string) => void;
}

export function FollowUps({ onOpenNewFollowUp, onNavigateToStudent }: FollowUpsProps) {
  const [filter, setFilter] = useState<'All' | 'Overdue' | 'Today' | 'Upcoming'>('All');
  const [doneList, setDoneList] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleDone = (id: string, name: string) => {
    const isDone = !doneList[id];
    setDoneList(prev => ({ ...prev, [id]: isDone }));
    showToast(isDone ? `Marked follow-up for ${name} as completed` : `Reopened follow-up for ${name}`);
  };

  const handleWhatsApp = (phone: string, text: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    showToast('Dispatched to WhatsApp...');
  };

  const followUpItems = [
    {
      id: 'fu-1',
      type: 'Overdue',
      studentId: '1',
      studentName: 'Rahul Sharma',
      grade: 'Grade 10 • ICSE Physics',
      parentName: 'Rajesh Sharma',
      parentPhone: '+91 98201 54321',
      due: 'Overdue by 22 hrs',
      objective: 'Confirm reschedule for missed Saturday mechanics class & check homework submission.',
      draft: "Hi Mr. Sharma, Amit here from TutorTrack. Checking in regarding Rahul's missed session on Saturday. Could we reschedule for this Friday at 5 PM? Also waiting on Ex 4.2.",
    },
    {
      id: 'fu-2',
      type: 'Today',
      studentId: '2',
      studentName: 'Priya Shah',
      grade: 'Grade 12 • Calculus',
      parentName: 'Neha Shah',
      parentPhone: '+91 98112 33445',
      due: 'Today, 10:30 AM',
      objective: 'Check homework progress on Integration worksheet before evening class.',
      draft: 'Hello Mrs. Shah, reminding Priya to finish problems 4 through 9 from Chapter 7 before our 5 PM class.',
    },
    {
      id: 'fu-3',
      type: 'Today',
      studentId: '3',
      studentName: 'Aarav Mehta',
      grade: 'Grade 9 • Foundation Math',
      parentName: 'Vikram Mehta',
      parentPhone: '+91 98765 43210',
      due: 'Today, 2:00 PM',
      objective: "Ask about renewal for next month's 12-session block and share feedback.",
      draft: "Hello Mr. Mehta, Amit here from TutorTrack. Hope Aarav is doing great with Foundation Math! Reaching out to confirm renewal for next month's 12-session block.",
    },
    {
      id: 'fu-4',
      type: 'Upcoming',
      studentId: '4',
      studentName: 'Ananya Iyer',
      grade: 'Grade 11 • Chemistry',
      parentName: 'Sundar Iyer',
      parentPhone: '+91 97654 32198',
      due: 'Tomorrow, 11:00 AM',
      objective: 'Check lab report notes & titration calculations before practicals.',
      draft: 'Hi Ananya, reminding you to verify titration notes before tomorrow practical session.',
    },
    {
      id: 'fu-5',
      type: 'Upcoming',
      studentId: '5',
      studentName: 'Rohan Verma',
      grade: 'Grade 8 • Science',
      parentName: 'Manoj Verma',
      parentPhone: '+91 98450 11223',
      due: 'Saturday, 10:00 AM',
      objective: 'Share weekly progress summary and quiz result score with his father.',
      draft: "Hello Mr. Verma, Amit here from TutorTrack. Sharing Rohan's weekly quiz performance score: 92/100.",
    },
  ];

  const filteredItems = followUpItems.filter(item => {
    if (filter === 'All') return true;
    return item.type === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8">
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Communication Desk</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-medium text-slate-500">Active Queue</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            Scheduled Follow-ups
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track parent updates, class reminder pings, fee renewals, and homework verification.
          </p>
        </div>

        <button
          onClick={onOpenNewFollowUp}
          className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 shadow-xs transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Follow-up Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {(['All', 'Overdue', 'Today', 'Upcoming'] as const).map((tab) => {
          const isActive = filter === tab;
          const count = tab === 'All' ? followUpItems.length : followUpItems.filter(i => i.type === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{tab}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List of Follow-up cards */}
      <div className="flex flex-col gap-4">
        {filteredItems.map((item) => {
          const isDone = doneList[item.id];
          return (
            <div 
              key={item.id} 
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col gap-4 transition-all ${
                isDone 
                  ? 'border-slate-200 opacity-60 bg-slate-50/70' 
                  : item.type === 'Overdue' 
                    ? 'border-l-4 border-l-rose-500 border-slate-100' 
                    : 'border-slate-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                    {item.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateToStudent?.(item.studentId)}
                        className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                      >
                        {item.studentName}
                      </button>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {item.grade}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-slate-400" /> Parent: <strong className="text-slate-700">{item.parentName}</strong> ({item.parentPhone})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    item.type === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                    item.type === 'Today' ? 'bg-amber-100 text-amber-800' :
                    'bg-indigo-50 text-indigo-700'
                  }`}>
                    {item.type === 'Overdue' && <AlertTriangle className="w-3 h-3" />}
                    {item.type === 'Today' && <Clock className="w-3 h-3" />}
                    {item.type === 'Upcoming' && <Calendar className="w-3 h-3" />}
                    {item.due}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 border border-slate-100">
                <strong className="text-slate-900">Goal: </strong>
                <span>{item.objective}</span>
              </div>

              <div className="bg-slate-50/70 rounded-lg p-3 border border-slate-100 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-emerald-600 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> WhatsApp Template Draft
                </span>
                <p className="text-xs text-slate-600 italic">"{item.draft}"</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleWhatsApp(item.parentPhone, item.draft)}
                    className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open WhatsApp</span>
                  </button>
                  <button
                    onClick={() => toggleDone(item.id, item.studentName)}
                    className={`h-9 px-4 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                      isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Settings() {
  const [tutorName, setTutorName] = useState('Amit Sharma');
  const [subjects, setSubjects] = useState('Physics, Math & Science');
  const [phone, setPhone] = useState('+91 98201 54321');
  const [email, setEmail] = useState('amit.sharma@tutortrack.app');
  const [autoReminderHours, setAutoReminderHours] = useState('2');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-indigo-600" />
          <span>Workspace Settings</span>
        </h1>
        <p className="text-slate-500 text-sm">Manage tutor profile, WhatsApp automated templates, and session configurations.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Profile Details */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-base text-slate-900">Tutor Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Display Name</label>
              <input
                type="text"
                value={tutorName}
                onChange={(e) => setTutorName(e.target.value)}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Specialization &amp; Subjects</label>
              <input
                type="text"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Registered WhatsApp Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-base text-slate-900">Communication &amp; Reminders</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Pre-session Class Reminder</span>
                <span className="text-xs text-slate-500">Send WhatsApp reminder to parent and student before scheduled class</span>
              </div>
              <select
                value={autoReminderHours}
                onChange={(e) => setAutoReminderHours(e.target.value)}
                className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
              >
                <option value="1">1 hour before</option>
                <option value="2">2 hours before</option>
                <option value="4">4 hours before</option>
                <option value="24">1 day before</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Auto-Draft Missed Session Follow-up</span>
                <span className="text-xs text-slate-500">Generate WhatsApp reschedule message instantly when class marked absent</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 rounded cursor-pointer" />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Monthly Renewal Alert</span>
                <span className="text-xs text-slate-500">Trigger follow-up notification 3 sessions prior to block package end</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 rounded cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saved}
            className="h-11 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saved ? 'Preferences Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
