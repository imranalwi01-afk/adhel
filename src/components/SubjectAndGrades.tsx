import React, { useState } from 'react';
import { Plus, Trash2, Edit2, BookOpen, Star, Award, TrendingUp, Sparkles, Sliders, Hash } from 'lucide-react';
import { Subject, Grade, Assignment } from '../types';
import { playChimeSound } from './NotificationCenter';

interface SubjectAndGradesProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  grades: Grade[];
  setGrades: React.Dispatch<React.SetStateAction<Grade[]>>;
  assignments: Assignment[];
  addNotification: (title: string, message: string, type: 'system') => void;
}

const PASTEL_GRADIENTS = [
  'from-[#FFB4C2] to-[#FFD0D8]',
  'from-[#C8E4FF] to-[#E1F0FF]',
  'from-[#FFECA1] to-[#FFF6D0]',
  'from-[#D2FFD2] to-[#E8FFE8]',
  'from-[#E8D3FF] to-[#F5EBFF]',
  'from-[#FFD0B4] to-[#FFE5D4]'
];

export const SubjectAndGrades: React.FC<SubjectAndGradesProps> = ({
  subjects,
  setSubjects,
  grades,
  setGrades,
  assignments,
  addNotification,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tracker' | 'grades'>('tracker');

  // Subject Tracker state
  const [newSubName, setNewSubName] = useState('');
  const [newSubColor, setNewSubColor] = useState('#FFB4C2');

  // Custom Deletion State
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string; type: 'subject' | 'grade'; score?: number; subName?: string } | null>(null);

  // Grade state
  const [newGradeSubject, setNewGradeSubject] = useState('');
  const [newGradeTitle, setNewGradeTitle] = useState('');
  const [newGradeScore, setNewGradeScore] = useState(90);

  // Colors mapping for random pastel assignments
  const hexColors = ['#FFB4C2', '#C8E4FF', '#FFECA1', '#D2FFD2', '#E8D3FF', '#FFD0B4'];

  // Handle adding custom subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    // Check duplication
    if (subjects.some((s) => s.name.toLowerCase() === newSubName.trim().toLowerCase())) {
      alert('Pelajaran tersebut sudah ada!');
      return;
    }

    const newSub: Subject = {
      id: 'sub-' + Date.now(),
      name: newSubName.trim(),
      color: newSubColor,
      progress: 0,
    };

    setSubjects((prev) => [...prev, newSub]);
    setNewSubName('');
    setNewSubColor(hexColors[Math.floor(Math.random() * hexColors.length)]);
    playChimeSound('success');
    addNotification('Mata Pelajaran Baru', `Mata pelajaran "${newSub.name}" berhasil terdaftar di planner belajar!`, 'system');
  };

  const deleteSubject = (id: string, name: string) => {
    setItemToDelete({ id, title: name, type: 'subject' });
  };

  const handleProgressChange = (id: string, progressVal: number) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, progress: progressVal } : s))
    );
  };

  // Grade operations
  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const activeSub = newGradeSubject || (subjects[0]?.name);
    if (!activeSub || !newGradeTitle.trim()) return;

    const newGrade: Grade = {
      id: 'gr-' + Date.now(),
      subjectName: activeSub,
      title: newGradeTitle.trim(),
      score: newGradeScore,
      date: new Date().toISOString().split('T')[0],
    };

    setGrades((prev) => [newGrade, ...prev]);
    
    // Update last grade field inside subject list
    setSubjects((prev) =>
      prev.map((s) => (s.name === activeSub ? { ...s, lastGrade: newGradeScore } : s))
    );

    setNewGradeTitle('');
    setNewGradeScore(90);
    playChimeSound('levelUp');
    addNotification('Nilai Baru Tersimpan', `Nilai ${newGradeScore} berhasil dicatat di pelajaran "${activeSub}"! ✨`, 'system');
  };

  const deleteGrade = (id: string, score: number, subName: string) => {
    setItemToDelete({ id, title: `Nilai ${score} (${subName})`, type: 'grade', score, subName });
  };

  // Calculations for Grade stats
  const totalGrades = grades.length;
  const gradeScores = grades.map((g) => g.score);
  const averageGrade = totalGrades > 0 
    ? Math.round(gradeScores.reduce((sum, score) => sum + score, 0) / totalGrades) 
    : 0;
  const highestGrade = totalGrades > 0 ? Math.max(...gradeScores) : 0;
  const lowestGrade = totalGrades > 0 ? Math.min(...gradeScores) : 0;

  return (
    <div className="space-y-6">
      {/* Tab bar header */}
      <div className="flex border-b border-[#ffd7de] bg-white/60 p-1.5 rounded-2xl md:max-w-md mx-auto shadow-sm">
        <button
          onClick={() => {
            setActiveSubTab('tracker');
            setNewGradeSubject(subjects[0]?.name || '');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
            activeSubTab === 'tracker'
              ? 'bg-[#FF8DA1] text-white shadow-sm'
              : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
          }`}
        >
          <BookOpen size={14} />
          Mata Pelajaran
        </button>
        <button
          onClick={() => {
            setActiveSubTab('grades');
            setNewGradeSubject(subjects[0]?.name || '');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
            activeSubTab === 'grades'
              ? 'bg-[#FF8DA1] text-white shadow-sm'
              : 'text-[#8A6167] hover:bg-[#FFF2F4] hover:text-[#FF6384]'
          }`}
        >
          <Award size={14} />
          Grade Tracker
        </button>
      </div>

      {/* TRACKER TAB */}
      {activeSubTab === 'tracker' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
            <div>
              <h2 className="font-display font-bold text-xl text-[#523A3E] flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#FF6384]" />
                Subject Tracker & Progress
              </h2>
              <p className="text-xs text-[#AC888C] mt-0.5">Kelola mata pelajaran dan pantau ketercapaian pemahaman belajarmu.</p>
            </div>
          </div>

          {/* New Subject Form Wrapper */}
          <div className="rounded-2xl border border-[#FFD0D8] bg-white p-5 shadow-sm text-left">
            <h3 className="font-display font-bold text-sm text-[#523A3E] mb-3">Registrasi Mata Pelajaran Baru</h3>
            <form onSubmit={handleAddSubject} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold text-[#8A6167] uppercase mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Contoh: Fisika, Biologi, Sejarah, dsb..."
                  maxLength={30}
                  required
                  className="w-full rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-xs text-[#523A3E] focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-44">
                <label className="block text-[10px] font-bold text-[#8A6167] uppercase mb-1">Warna Identitas</label>
                <div className="flex gap-1.5 items-center justify-start h-9">
                  {hexColors.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewSubColor(col)}
                      style={{ backgroundColor: col }}
                      className={`h-5 w-5 rounded-full border transition-transform ${
                        newSubColor === col ? 'scale-125 ring-2 ring-[#FF8DA1] border-white' : 'border-gray-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 bg-[#FF8DA1] hover:bg-[#FF6384] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                Tambah Pelajaran
              </button>
            </form>
          </div>

          {/* Subjects Card Slider List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub, index) => {
              // Calculate specific tasks count for this subject
              const subjectTasks = assignments.filter((a) => a.subjectName === sub.name);
              const totalTasksCount = subjectTasks.length;
              const pendingTasksCount = subjectTasks.filter((a) => a.status !== 'completed').length;

              // Gradient index picker
              const gradientClass = PASTEL_GRADIENTS[index % PASTEL_GRADIENTS.length];

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-[#FFECEF] bg-white p-5 shadow-xs relative overflow-hidden group flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-[#FFECEF] to-transparent pointer-events-none rounded-bl-3xl opacity-30" />
                  
                  <div>
                    {/* Header title */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: sub.color }} />
                        <h4 className="font-display font-extrabold text-base text-[#523A3E] text-left">{sub.name}</h4>
                      </div>
                      
                      <button
                        onClick={() => deleteSubject(sub.id, sub.name)}
                        className="text-gray-300 hover:text-red-500 opacity-60 group-hover:opacity-100 transition-opacity"
                        title="Hapus mata pelajaran"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Stats details bullet */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs bg-gray-50/75 rounded-xl p-2.5 border border-gray-100/30">
                      <div>
                        <span className="text-[10px] text-[#A67E83] uppercase block font-semibold">Tugas Aktif</span>
                        <span className="text-sm font-bold text-[#523A3E]">{pendingTasksCount} <span className="text-[10px] text-gray-400">/ {totalTasksCount}</span></span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A67E83] uppercase block font-semibold">Nilai Terakhir</span>
                        <span className="text-sm font-bold text-[#FF6384]">{sub.lastGrade ? `⭐ ${sub.lastGrade}` : '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Slider (Interactive!) */}
                  <div className="mt-5 text-left">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-[#A67E83]">Progres Belajar</span>
                      <span className="text-[#FF6384] font-bold">{sub.progress}%</span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sub.progress}
                      onChange={(e) => handleProgressChange(sub.id, parseInt(e.target.value))}
                      className="w-full accent-[#FF8DA1] h-1 bg-rose-50 rounded-lg appearance-none cursor-pointer"
                      title="Geser untuk update progres belajar"
                    />
                    <span className="text-[9px] text-[#C29298] block mt-1 italic">Geser slider untuk mengubah progres</span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GRADES TAB */}
      {activeSubTab === 'grades' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-xl text-[#523A3E] flex items-center gap-1.5">
                <Award size={16} className="text-[#FF6384]" />
                Grade Tracker (Buku Nilai)
              </h2>
              <p className="text-xs text-[#AC888C] mt-0.5">Catat seluruh hasil ulangan harian, proyek, dan ujian semester di sini.</p>
            </div>
          </div>

          {/* Summary Grade Statistics dashboard box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[#FFD0D8] bg-[#FFF5F6] p-4 text-center">
              <span className="text-[10px] text-[#A67E83] uppercase tracking-wider font-semibold block">Rata-Rata Nilai</span>
              <span className="text-3xl font-display font-extrabold text-[#FF6384] block mt-1">📈 {averageGrade}</span>
              <p className="text-[10px] text-gray-500 mt-1">Akumulasi seluruh ujian</p>
            </div>
            
            <div className="rounded-2xl border border-[#FFECA1] bg-yellow-50/40 p-4 text-center">
              <span className="text-[10px] text-amber-800 uppercase tracking-wider font-semibold block">Nilai Tertinggi</span>
              <span className="text-3xl font-display font-extrabold text-amber-600 block mt-1">🏆 {highestGrade}</span>
              <p className="text-[10px] text-gray-400 mt-1">Prestasi belajarmu</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 text-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">Nilai Terendah</span>
              <span className="text-3xl font-display font-extrabold text-gray-700 block mt-1">🎯 {lowestGrade}</span>
              <p className="text-[10px] text-gray-400 mt-1">Review materi lemah</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Box: Add new grade Form */}
            <div className="lg:col-span-4 rounded-2xl border border-[#FFD0D8] bg-white p-5 shadow-xs h-fit">
              <h3 className="font-display font-bold text-sm text-[#523A3E] mb-3">Input Nilai Baru</h3>
              <form onSubmit={handleAddGrade} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8A6167] uppercase mb-1">Mata Pelajaran</label>
                  <select
                    value={newGradeSubject}
                    onChange={(e) => setNewGradeSubject(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-xs text-[#523A3E] focus:outline-none"
                  >
                    {subjects.length === 0 ? (
                      <option value="">(Silakan tambah mapel dulu)</option>
                    ) : (
                      subjects.map((sub) => (
                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8A6167] uppercase mb-1">Nama Tugas / Jenis Evaluasi</label>
                  <input
                    type="text"
                    value={newGradeTitle}
                    onChange={(e) => setNewGradeTitle(e.target.value)}
                    placeholder="Contoh: Kuis 1 Eksponen, PH 2 Ekskresi"
                    maxLength={40}
                    required
                    className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-xs text-[#523A3E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8A6167] uppercase mb-1">Skor Nilai Diperoleh (0 - 100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newGradeScore}
                    onChange={(e) => setNewGradeScore(parseInt(e.target.value) || 0)}
                    required
                    className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-xs text-[#523A3E] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={subjects.length === 0}
                  className="w-full bg-[#FF8DA1] hover:bg-[#FF6384] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  Catat Hasil Nilai
                </button>
              </form>
            </div>

            {/* Right Box: Past Grades Table list */}
            <div className="lg:col-span-8 rounded-2xl border border-[#FFECEF] bg-white p-5 shadow-xs">
              <h3 className="font-display font-bold text-sm text-[#523A3E] mb-3">Arsip Riwayat Nilai Belajar</h3>

              {grades.length === 0 ? (
                <div className="text-center py-12">
                  <Award size={36} className="text-[#FFD0D8] mx-auto mb-2" />
                  <p className="text-xs text-[#AC888C] italic">Belum ada catatan nilai tersimpan.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#FFECEF] text-[#8A6167] font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">Mapel</th>
                        <th className="py-2.5">Tugas / Kuis</th>
                        <th className="py-2.5">Tanggal</th>
                        <th className="py-2.5 text-center">Score</th>
                        <th className="py-2.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {grades.map((g) => {
                        let scoreColorClass = 'text-green-600 bg-green-50 font-bold';
                        if (g.score < 75) scoreColorClass = 'text-red-500 bg-red-50 font-bold';
                        else if (g.score < 85) scoreColorClass = 'text-amber-500 bg-amber-50 font-bold';

                        return (
                          <tr key={g.id} className="hover:bg-rose-50/20 transition-colors">
                            <td className="py-3 font-semibold text-[#523A3E]">{g.subjectName}</td>
                            <td className="py-3 text-gray-600">{g.title}</td>
                            <td className="py-3 text-gray-400 font-mono text-[10px]">{g.date}</td>
                            <td className="py-3 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs ${scoreColorClass}`}>
                                {g.score}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => deleteGrade(g.id, g.score, g.subjectName)}
                                className="text-gray-300 hover:text-red-500 p-1"
                                title="Hapus Nilai"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
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
            <h3 className="font-display font-extrabold text-sm text-[#523A3E] mb-2">
              Hapus {itemToDelete.type === 'subject' ? 'Mata Pelajaran' : 'Berkas Nilai'}? 🎀
            </h3>
            <p className="text-xs text-[#AC888C] leading-relaxed mb-6">
              Apakah Adel yakin ingin menghapus {itemToDelete.type === 'subject' ? 'mata pelajaran' : 'catatan nilai'}{' '}
              <span className="font-bold text-[#FF6384]">"{itemToDelete.title}"</span>?
              {itemToDelete.type === 'subject' 
                ? ' Tindakan ini juga akan menghapus seluruh target progres belajarnya.' 
                : ' Tindakan ini akan menghapusnya dari laporan rata-rata nilaimu.'}
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
                  if (itemToDelete.type === 'subject') {
                    setSubjects((prev) => prev.filter((s) => s.id !== itemToDelete.id));
                    playChimeSound('bell');
                    addNotification('Mata Pelajaran Dihapus', `Mata pelajaran "${itemToDelete.title}" telah dihapus.`, 'system');
                  } else {
                    setGrades((prev) => prev.filter((g) => g.id !== itemToDelete.id));
                    playChimeSound('bell');
                  }
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
