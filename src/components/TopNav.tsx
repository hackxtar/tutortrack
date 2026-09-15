import { Search, Plus, MessageCircle } from 'lucide-react';

interface TopNavProps {
  onOpenQuickNote?: () => void;
  onOpenNewFollowUp?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function TopNav({ onOpenQuickNote, onOpenNewFollowUp, searchQuery, onSearchChange }: TopNavProps) {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/80 backdrop-blur-md z-40 border-b border-slate-200">
      <div className="w-full h-full px-4 lg:px-8 flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teaching Workspace</span>
            <span className="text-sm font-semibold text-slate-900">Thursday, Oct 24, 2024</span>
          </div>
        </div>

        {/* Mobile Centered Logo */}
        <div className="flex lg:hidden items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-[10px]">T</div>
          <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-slate-900">TutorTrack</span>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search students..."
              className="h-9 pl-9 pr-12 bg-slate-100 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 lg:w-64 placeholder:text-slate-500"
            />
            <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-white text-slate-500 rounded border border-slate-200">⌘K</kbd>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQuickNote}
              className="h-9 px-3 lg:px-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Note</span>
            </button>
            <button
              onClick={onOpenNewFollowUp}
              className="h-9 px-3 lg:px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Follow-up</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
