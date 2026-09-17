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
import { studentsApi } from './api/services';
import { Student } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('tutortrack_token')
  );
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Global modals and drawers
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isNewFollowUpOpen, setIsNewFollowUpOpen] = useState(false);
  const [followUpStudentId, setFollowUpStudentId] = useState<string | undefined>(undefined);
  const [isFastNoteOpen, setIsFastNoteOpen] = useState(false);
  const [fastNoteStudent, setFastNoteStudent] = useState<Student | null>(null);

  // Trigger re-fetches across active views
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(k => k + 1);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('tutortrack_token');
    setIsAuthenticated(false);
  };

  const navigateToStudent = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView('student_detail');
  };

  const navigateBackToDirectory = () => {
    setSelectedStudentId(null);
    setCurrentView('students');
  };

  const handleOpenQuickNoteFromTop = async () => {
    try {
      const res = await studentsApi.list();
      if (res.data && res.data.length > 0) {
        const defaultStudent = selectedStudentId 
          ? res.data.find((s: Student) => s.id === selectedStudentId) || res.data[0]
          : res.data[0];
        setFastNoteStudent(defaultStudent);
      }
    } catch {
      // Ignore fallback
    }
    setIsFastNoteOpen(true);
  };

  const handleOpenFollowUpWithStudent = (studentId?: string) => {
    setFollowUpStudentId(studentId);
    setIsNewFollowUpOpen(true);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <>
      <AppLayout 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onOpenQuickNote={handleOpenQuickNoteFromTop}
        onOpenNewFollowUp={() => handleOpenFollowUpWithStudent()}
        onLogout={handleLogout}
      >
        {currentView === 'dashboard' && (
          <Dashboard 
            refreshKey={refreshKey}
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            onOpenAddFollowUp={() => handleOpenFollowUpWithStudent()}
            onNavigateToStudent={navigateToStudent}
          />
        )}
        {currentView === 'students' && (
          <StudentsDirectory 
            refreshKey={refreshKey}
            onNavigateToStudent={navigateToStudent} 
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            onOpenFollowUpForStudent={(id) => handleOpenFollowUpWithStudent(id)}
          />
        )}
        {currentView === 'student_detail' && selectedStudentId && (
          <StudentDetail 
            studentId={selectedStudentId} 
            refreshKey={refreshKey}
            onBack={navigateBackToDirectory}
          />
        )}
        {currentView === 'followups' && (
          <FollowUps 
            refreshKey={refreshKey}
            onOpenNewFollowUp={() => handleOpenFollowUpWithStudent()}
            onNavigateToStudent={navigateToStudent}
          />
        )}
        {currentView === 'settings' && <Settings onLogout={handleLogout} />}
      </AppLayout>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSaved={handleRefresh}
      />

      {/* New Follow-up Slide-over Drawer */}
      <NewFollowUpDrawer
        isOpen={isNewFollowUpOpen}
        onClose={() => setIsNewFollowUpOpen(false)}
        defaultStudentId={followUpStudentId}
        onSaved={handleRefresh}
      />

      {/* Fast Teaching Logger */}
      <FastTeachingLogger
        isOpen={isFastNoteOpen}
        onClose={() => setIsFastNoteOpen(false)}
        student={fastNoteStudent}
        onSaved={handleRefresh}
      />
    </>
  );
}
