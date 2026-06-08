import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, Trash2, Plus, Sparkles, CheckSquare, Heart, Clock, ChevronRight, Award, Flame, Star } from 'lucide-react';
import { TodoItem, Habit } from '../types';
import { playChimeSound } from './NotificationCenter';

interface FocusAndHabitsProps {
  todos: TodoItem[];
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  addNotification: (title: string, message: string, type: 'system') => void;
}

export const FocusAndHabits: React.FC<FocusAndHabitsProps> = ({
  todos,
  setTodos,
  habits,
  setHabits,
  addNotification,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pomodoro' | 'checklist' | 'habits'>('pomodoro');

  // Pomodoro States
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [focusStreakSession, setFocusStreakSession] = useState(0);
  const [totalMinFocused, setTotalMinFocused] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Todo States
  const [newTodoText, setNewTodoText] = useState('');

  // Habit States
  const [newHabitName, setNewHabitName] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Synchronize dynamic dates based on GMT 2026-06-08
  const todayStr = '2026-06-08';

  // ------------------------------------
  // POMODORO TIMER CORE LOGIC
  // ------------------------------------
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerMode]);

  const handleTimerComplete = () => {
    if (timerMode === 'focus') {
      const mins = 25;
      setFocusStreakSession((prev) => prev + 1);
      setTotalMinFocused((prev) => prev + mins);
      playChimeSound('levelUp');
      addNotification(
        'Sesi Fokus Selesai! 🎀',
        'Luar biasa Adel! Kamu telah berfokus penuh selama 25 menit. Ambil istirahat sejenak.',
        'system'
      );
      // Switch mode to shortBreak automatically
      switchMode('shortBreak');
    } else {
      playChimeSound('bell');
      addNotification(
        'Istirahat Selesai ✨',
        'Waktunya kembali berfokus dan mencapai target belajarmu hari ini!',
        'system'
      );
      switchMode('focus');
    }
  };

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === 'focus') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    switchMode(timerMode);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Circular progress calculations
  const getInitialSeconds = () => {
    if (timerMode === 'focus') return 25 * 60;
    if (timerMode === 'shortBreak') return 5 * 60;
    return 15 * 60;
  };
  const totalSecs = getInitialSeconds();
  const percentage = totalSecs > 0 ? (timeLeft / totalSecs) * 100 : 0;
  const strokeDashoffset = 280 - (280 * percentage) / 100;

  // ------------------------------------
  // DAILY CHECKLIST (TO-DO) LOGIC
  // ------------------------------------
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newItem: TodoItem = {
      id: 'todo-' + Date.now(),
      text: newTodoText.trim(),
      completed: false,
      date: todayStr,
    };

    setTodos((prev) => [newItem, ...prev]);
    setNewTodoText('');
    playChimeSound('success');
  };

  const toggleTodo = (id: string, currentlyCompleted: boolean) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    if (!currentlyCompleted) {
      playChimeSound('success');
    }
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    playChimeSound('bell');
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const todoPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // ------------------------------------
  // HABIT TRACKER LOGIC
  // ------------------------------------
  // Function to toggle status of habits for a certain date
  const toggleHabitHistory = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const newHistory = { ...h.history };
          const completed = !newHistory[dateStr];
          newHistory[dateStr] = completed;

          // Calculate streak dynamically
          const calculatedStreak = calculateStreak(newHistory, dateStr);

          return {
            ...h,
            history: newHistory,
            streak: calculatedStreak,
          };
        }
        return h;
      })
    );
    playChimeSound('success');
  };

  // Backwards streak check
  const calculateStreak = (history: Record<string, boolean>, baseDateStr: string): number => {
    let streak = 0;
    let checkDate = new Date(baseDateStr);

    // If base date is not completed, check if yesterday was completed
    if (!history[baseDateStr]) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (history[checkStr]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1); // move back 1 day
      } else {
        break; // streak interrupted
      }
    }
    return streak;
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: 'hb-' + Date.now(),
      name: newHabitName.trim(),
      streak: 0,
      history: {},
    };

    setHabits((prev) => [...prev, newHabit]);
    setNewHabitName('');
    playChimeSound('success');
    addNotification('Habit Ditambahkan', `Mulai bangun ketekunan belajar di habit "${newHabit.name}"!`, 'system');
  };

  const deleteHabit = (id: string, name: string) => {
    setItemToDelete({ id, title: name });
  };

  // Generate date history tags (Past 5 days for checking)
  const getPastDays = () => {
    const days = [];
    const dateNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(todayStr);
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const name = dateNames[d.getDay()];
      days.push({ dateStr: str, label: name, dayNum: d.getDate() });
    }
    return days;
  };
  const past5Days = getPastDays();

  return (
    <div className="space-y-6">
      {/* Tab bar header */}
      <div className="flex border-b border-[#ffd7de] bg-white/60 p-1.5 rounded-2xl md:max-w-md mx-auto shadow-sm">
        <button
          onClick={() => setActiveSubTab('pomodoro')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
            activeSubTab === 'pomodoro'
              ? 'bg-[#FF8DA1] text-white shadow-sm'
              : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
          }`}
        >
          <Clock size={14} />
          Pomodoro Timer
        </button>
        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
            activeSubTab === 'checklist'
              ? 'bg-[#FF8DA1] text-white shadow-sm'
              : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
          }`}
        >
          <CheckSquare size={14} />
          Harian To-Do
        </button>
        <button
          onClick={() => setActiveSubTab('habits')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
            activeSubTab === 'habits'
              ? 'bg-[#FF8DA1] text-white shadow-sm'
              : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
          }`}
        >
          <Flame size={14} />
          Habit Tracker
        </button>
      </div>

      {/* SUB TAB 1: POMODORO TIMER */}
      {activeSubTab === 'pomodoro' && (
        <div className="space-y-6 max-w-3xl mx-auto w-full">
          <div className="rounded-2xl border border-[#FFD0D8] bg-white p-6 shadow-sm text-center">
            <h3 className="font-display font-medium text-xs tracking-wider uppercase text-[#E5919F] mb-4">
              🎀 Ambient Pomodoro Focus Desk 🎀
            </h3>

            {/* Mode Switchers */}
            <div className="flex justify-center gap-2 p-1 bg-[#FFF5F6] rounded-xl mb-8 max-w-sm mx-auto border border-[#FFE8EB]">
              <button
                onClick={() => switchMode('focus')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  timerMode === 'focus' ? 'bg-[#FF8DA1] text-white' : 'text-[#8A6167] hover:bg-white/50'
                }`}
              >
                Focus
              </button>
              <button
                onClick={() => switchMode('shortBreak')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  timerMode === 'shortBreak' ? 'bg-[#D2FFD2] text-[#2C5E2C]' : 'text-[#8A6167] hover:bg-white/50'
                }`}
              >
                Break (5m)
              </button>
              <button
                onClick={() => switchMode('longBreak')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  timerMode === 'longBreak' ? 'bg-[#C8E4FF] text-[#2C495E]' : 'text-[#8A6167] hover:bg-white/50'
                }`}
              >
                Long Break
              </button>
            </div>

            {/* Clock Face Display SVG Circle */}
            <div className="relative flex justify-center items-center h-48 w-48 mx-auto mb-8">
              <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={timerMode === 'focus' ? '#FFF0F2' : timerMode === 'shortBreak' ? '#F0FFF0' : '#F0F7FF'}
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={timerMode === 'focus' ? '#FF8DA1' : timerMode === 'shortBreak' ? '#4ADE80' : '#60A5FA'}
                  strokeWidth="6"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              
              <div className="z-10 text-center">
                <span className="font-mono text-3xl md:text-4xl font-extrabold text-[#523A3E] tracking-wider leading-none">
                  {formatTime(timeLeft)}
                </span>
                <p className="text-[9px] uppercase tracking-widest text-[#BFA0A4] font-bold mt-1.5">
                  {timerMode === 'focus' ? 'DURASI BELAJAR' : 'ISTIRAHAT'}
                </p>
              </div>
            </div>

            {/* Click controls */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={resetTimer}
                className="p-3 border border-[#FFD0D8] rounded-full text-[#A67E83] hover:text-[#FF6384] hover:bg-rose-50 transition-colors"
                title="Reset timer"
              >
                <RotateCw size={16} />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-1 px-6 py-3.5 rounded-full text-white font-bold text-xs shadow-md ${
                  timerMode === 'focus'
                    ? 'bg-[#FF8DA1] hover:bg-[#FF6384]'
                    : timerMode === 'shortBreak'
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause size={14} fill="currentColor" />
                    <span>PUSE</span>
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    <span>START FOCUS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats summary board for focus session */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FFF5F6] border border-[#FFD0D8] rounded-2xl p-4 text-center">
              <span className="text-[10px] text-[#A67E83] font-bold uppercase tracking-wider block">Sesi Tercapai</span>
              <span className="font-display text-2xl font-bold text-[#FF6384] block mt-1">⭐️ {focusStreakSession}</span>
              <p className="text-[10px] text-[#C29AA0] mt-1">Sesi Pomodoro berhasil hari ini</p>
            </div>
            <div className="bg-[#FFF5F6] border border-[#FFD0D8] rounded-2xl p-4 text-center">
              <span className="text-[10px] text-[#A67E83] font-bold uppercase tracking-wider block">Total Menit Belajar</span>
              <span className="font-display text-2xl font-bold text-[#FF6384] block mt-1">⏳ {totalMinFocused} Mins</span>
              <p className="text-[10px] text-[#C29AA0] mt-1">Terakumulasi fokus penuh</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: HARIAN TO-DO */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-4 max-w-3xl mx-auto w-full">
          <div className="rounded-2xl border border-[#FFD0D8] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-[#523A3E] flex items-center gap-1.5">
                <CheckSquare size={16} className="text-[#FF6384]" />
                Daily Practice Checklist
              </h3>
              <span className="text-xs text-rose-500 font-bold bg-rose-50 px-2.5 py-1 rounded-lg">
                Selesai: {todoPercent}%
              </span>
            </div>

            {/* Todo Percentage Visualizer bar */}
            <div className="w-full bg-[#FFF0F2] rounded-full h-2 overflow-hidden mb-5">
              <div
                className="bg-gradient-to-r from-[#FFB4C2] to-[#FF6384] h-2 rounded-full transition-all duration-300"
                style={{ width: `${todoPercent}%` }}
              />
            </div>

            {/* Simple add todo inline form */}
            <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                maxLength={50}
                required
                placeholder="Tambah checklist harian... (e.g. Istirahat sore, review rumus)"
                className="flex-1 rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-xs text-[#523A3E] focus:outline-none focus:ring-1 focus:ring-[#FF8DA1]"
              />
              <button
                type="submit"
                className="rounded-xl px-4 py-2 bg-[#FF8DA1] hover:bg-[#FF6384] text-xs font-bold text-white shadow-xs shrink-0 flex items-center gap-0.5"
              >
                <Plus size={14} />
                Add
              </button>
            </form>

            {/* Checklist items list */}
            {todos.length === 0 ? (
              <p className="text-xs text-[#AC888C] text-center p-6 italic bg-gray-50/50 rounded-xl">Belum ada agenda checklist harian.</p>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-2.5 border rounded-xl transition-colors ${
                      todo.completed ? 'bg-emerald-50/50 border-emerald-200 text-gray-400' : 'bg-white border-gray-100 hover:border-[#FFD0D8]'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs text-left">
                      <button
                        type="button"
                        onClick={() => toggleTodo(todo.id, todo.completed)}
                        className={`h-4.5 w-4.5 rounded-lg border flex items-center justify-center transition-all ${
                          todo.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-[#FFD0D8] hover:bg-rose-50'
                        }`}
                      >
                        {todo.completed && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className={todo.completed ? 'line-through text-gray-400' : 'font-medium text-[#523A3E]'}>
                        {todo.text}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-300 hover:text-red-500 p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB TAB 3: HABIT TRACKER */}
      {activeSubTab === 'habits' && (
        <div className="space-y-4 max-w-3xl mx-auto w-full">
          <div className="rounded-2xl border border-[#FFD0D8] bg-white p-5 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-base text-[#523A3E] flex items-center gap-1.5 mb-2">
                <Flame size={18} className="text-[#D4AF37] fill-[#D4AF37]" />
                Daily Study Habits
              </h3>
              <p className="text-xs text-[#AC888C] mb-4">Centang setiap kali kamu menyelesaikan target kebiasaanmu dalam 5 hari terakhir.</p>
            </div>

            {/* Register new habit */}
            <form onSubmit={handleAddHabit} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                maxLength={40}
                required
                placeholder="Buat kebiasaan baru... (e.g. Olahraga ringkas, Tulis diary)"
                className="flex-1 rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-xs text-[#523A3E] focus:outline-none focus:ring-1 focus:ring-[#FF8DA1]"
              />
              <button
                type="submit"
                className="rounded-xl px-4 py-2 bg-[#FF8DA1] hover:bg-[#FF6384] text-xs font-bold text-white shadow-xs shrink-0 flex items-center gap-0.5"
              >
                <Plus size={14} />
                Mulai Habit
              </button>
            </form>

            <div className="space-y-4">
              {habits.map((hb) => (
                <div
                  key={hb.id}
                  className="rounded-xl p-3 bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display text-xs font-bold text-[#523A3E] truncate">{hb.name}</h4>
                      <button
                        onClick={() => deleteHabit(hb.id, hb.name)}
                        className="text-gray-300 hover:text-red-500"
                        title="Hapus habit"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>

                    {/* Streak indicator badges */}
                    <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg w-fit">
                      <Flame size={12} className="text-[#D4AF37] fill-[#D4AF37]" />
                      <span>{hb.streak} Day Streak!</span>
                    </div>
                  </div>

                  {/* 5 dates Checklist bar */}
                  <div className="flex gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 shrink-0 self-start sm:self-auto">
                    {past5Days.map((day) => {
                      const active = !!hb.history[day.dateStr];
                      return (
                        <button
                          key={day.dateStr}
                          type="button"
                          onClick={() => toggleHabitHistory(hb.id, day.dateStr)}
                          className={`flex flex-col items-center p-1 rounded-lg w-8 transition-colors ${
                            active
                              ? 'bg-rose-100 border border-[#FFB4C2] text-[#FF6384]'
                              : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-[8px] font-bold uppercase">{day.label}</span>
                          <span className="text-[11px] font-black leading-none mt-1">{day.dayNum}</span>
                          
                          {/* Checked box representation inside */}
                          <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${active ? 'bg-[#FF6384]' : 'bg-gray-200'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM COQUETTE DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#FFD0D8] shadow-2xl p-6 text-center animate-scale-up">
            <div className="h-12 w-12 rounded-full bg-[#FFF0F2] text-[#FF6384] flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="font-display font-extrabold text-sm text-[#523A3E] mb-2">Hapus Habit Belajar? 🎀</h3>
            <p className="text-xs text-[#AC888C] leading-relaxed mb-6">
              Apakah Adel yakin ingin menghapus habit <span className="font-bold text-[#FF6384]">"{itemToDelete.title}"</span>? Laporan streak harianmu akan ikut terhapus.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="rounded-xl px-4 py-2 border border-[#FFD0D8] text-xs font-bold text-[#8A6167] hover:bg-[#FFF0F2] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setHabits((prev) => prev.filter((h) => h.id !== itemToDelete.id));
                  playChimeSound('bell');
                  setItemToDelete(null);
                }}
                className="rounded-xl px-4 py-2 bg-[#FF8DA1] hover:bg-[#FF6384] text-xs font-bold text-white shadow-xs transition-colors"
              >
                Ya, Hapus 🎀
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
