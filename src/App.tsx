import { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, LayoutDashboard, Calendar, ListTodo, Star, 
  Clock, BookOpen, Award, FileText, BarChart3, User, Menu, Bell
} from 'lucide-react';

// Components
import { Dashboard } from './components/Dashboard';
import { ScheduleAndTasks } from './components/ScheduleAndTasks';
import { ExamsAndCalendar } from './components/ExamsAndCalendar';
import { FocusAndHabits } from './components/FocusAndHabits';
import { SubjectAndGrades } from './components/SubjectAndGrades';
import { NotesSection } from './components/NotesSection';
import { StatsDashboard } from './components/StatsDashboard';
import { NotificationCenter, AppNotification, playChimeSound } from './components/NotificationCenter';

// Mock Data
import { 
  INITIAL_SUBJECTS, INITIAL_SCHEDULES, INITIAL_ASSIGNMENTS, 
  INITIAL_EXAMS, INITIAL_TODOS, INITIAL_GRADES, INITIAL_HABITS, INITIAL_NOTES 
} from './initialData';

export default function App() {
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('ssp_username') || 'Adel';
  });

  // State definitions from localStorage fallbacks with smart default merging
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('ssp_subjects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingNames = new Set(parsed.map((s: any) => s.name.toLowerCase()));
        const missingDefaults = INITIAL_SUBJECTS.filter((s) => !existingNames.has(s.name.toLowerCase()));
        if (missingDefaults.length > 0) {
          const merged = [...parsed, ...missingDefaults];
          localStorage.setItem('ssp_subjects', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        return INITIAL_SUBJECTS;
      }
    }
    return INITIAL_SUBJECTS;
  });

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('ssp_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('ssp_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('ssp_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('ssp_todos');
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem('ssp_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('ssp_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('ssp_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('ssp_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'welcome-notif',
        title: 'Halo Adel! Selamat Datang 🌸',
        message: 'Smart Study Planner Premium siap membantumu meraih prestasi terbaik semester ini!',
        type: 'system',
        timestamp: new Date(),
        read: false,
      },
      {
        id: 'welcome-notif-2',
        title: 'Atur Target Belajar 🏆',
        message: 'Lengkapi jadwal pelajaran dan kuis mingguanmu di bagian menu planner.',
        type: 'system',
        timestamp: new Date(),
        read: false,
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state data to localStorage on edits
  useEffect(() => {
    localStorage.setItem('ssp_username', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('ssp_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('ssp_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('ssp_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('ssp_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('ssp_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('ssp_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('ssp_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('ssp_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('ssp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Helper helper to generate alerts
  const addNotification = (title: string, message: string, type: 'schedule' | 'assignment' | 'exam' | 'system') => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Nav items declarations
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Jadwal & Tugas', icon: Calendar },
    { id: 'exams', label: 'Kalender & Ujian', icon: Star },
    { id: 'focus', label: 'Fokus & Habit', icon: Clock },
    { id: 'subjects', label: 'Pelajaran & Nilai', icon: BookOpen },
    { id: 'notes', label: 'Catatan Belajar', icon: FileText },
    { id: 'stats', label: 'Grafik Statistik', icon: BarChart3 },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    playChimeSound('success');
  };

  return (
    <div className="min-h-screen bg-[#FFF0F2] flex flex-col md:flex-row text-left">
      
      {/* SIDEBAR NAVIGATION: DESKTOP ONLY */}
      <aside className="hidden md:flex flex-col w-64 bg-[#FFFBFB] border-r border-[#FFD0D8] shrink-0 min-h-screen sticky top-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-[#FFF0F2] flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-[#FF8DA1] flex items-center justify-center text-white shadow-md animate-float">
            <Heart size={18} className="fill-current" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-sm tracking-tight text-[#523A3E]">
              Smart Study Planner
            </h1>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#FF8DA1] bg-[#FFF0F2] px-2 py-0.5 rounded-lg">
              PREMIUM DESK
            </span>
          </div>
        </div>

        {/* Sidebar Nav body links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#FF8DA1] text-white shadow-sm scale-[1.02]'
                    : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Profile Area with personalization */}
        <div className="p-4 border-t border-[#FFF0F2] bg-[#FFF8F9]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-[#FFD0D8] bg-[#FFF0F2] flex items-center justify-center font-bold text-[#FF6384] overflow-hidden">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#523A3E] truncate">{userName}</h4>
              <p className="text-[10px] text-[#A67E83] truncate">Premium Member 🌸</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER & NAVIGATION BAR */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#FFD0D8] bg-[#FFFBFB] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#FF8DA1] flex items-center justify-center text-white">
            <Heart size={14} className="fill-current" />
          </div>
          <h1 className="font-display font-extrabold text-[#523A3E] text-xs tracking-tight">
            Smart Study Planner
          </h1>
        </div>

        {/* Right tools Bell notification & mobile menu panel trigger */}
        <div className="flex items-center gap-1.5">
          <NotificationCenter
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#FFD0D8] bg-white rounded-full text-[#8A6167]"
            title="Menu Navigasi"
          >
            <Menu size={16} />
          </button>
        </div>
      </header>

      {/* DRAWER FULLSCREEN PANEL OVERLAY FOR MOBILE */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/30 backdrop-blur-xs flex justify-end">
          <div className="w-64 max-w-full bg-[#FFFBFB] h-full flex flex-col p-5 border-l border-[#FFD0D8] animate-slide-in">
            <div className="flex justify-between items-center pb-4 border-b border-[#FFF0F2] mb-4">
              <span className="font-display font-bold text-xs text-[#523A3E]">Menu Navigasi</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-rose-500 font-bold hover:underline"
              >
                Close
              </button>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#FF8DA1] text-white shadow-sm'
                        : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-[#FFF0F2]">
              <p className="text-[10px] text-[#A67E83] text-center font-bold">User: {userName} 🎀</p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER CONTENT */}
      <main className="flex-1 min-w-0 p-4 md:p-8 flex flex-col justify-between max-w-7xl mx-auto w-full">
        <div>
          {/* Desktop utility header displaying Notification Bell */}
          <div className="hidden md:flex justify-between items-center mb-6 border-b border-[#FFE6EA] pb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#A67E83]">
              <Sparkles size={14} className="text-[#FF8DA1]" />
              <span>Aesthetic Coquette Pink Style Study Planner</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#6E4249] bg-white border border-[#FFD0D8] px-3 py-1.5 rounded-full shadow-3xs flex items-center gap-1">
                <span>🌸 Room: {userName}</span>
              </span>
              <NotificationCenter
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </div>
          </div>

          {/* RENDERING SCREEN VIEWS */}
          <div className="transition-all duration-300">
            {activeTab === 'dashboard' && (
              <Dashboard
                userName={userName}
                setUserName={setUserName}
                subjects={subjects}
                assignments={assignments}
                schedules={schedules}
                habits={habits}
                exams={exams}
                todos={todos}
                setActiveTab={handleTabChange}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleAndTasks
                schedules={schedules}
                setSchedules={setSchedules}
                assignments={assignments}
                setAssignments={setAssignments}
                subjects={subjects}
                addNotification={addNotification}
              />
            )}

            {activeTab === 'exams' && (
              <ExamsAndCalendar
                exams={exams}
                setExams={setExams}
                schedules={schedules}
                assignments={assignments}
                subjects={subjects}
                addNotification={addNotification}
              />
            )}

            {activeTab === 'focus' && (
              <FocusAndHabits
                todos={todos}
                setTodos={setTodos}
                habits={habits}
                setHabits={setHabits}
                addNotification={addNotification}
              />
            )}

            {activeTab === 'subjects' && (
              <SubjectAndGrades
                subjects={subjects}
                setSubjects={setSubjects}
                grades={grades}
                setGrades={setGrades}
                assignments={assignments}
                addNotification={addNotification}
              />
            )}

            {activeTab === 'notes' && (
              <NotesSection
                notes={notes}
                setNotes={setNotes}
                addNotification={addNotification}
              />
            )}

            {activeTab === 'stats' && (
              <StatsDashboard
                grades={grades}
                assignments={assignments}
                habits={habits}
                subjects={subjects}
              />
            )}
          </div>
        </div>

        {/* MASTER VISUAL PREMIUM FOOTER */}
        <footer className="mt-12 border-t border-[#FFD0D8] pt-6 pb-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#FFF0F2] bg-white/70 shadow-3xs mb-2">
            <Heart size={14} className="text-[#FF8DA1] fill-current animate-float" />
            <span className="font-display font-black text-[#523A3E] text-[11px] uppercase tracking-widest">
              Smart Study Planner Premium
            </span>
          </div>
          <p className="text-[11px] text-[#A67E83] leading-none" id="footer-creative-credits">
            Created by: <span className="font-extrabold text-[#FF6384] hover:underline">Athifa Adzara Adelia — DIGISTAR</span>
          </p>
          <p className="text-[9px] text-[#CBB1B4] uppercase mt-1 tracking-wider">
            © 2026 Athifa Adzara Adelia. Crafted with elegant grace.
          </p>
        </footer>

      </main>

      {/* MOBILE COZY BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#FFD0D8] z-30 px-2 py-1.5 flex justify-around shadow-lg">
        {navigationItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors ${
                isActive ? 'text-[#FF6384] font-bold' : 'text-[#8A6167]/70'
              }`}
            >
              <Icon size={16} />
              <span className="text-[9px] font-semibold mt-1">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
      {/* Spacer so bottom navigation does not hide content on small screens */}
      <div className="h-14 md:hidden shrink-0" />

    </div>
  );
}
