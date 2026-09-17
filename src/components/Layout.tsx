import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenQuickNote?: () => void;
  onOpenNewFollowUp?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onLogout?: () => void;
}

export function AppLayout({ 
  children, 
  currentView, 
  setCurrentView,
  onOpenQuickNote,
  onOpenNewFollowUp,
  searchQuery,
  onSearchChange,
  onLogout,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] pb-16 lg:pb-0">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={onLogout} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopNav 
          onOpenQuickNote={onOpenQuickNote}
          onOpenNewFollowUp={onOpenNewFollowUp}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <main className="flex-1 pt-16 w-full">
          {children}
        </main>
      </div>
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}
