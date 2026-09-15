import { useState } from 'react';
import { 
  AlertTriangle, Clock, Calendar, Users, MessageCircle, Edit, CheckCircle2, 
  PhoneCall, Lightbulb, ChevronDown, Check, Sparkles 
} from 'lucide-react';
import { mockStudents } from '../data';

interface DashboardProps {
  onOpenAddStudent?: () => void;
  onOpenAddFollowUp?: () => void;
  onNavigateToStudent?: (studentId: string) => void;
}

export function Dashboard({ onOpenAddStudent, onOpenAddFollowUp, onNavigateToStudent }: DashboardProps) {
  // State for tasks done
  const [doneTasks, setDoneTasks] = useState<Record<string, boolean>>({});
  
  // Quick Note Form state
  const [selectedStudentName, setSelectedStudentName] = useState('Rahul Sharma (ICSE 10)');
  const [quickNoteText, setQuickNoteText] = useState('');
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [quickNoteSaved, setQuickNoteSaved] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleTaskDone = (taskId: string, title: string) => {
    const isNowDone = !doneTasks[taskId];
    setDoneTasks(prev => ({ ...prev, [taskId]: isNowDone }));
    showToast(isNowDone ? `Marked "${title}" as completed` : `Reopened "${title}"`);
  };

  const handleWhatsApp = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text);
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Opening WhatsApp dispatch...');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const appendTag = (tag: string) => {
    setQuickNoteText(prev => prev ? `${prev} ${tag}` : tag);
  };

  const handleSaveQuickNote = () => {
    if (!quickNoteText.trim()) {
      showToast('Please add observation notes before saving.');
      return;
    }
    setQuickNoteSaved(true);
    showToast(`Quick note saved for ${selectedStudentName}`);
    setTimeout(() => {
      setQuickNoteSaved(false);
      setQuickNoteText('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8 relative">
      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, Amit <span className="text-2xl">👋</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm">
            <span className="font-semibold text-indigo-600">Thursday, October 24, 2024</span>
            <span className="hidden sm:block text-slate-300">•</span>
            <span className="text-slate-600">
              <strong className="text-rose-600">1 urgent overdue</strong> and <strong>2 scheduled follow-ups</strong> require attention today
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenAddStudent}
            className="h-10 px-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Add Student</span>
          </button>
          <button 
            onClick={onOpenAddFollowUp}
            className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <Edit className="w-4 h-4" />
            <span>Add Follow-up</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* OVERDUE */}
        <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">OVERDUE</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-4xl text-rose-600">01</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Action Needed</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Missed Saturday class followup</span>
        </div>

        {/* DUE TODAY */}
        <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">DUE TODAY</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-4xl text-amber-600">02</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Today</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Worksheet & Renewal checks</span>
        </div>

        {/* UPCOMING */}
        <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">UPCOMING</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-4xl text-slate-900">04</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600">Fri - Sun</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Next 72 hours roadmap</span>
        </div>

        {/* ACTIVE STUDENTS */}
        <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ACTIVE STUDENTS</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-4xl text-slate-900">18</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">100% Active</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Math, Physics & Chemistry</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Lists) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Overdue Attention */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h2 className="font-bold text-lg text-slate-900">Overdue Attention</h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">1 Urgent</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">Delayed &gt; 20 hrs</span>
            </div>

            <div className={`bg-white rounded-xl border-l-4 border-l-rose-500 border border-slate-100 shadow-xs p-5 flex flex-col gap-4 transition-all ${doneTasks['rahul-overdue'] ? 'opacity-60 bg-slate-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    RS
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onNavigateToStudent?.('1')}
                        className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                      >
                        Rahul Sharma
                      </button>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">Grade 10 • ICSE Physics</span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" /> Parent: <strong className="text-slate-700">Rajesh Sharma</strong> (+91 98201 54321)
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> Overdue by 22 hrs
                </span>
              </div>

              <div className="bg-rose-50/50 rounded-lg p-3 text-sm border border-rose-100/50">
                <strong className="text-rose-700">Objective:</strong> <span className="text-slate-700">Confirm reschedule for missed Saturday mechanics class & check homework submission.</span>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> WhatsApp Message Draft
                  </span>
                  <span className="text-[10px] text-slate-400">Click button to dispatch</span>
                </div>
                <p className="text-sm text-slate-600 italic">
                  "Hi Mr. Sharma, Amit here from TutorTrack. Checking in regarding Rahul's missed session on Saturday. Could we reschedule for this Friday at 5 PM? Also waiting on Ex 4.2."
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleWhatsApp('+91 98201 54321', "Hi Mr. Sharma, Amit here from TutorTrack. Checking in regarding Rahul's missed session on Saturday. Could we reschedule for this Friday at 5 PM? Also waiting on Ex 4.2.")}
                    className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" /> Open WhatsApp
                  </button>
                  <button 
                    onClick={() => toggleTaskDone('rahul-overdue', 'Rahul Sharma follow-up')}
                    className={`h-9 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                      doneTasks['rahul-overdue'] ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> 
                    <span>{doneTasks['rahul-overdue'] ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Follow-ups */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <h2 className="font-bold text-lg text-slate-900">Today's Follow-ups</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-700 text-white text-[10px] font-bold">2 Scheduled</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">Scheduled for Oct 24</span>
            </div>

            {/* Item 1 - Priya Shah */}
            <div className={`bg-white rounded-xl border border-slate-100 shadow-xs p-5 flex flex-col gap-4 transition-all ${doneTasks['priya-today'] ? 'opacity-60 bg-slate-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                    PS
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onNavigateToStudent?.('2')}
                        className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                      >
                        Priya Shah
                      </button>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">Grade 12 • Calculus</span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" /> Parent: <strong className="text-slate-700">Neha Shah</strong> (+91 98112 33445)
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> Today, 10:30 AM
                </span>
              </div>

              <div className="bg-indigo-50/50 rounded-lg p-3 text-sm border border-indigo-100/50">
                <strong className="text-indigo-700">Goal:</strong> <span className="text-slate-700">Check homework progress on Integration worksheet before evening class.</span>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase text-emerald-600 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> Prepared Draft
                </span>
                <p className="text-sm text-slate-600 italic">
                  "Hello Mrs. Shah, reminding Priya to finish problems 4 through 9 from Chapter 7 before our 5 PM class."
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleWhatsApp('+91 98112 33445', "Hello Mrs. Shah, reminding Priya to finish problems 4 through 9 from Chapter 7 before our 5 PM class.")}
                    className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" /> Open WhatsApp
                  </button>
                  <button 
                    onClick={() => toggleTaskDone('priya-today', 'Priya Shah follow-up')}
                    className={`h-9 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                      doneTasks['priya-today'] ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> 
                    <span>{doneTasks['priya-today'] ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Item 2 - Aarav Mehta */}
            <div className={`bg-white rounded-xl border border-slate-100 shadow-xs p-5 flex flex-col gap-4 transition-all ${doneTasks['aarav-today'] ? 'opacity-60 bg-slate-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                    AM
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onNavigateToStudent?.('3')}
                        className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                      >
                        Aarav Mehta
                      </button>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">Grade 9 • Foundation Math</span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" /> Parent: <strong className="text-slate-700">Vikram Mehta</strong> (+91 98765 43210)
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> Today, 2:00 PM
                </span>
              </div>

              <div className="bg-indigo-50/50 rounded-lg p-3 text-sm border border-indigo-100/50">
                <strong className="text-indigo-700">Goal:</strong> <span className="text-slate-700">Ask about renewal for next month's 12-session block and share feedback.</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleWhatsApp('+91 98765 43210', "Hello Mr. Mehta, Amit here from TutorTrack. Hope Aarav is doing great with Foundation Math! Reaching out to confirm renewal for next month's 12-session block.")}
                    className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" /> Open WhatsApp
                  </button>
                  <button 
                    onClick={() => handleCall('+91 98765 43210')}
                    className="h-9 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" /> Direct Call
                  </button>
                  <button 
                    onClick={() => toggleTaskDone('aarav-today', 'Aarav Mehta follow-up')}
                    className={`h-9 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                      doneTasks['aarav-today'] ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> 
                    <span>{doneTasks['aarav-today'] ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Follow-ups */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-lg text-slate-900">Upcoming Follow-ups</h2>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-bold">Tomorrow &amp; Weekend</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">Tomorrow • 11:00 AM</span>
                  <MessageCircle className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Ananya Iyer</h3>
                  <p className="text-xs text-slate-500">Grade 11 • Chemistry</p>
                </div>
                <p className="text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg">Check lab report notes & titration calculations before practicals.</p>
                <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100">
                   <span className="text-xs text-slate-400 font-mono">+91 97654 32198</span>
                   <button 
                     onClick={() => handleWhatsApp('+91 97654 32198', "Hi Ananya, reminding you to verify titration notes before tomorrow's practical session.")}
                     className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                   >
                      <MessageCircle className="w-3 h-3" /> Send Ping
                   </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">Saturday • 10:00 AM</span>
                  <MessageCircle className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Rohan Verma</h3>
                  <p className="text-xs text-slate-500">Grade 8 • Science</p>
                </div>
                <p className="text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg">Share weekly progress summary and quiz result score with his father.</p>
                <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100">
                   <span className="text-xs text-slate-400 font-mono">+91 98450 11223</span>
                   <button 
                     onClick={() => handleWhatsApp('+91 98450 11223', "Hello Mr. Verma, Amit here from TutorTrack. Sharing Rohan's weekly quiz performance score: 92/100.")}
                     className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                   >
                      <MessageCircle className="w-3 h-3" /> Send Ping
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Class Note */}
          <div className="bg-indigo-700 rounded-xl p-5 shadow-lg shadow-indigo-600/20 text-white flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-200" />
                <h3 className="font-bold text-lg">Quick Class Note</h3>
              </div>
              <span className="text-[10px] font-bold bg-indigo-600/60 border border-indigo-400/30 px-2 py-1 rounded text-indigo-100">30S FAST LOG</span>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">Capture immediate observations right after your session before you forget.</p>
            
            <div className="flex flex-col gap-3 relative">
              <div className="flex flex-col gap-1 relative">
                <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">STUDENT</label>
                <button 
                  type="button"
                  onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                  className="w-full h-10 px-3 bg-indigo-600/60 border border-indigo-500/60 rounded-lg text-sm text-left flex justify-between items-center text-white hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  <span className="truncate">{selectedStudentName}</span>
                  <ChevronDown className="w-4 h-4 text-indigo-200" />
                </button>

                {studentDropdownOpen && (
                  <div className="absolute top-16 left-0 right-0 z-30 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 max-h-48 overflow-y-auto p-1 text-xs">
                    {mockStudents.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedStudentName(`${s.name} (${s.grade})`);
                          setStudentDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-indigo-600 transition-colors"
                      >
                        {s.name} • {s.grade}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">OBSERVATIONS &amp; HOMEWORK</label>
                <textarea 
                  value={quickNoteText}
                  onChange={(e) => setQuickNoteText(e.target.value)}
                  placeholder="e.g. Completed Chapter 4. Homework: Page 42 problems 1-5..."
                  className="w-full h-20 p-3 bg-indigo-600/60 border border-indigo-500/60 rounded-lg text-sm text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-white resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                <button 
                  type="button"
                  onClick={() => appendTag('HW: Ex 4.2 Assigned.')}
                  className="px-2.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-[10px] font-bold transition-colors cursor-pointer border border-indigo-400/30"
                >
                  + HW Assigned
                </button>
                <button 
                  type="button"
                  onClick={() => appendTag('High focus and active problem solving.')}
                  className="px-2.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-[10px] font-bold transition-colors cursor-pointer border border-indigo-400/30"
                >
                  + Good Focus
                </button>
                <button 
                  type="button"
                  onClick={() => appendTag('Needs revision on fundamentals.')}
                  className="px-2.5 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-[10px] font-bold transition-colors cursor-pointer border border-indigo-400/30"
                >
                  + Revision Needed
                </button>
              </div>

              <button 
                type="button"
                onClick={handleSaveQuickNote}
                disabled={quickNoteSaved}
                className="w-full h-10 mt-2 bg-white text-indigo-700 font-bold text-sm rounded-lg hover:bg-indigo-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {quickNoteSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Edit className="w-4 h-4" />}
                <span>{quickNoteSaved ? 'Quick Note Saved!' : 'Save Quick Note'}</span>
              </button>
            </div>
          </div>

          {/* Recent Class Notes */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-slate-900">
                 <Edit className="w-5 h-5 text-indigo-600" />
                 <h3 className="font-bold">Recent Class Notes</h3>
               </div>
               <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">Past 24h</span>
            </div>
            
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
                 <div className="flex justify-between items-center">
                   <button 
                     onClick={() => onNavigateToStudent?.('1')}
                     className="text-sm font-bold text-slate-900 hover:text-indigo-600 text-left cursor-pointer"
                   >
                     Rahul Sharma
                   </button>
                   <span className="text-[10px] font-semibold text-slate-400">Yesterday, 5:30 PM</span>
                 </div>
                 <span className="text-xs font-semibold text-slate-700">Light Reflection & Refraction •</span>
                 <p className="text-xs text-slate-500 leading-relaxed">Performance: Good understanding of Snell's law. HW: Ex 4.2.</p>
               </div>
               
               <div className="flex flex-col gap-1">
                 <div className="flex justify-between items-center">
                   <button 
                     onClick={() => onNavigateToStudent?.('2')}
                     className="text-sm font-bold text-slate-900 hover:text-indigo-600 text-left cursor-pointer"
                   >
                     Priya Shah
                   </button>
                   <span className="text-[10px] font-semibold text-slate-400">Yesterday, 7:15 PM</span>
                 </div>
                 <span className="text-xs font-semibold text-slate-700">Definite Integrals •</span>
                 <p className="text-xs text-slate-500 leading-relaxed">Performance: Needs revision on substitution variables. Handed practice sheet.</p>
               </div>
            </div>
          </div>

          {/* Weekly Lesson Ratio */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex flex-col gap-4">
             <div className="flex justify-between items-end">
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 w-24 leading-tight">WEEKLY LESSON RATIO</span>
               <span className="text-sm font-bold text-emerald-600">14/18 Completed</span>
             </div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }}></div>
             </div>
             <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                <span>Goal: 18 sessions</span>
                <span className="text-slate-900 font-bold">78% Target Met</span>
             </div>
          </div>

          {/* Tip */}
          <div className="bg-amber-50 rounded-xl p-4 flex gap-3 border border-amber-100/60">
             <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
             <div className="flex flex-col gap-1">
               <span className="text-sm font-bold text-amber-900">Parent Communication Tip</span>
               <p className="text-xs text-amber-700 leading-relaxed">Sending WhatsApp follow-ups within 2 hours of missed classes increases reschedule rates by 65%.</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
