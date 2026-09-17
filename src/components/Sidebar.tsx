import { useState, useEffect } from 'react';
import { Home, Users, MessageSquare, Settings, LogOut } from 'lucide-react';
import { tutorApi, followUpsApi } from '../api/services';
import { TutorProfile } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout?: () => void;
}

export function Sidebar({ currentView, setCurrentView, onLogout }: SidebarProps) {
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [activeFollowUpsCount, setActiveFollowUpsCount] = useState<number>(0);

  useEffect(() => {
    tutorApi.getProfile().then(res => {
      if (res.data) setProfile(res.data);
    }).catch(() => {});

    followUpsApi.list().then(res => {
      if (res.data) {
        setActiveFollowUpsCount(res.data.filter(f => !f.isDone).length);
      }
    }).catch(() => {});
  }, [currentView]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, count: 0 },
    { id: 'students', label: 'Students', icon: Users, count: 0 },
    { id: 'followups', label: 'Follow-ups', icon: MessageSquare, count: activeFollowUpsCount },
    { id: 'settings', label: 'Settings', icon: Settings, count: 0 },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex-col justify-between z-50">
      <div className="flex flex-col">
        {/* Logo area */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-slate-900 leading-tight">TutorTrack</span>
            <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Tutor MVP</span>
          </div>
        </div>

        <div className="px-6 py-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</span>
        </div>

        <nav className="px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'students' && currentView === 'student_detail');
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=150&auto=format&fit=crop"
              alt="Amit Sharma"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-slate-900 truncate">{profile?.name || 'Tutor'}</span>
            <span className="text-xs text-slate-500 truncate">{profile?.subjects || 'Workspace'}</span>
          </div>
        </div>
        <button 
          onClick={() => onLogout ? onLogout() : setCurrentView('auth')}
          className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
