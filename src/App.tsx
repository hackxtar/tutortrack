import { useState } from 'react';
import { Auth } from './pages/Auth';
import { AppLayout } from './components/Layout';
import { StudentsDirectory } from './pages/StudentsDirectory';
import { StudentDetail } from './pages/StudentDetail';
import { Dashboard } from './pages/Dashboard';
import { FollowUps, Settings } from './pages/FollowUpsSettings';
import { AddStudentModal } from './components/AddStudentModal';
import { NewFollowUpDrawer } from './components/NewFollowUpDrawer';
import { FastTeachingLogger } from './components/FastTeachingLogger';
import { mockStudents } from './data';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Global modals and drawers
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isNewFollowUpOpen, setIsNewFollowUpOpen] = useState(false);
  const [followUpStudentId, setFollowUpStudentId] = useState<string | undefined>(undefined);
  const [isFastNoteOpen, setIsFastNoteOpen] = useState(false);
  const [fastNoteStudent, setFastNoteStudent] = useState<any>(mockStudents[0]);

  // Students roster state
  const [students, setStudents] = useState(mockStudents);

  const handleLogin = () => {
    setCurrentView('dashboard');
  };

  const navigateToStudent = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView('student_detail');
  };

  const navigateBackToDirectory = () => {
    setSelectedStudentId(null);
    setCurrentView('students');
  };

  const handleOpenQuickNoteFromTop = () => {
    const defaultStudent = selectedStudentId 
      ? students.find(s => s.id === selectedStudentId) || students[0]
      : students[0];
    setFastNoteStudent(defaultStudent);
    setIsFastNoteOpen(true);
  };

  const handleOpenFollowUpWithStudent = (studentId?: string) => {
    setFollowUpStudentId(studentId);
    setIsNewFollowUpOpen(true);
  };

  const handleAddNewStudent = (studentData: any) => {
    const newStudent = {
      id: `${students.length + 1}`,
      name: studentData.name,
      grade: studentData.grade,
      course: studentData.course,
      teacher: 'Amit Sharma',
      parentName: studentData.parentName || 'Parent',
      parentPhone: studentData.parentPhone || '+91 99999 00000',
      schedule: studentData.schedule || 'Mon, Wed • 5:00 PM',
      status: 'Active',
      nextFollowUp: 'Tomorrow, 4:00 PM',
      followUpStatus: 'upcoming',
      avatarColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      initials: studentData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
      attendance: 100,
    };
    setStudents([newStudent, ...students]);
  };

  if (currentView === 'auth') {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <>
      <AppLayout 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onOpenQuickNote={handleOpenQuickNoteFromTop}
        onOpenNewFollowUp={() => handleOpenFollowUpWithStudent()}
      >
        {currentView === 'dashboard' && (
          <Dashboard 
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            onOpenAddFollowUp={() => handleOpenFollowUpWithStudent()}
            onNavigateToStudent={navigateToStudent}
          />
        )}
        {currentView === 'students' && (
          <StudentsDirectory 
            onNavigateToStudent={navigateToStudent} 
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            onOpenFollowUpForStudent={(id) => handleOpenFollowUpWithStudent(id)}
          />
        )}
        {currentView === 'student_detail' && selectedStudentId && (
          <StudentDetail 
            studentId={selectedStudentId} 
            onBack={navigateBackToDirectory} 
          />
        )}
        {currentView === 'followups' && (
          <FollowUps 
            onOpenNewFollowUp={() => handleOpenFollowUpWithStudent()}
            onNavigateToStudent={navigateToStudent}
          />
        )}
        {currentView === 'settings' && <Settings />}
      </AppLayout>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddNewStudent}
      />

      {/* New Follow-up Slide-over Drawer (Image 1) */}
      <NewFollowUpDrawer
        isOpen={isNewFollowUpOpen}
        onClose={() => setIsNewFollowUpOpen(false)}
        defaultStudentId={followUpStudentId}
      />

      {/* Fast Teaching Logger (Image 2) */}
      <FastTeachingLogger
        isOpen={isFastNoteOpen}
        onClose={() => setIsFastNoteOpen(false)}
        student={fastNoteStudent}
      />
    </>
  );
}
