import { useState, useEffect, type FormEvent } from 'react';
import { 
  MessageSquare, Settings as SettingsIcon, AlertTriangle, Clock, 
  Calendar, CheckCircle2, PhoneCall, Plus, Save, Bell, User, MessageCircle, Sparkles, Loader2, AlertCircle 
} from 'lucide-react';
import { FollowUp, TutorProfile } from '../types';
import { followUpsApi, tutorApi } from '../api/services';

interface FollowUpsProps {
  onOpenNewFollowUp?: () => void;
  onNavigateToStudent?: (studentId: string) => void;
  refreshKey?: number;
}

export function FollowUps({ onOpenNewFollowUp, onNavigateToStudent, refreshKey = 0 }: FollowUpsProps) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Overdue' | 'Today' | 'Upcoming'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchFollowUps = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await followUpsApi.list({ filter: filter !== 'All' ? filter : undefined });
      if (res.data) setFollowUps(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch follow-ups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [filter, refreshKey]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleDone = async (id: string, name: string, currentIsDone?: boolean) => {
    const nextDone = !currentIsDone;
    try {
      await followUpsApi.toggleStatus(id, nextDone);
      setFollowUps(prev => prev.map(f => f.id === id ? { ...f, isDone: nextDone } : f));
      showToast(nextDone ? `Marked follow-up for ${name} as completed` : `Reopened follow-up for ${name}`);
    } catch (err: any) {
      showToast(err?.message || 'Failed to update follow-up status');
    }
  };

  const handleWhatsApp = (phone: string, text: string) => {
    const clean = phone ? phone.replace(/[^0-9]/g, '') : '';
    window.open(`https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    showToast('Dispatched to WhatsApp...');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8 font-['Inter']">
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

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchFollowUps} className="px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-md hover:bg-rose-700 cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {(['All', 'Overdue', 'Today', 'Upcoming'] as const).map((tab) => {
          const isActive = filter === tab;
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
            </button>
          );
        })}
      </div>

      {/* List of Follow-up cards */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">Loading scheduled follow-ups...</span>
        </div>
      ) : followUps.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-slate-100 text-center text-slate-400 text-sm">
          No follow-ups match your selected filter.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {followUps.map((item) => {
            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col gap-4 transition-all ${
                  item.isDone 
                    ? 'border-slate-200 opacity-60 bg-slate-50/70' 
                    : item.type === 'Overdue' 
                      ? 'border-l-4 border-l-rose-500 border-slate-100' 
                      : 'border-slate-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                      {item.studentName ? item.studentName.split(' ').map(n => n[0]).join('') : 'ST'}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => item.studentId && onNavigateToStudent?.(item.studentId)}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                        >
                          {item.studentName}
                        </button>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {item.grade}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <PhoneCall className="w-3 h-3 text-slate-400" /> Parent: <strong className="text-slate-700">{item.parentName || 'Parent'}</strong> ({item.parentPhone})
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

                {item.draft && (
                  <div className="bg-slate-50/70 rounded-lg p-3 border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> WhatsApp Template Draft
                    </span>
                    <p className="text-xs text-slate-600 italic">"{item.draft}"</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleWhatsApp(item.parentPhone, item.draft || item.objective)}
                      className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Open WhatsApp</span>
                    </button>
                    <button
                      onClick={() => toggleDone(item.id, item.studentName, item.isDone)}
                      className={`h-9 px-4 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                        item.isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.isDone ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SettingsProps {
  onLogout?: () => void;
}

export function Settings({ onLogout }: SettingsProps = {}) {
  const [tutorName, setTutorName] = useState('');
  const [subjects, setSubjects] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [autoReminderHours, setAutoReminderHours] = useState('2');
  const [autoDraftMissedSession, setAutoDraftMissedSession] = useState(true);
  const [monthlyRenewalAlert, setMonthlyRenewalAlert] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tutorApi.getProfile()
      .then(res => {
        if (res.data) {
          setTutorName(res.data.name || '');
          setSubjects(res.data.subjects || '');
          setPhone(res.data.phone || '');
          setEmail(res.data.email || '');
          if (res.data.autoReminderHours) {
            setAutoReminderHours(String(res.data.autoReminderHours));
          }
          if (res.data.autoDraftMissedSession !== undefined) {
            setAutoDraftMissedSession(Boolean(res.data.autoDraftMissedSession));
          }
          if (res.data.monthlyRenewalAlert !== undefined) {
            setMonthlyRenewalAlert(Boolean(res.data.monthlyRenewalAlert));
          }
        }
      })
      .catch(err => {
        setError(err?.message || 'Failed to load profile settings');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await tutorApi.updateProfile({
        name: tutorName,
        subjects,
        phone,
        email,
        autoReminderHours: parseInt(autoReminderHours, 10),
        autoDraftMissedSession,
        monthlyRenewalAlert,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err?.message || 'Failed to save settings. Please check phone/email format.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 flex flex-col items-center justify-center gap-3 text-slate-400 font-['Inter']">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">Loading workspace settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8 font-['Inter']">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-indigo-600" />
          <span>Workspace Settings</span>
        </h1>
        <p className="text-slate-500 text-sm">Manage tutor profile, WhatsApp automated templates, and session configurations.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Profile Details */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-base text-slate-900">Tutor Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Display Name *</label>
              <input
                type="text"
                required
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
              <label className="text-xs font-semibold text-slate-700">Registered WhatsApp Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Email Address *</label>
              <input
                type="email"
                required
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
              <input
                type="checkbox"
                checked={autoDraftMissedSession}
                onChange={(e) => setAutoDraftMissedSession(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Monthly Renewal Alert</span>
                <span className="text-xs text-slate-500">Trigger follow-up notification 3 sessions prior to block package end</span>
              </div>
              <input
                type="checkbox"
                checked={monthlyRenewalAlert}
                onChange={(e) => setMonthlyRenewalAlert(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="h-11 px-5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm transition-all cursor-pointer"
            >
              Sign Out
            </button>
          ) : <div />}
          <button
            type="submit"
            disabled={saving || saved}
            className="h-11 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving Preferences...' : saved ? 'Preferences Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

