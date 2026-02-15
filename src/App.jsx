import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Target,
  Timer,
  Calendar as CalendarIcon,
  List,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { Dashboard } from './views/Dashboard';
import { Tasks } from './views/Tasks';
import { Notes } from './views/Notes';
import { Habits } from './views/Habits';
import { Pomodoro } from './views/Pomodoro';
import { Calendar } from './views/Calendar';
import { Lists } from './views/Lists';
import { Insights } from './views/Insights';
import { checkVersion } from './utils/version';
import { initDB } from './utils/db';

const VIEWS = {
  DASHBOARD: 'dashboard',
  TASKS: 'tasks',
  NOTES: 'notes',
  HABITS: 'habits',
  POMODORO: 'pomodoro',
  CALENDAR: 'calendar',
  LISTS: 'lists',
  INSIGHTS: 'insights',
};

const NAV_ITEMS = [
  { id: VIEWS.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { id: VIEWS.TASKS, label: 'Tasks', icon: CheckSquare },
  { id: VIEWS.NOTES, label: 'Notes', icon: FileText },
  { id: VIEWS.HABITS, label: 'Habits', icon: Target },
  { id: VIEWS.POMODORO, label: 'Pomodoro', icon: Timer },
  { id: VIEWS.CALENDAR, label: 'Calendar', icon: CalendarIcon },
  { id: VIEWS.LISTS, label: 'Lists', icon: List },
  { id: VIEWS.INSIGHTS, label: 'Insights', icon: BarChart3 },
];

function App() {
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const versionChanged = checkVersion();
      if (versionChanged) {
        console.log('App updated to new version');
      }

      await initDB();
      setMounted(true);
    }

    init();
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case VIEWS.DASHBOARD:
        return <Dashboard onNavigate={handleNavigate} />;
      case VIEWS.TASKS:
        return <Tasks />;
      case VIEWS.NOTES:
        return <Notes />;
      case VIEWS.HABITS:
        return <Habits />;
      case VIEWS.POMODORO:
        return <Pomodoro />;
      case VIEWS.CALENDAR:
        return <Calendar />;
      case VIEWS.LISTS:
        return <Lists onNavigate={handleNavigate} />;
      case VIEWS.INSIGHTS:
        return <Insights />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`min-h-screen transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Mobile Floating Header */}
      <header className="md:hidden fixed top-4 left-4 right-4 z-40 px-6 py-4 rounded-3xl backdrop-blur-xl border shadow-2xl transition-all" style={{
        backgroundColor: 'var(--color-glass)',
        borderColor: 'var(--color-glass-border)'
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="LifeFlow Logo" className="w-10 h-10" />
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tighter">
              LifeFlow
            </h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl hover:bg-surface transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-7 h-7 text-text" /> : <Menu className="w-7 h-7 text-text" />}
          </button>
        </div>
      </header>

      <div className="flex min-h-screen overflow-x-hidden md:p-6 lg:p-8">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 md:top-6 left-0 h-screen md:h-[calc(100vh-3rem)] z-30
          w-72 p-8 md:rounded-3xl border transition-all duration-500 ease-spring
          ${mobileMenuOpen ? 'translate-x-0 pt-28' : '-translate-x-full md:translate-x-0'}
          ${!mobileMenuOpen && 'md:shadow-xl md:shadow-black/5'}
        `} style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            backdropFilter: 'blur(40px)'
          }}>
          {/* Logo */}
          <div className="mb-8 hidden md:block">
            <div className="flex items-center gap-3 mb-2">
              <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="LifeFlow Logo" className="w-10 h-10" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                LifeFlow
              </h1>
            </div>
            <p className="text-sm text-text-secondary">
              Your productivity companion
            </p>
          </div>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-4 px-5 py-4 rounded-2xl
                    font-bold transition-all duration-300 cursor-pointer
                    ${isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                      : 'text-text-secondary hover:bg-surface-elevated hover:text-text hover:translate-x-1'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-primary/70'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 pt-28 md:pt-0 md:pl-8">
          <div className="w-full">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
