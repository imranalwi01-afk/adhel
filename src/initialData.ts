import { Schedule, Assignment, Exam, TodoItem, Subject, Grade, Habit, Note } from './types';

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'Matematika', color: '#FFB4C2', progress: 75, lastGrade: 92 },
  { id: 'sub-2', name: 'IPA', color: '#C8E4FF', progress: 60, lastGrade: 85 },
  { id: 'sub-3', name: 'IPS', color: '#FFECA1', progress: 45, lastGrade: 88 },
  { id: 'sub-4', name: 'Bahasa Indonesia', color: '#D2FFD2', progress: 90, lastGrade: 95 },
  { id: 'sub-5', name: 'Bahasa Inggris', color: '#E8D3FF', progress: 80, lastGrade: 91 },
  { id: 'sub-6', name: 'Digital', color: '#B3F0FF', progress: 50, lastGrade: 85 },
  { id: 'sub-7', name: 'PAI', color: '#D2FFEB', progress: 40, lastGrade: 90 },
  { id: 'sub-8', name: 'Fiqih Wanita', color: '#FFEBF5', progress: 65, lastGrade: 88 },
  { id: 'sub-9', name: 'Akidah Akhlak', color: '#FFF2E6', progress: 70, lastGrade: 92 },
  { id: 'sub-10', name: 'Bahasa Arab', color: '#E6F7FF', progress: 55, lastGrade: 80 },
  { id: 'sub-11', name: 'Seni Budaya', color: '#FFF0F0', progress: 85, lastGrade: 94 },
  { id: 'sub-12', name: 'Pancasila', color: '#FAF3E0', progress: 60, lastGrade: 89 },
  { id: 'sub-13', name: 'Olahraga', color: '#F3E5F5', progress: 90, lastGrade: 96 },
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sch-1',
    subjectName: 'Matematika',
    day: 'Monday',
    startTime: '08:00',
    endTime: '09:30',
    notes: 'Bab Teorema Pythagoras & Latihan Soal',
    color: '#FFB4C2',
  },
  {
    id: 'sch-2',
    subjectName: 'IPA',
    day: 'Monday',
    startTime: '10:00',
    endTime: '11:45',
    notes: 'Praktikum Sistem Organ Manusia',
    color: '#C8E4FF',
  },
  {
    id: 'sch-3',
    subjectName: 'Bahasa Inggris',
    day: 'Tuesday',
    startTime: '08:00',
    endTime: '09:30',
    notes: 'Writing Narrative Text & Vocab Quiz',
    color: '#E8D3FF',
  },
  {
    id: 'sch-4',
    subjectName: 'IPS',
    day: 'Wednesday',
    startTime: '13:00',
    endTime: '14:30',
    notes: 'Sejarah Perang Dunia 1 & Diskusi kelompok',
    color: '#FFECA1',
  },
  {
    id: 'sch-5',
    subjectName: 'Bahasa Indonesia',
    day: 'Thursday',
    startTime: '09:45',
    endTime: '11:15',
    notes: 'Analisis Novel Angkatan Pujangga Baru',
    color: '#D2FFD2',
  },
  {
    id: 'sch-6',
    subjectName: 'Matematika',
    day: 'Friday',
    startTime: '08:00',
    endTime: '09:30',
    notes: 'Review Kisi-kisi Evaluasi Tengah Semester',
    color: '#FFB4C2',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'ass-1',
    title: 'Latihan Soal Aljabar Linier',
    subjectName: 'Matematika',
    dueDate: '2026-06-12',
    priority: 'high',
    status: 'todo',
  },
  {
    id: 'ass-2',
    title: 'Laporan Praktikum Fotosintesis',
    subjectName: 'IPA',
    dueDate: '2026-06-10',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 'ass-3',
    title: 'Menulis Cerpen Tema Pahlawan',
    subjectName: 'Bahasa Indonesia',
    dueDate: '2026-06-15',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 'ass-4',
    title: 'Vocabulary Practice Exercises 4',
    subjectName: 'Bahasa Inggris',
    dueDate: '2026-06-09',
    priority: 'low',
    status: 'completed',
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'ex-1',
    title: 'Ujian Tengah Semester - Matematika',
    subjectName: 'Matematika',
    date: '2026-06-15',
    targetGrade: 95,
  },
  {
    id: 'ex-2',
    title: 'Kuis Bab 3 - Fisika Gravitasi',
    subjectName: 'IPA',
    date: '2026-06-20',
    targetGrade: 90,
  },
  {
    id: 'ex-3',
    title: 'Ujian Akhir - Membaca & Menulis',
    subjectName: 'Bahasa Indonesia',
    date: '2026-06-24',
    targetGrade: 98,
  },
];

export const INITIAL_TODOS: TodoItem[] = [
  { id: 'todo-1', text: 'Merapikan meja belajar', completed: true, date: '2026-06-08' },
  { id: 'todo-2', text: 'Beli buku catatan baru warna pink pastel', completed: false, date: '2026-06-08' },
  { id: 'todo-3', text: 'Review flashcards rumus Matematika', completed: false, date: '2026-06-08' },
  { id: 'todo-4', text: 'Menyerahkan tugas Bahasa Inggris', completed: true, date: '2026-06-08' },
];

export const INITIAL_GRADES: Grade[] = [
  { id: 'gr-1', subjectName: 'Matematika', title: 'Ulangan Harian 1', score: 92, date: '2026-05-15' },
  { id: 'gr-2', subjectName: 'IPA', title: 'Kuis Sel Tumbuhan', score: 85, date: '2026-05-20' },
  { id: 'gr-3', subjectName: 'IPS', title: 'Tugas Geografi Nusantara', score: 88, date: '2026-05-28' },
  { id: 'gr-4', subjectName: 'Bahasa Indonesia', title: 'Prinsip Sintaksis', score: 95, date: '2026-06-02' },
  { id: 'gr-5', subjectName: 'Bahasa Inggris', title: 'Listening Comprehension', score: 91, date: '2026-06-04' },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'hb-1',
    name: 'Membaca 30 Menit',
    streak: 4,
    history: {
      '2026-06-04': true,
      '2026-06-05': true,
      '2026-06-06': true,
      '2026-06-07': true,
    },
  },
  {
    id: 'hb-2',
    name: 'Menghafal Kosa Kata Baru',
    streak: 2,
    history: {
      '2026-06-05': false,
      '2026-06-06': true,
      '2026-06-07': true,
    },
  },
  {
    id: 'hb-3',
    name: 'Mengerjakan PR & Latihan',
    streak: 5,
    history: {
      '2026-06-03': true,
      '2026-06-04': true,
      '2026-06-05': true,
      '2026-06-06': true,
      '2026-06-07': true,
    },
  },
  {
    id: 'hb-4',
    name: 'Review Materi Seharian',
    streak: 0,
    history: {
      '2026-06-07': false,
    },
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'not-1',
    title: 'Rumus Deret Aritmatika',
    content: 'Deret Aritmatika:\nSn = n/2 * (2a + (n-1)b)\nSuku ke-n:\nUn = a + (n-1)b\n\na = suku pertama\nb = beda antar suku',
    category: 'formula',
    updatedAt: '2026-06-07T14:20:00.000Z',
  },
  {
    id: 'not-2',
    title: 'Sistem Pencernaan Manusia',
    content: 'Urutan Sistem Pencernaan:\n1. Rongga Mulut (terdapat amilase/ptialin)\n2. Kerongkongan (gerak peristaltik)\n3. Lambung (HCl, pepsin, renin)\n4. Usus Halus (duodenum, jejunum, ileum)\n5. Usus Besar (penyerapan air & pembusukan oleh E. Coli)\n6. Anus',
    category: 'summary',
    updatedAt: '2026-06-06T10:15:00.000Z',
  },
  {
    id: 'not-3',
    title: 'Kosakata Bahasa Inggris Akademik',
    content: '- Substantial = Sangat penting / banyak\n- Refute = Menyanggah\n- Concur = Setuju / sependapat\n- Inherent = Melekat pada sesuatu\n- Paradigm = Kerangka berpikir / model',
    category: 'memorization',
    updatedAt: '2026-06-05T09:30:00.000Z',
  },
];

export const DAILY_MOTIVATIONS = [
  "You can do hard things.",
  "Your potential is endless. Keep going, pastel queen!",
  "Trust the process. Small steps every single day.",
  "Make yourself proud today.",
  "Beautiful minds grow with lovely patience.",
  "Start where you are. Use what you have. Do what you can.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Dream big. Study hard. Stay sweet.",
];
