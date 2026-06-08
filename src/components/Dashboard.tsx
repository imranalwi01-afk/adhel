import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, Smile, Heart, RefreshCw, Trophy, Flame, BookOpen, CheckSquare } from 'lucide-react';
import { Subject, Assignment, Schedule, Habit, Exam, TodoItem } from '../types';
import { DAILY_MOTIVATIONS } from '../initialData';

interface DashboardProps {
  userName: string;
  setUserName: (name: string) => void;
  subjects: Subject[];
  assignments: Assignment[];
  schedules: Schedule[];
  habits: Habit[];
  exams: Exam[];
  todos: TodoItem[];
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userName,
  setUserName,
  subjects,
  assignments,
  schedules,
  habits,
  exams,
  todos,
  setActiveTab,
}) => {
  const [time, setTime] = useState(new Date());
  const [motivation, setMotivation] = useState(DAILY_MOTIVATIONS[0]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRandomMotivation = () => {
    const currentIndex = DAILY_MOTIVATIONS.indexOf(motivation);
    let nextIndex = Math.floor(Math.random() * DAILY_MOTIVATIONS.length);
    if (nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % DAILY_MOTIVATIONS.length;
    }
    setMotivation(DAILY_MOTIVATIONS[nextIndex]);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setIsEditingName(false);
    }
  };

  // Calculations for stats widgets
  const completedTaskCount = assignments.filter((a) => a.status === 'completed').length;
  const totalTaskCount = assignments.length;
  const taskProgress = totalTaskCount > 0 ? Math.round((completedTaskCount / totalTaskCount) * 100) : 0;

  const completedTodoCount = todos.filter((t) => t.completed).length;
  const totalTodoCount = todos.length;
  const todoProgress = totalTodoCount > 0 ? Math.round((completedTodoCount / totalTodoCount) * 100) : 0;

  // Active schedule list for today
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[time.getDay()];
  const schedulesToday = schedules.filter((s) => s.day === todayName);

  // Remaining exams
  const upcomingExams = exams.filter((e) => {
    const examDate = new Date(e.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return examDate >= today;
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Max habit streak
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  // Greeting based on time of day
  const hour = time.getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  else if (hour >= 17) greeting = 'Good Evening';

  // Format Date gracefully: e.g. "Monday, 8 June 2026"
  const formattedDate = time.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Hero Header Area */}
      <div className="relative overflow-hidden rounded-3xl border border-[#FFD0D8] bg-[#FFF5F6]/75 p-6 md:p-8 shadow-sm backdrop-blur-md">
        <div className="coquette-lace-bg absolute inset-0 -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#FF6384] font-display font-medium text-sm md:text-base">
              <Sparkles size={16} className="animate-spin" style={{ animationDuration: '6s' }} />
              <span>Beautiful Day for Learning</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                    className="rounded-xl border border-[#FFD0D8] bg-white px-3 py-1 font-display text-2xl font-bold text-[#6E4249] focus:outline-none focus:ring-2 focus:ring-[#FF8DA1]"
                    maxLength={20}
                    autoFocus
                  />
                  <button
                    onClick={handleNameSave}
                    className="rounded-xl bg-[#FF8DA1] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#FF6384]"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h1 className="font-display text-3xl md:text-4xl font-bold text-[#523A3E] tracking-tight">
                  {greeting}, <span className="text-[#FF6384] hover:underline cursor-pointer" onClick={() => setIsEditingName(true)} title="Klik untuk edit nama">{userName}</span> 🎀
                </h1>
              )}
            </div>

            <p className="text-sm text-[#7E575C] font-nunito flex items-center gap-1.5" id="today-date-str">
              <Calendar size={14} className="text-[#FF8DA1]" />
              <span>Hari ini: {formattedDate}</span>
            </p>
          </div>

          {/* Clock Card */}
          <div className="flex items-center gap-3 self-start md:self-auto rounded-2xl border border-[#FFE3E7] bg-white/60 p-3 md:p-4 shadow-sm backdrop-blur-sm">
            <Clock className="text-[#FF8DA1] animate-pulse" size={24} />
            <div>
              <div className="font-mono text-xl md:text-2xl font-bold text-[#523A3E] tracking-wider leading-none">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <p className="text-[10px] text-[#A27A80] tracking-wider uppercase font-medium mt-0.5">WIB Digital Clock</p>
            </div>
          </div>
        </div>

        {/* Coquette Quote */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FFFBFB]/90 p-4 border border-[#FFE3E7]">
          <div className="text-2xl text-[#FF8DA1] font-display font-bold leading-none">“</div>
          <div className="flex-1">
            <p className="font-nunito italic text-sm md:text-base text-[#6E4249]">
              {motivation}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-[#B58E94] uppercase tracking-wider font-semibold">— Daily Inspiration</span>
              <button
                onClick={getRandomMotivation}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#FF6384] hover:text-[#D4AF37] transition-all bg-transparent"
                title="Selingan kutipan baru"
              >
                <RefreshCw size={12} />
                <span>Next Quote</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Bento Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tugas Status Box */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="group relative overflow-hidden rounded-2xl border border-[#FFD0D8] bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E7379]">Tugas Terdaftar</span>
            <div className="rounded-full bg-[#FFF0F2] p-2 text-[#FF6384] group-hover:scale-110 transition-transform">
              <BookOpen size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-[#523A3E]">{completedTaskCount}</span>
            <span className="text-xs text-[#8E696E]">/ {totalTaskCount} Selesai</span>
          </div>
          {/* Progess bar mini */}
          <div className="w-full bg-[#FCF0F2] rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-[#FF8DA1] h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${taskProgress}%` }}
            />
          </div>
          <span className="text-[10px] text-[#A67E83] mt-1.5 block font-medium">{taskProgress}% Tugas Sekolah Beres</span>
        </div>

        {/* Todo checklist box */}
        <div 
          onClick={() => setActiveTab('todos')}
          className="group relative overflow-hidden rounded-2xl border border-[#FFD0D8] bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">Daily Checklist</span>
            <div className="rounded-full bg-teal-50 p-2 text-teal-500 group-hover:scale-110 transition-transform">
              <CheckSquare size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-teal-700">{completedTodoCount}</span>
            <span className="text-xs text-teal-600">/ {totalTodoCount} Hari ini</span>
          </div>
          {/* Progess bar mini */}
          <div className="w-full bg-teal-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-teal-400 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${todoProgress}%` }}
            />
          </div>
          <span className="text-[10px] text-teal-600 mt-1.5 block font-medium">{todoProgress}% To Do List Selesai</span>
        </div>

        {/* Best Streak Box */}
        <div 
          onClick={() => setActiveTab('habits')}
          className="group relative overflow-hidden rounded-2xl border border-[#FFECA1] bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Streak Terbaik</span>
            <div className="rounded-full bg-amber-50 p-2 text-amber-500 group-hover:scale-110 transition-transform">
              <Flame size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-amber-700">{bestStreak}</span>
            <span className="text-xs text-amber-600">Hari Beruntun</span>
          </div>
          {/* Flame status indicator message */}
          <div className="mt-4 flex items-center gap-1">
            <Trophy size={12} className="text-[#D4AF37]" />
            <span className="text-[10px] text-amber-600 font-medium">Bagus sekali! Pertahankan habit belajarmu</span>
          </div>
        </div>

        {/* Pelajaran Aktif Box */}
        <div 
          onClick={() => setActiveTab('subjects')}
          className="group relative overflow-hidden rounded-2xl border border-[#D5C2FF] bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">Mata Pelajaran</span>
            <div className="rounded-full bg-purple-50 p-2 text-purple-500 group-hover:scale-110 transition-transform">
              <Smile size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-purple-700">{subjects.length}</span>
            <span className="text-xs text-purple-600">Subjek Utama</span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 overflow-hidden">
            {subjects.slice(0, 3).map((sub) => (
              <span 
                key={sub.id} 
                className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold border"
                style={{ backgroundColor: `${sub.color}33`, borderColor: sub.color, color: '#3D2D30' }}
              >
                {sub.name.substring(0, 8)}
              </span>
            ))}
            {subjects.length > 3 && <span className="text-[9px] text-purple-500">+{subjects.length - 3}</span>}
          </div>
        </div>
      </div>

      {/* Main Core Detail Panel split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Agenda Belajar Hari Ini */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-[#FFD0D8] bg-[#FFFBFB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-[#523A3E] flex items-center gap-1.5">
                <Heart size={16} className="text-[#FF6384] fill-[#FF6384]" />
                Jadwal Hari Ini ({todayName})
              </h3>
              <button 
                onClick={() => setActiveTab('schedule')}
                className="text-xs font-semibold text-[#FF6384] hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            {schedulesToday.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-[#AC888C] italic">Hore! Tidak ada jadwal pelajaran wajib hari ini. ✨</p>
                <button
                  onClick={() => setActiveTab('focus')}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#FF8DA1] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#FF6384]"
                >
                  <Sparkles size={12} />
                  Belajar Mandiri dengan Pomodoro
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {schedulesToday.map((sch) => (
                  <div 
                    key={sch.id}
                    className="flex justify-between items-center rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    style={{ borderLeft: `4px solid ${sch.color || '#FF8DA1'}` }}
                  >
                    <div>
                      <h4 className="font-display text-sm font-bold text-[#523A3E]">{sch.subjectName}</h4>
                      <p className="text-xs text-[#8A6167] mt-0.5">{sch.notes || 'Tidak ada catatan tambahan'}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF6384] bg-[#FFF0F2] rounded-lg px-2.5 py-1">
                      <Clock size={12} />
                      <span>{sch.startTime} - {sch.endTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick task due soon */}
          <div className="rounded-2xl border border-[#ED9D9D] bg-gradient-to-r from-[#FFF5F6] to-white p-5 shadow-sm">
            <h3 className="font-display font-bold text-base text-[#523A3E] flex items-center gap-1.5 mb-3">
              <Trophy size={16} className="text-[#FF8DA1]" />
              Catatan Tugas Penting (To Do)
            </h3>
            
            {assignments.filter((a) => a.status !== 'completed').length === 0 ? (
              <p className="text-xs text-green-700 font-medium">✨ Semua tugas sekolah selesai dikerjakan! Kamu hebat!</p>
            ) : (
              <div className="space-y-2">
                {assignments
                  .filter((a) => a.status !== 'completed')
                  .slice(0, 3)
                  .map((task) => {
                    const isHigh = task.priority === 'high';
                    return (
                      <div key={task.id} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-white border border-gray-50">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${isHigh ? 'bg-red-400' : 'bg-amber-300'}`} />
                          <span className="font-medium text-[#523A3E]">{task.title}</span>
                          <span className="text-[10px] text-gray-400">({task.subjectName})</span>
                        </div>
                        <span className="font-mono text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md">
                          Due: {task.dueDate}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Countdown Ujian Terdekat */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[#FFD0D8] bg-[#FFFBFB] p-5 shadow-sm">
            <h3 className="font-display font-bold text-base text-[#523A3E] flex items-center gap-1.5 mb-4">
              <Sparkles size={16} className="text-[#FF6384]" />
              Countdown Ujian Terdekat
            </h3>

            {upcomingExams.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-[#AC888C] italic">Tidak ada ujian terjadwal. Bebas stres! ☕</p>
                <button
                  onClick={() => setActiveTab('exams')}
                  className="text-xs text-[#FF6384] hover:underline font-bold mt-2"
                >
                  Tambahkan Target Ujian Baru
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingExams.slice(0, 2).map((ex) => {
                  const examDate = new Date(ex.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const timeDiff = examDate.getTime() - today.getTime();
                  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  
                  return (
                    <div 
                      key={ex.id}
                      className="rounded-xl p-3.5 border border-[#FFE3E7] bg-white hover:border-[#FFB4C2] transition-colors relative overflow-hidden"
                    >
                      <div className="absolute right-2 top-2 rounded-lg bg-[#FFF2F4] px-2 py-0.5 text-[10px] font-bold text-[#FF8DA1]">
                        Target: {ex.targetGrade}
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A27A80]">
                        {ex.subjectName}
                      </span>
                      <h4 className="font-display text-sm font-bold text-[#523A3E] mt-0.5">
                        {ex.title}
                      </h4>
                      <p className="text-xs text-[#AC888C] mt-1">{new Date(ex.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

                      <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                        {daysDiff <= 3 ? (
                          <span className="font-display font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                            ⚠️ {daysDiff === 0 ? 'Hari ini!' : `${daysDiff} Hari Tersisa`}
                          </span>
                        ) : (
                          <span className="font-display font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            🌸 {daysDiff} Hari Tersisa
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">Siapkan catatan rumusnya ya!</span>
                      </div>
                    </div>
                  );
                })}
                {upcomingExams.length > 2 && (
                  <button 
                    onClick={() => setActiveTab('exams')}
                    className="w-full text-center text-xs text-[#FF8DA1] font-semibold hover:text-[#FF6384]"
                  >
                    Lihat sisa {upcomingExams.length - 2} ujian lainnya
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick study tips */}
          <div className="rounded-2xl border border-[#FFE3E7] bg-[#FFFBFB] p-4 text-[11px] text-[#86666A] space-y-1.5">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37] block">✨ Study Habit Tip</span>
            <p>Metode **Feynman** sangat cocok dikombinasikan dengan timer Pomodoro. Setelah belajar 25 menit, coba jelaskan materi tersebut kepada boneka kesayanganmu atau dirimu sendiri di cermin secara sederhana!</p>
          </div>
        </div>

      </div>
    </div>
  );
};
