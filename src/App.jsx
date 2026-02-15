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
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 px-4 py-3 border-b backdrop-blur-sm" style={{
        backgroundColor: 'color-mix(in srgb, var(--color-background), transparent 20%)',
        borderColor: 'var(--color-border)'
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="LifeFlow Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LifeFlow
            </h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-surface cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="flex min-h-screen overflow-x-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 left-0 h-screen z-30
          w-64 p-6 border-r transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `} style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)'
          }}>
          {/* Logo */}
          <div className="mb-8 hidden md:block">
            <div className="flex items-center gap-3 mb-2">
              <img src="/icon.svg" alt="LifeFlow Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                LifeFlow
              </h1>
            </div>
            <p className="text-sm text-text-secondary">
              Your productivity companion
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    font-medium transition-all cursor-pointer
                    ${isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-text-secondary hover:bg-surface-elevated hover:text-text'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-8">
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
