import { Home, Users, MessageSquare, Settings } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function BottomNav({ currentView, setCurrentView }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, count: 0 },
    { id: 'students', label: 'Students', icon: Users, count: 0 },
    { id: 'followups', label: 'Follow-ups', icon: MessageSquare, count: 3 },
    { id: 'settings', label: 'Settings', icon: Settings, count: 0 },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 pb-safe pt-1 flex items-center justify-around h-16">
      {navItems.map((item) => {
        const isActive = currentView === item.id || (item.id === 'students' && currentView === 'student_detail');
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {item.count}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
