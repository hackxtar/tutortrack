import { useState, useEffect } from 'react';
import { 
  AlertTriangle, Clock, Calendar, Users, MessageCircle, Edit, CheckCircle2, 
  PhoneCall, Lightbulb, ChevronDown, Check, Sparkles, Loader2, AlertCircle 
} from 'lucide-react';
import { Student, ClassNote, FollowUp, DashboardMetrics } from '../types';
import { dashboardApi, followUpsApi, classNotesApi, studentsApi } from '../api/services';

interface DashboardProps {
  onOpenAddStudent?: () => void;
  onOpenAddFollowUp?: () => void;
  onNavigateToStudent?: (studentId: string) => void;
  refreshKey?: number;
}

export function Dashboard({ 
  onOpenAddStudent, 
  onOpenAddFollowUp, 
  onNavigateToStudent,
  refreshKey = 0
}: DashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [classNotes, setClassNotes] = useState<ClassNote[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Note Form state
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [quickNoteText, setQuickNoteText] = useState('');
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [savingQuickNote, setSavingQuickNote] = useState(false);
  const [quickNoteSaved, setQuickNoteSaved] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRes, fRes, cRes, sRes] = await Promise.all([
        dashboardApi.getMetrics().catch(() => null),
        followUpsApi.list().catch(() => null),
        classNotesApi.list({ limit: 5 }).catch(() => null),
        studentsApi.list().catch(() => null),
      ]);

      if (mRes?.data) setMetrics(mRes.data);
      if (fRes?.data) setFollowUps(fRes.data);
      if (cRes?.data) setClassNotes(cRes.data);
      if (sRes?.data) {
        setStudents(sRes.data);
        if (sRes.data.length > 0 && !selectedStudentId) {
          setSelectedStudentId(sRes.data[0].id);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [refreshKey]);

  const selectedStudentObj = students.find(s => s.id === selectedStudentId) || students[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleTaskDone = async (taskId: string, title: string, currentStatus?: boolean) => {
    const nextStatus = !currentStatus;
    try {
      await followUpsApi.toggleStatus(taskId, nextStatus);
      setFollowUps(prev => prev.map(f => f.id === taskId ? { ...f, isDone: nextStatus } : f));
      showToast(nextStatus ? `Marked "${title}" as completed` : `Reopened "${title}"`);
    } catch (err: any) {
      showToast(err?.message || 'Failed to update follow-up status');
    }
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

  const handleSaveQuickNote = async () => {
    if (!selectedStudentObj?.id) {
      showToast('Please select a student.');
      return;
    }
    if (!quickNoteText.trim()) {
      showToast('Please add observation notes before saving.');
      return;
    }

    setSavingQuickNote(true);
    try {
      await classNotesApi.create({
        studentId: selectedStudentObj.id,
        topic: 'Quick Observation Note',
        understanding: 'Good Understanding',
        homework: quickNoteText,
        duration: '60m',
        subject: selectedStudentObj.course ? selectedStudentObj.course.split('&')[0].trim() : 'General',
      });

      setQuickNoteSaved(true);
      showToast(`Quick note saved for ${selectedStudentObj?.name || 'student'}`);
      setQuickNoteText('');
      loadDashboardData();
      setTimeout(() => {
        setQuickNoteSaved(false);
      }, 2000);
    } catch (err: any) {
      showToast(err?.message || 'Failed to save quick note');
    } finally {
      setSavingQuickNote(false);
    }
  };

  const overdueFollowUps = followUps.filter(f => f.type === 'Overdue');
  const todayFollowUps = followUps.filter(f => f.type === 'Today');
  const upcomingFollowUps = followUps.filter(f => f.type === 'Upcoming');

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading && !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">Loading workspace dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8 relative font-['Inter']">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={loadDashboardData} className="px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-md hover:bg-rose-700 cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, Educator <span className="text-2xl">👋</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm">
            <span className="font-semibold text-indigo-600">{todayDateFormatted}</span>
            <span className="hidden sm:block text-slate-300">•</span>
            <span className="text-slate-600">
              <strong className="text-rose-600">{metrics?.overdueCount ?? overdueFollowUps.length} urgent overdue</strong> and <strong>{metrics?.dueTodayCount ?? todayFollowUps.length} scheduled follow-ups</strong> require attention today
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
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-4xl text-rose-600">
              {String(metrics?.overdueCount ?? 0).padStart(2, '0')}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Action Needed</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Pending overdue tasks</span>
        </div>

        {/* DUE TODAY */}
        <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">DUE TODAY</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-4xl text-amber-600">
              {String(metrics?.dueTodayCount ?? 0).padStart(2, '0')}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Today</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Scheduled for today</span>
        </div>

        {/* UPCOMING */}
        <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">UPCOMING</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-4xl text-slate-900">
              {String(metrics?.upcomingCount ?? 0).padStart(2, '0')}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600">Next 72h</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Next few days roadmap</span>
        </div>

        {/* ACTIVE STUDENTS */}
        <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ACTIVE STUDENTS</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-4xl text-slate-900">
              {metrics?.activeStudentsCount ?? students.length}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Active Roster</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Enrolled tutoring students</span>
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
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">{overdueFollowUps.length} Urgent</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">Requires prompt response</span>
            </div>

            {overdueFollowUps.length === 0 ? (
              <div className="bg-white rounded-xl p-6 border border-slate-100 text-center text-sm text-slate-400">
                🎉 No overdue follow-ups! You're all caught up.
              </div>
            ) : (
              overdueFollowUps.map(item => (
                <div key={item.id} className={`bg-white rounded-xl border-l-4 border-l-rose-500 border border-slate-100 shadow-xs p-5 flex flex-col gap-4 transition-all ${item.isDone ? 'opacity-60 bg-slate-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {item.studentName ? item.studentName.split(' ').map(n => n[0]).join('') : 'ST'}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => onNavigateToStudent?.(item.studentId)}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                          >
                            {item.studentName}
                          </button>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">{item.grade}</span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" /> Parent: <strong className="text-slate-700">{item.parentName}</strong> ({item.parentPhone})
                        </span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" /> {item.due}
                    </span>
                  </div>

                  <div className="bg-rose-50/50 rounded-lg p-3 text-sm border border-rose-100/50">
                    <strong className="text-rose-700">Objective:</strong> <span className="text-slate-700">{item.objective}</span>
                  </div>

                  {item.draft && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-emerald-600 flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> WhatsApp Message Draft
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 italic">"{item.draft}"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleWhatsApp(item.parentPhone, item.draft || item.objective)}
                        className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" /> Open WhatsApp
                      </button>
                      <button 
                        onClick={() => toggleTaskDone(item.id, `${item.studentName} follow-up`, item.isDone)}
                        className={`h-9 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                          item.isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" /> 
                        <span>{item.isDone ? 'Completed' : 'Mark Done'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Today's Follow-ups */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <h2 className="font-bold text-lg text-slate-900">Today's Follow-ups</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-700 text-white text-[10px] font-bold">{todayFollowUps.length} Scheduled</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">Scheduled for today</span>
            </div>

            {todayFollowUps.length === 0 ? (
              <div className="bg-white rounded-xl p-6 border border-slate-100 text-center text-sm text-slate-400">
                No follow-ups scheduled for today.
              </div>
            ) : (
              todayFollowUps.map(item => (
                <div key={item.id} className={`bg-white rounded-xl border border-slate-100 shadow-xs p-5 flex flex-col gap-4 transition-all ${item.isDone ? 'opacity-60 bg-slate-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                        {item.studentName ? item.studentName.split(' ').map(n => n[0]).join('') : 'ST'}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => onNavigateToStudent?.(item.studentId)}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                          >
                            {item.studentName}
                          </button>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">{item.grade}</span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" /> Parent: <strong className="text-slate-700">{item.parentName}</strong> ({item.parentPhone})
                        </span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" /> {item.due}
                    </span>
                  </div>

                  <div className="bg-indigo-50/50 rounded-lg p-3 text-sm border border-indigo-100/50">
                    <strong className="text-indigo-700">Goal:</strong> <span className="text-slate-700">{item.objective}</span>
                  </div>

                  {item.draft && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase text-emerald-600 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> Prepared Draft
                      </span>
                      <p className="text-sm text-slate-600 italic">"{item.draft}"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => handleWhatsApp(item.parentPhone, item.draft || item.objective)}
                        className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" /> Open WhatsApp
                      </button>
                      <button 
                        onClick={() => handleCall(item.parentPhone)}
                        className="h-9 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4" /> Direct Call
                      </button>
                      <button 
                        onClick={() => toggleTaskDone(item.id, `${item.studentName} follow-up`, item.isDone)}
                        className={`h-9 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                          item.isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" /> 
                        <span>{item.isDone ? 'Completed' : 'Mark Done'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Upcoming Follow-ups */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-lg text-slate-900">Upcoming Follow-ups</h2>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-bold">Next 72 Hours</span>
            </div>

            {upcomingFollowUps.length === 0 ? (
              <div className="bg-white rounded-xl p-6 border border-slate-100 text-center text-sm text-slate-400">
                No upcoming follow-ups scheduled.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingFollowUps.map(item => (
                  <div key={item.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{item.due}</span>
                      <MessageCircle className="w-4 h-4 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.studentName}</h3>
                      <p className="text-xs text-slate-500">{item.grade}</p>
                    </div>
                    <p className="text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg">{item.objective}</p>
                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100">
                       <span className="text-xs text-slate-400 font-mono">{item.parentPhone}</span>
                       <button 
                         onClick={() => handleWhatsApp(item.parentPhone, item.draft || item.objective)}
                         className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                       >
                          <MessageCircle className="w-3 h-3" /> Send Ping
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  <span className="truncate">{selectedStudentObj ? `${selectedStudentObj.name} (${selectedStudentObj.grade})` : 'Select Student'}</span>
                  <ChevronDown className="w-4 h-4 text-indigo-200" />
                </button>

                {studentDropdownOpen && (
                  <div className="absolute top-16 left-0 right-0 z-30 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 max-h-48 overflow-y-auto p-1 text-xs">
                    {students.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedStudentId(s.id);
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
                disabled={savingQuickNote || quickNoteSaved}
                className="w-full h-10 mt-2 bg-white text-indigo-700 font-bold text-sm rounded-lg hover:bg-indigo-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
              >
                {savingQuickNote ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : quickNoteSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Edit className="w-4 h-4" />}
                <span>{savingQuickNote ? 'Saving Note...' : quickNoteSaved ? 'Quick Note Saved!' : 'Save Quick Note'}</span>
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
               <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">Latest</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {classNotes.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No notes recorded yet.</span>
              ) : (
                classNotes.slice(0, 3).map((note) => {
                  const targetStudent = students.find(s => s.id === note.studentId) || { name: 'Student', id: note.studentId || '' };
                  return (
                    <div key={note.id} className="flex flex-col gap-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => targetStudent.id && onNavigateToStudent?.(targetStudent.id)}
                          className="text-sm font-bold text-slate-900 hover:text-indigo-600 text-left cursor-pointer"
                        >
                          {targetStudent.name}
                        </button>
                        <span className="text-[10px] font-semibold text-slate-400">{note.date}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{note.topic} •</span>
                      <p className="text-xs text-slate-500 leading-relaxed">Understanding: {note.understanding || 'Good'}. HW: {note.homework || 'N/A'}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Weekly Lesson Ratio */}
          {metrics?.weeklyLessonRatio && (
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex flex-col gap-4">
               <div className="flex justify-between items-end">
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 w-24 leading-tight">WEEKLY LESSON RATIO</span>
                 <span className="text-sm font-bold text-emerald-600">{metrics.weeklyLessonRatio.completed}/{metrics.weeklyLessonRatio.target} Completed</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, metrics.weeklyLessonRatio.percentage)}%` }}></div>
               </div>
               <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                  <span>Goal: {metrics.weeklyLessonRatio.target} sessions</span>
                  <span className="text-slate-900 font-bold">{metrics.weeklyLessonRatio.percentage}% Target Met</span>
               </div>
            </div>
          )}

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

