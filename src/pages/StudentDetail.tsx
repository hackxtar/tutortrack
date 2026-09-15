import { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, FileText, CheckCircle, Clock, MessageCircle, Check, Sparkles } from 'lucide-react';
import { mockStudents, mockClassNotes, mockFollowUps } from '../data';
import { FastTeachingLogger } from '../components/FastTeachingLogger';
import { NewFollowUpDrawer } from '../components/NewFollowUpDrawer';

interface StudentDetailProps {
  studentId: string;
  onBack: () => void;
}

export function StudentDetail({ studentId, onBack }: StudentDetailProps) {
  const student = mockStudents.find(s => s.id === studentId) || mockStudents[0];
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isFollowUpDrawerOpen, setIsFollowUpDrawerOpen] = useState(false);
  const [allNotes, setAllNotes] = useState(mockClassNotes);
  const [followUpsList, setFollowUpsList] = useState(mockFollowUps);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleWhatsApp = (phone: string, msg: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    showToast('Dispatched to WhatsApp...');
  };

  const handleNoteSave = (savedData: any) => {
    const newNote = {
      id: `note-${Date.now()}`,
      studentId: student.id,
      date: 'Today, Oct 24',
      time: 'Just now',
      subject: student.course.split('&')[0].trim() || 'General',
      topic: savedData.topic || 'Class Review & Practice',
      homework: savedData.homework || 'Review notes and practice exercises',
      performance: savedData.performance || 'Good',
      keyStrengths: savedData.keyStrengths || 'Focused learning',
      tutorNote: savedData.tutorNote || 'Completed session on time.',
    };
    setAllNotes([newNote, ...allNotes]);
    showToast('Class note saved successfully!');
  };

  const handleFollowUpSave = (fuData: any) => {
    const newFu = {
      id: `fu-${Date.now()}`,
      studentId: student.id,
      title: fuData.objective || 'Scheduled Follow-up',
      dueDate: fuData.dueDate || 'Tomorrow',
      description: fuData.draftMessage || 'Follow-up with parent on student progress.',
      isOverdue: false,
    };
    setFollowUpsList([newFu, ...followUpsList]);
    showToast('Follow-up task created!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-6 relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb / Nav */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <nav className="flex items-center gap-2 text-sm font-medium">
          <button 
            onClick={onBack} 
            className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Students</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900">{student.name}</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            ID: #{student.id}
          </span>
        </nav>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-semibold text-emerald-600">Class Attendance: {student.attendance}%</span>
        </div>
      </div>

      {/* Hero Master Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-['Plus_Jakarta_Sans'] text-2xl font-bold shadow-xs ${student.avatarColor}`}>
                {student.initials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            
            <div className="flex flex-col min-w-0 gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-slate-900 tracking-tight">{student.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">Active</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-indigo-700 text-xs font-semibold">{student.grade}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap font-medium">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4 text-indigo-600" />
                  Teacher: <strong className="text-slate-900">{student.teacher} (You)</strong>
                </span>
                <span className="opacity-40">•</span>
                <span>Batch #ICSE-B2</span>
                <span className="opacity-40">•</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> 4 Mo Enrolled
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3 self-start lg:self-center">
            <button 
              onClick={() => setIsNoteModalOpen(true)}
              className="h-10 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>+ Add Class Note</span>
            </button>
            <button 
              onClick={() => setIsFollowUpDrawerOpen(true)}
              className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>+ Create Follow-up</span>
            </button>
          </div>
        </div>

        {/* Metadata Details Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Parent Contact</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-slate-900 truncate">{student.parentName}</span>
              <span className="text-xs text-slate-500">(Father)</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => handleWhatsApp(student.parentPhone, `Hi ${student.parentName}, Amit here from TutorTrack with an update on ${student.name}'s progress.`)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-semibold hover:bg-emerald-200 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Communication Details</span>
            <div className="flex items-center gap-1.5 text-slate-900 text-sm font-semibold">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="font-mono tracking-tight">{student.parentPhone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Mail className="w-3.5 h-3.5" />
              <span>parent.{student.name.toLowerCase().replace(' ', '')}@gmail.com</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Course</span>
            <span className="font-semibold text-sm text-indigo-700">{student.course}</span>
            <span className="text-xs text-slate-500 font-medium">{student.schedule}</span>
          </div>

          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subscription &amp; Milestone</span>
             <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-900">14 of 24 Sessions</span>
                <span className="text-xs font-bold text-emerald-600">58% Completed</span>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '58%' }}></div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col (2/3): Class Notes */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-slate-900">Class Notes</h2>
               <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">{allNotes.length} sessions recorded</span>
             </div>
             <button
               onClick={() => setIsNoteModalOpen(true)}
               className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
             >
               + Fast Log
             </button>
          </div>

          {allNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{note.date} • {note.time}</span>
                    <span className="opacity-40">•</span>
                    <span className="font-semibold text-slate-700">{note.subject}</span>
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-slate-900 mt-1">{note.topic}</h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-center ${
                  note.performance === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
                  note.performance === 'Good' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {note.performance} Progress
                </span>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-sm flex flex-col gap-1 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Homework &amp; Assignments</span>
                <p className="text-slate-800 font-medium">{note.homework}</p>
              </div>

              {note.tutorNote && (
                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100/50 text-xs text-amber-900">
                  <span className="font-bold">Tutor Private Note: </span>
                  <span>{note.tutorNote}</span>
                </div>
              )}
            </div>
          ))}
          
          <div className="flex justify-center pt-2">
            <button 
              onClick={() => showToast('All past sessions loaded.')}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              Load Older Sessions...
            </button>
          </div>
        </div>

        {/* Right Col (1/3): Follow-ups & Info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
             <div className="flex items-center justify-between">
               <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-slate-900">Active Follow-ups</h2>
               <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">{followUpsList.length}</span>
             </div>
             
             {followUpsList.map(fu => (
               <div key={fu.id} className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col gap-2 relative overflow-hidden">
                 <div className="flex items-center justify-between">
                   <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">FOLLOW-UP</span>
                   <span className="text-[11px] font-semibold text-rose-600">Scheduled: {fu.dueDate}</span>
                 </div>
                 <h4 className="font-semibold text-sm text-slate-900">{fu.title}</h4>
                 <p className="text-xs text-slate-500 leading-relaxed">{fu.description}</p>
                 <button 
                   onClick={() => handleWhatsApp(student.parentPhone, `Hi ${student.parentName}, checking in regarding: ${fu.title}`)}
                   className="mt-2 w-full h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                 >
                   <MessageCircle className="w-3.5 h-3.5" /> Open WhatsApp
                 </button>
               </div>
             ))}
          </div>

          <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-100 flex flex-col gap-3">
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-md text-slate-900">General Student Notes</h3>
            <p className="text-sm text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-lg border border-slate-100">
              Prepares well for school periodic tests. Parent prefers updates via WhatsApp on weekday mornings. Aiming for 90%+ in ICSE board exams.
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
               <span>Target: 95% in Boards</span>
               <span>Updated recently</span>
            </div>
          </div>
        </div>

      </div>

      {/* Modals & Drawers */}
      <FastTeachingLogger
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        student={student}
        onSave={handleNoteSave}
      />

      <NewFollowUpDrawer
        isOpen={isFollowUpDrawerOpen}
        onClose={() => setIsFollowUpDrawerOpen(false)}
        defaultStudentId={student.id}
        onSave={handleFollowUpSave}
      />
    </div>
  );
}
