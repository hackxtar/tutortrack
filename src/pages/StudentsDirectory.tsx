import { useState, useEffect } from 'react';
import { 
  Filter, Users, BellRing, CalendarCheck, TrendingUp, Search, 
  ChevronDown, MoreHorizontal, Edit, Send, MessageCircle, Sparkles, Loader2, AlertCircle 
} from 'lucide-react';
import { Student } from '../types';
import { studentsApi } from '../api/services';
import { FastTeachingLogger } from '../components/FastTeachingLogger';

interface StudentsDirectoryProps {
  onNavigateToStudent: (studentId: string) => void;
  onOpenAddStudent?: () => void;
  onOpenFollowUpForStudent?: (studentId: string) => void;
  refreshKey?: number;
}

export function StudentsDirectory({ 
  onNavigateToStudent, 
  onOpenAddStudent,
  onOpenFollowUpForStudent,
  refreshKey = 0
}: StudentsDirectoryProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Lead' | 'Inactive'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedStudentForNote, setSelectedStudentForNote] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentsApi.list({
        status: filter !== 'All' ? filter : undefined,
        search: searchQuery.trim() || undefined,
      });
      if (res.data) {
        setStudents(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch students roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filter, searchQuery, refreshKey]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenWhatsApp = (phone: string, studentName: string, parentName: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const msg = `Hi ${parentName || 'Parent'}, Amit here from TutorTrack regarding ${studentName}'s tutoring schedule and progress.`;
    window.open(`https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    showToast(`Opening WhatsApp for ${parentName || studentName}...`);
  };

  const activeCount = students.filter(s => s.status === 'Active').length;
  const leadCount = students.filter(s => s.status === 'Lead').length;

  const stats = [
    { label: 'Total Enrolled', value: `${students.length}`, trend: `${activeCount} Active`, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Updates', value: `${students.filter(s => s.followUpStatus === 'overdue').length}`, trend: 'Overdue Follow-ups', icon: BellRing, color: 'text-rose-600', bg: 'bg-rose-50', trendColor: 'text-rose-600' },
    { label: 'Lead Pipeline', value: `${leadCount}`, trend: 'Inquiries', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg Attendance', value: '92%', trend: 'Overall Roster', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const handleOpenNote = (student: Student) => {
    setSelectedStudentForNote(student);
    setIsNoteModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8 relative font-['Inter']">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Roster &amp; Engagements</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-medium text-slate-500">Active Term</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl text-slate-900 tracking-tight">Students Directory</h1>
          <p className="text-slate-500 text-sm max-w-2xl mt-1">
            {students.length} Students listed • Manage records, assigned tutors, contact information, and pending follow-ups.
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter by Status Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="h-10 px-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Filter className="w-4 h-4 text-slate-400" />
              <span>{filter === 'All' ? 'Filter by Status' : `Status: ${filter}`}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {statusDropdownOpen && (
              <div className="absolute top-12 left-0 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 p-1.5 flex flex-col text-xs font-semibold text-slate-700">
                {(['All', 'Active', 'Lead', 'Inactive'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      setFilter(st);
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-left hover:bg-slate-50 transition-colors cursor-pointer ${filter === st ? 'bg-indigo-50 text-indigo-700' : ''}`}
                  >
                    {st === 'All' ? 'All Statuses' : st}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={onOpenAddStudent}
            className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 shadow-xs shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
              <span className={`font-['Plus_Jakarta_Sans'] font-bold text-3xl mt-1 ${stat.label === 'Pending Updates' && Number(stat.value) > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{stat.value}</span>
              <span className={`text-xs flex items-center gap-1 mt-1 font-medium ${stat.trendColor || 'text-emerald-600'}`}>
                {stat.trend}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchStudents} className="px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-md hover:bg-rose-700 cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Table Section */}
      <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-100 flex flex-col gap-4">
        {/* Table Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, parent, phone, or course..."
              className="w-full h-11 pl-11 pr-4 bg-slate-50 text-slate-900 text-sm rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 border border-slate-200 focus:border-indigo-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {(['All', 'Active', 'Lead', 'Inactive'] as const).map((tab) => {
              const isActive = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs">Loading students roster...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Parent Details</th>
                  <th className="py-3 px-4">Course &amp; Schedule</th>
                  <th className="py-3 px-4">Teacher</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Follow-up</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-slate-400">
                      No students match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-3 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${student.avatarColor || 'bg-indigo-100 text-indigo-700'}`}>
                            {student.initials || student.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <button
                              onClick={() => onNavigateToStudent(student.id)}
                              className="font-bold text-slate-900 hover:text-indigo-600 text-left text-sm transition-colors cursor-pointer"
                            >
                              {student.name}
                            </button>
                            <span className="text-xs text-slate-500">{student.grade}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-xs">{student.parentName || 'Parent'}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <button 
                              onClick={() => handleOpenWhatsApp(student.parentPhone, student.name, student.parentName)}
                              title="Message on WhatsApp"
                              className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </button>
                            <span className="text-xs text-slate-500 font-mono tracking-tight">{student.parentPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-xs">{student.course}</span>
                          <span className="text-xs text-slate-500">{student.schedule || 'Regular'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${student.status === 'Inactive' ? 'bg-slate-300' : 'bg-indigo-600'}`}></span>
                          <span className="text-xs font-medium text-slate-900">{student.teacher || 'Amit Sharma'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          student.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          student.status === 'Lead' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        {student.nextFollowUp && student.nextFollowUp !== 'None' ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            student.followUpStatus === 'overdue' ? 'bg-rose-100 text-rose-800' :
                            student.followUpStatus === 'today' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-50 text-emerald-700'
                          }`}>
                            {student.nextFollowUp}
                          </span>
                        ) : (
                          <span className="text-xs italic text-slate-400">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {student.status !== 'Inactive' && (
                            <>
                              <button 
                                onClick={() => handleOpenNote(student)}
                                className="h-7 px-2 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Class Note</span>
                              </button>
                              <button 
                                onClick={() => onOpenFollowUpForStudent?.(student.id)}
                                className="h-7 px-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Follow-up</span>
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => onNavigateToStudent(student.id)}
                            className="h-7 w-7 rounded-md hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Note Modal */}
      {selectedStudentForNote && (
        <FastTeachingLogger
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          student={selectedStudentForNote}
          onSaved={() => {
            fetchStudents();
            showToast(`Note recorded for ${selectedStudentForNote.name}`);
          }}
        />
      )}
    </div>
  );
}

