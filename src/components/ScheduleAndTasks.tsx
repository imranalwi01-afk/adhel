import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Calendar, Clock, AlertCircle, CheckSquare, ListTodo, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { Schedule, Assignment, Subject, PriorityType, StatusType } from '../types';
import { playChimeSound } from './NotificationCenter';

interface ScheduleAndTasksProps {
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  subjects: Subject[];
  addNotification: (title: string, message: string, type: 'schedule' | 'assignment') => void;
}

const PASTEL_COLORS = ['#FFB4C2', '#C8E4FF', '#FFECA1', '#D2FFD2', '#E8D3FF', '#FFD0B4', '#BFFCC6'];

export const ScheduleAndTasks: React.FC<ScheduleAndTasksProps> = ({
  schedules,
  setSchedules,
  assignments,
  setAssignments,
  subjects,
  addNotification,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'tasks'>('schedule');

  // Schedule States
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('All');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const [schSubject, setSchSubject] = useState('');
  const [schDay, setSchDay] = useState('Monday');
  const [schStart, setSchStart] = useState('08:00');
  const [schEnd, setSchEnd] = useState('09:30');
  const [schNotes, setSchNotes] = useState('');
  const [schColor, setSchColor] = useState(PASTEL_COLORS[0]);

  // Assignment States
  const [taskFilterStatus, setTaskFilterStatus] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('2026-06-12');
  const [taskPriority, setTaskPriority] = useState<PriorityType>('medium');
  const [taskStatus, setTaskStatus] = useState<StatusType>('todo');

  // Custom Item to Delete State
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string; type: 'schedule' | 'task' } | null>(null);

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Handle addition & edit of schedules
  const saveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schSubject.trim()) return;

    if (editingScheduleId) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingScheduleId
            ? {
                ...s,
                subjectName: schSubject,
                day: schDay,
                startTime: schStart,
                endTime: schEnd,
                notes: schNotes,
                color: schColor,
              }
            : s
        )
      );
      addNotification('Jadwal Diubah', `Jadwal mapel ${schSubject} telah berhasil diperbarui!`, 'schedule');
    } else {
      const newSchedule: Schedule = {
        id: 'sch-' + Date.now(),
        subjectName: schSubject,
        day: schDay,
        startTime: schStart,
        endTime: schEnd,
        notes: schNotes,
        color: schColor,
      };
      setSchedules((prev) => [...prev, newSchedule]);
      addNotification('Jadwal Ditambahkan', `Pelajaran ${schSubject} hari ${schDay} masuk ke plan belajarmu! 🌸`, 'schedule');
    }

    playChimeSound('success');
    closeScheduleModal();
  };

  const openScheduleAdd = () => {
    setEditingScheduleId(null);
    setSchSubject(subjects[0]?.name || 'Matematika');
    setSchDay('Monday');
    setSchStart('08:00');
    setSchEnd('09:30');
    setSchNotes('');
    setSchColor(PASTEL_COLORS[0]);
    setIsScheduleModalOpen(true);
  };

  const openScheduleEdit = (sch: Schedule) => {
    setEditingScheduleId(sch.id);
    setSchSubject(sch.subjectName);
    setSchDay(sch.day);
    setSchStart(sch.startTime);
    setSchEnd(sch.endTime);
    setSchNotes(sch.notes || '');
    setSchColor(sch.color);
    setIsScheduleModalOpen(true);
  };

  const deleteSchedule = (id: string, name: string) => {
    setItemToDelete({ id, title: name, type: 'schedule' });
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setEditingScheduleId(null);
  };

  // Handle addition & edit of assignments
  const saveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskSubject.trim()) return;

    if (editingTaskId) {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === editingTaskId
            ? {
                ...a,
                title: taskTitle,
                subjectName: taskSubject,
                dueDate: taskDueDate,
                priority: taskPriority,
                status: taskStatus,
              }
            : a
        )
      );
      addNotification('Tugas Diperbarui', `Laporan tugas "${taskTitle}" berhasil disimpan.`, 'assignment');
    } else {
      const newTask: Assignment = {
        id: 'ass-' + Date.now(),
        title: taskTitle,
        subjectName: taskSubject,
        dueDate: taskDueDate,
        priority: taskPriority,
        status: taskStatus,
      };
      setAssignments((prev) => [...prev, newTask]);
      addNotification('Tugas Ditambahkan', `Tugas baru "${taskTitle}" menunggumu di papan, segera selesaikan ya!`, 'assignment');
    }

    playChimeSound('success');
    closeTaskModal();
  };

  const openTaskAdd = () => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskSubject(subjects[0]?.name || 'Matematika');
    setTaskDueDate(new Date().toISOString().split('T')[0]);
    setTaskPriority('medium');
    setTaskStatus('todo');
    setIsTaskModalOpen(true);
  };

  const openTaskEdit = (task: Assignment) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskSubject(task.subjectName);
    setTaskDueDate(task.dueDate);
    setTaskPriority(task.priority);
    setTaskStatus(task.status);
    setIsTaskModalOpen(true);
  };

  const deleteTask = (id: string, title: string) => {
    setItemToDelete({ id, title, type: 'task' });
  };

  const toggleTaskStatus = (task: Assignment) => {
    const nextStatus: Record<StatusType, StatusType> = {
      'todo': 'in_progress',
      'in_progress': 'completed',
      'completed': 'todo'
    };
    const updatedStatus = nextStatus[task.status];
    
    setAssignments((prev) =>
      prev.map((a) => (a.id === task.id ? { ...a, status: updatedStatus } : a))
    );

    if (updatedStatus === 'completed') {
      addNotification('Tugas Selesai!', `Selamat! Tugas "${task.title}" berhasil diselesaikan. Outstanding job! 🎉`, 'assignment');
      playChimeSound('levelUp');
    } else {
      playChimeSound('success');
    }
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTaskId(null);
  };

  // Filters applying to schedules
  const filteredSchedules = selectedDayFilter === 'All'
    ? schedules
    : schedules.filter((s) => s.day === selectedDayFilter);

  // Group schedules by day for comprehensive view
  const sorterDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedSchedules = [...filteredSchedules].sort((a,b) => {
    const dayDiff = sorterDays.indexOf(a.day) - sorterDays.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  // Filters applying to tasks
  const filteredAssignments = taskFilterStatus === 'all'
    ? assignments
    : assignments.filter((a) => a.status === taskFilterStatus);

  return (
    <div className="space-y-6">
      {/* Tab bar header */}
      <div className="flex border-b border-[#ffd7de] bg-white/60 p-1.5 rounded-2xl md:max-w-md mx-auto shadow-sm">
        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
            activeSubTab === 'schedule'
              ? 'bg-[#FF8DA1] text-white shadow-sm'
              : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
          }`}
        >
          <Calendar size={14} />
          Jadwal Belajar
        </button>
        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
            activeSubTab === 'tasks'
              ? 'bg-[#FF8DA1] text-white shadow-sm'
              : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
          }`}
        >
          <ListTodo size={14} />
          Manajemen Tugas (Tasks)
        </button>
      </div>

      {/* SUB TAB 1: STUDY SCHEDULE */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-xl text-[#523A3E] flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#FF6384]" />
                Jadwal Belajar Interaktif
              </h2>
              <p className="text-xs text-[#AC888C] mt-0.5">Atur mata pelajaranmu secara rapi sesuai jam sekolah maupun jam belajar malam.</p>
            </div>
            
            <button
              onClick={openScheduleAdd}
              className="inline-flex self-start sm:self-auto items-center gap-1.5 rounded-full bg-[#FF8DA1] hover:bg-[#FF6384] text-white text-xs font-bold px-4 py-2.5 shadow-sm transition-all animate-float"
            >
              <Plus size={14} />
              Tambah Jadwal
            </button>
          </div>

          {/* Quick Day Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] font-bold text-[#A67E83] uppercase mr-1">Filter Hari:</span>
            <button
              onClick={() => setSelectedDayFilter('All')}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold border shrink-0 transition-colors ${
                selectedDayFilter === 'All'
                  ? 'bg-[#FF8DA1] text-white border-[#FF8DA1]'
                  : 'bg-white border-[#FFD0D8] text-[#8A6167] hover:bg-[#FFF0F2]'
              }`}
            >
              Semua
            </button>
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDayFilter(day)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold border shrink-0 transition-colors ${
                  selectedDayFilter === day
                    ? 'bg-[#FF8DA1] text-white border-[#FF8DA1]'
                    : 'bg-white border-[#FFD0D8] text-[#8A6167] hover:bg-[#FFF0F2]'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule Grid List */}
          {sortedSchedules.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#FFD0D8] bg-white/40 p-12 text-center">
              <Calendar size={36} className="text-[#FFB4C2] mx-auto mb-2" />
              <p className="text-xs text-[#AC888C]">Belum ada jadwal yang dimasukkan untuk kategori ini.</p>
              <button
                onClick={openScheduleAdd}
                className="mt-3 text-xs font-bold text-[#FF6384] hover:underline"
              >
                Mulai buat jadwal belajarmu sekarang!
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedSchedules.map((sch) => (
                <div
                  key={sch.id}
                  className="rounded-2xl border border-[#FFECEF] bg-white p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                  style={{ borderLeft: `6px solid ${sch.color}` }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span 
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${sch.color}33`, color: '#4D3337' }}
                      >
                        {sch.day}
                      </span>
                      <h4 className="font-display font-bold text-base text-[#523A3E] mt-1.5">{sch.subjectName}</h4>
                    </div>
                    {/* Action buttons */}
                    <div className="opacity-80 group-hover:opacity-100 flex items-center gap-1">
                      <button
                        onClick={() => openScheduleEdit(sch)}
                        className="p-1 text-[#C4959A] hover:text-[#FF8DA1] hover:bg-rose-50 rounded-lg transition-colors"
                        title="Edit jadwal"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => deleteSchedule(sch.id, sch.subjectName)}
                        className="p-1 text-[#C4959A] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus jadwal"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#8A6167] font-semibold mt-3">
                    <Clock size={12} className="text-[#FF8DA1]" />
                    <span>{sch.startTime} - {sch.endTime}</span>
                  </div>

                  {sch.notes && (
                    <div className="mt-2.5 bg-gray-50/70 rounded-xl p-2.5 text-xs text-[#6B5255] border border-gray-100/50 italic">
                      {sch.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 2: ASSIGNMENT MANAGER */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-xl text-[#523A3E] flex items-center gap-1.5">
                <CheckSquare size={16} className="text-[#FF6384]" />
                Manajemen Tugas Sekolah
              </h2>
              <p className="text-xs text-[#AC888C] mt-0.5">Klasifikasikan pekerjaan rumah (PR), projek kelompok, dan deadline penting lainnya.</p>
            </div>
            
            <button
              onClick={openTaskAdd}
              className="inline-flex self-start sm:self-auto items-center gap-1.5 rounded-full bg-[#FF8DA1] hover:bg-[#FF6384] text-white text-xs font-bold px-4 py-2.5 shadow-sm transition-all"
            >
              <Plus size={14} />
              Tambah Tugas (Task)
            </button>
          </div>

          {/* Task Status Filters & Calculations */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/60 border border-[#FFD0D8] rounded-2xl p-3 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold text-[#A67E83] uppercase mr-1">Status:</span>
              <button
                onClick={() => setTaskFilterStatus('all')}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                  taskFilterStatus === 'all'
                    ? 'bg-[#FF8DA1] text-white'
                    : 'bg-white text-[#8A6167] hover:bg-[#FFF0F2] border border-[#FFE1E5]'
                }`}
              >
                Semua ({assignments.length})
              </button>
              <button
                onClick={() => setTaskFilterStatus('todo')}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                  taskFilterStatus === 'todo'
                    ? 'bg-rose-400 text-white'
                    : 'bg-white text-rose-500 hover:bg-rose-50 border border-rose-200'
                }`}
              >
                To Do ({assignments.filter((a) => a.status === 'todo').length})
              </button>
              <button
                onClick={() => setTaskFilterStatus('in_progress')}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                  taskFilterStatus === 'in_progress'
                    ? 'bg-amber-400 text-white'
                    : 'bg-white text-amber-500 hover:bg-amber-50 border border-amber-200'
                }`}
              >
                In Progress ({assignments.filter((a) => a.status === 'in_progress').length})
              </button>
              <button
                onClick={() => setTaskFilterStatus('completed')}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                  taskFilterStatus === 'completed'
                    ? 'bg-emerald-400 text-white'
                    : 'bg-white text-emerald-500 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                Completed ({assignments.filter((a) => a.status === 'completed').length})
              </button>
            </div>

            {/* Quick Progression status */}
            <div className="text-xs text-[#8A6167] font-semibold flex items-center gap-1 shrink-0">
              <Sparkles size={12} className="text-[#FF8DA1]" />
              <span>Selesai: {assignments.filter((a) => a.status === 'completed').length} dari {assignments.length} Tugas</span>
            </div>
          </div>

          {/* Assignments Grid/List */}
          {filteredAssignments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#FFD0D8] bg-white/40 p-12 text-center">
              <ListTodo size={36} className="text-[#FFB4C2] mx-auto mb-2" />
              <p className="text-xs text-[#AC888C]">Tidak ada tugas sekolah dalam daftar filter ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAssignments.map((task) => {
                const isCompleted = task.status === 'completed';
                const isInProgress = task.status === 'in_progress';
                const isTodo = task.status === 'todo';

                // priority chip
                let priorityText = 'Rendah';
                let priorityClass = 'bg-gray-100 text-gray-700 border-gray-200';
                if (task.priority === 'high') {
                  priorityText = 'Tinggi 🔥';
                  priorityClass = 'bg-red-50 text-red-600 border-red-200';
                } else if (task.priority === 'medium') {
                  priorityText = 'Sedang';
                  priorityClass = 'bg-amber-50 text-amber-600 border-amber-200';
                }

                // calculate remaining days
                const due = new Date(task.dueDate);
                const today = new Date();
                today.setHours(0,0,0,0);
                const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
                let dueMsg = `${task.dueDate}`;
                if (daysDiff === 0) dueMsg = 'HARI INI!';
                else if (daysDiff === 1) dueMsg = 'Besok!';
                else if (daysDiff < 0) dueMsg = `Terlambat ${Math.abs(daysDiff)} hari`;
                else if (daysDiff > 0) dueMsg = `${daysDiff} hari lagi`;

                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between ${
                      isCompleted 
                        ? 'bg-[#EBFBF5]/75 border-[#CEF1E2] line-through decoration-[#B0DCC7]' 
                        : 'bg-white border-[#FFECEF]'
                    }`}
                  >
                    <div>
                      {/* Top status */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span 
                            className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-white text-gray-700 border"
                          >
                            {task.subjectName}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 border rounded-full font-bold ${priorityClass}`}>
                            {priorityText}
                          </span>
                        </div>

                        {/* Edit Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openTaskEdit(task)}
                            className="p-1 text-[#C4959A] hover:text-[#FF8DA1] hover:bg-rose-50 rounded-lg transition-colors"
                            title="Edit Tugas"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id, task.title)}
                            className="p-1 text-[#C4959A] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Tugas"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Header with quick checkbox click */}
                      <div className="flex items-start gap-3 mt-3">
                        <button
                          onClick={() => toggleTaskStatus(task)}
                          className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-xl border transition-all shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : isInProgress
                              ? 'border-amber-400 bg-amber-50 text-amber-500'
                              : 'border-[#FFB4C2] bg-white text-[#FF6384] hover:bg-rose-50'
                          }`}
                          title="Klik untuk ubah status tugas"
                        >
                          {isCompleted ? (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : isInProgress ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          ) : null}
                        </button>
                        <div>
                          <h4 className={`font-display text-sm font-bold text-[#523A3E] ${isCompleted ? 'text-gray-400' : ''}`}>
                            {task.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Klik kotak untuk ubah status tugas</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status info */}
                    <div className="mt-4 pt-3 border-t border-[#FFECEF] flex items-center justify-between text-[11px] font-semibold">
                      <div className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : isInProgress
                          ? 'bg-amber-50 text-amber-600 border-amber-100'
                          : 'bg-rose-50 text-[#FF6384] border-rose-100'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : isInProgress ? 'bg-amber-400' : 'bg-red-400'}`} />
                        <span className="uppercase text-[9px] font-bold">
                          {isCompleted ? 'Selesai' : isInProgress ? 'Proses' : 'Belum'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[#8A6167]">
                        <Clock size={12} className="text-[#FF8DA1]" />
                        <span className={daysDiff <= 1 && !isCompleted ? 'text-red-500 font-bold' : ''}>
                          {isCompleted ? 'Completed' : dueMsg}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL JADWAL BELAJAR */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#FFD0D8] shadow-2xl p-6 text-left">
            <h3 className="font-display font-bold text-lg text-[#523A3E] mb-4 flex items-center gap-1.5">
              <Sparkles size={16} className="text-[#FF6384]" />
              {editingScheduleId ? 'Ubah Agenda Belajar' : 'Tambah Agenda Belajar'}
            </h3>

            <form onSubmit={saveSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Mata Pelajaran</label>
                <select
                  value={schSubject}
                  onChange={(e) => setSchSubject(e.target.value)}
                  className="w-full rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-sm text-[#523A3E] focus:outline-none focus:ring-2 focus:ring-[#FF8DA1]"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                  <option value="Belajar Mandiri">Belajar Mandiri</option>
                  <option value="Istirahat / Fun">Istirahat / Fun</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Hari</label>
                  <select
                    value={schDay}
                    onChange={(e) => setSchDay(e.target.value)}
                    className="w-full rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-sm text-[#523A3E] focus:outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Warna Label</label>
                  <div className="flex gap-1.5 items-center h-9">
                    {PASTEL_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSchColor(col)}
                        style={{ backgroundColor: col }}
                        className={`h-5 w-5 rounded-full border transition-all ${
                          schColor === col ? 'scale-125 ring-2 ring-[#FF8DA1] border-white' : 'border-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={schStart}
                    onChange={(e) => setSchStart(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-sm text-[#523A3E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={schEnd}
                    onChange={(e) => setSchEnd(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-sm text-[#523A3E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  value={schNotes}
                  onChange={(e) => setSchNotes(e.target.value)}
                  placeholder="Contoh: Bab 4 Teorema Pythagoras atau Kelompok 2"
                  rows={2}
                  maxLength={100}
                  className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-sm text-[#523A3E] focus:outline-none focus:ring-2 focus:ring-[#FF8DA1]"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={closeScheduleModal}
                  className="rounded-xl px-4 py-2 border border-[#FFD0D8] text-xs font-bold text-[#8A6167] hover:bg-[#FFF0F2]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-4 py-2 bg-[#FF8DA1] hover:bg-[#FF6384] text-xs font-bold text-white shadow-xs"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TUGAS (ASSIGNMENT) */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#FFD0D8] shadow-2xl p-6 text-left">
            <h3 className="font-display font-bold text-lg text-[#523A3E] mb-4 flex items-center gap-1.5">
              <CheckSquare size={16} className="text-[#FF6384]" />
              {editingTaskId ? 'Ubah Detail Tugas' : 'Tambah Tugas Baru'}
            </h3>

            <form onSubmit={saveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Deskripsi Tugas / Deskripsi PR</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  maxLength={60}
                  placeholder="Contoh: Kerjakan Latihan Halaman 24 No. 1-10"
                  required
                  className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-sm text-[#523A3E] focus:outline-none focus:ring-2 focus:ring-[#FF8DA1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Mata Pelajaran</label>
                  <select
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-sm text-[#523A3E] focus:outline-none"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                    <option value="Umum / Lainnya">Umum / Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Tenggat Tanggal (Due Date)</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-sm text-[#523A3E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Prioritas Penting</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as PriorityType)}
                    className="w-full rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-sm text-[#523A3E] focus:outline-none"
                  >
                    <option value="high">High Priority 🔥</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8A6167] uppercase mb-1">Status Pengerjaan</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as StatusType)}
                    className="w-full rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-sm text-[#523A3E] focus:outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={closeTaskModal}
                  className="rounded-xl px-4 py-2 border border-[#FFD0D8] text-xs font-bold text-[#8A6167] hover:bg-[#FFF0F2]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-4 py-2 bg-[#FF8DA1] hover:bg-[#FF6384] text-xs font-bold text-white shadow-xs"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
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
            <h3 className="font-display font-extrabold text-sm text-[#523A3E] mb-2">
              Hapus {itemToDelete.type === 'schedule' ? 'Jadwal Pelajaran' : 'Tugas Sekolah'}? 🎀
            </h3>
            <p className="text-xs text-[#AC888C] leading-relaxed mb-6">
              Apakah Adel yakin ingin menghapus {itemToDelete.type === 'schedule' ? 'jadwal pelajaran' : 'tugas'} <span className="font-bold text-[#FF6384]">"{itemToDelete.title}"</span>? Tindakan ini tidak dapat dibatalkan.
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
                  if (itemToDelete.type === 'schedule') {
                    setSchedules((prev) => prev.filter((s) => s.id !== itemToDelete.id));
                    addNotification('Jadwal Dihapus', `Jadwal "${itemToDelete.title}" telah dihapus dari agenda.`, 'schedule');
                  } else {
                    setAssignments((prev) => prev.filter((a) => a.id !== itemToDelete.id));
                    addNotification('Tugas Dihapus', `Tugas "${itemToDelete.title}" telah dihapus.`, 'assignment');
                  }
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
