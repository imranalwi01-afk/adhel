import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Calendar, Clock, Sparkles, ChevronLeft, ChevronRight, AlertCircle, Eye, Star } from 'lucide-react';
import { Exam, Schedule, Assignment } from '../types';
import { playChimeSound } from './NotificationCenter';

interface ExamsAndCalendarProps {
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  schedules: Schedule[];
  assignments: Assignment[];
  subjects: { name: string }[];
  addNotification: (title: string, message: string, type: 'exam' | 'system') => void;
}

export const ExamsAndCalendar: React.FC<ExamsAndCalendarProps> = ({
  exams,
  setExams,
  schedules,
  assignments,
  subjects,
  addNotification,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'exams' | 'calendar'>('exams');

  // Exam States
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState('');
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('2026-06-15');
  const [examTarget, setExamTarget] = useState(95);

  // Custom Item to Delete State
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Calendar States (Defaults to June 2026 based on mock current local time)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 8)); // June (index 5) 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-06-08');

  // Year & Month Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Exam Add & Save
  const saveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim() || !examSubject.trim()) return;

    if (editingExamId) {
      setExams((prev) =>
        prev.map((ex) =>
          ex.id === editingExamId
            ? {
                ...ex,
                title: examTitle,
                subjectName: examSubject,
                date: examDate,
                targetGrade: examTarget,
              }
            : ex
        )
      );
      addNotification('Ujian Diperbarui', `Target ujian "${examTitle}" berhasil disimpan.`, 'exam');
    } else {
      const newExam: Exam = {
        id: 'ex-' + Date.now(),
        title: examTitle,
        subjectName: examSubject,
        date: examDate,
        targetGrade: examTarget,
      };
      setExams((prev) => [...prev, newExam]);
      addNotification('Rencana Ujian Tambah', `Ujian "${examTitle}" terdaftar! Persiapkan belajarmu dengan matang. 🏆`, 'exam');
    }

    playChimeSound('success');
    closeExamModal();
  };

  const openExamAdd = () => {
    setEditingExamId(null);
    setExamTitle('');
    setExamSubject(subjects[0]?.name || 'Matematika');
    setExamDate(new Date().toISOString().split('T')[0]);
    setExamTarget(95);
    setIsExamModalOpen(true);
  };

  const openExamEdit = (ex: Exam) => {
    setEditingExamId(ex.id);
    setExamTitle(ex.title);
    setExamSubject(ex.subjectName);
    setExamDate(ex.date);
    setExamTarget(ex.targetGrade);
    setIsExamModalOpen(true);
  };

  const deleteExam = (id: string, title: string) => {
    setItemToDelete({ id, title });
  };

  const closeExamModal = () => {
    setIsExamModalOpen(false);
    setEditingExamId(null);
  };

  // Generate Calendar Days
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay(); // Sunday is 0
    return day === 0 ? 6 : day - 1; // Convert to Monday start: Monday is 0, Sunday is 6
  };

  const totalDays = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayIndex(year, month);

  const prevMonthTotalDays = getDaysInMonth(year, month - 1);

  const calendarDays: { dayNum: number; dateStr: string; type: 'prev' | 'current' | 'next' }[] = [];

  // Previous month filler days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateStr = prevMonthDate.toISOString().split('T')[0];
    calendarDays.push({ dayNum, dateStr, type: 'prev' });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ dayNum: d, dateStr: dStr, type: 'current' });
  }

  // Next month filler days to complete grid (usually 42 boxes total: 6 rows * 7 columns)
  const remainingBoxes = 42 - calendarDays.length;
  for (let n = 1; n <= remainingBoxes; n++) {
    const nextMonthDate = new Date(year, month + 1, n);
    const dateStr = nextMonthDate.toISOString().split('T')[0];
    calendarDays.push({ dayNum: n, dateStr, type: 'next' });
  }

  // Find schedule subjects, assignments, and exams due on a specific calendarDateStr
  const getDayAgenda = (dateStr: string) => {
    const targetedDate = new Date(dateStr);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayName = dayNames[targetedDate.getDay()];

    // Schedules recurring on this day of the week
    const targetSchedules = schedules.filter((s) => s.day === targetDayName);
    
    // Assignments due on this date
    const targetAssignments = assignments.filter((a) => a.dueDate === dateStr);

    // Exams on this date
    const targetExams = exams.filter((e) => e.date === dateStr);

    return {
      schedules: targetSchedules,
      assignments: targetAssignments,
      exams: targetExams,
    };
  };

  const selectedDateAgenda = getDayAgenda(selectedDateStr);
  const selectedDateObj = new Date(selectedDateStr);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar header */}
      <div className="flex border-b border-[#ffd7de] bg-white/60 p-1.5 rounded-2xl md:max-w-md mx-auto shadow-sm">
        <button
          onClick={() => setActiveSubTab('exams')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
            activeSubTab === 'exams'
              ? 'bg-[#FF8DA1] text-white shadow-sm'
              : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
          }`}
        >
          <Star size={14} />
          Exam Planner
        </button>
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
            activeSubTab === 'calendar'
              ? 'bg-[#FF8DA1] text-white shadow-sm'
              : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
          }`}
        >
          <Calendar size={14} />
          Monthly Calendar
        </button>
      </div>

      {/* SUB TAB 1: EXAM PLANNER */}
      {activeSubTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-xl text-[#523A3E] flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#FF6384]" />
                Perencanaan Ujian (Target Nilai)
              </h2>
              <p className="text-xs text-[#AC888C] mt-0.5">Kelola persiapan ujian lengkap dengan hitung mundur otomatis dan target nilai ideal.</p>
            </div>
            
            <button
              onClick={openExamAdd}
              className="inline-flex self-start sm:self-auto items-center gap-1.5 rounded-full bg-[#FF8DA1] hover:bg-[#FF6384] text-white text-xs font-bold px-4 py-2.5 shadow-sm transition-all"
            >
              <Plus size={14} />
              Tambah Target Ujian
            </button>
          </div>

          {/* Exams Countdown Grid */}
          {exams.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#FFD0D8] bg-white/40 p-12 text-center">
              <Calendar size={36} className="text-[#FFB4C2] mx-auto mb-2" />
              <p className="text-xs text-[#AC888C]">Belum ada jadwal ujian yang direncanakan.</p>
              <button
                onClick={openExamAdd}
                className="mt-3 text-xs font-bold text-[#FF6384] hover:underline"
              >
                Mulai atur target ujianmu!
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.map((ex) => {
                const examDateObj = new Date(ex.date);
                const today = new Date();
                today.setHours(0,0,0,0);
                const diffTime = examDateObj.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

                let countdownText = '';
                let statusColorClass = 'text-gray-500 bg-gray-50';
                if (diffDays === 0) {
                  countdownText = 'Ujian Hari Ini!';
                  statusColorClass = 'text-red-600 bg-red-50 border border-red-200 animate-pulse';
                } else if (diffDays === 1) {
                  countdownText = 'Besok Pagi!';
                  statusColorClass = 'text-rose-600 bg-rose-50 border border-rose-200';
                } else if (diffDays < 0) {
                  countdownText = `Sudah lewat ${Math.abs(diffDays)} hari`;
                  statusColorClass = 'text-gray-400 bg-gray-100';
                } else {
                  countdownText = `${diffDays} hari lagi`;
                  statusColorClass = diffDays <= 4 
                    ? 'text-amber-600 bg-[#FFFCE3] border border-amber-200' 
                    : 'text-pink-600 bg-[#FFF0F2] border border-[#FFD0D8]';
                }

                return (
                  <div
                    key={ex.id}
                    className="relative rounded-2xl border border-[#FFECEF] bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
                  >
                    {/* Background decor ribbon */}
                    <div className="absolute top-0 right-0 h-10 w-10 bg-gradient-to-bl from-[#FFF0F2] to-transparent opacity-40 pointer-events-none rounded-bl-3xl" />
                    
                    <div>
                      {/* Top labels */}
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[10px] font-bold text-[#FF8DA1] bg-[#FFF0F2] px-2.5 py-0.5 rounded-full uppercase">
                          {ex.subjectName}
                        </span>
                        
                        {/* Control buttons */}
                        <div className="opacity-70 group-hover:opacity-100 flex items-center gap-1">
                          <button
                            onClick={() => openExamEdit(ex)}
                            className="p-1 text-[#C4959A] hover:text-[#FF8DA1] rounded-lg hover:bg-rose-50"
                            title="Edit Ujian"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => deleteExam(ex.id, ex.title)}
                            className="p-1 text-[#C4959A] hover:text-red-500 rounded-lg hover:bg-red-50"
                            title="Hapus Ujian"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-display font-bold text-base text-[#523A3E] mt-3">{ex.title}</h4>
                      <p className="text-xs text-[#AC888C] mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(ex.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#FFECEF] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#A67E83] uppercase tracking-wider font-semibold">Target Nilai</span>
                        <span className="text-lg font-display font-extrabold text-[#D4AF37] flex items-center gap-0.5 leading-none mt-0.5">
                          ⭐ {ex.targetGrade}
                        </span>
                      </div>

                      {/* Remaining Days box */}
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${statusColorClass}`}>
                        {countdownText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 2: MONTHLY CALENDAR */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#FFD0D8] bg-white p-5 shadow-sm">
            
            {/* Header controls */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-[#523A3E] flex items-center gap-1.5">
                  <Calendar size={18} className="text-[#FF6384]" />
                  Kalender Akademik Interaktif
                </h3>
                <p className="text-[11px] text-[#AC888C] mt-0.5">Klik pada tanggal untuk memunculkan rincian agenda di panel bawah.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 border border-[#FFD0D8] hover:bg-[#FFF0F2] rounded-xl text-[#FF6384] transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="font-display font-bold text-xs md:text-sm text-[#523A3E] min-w-[100px] text-center">
                  {monthNames[month]} {year}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-2 border border-[#FFD0D8] hover:bg-[#FFF0F2] rounded-xl text-[#FF6384] transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="w-full">
              {/* Day Headers */}
              <div className="grid grid-cols-7 text-center border-b border-[#FFF0F2] pb-2 text-xs font-bold text-[#8A6167]">
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
                <span>Sab</span>
                <span>Min</span>
              </div>

              {/* Grid cells */}
              <div className="grid grid-cols-7 gap-1 mt-1 text-center font-mono">
                {calendarDays.map((item, index) => {
                  const { dayNum, dateStr, type } = item;
                  const isCurrentMonth = type === 'current';
                  const agenda = getDayAgenda(dateStr);
                  const isSelected = selectedDateStr === dateStr;

                  // dot counts
                  const hasSchedules = agenda.schedules.length > 0;
                  const hasTasks = agenda.assignments.length > 0;
                  const hasExams = agenda.exams.length > 0;

                  // check if cell is today
                  const dObj = new Date();
                  const isToday = dObj.getFullYear() === parseInt(dateStr.split('-')[0]) &&
                    (dObj.getMonth() + 1) === parseInt(dateStr.split('-')[1]) &&
                    dObj.getDate() === parseInt(dateStr.split('-')[2]);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`min-h-[50px] p-1 border rounded-xl relative flex flex-col justify-between transition-colors focus:outline-none ${
                        isSelected 
                          ? 'bg-[#FF8DA1] border-[#FF8DA1] text-white shadow-xs z-10' 
                          : isToday
                          ? 'bg-[#FFFCF3] border-[#FFB4C2] text-[#FF6384] font-bold'
                          : isCurrentMonth
                          ? 'border-[#FFF0F2] bg-white text-[#523A3E] hover:bg-rose-50/50'
                          : 'border-[#FFFDFD] bg-[#FFFBFB]/40 text-[#D0B2B6]'
                      }`}
                    >
                      <span className="text-[11px] self-start font-bold pl-1">{dayNum}</span>
                      
                      {/* Indicator dots */}
                      <div className="flex gap-1 justify-center pb-0.5">
                        {hasSchedules && (
                          <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-400'}`} title="Ada Lesson" />
                        )}
                        {hasTasks && (
                          <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-400'}`} title="Ada Deadline Tugas" />
                        )}
                        {hasExams && (
                          <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white shrink-0 animate-ping' : 'bg-[#D4AF37]'}`} title="Ujian Terjadwal" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Agenda Details for Selected Date */}
            <div className="mt-5 border-t border-[#FFECEF] pt-4 text-left">
              <h4 className="font-display font-bold text-xs text-[#8A6167] uppercase tracking-wider flex items-center gap-1">
                <Clock size={12} className="text-[#FF8DA1]" />
                Agenda Tanggal: <span className="text-[#523A3E] font-sans font-medium hover:underline lowercase bg-[#FFF0F2] px-2 py-0.5 rounded-md">
                  {selectedDateObj.toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </span>
              </h4>

              <div className="mt-3 space-y-2">
                {/* Schedules */}
                {selectedDateAgenda.schedules.map((sch) => (
                  <div key={sch.id} style={{ borderLeft: `3px solid ${sch.color}` }} className="bg-white border rounded-xl p-2.5 text-xs shadow-3xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#523A3E]">{sch.subjectName}</span>
                      <p className="text-[10px] text-gray-500 mt-0.5">Lesson {sch.notes ? `• ${sch.notes}` : ''}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 text-purple-700 bg-purple-50 rounded-lg bold">{sch.startTime} - {sch.endTime}</span>
                  </div>
                ))}

                {/* Assignments */}
                {selectedDateAgenda.assignments.map((ass) => (
                  <div key={ass.id} className="bg-rose-50/50 border border-rose-100 rounded-xl p-2.5 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-rose-800">⚠️ Deadline: {ass.title}</span>
                      <p className="text-[10px] text-rose-500 mt-0.5">{ass.subjectName} • Prioritas: {ass.priority}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 text-red-700 bg-red-100 rounded-lg font-bold">TASK DUE</span>
                  </div>
                ))}

                {/* Exams */}
                {selectedDateAgenda.exams.map((ex) => (
                  <div key={ex.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs flex justify-between items-center animate-pulse">
                    <div>
                      <span className="font-bold text-amber-900">🏆 UJIAN: {ex.title}</span>
                      <p className="text-[10px] text-amber-600 mt-0.5">{ex.subjectName} • Target Nilai: {ex.targetGrade}</p>
                    </div>
                    <span className="text-[10px] text-[#D4AF37] font-bold">EXAM DAY</span>
                  </div>
                ))}

                {/* Blank message */}
                {selectedDateAgenda.schedules.length === 0 &&
                  selectedDateAgenda.assignments.length === 0 &&
                  selectedDateAgenda.exams.length === 0 && (
                    <p className="text-xs text-[#AC888C] italic text-center py-4 bg-gray-50/50 rounded-xl">
                      Tidak ada agenda khusus hari ini. Nikmati harimu dengan bersantai atau mereview materi! ✨
                    </p>
                  )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* EXAM PLANNER MODAL */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#FFD0D8] shadow-2xl p-6 text-left">
            <h3 className="font-display font-bold text-lg text-[#523A3E] mb-4 flex items-center gap-1.5">
              <Star size={16} className="text-[#FF6384]" />
              {editingExamId ? 'Ubah Rencana Ujian' : 'Tambah Rencana Ujian'}
            </h3>

            <form onSubmit={saveExam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Nama / Topik Ujian</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  maxLength={50}
                  placeholder="Contoh: Penilaian Harian Bab Aljabar"
                  required
                  className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-sm text-[#523A3E] focus:outline-none focus:ring-2 focus:ring-[#FF8DA1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Mata Pelajaran</label>
                  <select
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                    className="w-full rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-sm text-[#523A3E] focus:outline-none"
                  >
                    {subjects.map((s, index) => (
                      <option key={index} value={s.name}>{s.name}</option>
                    ))}
                    <option value="Umum / Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Tanggal Ujian</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-sm text-[#523A3E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Target Nilai (0 - 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={examTarget}
                  onChange={(e) => setExamTarget(parseInt(e.target.value) || 0)}
                  required
                  className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-sm text-[#523A3E] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={closeExamModal}
                  className="rounded-xl px-4 py-2 border border-[#FFD0D8] text-xs font-bold text-[#8A6167] hover:bg-[#FFF0F2]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-4 py-2 bg-[#FF8DA1] hover:bg-[#FF6384] text-xs font-bold text-white shadow-xs"
                >
                  Simpan Rencana Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXAM PLANNER DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#FFD0D8] shadow-2xl p-6 text-center animate-scale-up">
            <div className="h-12 w-12 rounded-full bg-[#FFF0F2] text-[#FF6384] flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="font-display font-extrabold text-sm text-[#523A3E] mb-2">Hapus Rencana Ujian? 🎀</h3>
            <p className="text-xs text-[#AC888C] leading-relaxed mb-6">
              Apakah Adel yakin ingin menghapus rencana ujian <span className="font-bold text-[#FF6384]">"{itemToDelete.title}"</span>? Tindakan ini tidak dapat dibatalkan.
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
                  setExams((prev) => prev.filter((ex) => ex.id !== itemToDelete.id));
                  addNotification('Rencana Ujian Dihapus', `Rencana ujian "${itemToDelete.title}" telah dihapus.`, 'exam');
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
