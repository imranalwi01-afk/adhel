import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit3, Heart, Save, FileText, Check, BookOpen, Clock, Tag } from 'lucide-react';
import { Note, NoteCategoryType } from '../types';
import { playChimeSound } from './NotificationCenter';

interface NotesSectionProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  addNotification: (title: string, message: string, type: 'system') => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  setNotes,
  addNotification,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');

  // Currently viewing or editing note
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isEditing, setIsEditing] = useState(false);

  // Custom Deletion State
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Form states for adding / editing notes
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<NoteCategoryType>('class_note');

  // Create empty new note trigger
  const handleAddNewNote = () => {
    const newNote: Note = {
      id: 'not-' + Date.now(),
      title: 'Catatan Belajar Baru 🎀',
      content: 'Tulis ringkasan materimu di sini...\n\nFormat tips:\n- Gunakan tanda (-) untuk list\n- Tambah subjudul pelajaran',
      category: 'class_note',
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setNoteTitle(newNote.title);
    setNoteContent(newNote.content);
    setNoteCategory(newNote.category);
    setIsEditing(true);

    playChimeSound('success');
    addNotification('Catatan Dibuat', 'Mulai mencatat ringkasan materimu di coquette book yang indah ini!', 'system');
  };

  // Find active note object
  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Save active note modifications
  const handleSaveNote = () => {
    if (!activeNoteId) return;

    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNoteId
          ? {
              ...n,
              title: noteTitle,
              content: noteContent,
              category: noteCategory,
              updatedAt: new Date().toISOString(),
            }
          : n
      )
    );

    setIsEditing(false);
    playChimeSound('success');
    addNotification('Catatan Disimpan', `Catatan "${noteTitle}" berhasil disimpan dengan rapi! ✨`, 'system');
  };

  // Trigger editing phase
  const handleStartEdit = () => {
    if (!activeNote) return;
    setNoteTitle(activeNote.title);
    setNoteContent(activeNote.content);
    setNoteCategory(activeNote.category);
    setIsEditing(true);
  };

  const handleDeleteNote = (id: string, title: string) => {
    setItemToDelete({ id, title });
  };

  const handleSelectNote = (note: Note) => {
    setActiveNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setIsEditing(false);
  };

  // Filter notes by search query and category
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilterCategory === 'All' || n.category === selectedFilterCategory;
    return matchesSearch && matchesCategory;
  });

  const CATEGORY_LABELS: Record<NoteCategoryType, string> = {
    summary: 'Ringkasan',
    formula: 'Rumus',
    memorization: 'Hafalan',
    class_note: 'Catatan Kelas',
  };

  const CATEGORY_COLORS: Record<NoteCategoryType, string> = {
    summary: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    formula: 'bg-amber-50 text-amber-700 border-amber-200',
    memorization: 'bg-rose-50 text-rose-600 border-rose-200',
    class_note: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="font-display font-bold text-xl text-[#523A3E] flex items-center gap-1.5">
          <BookOpen size={18} className="text-[#FF6384]" />
          My Coquette Study Notes 📜
        </h2>
        <p className="text-xs text-[#AC888C] mt-0.5">Tulis ringkasan rumus matematika, hafalan biologi, atau kisi-kisi ujian kelasmu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Note Sidebar List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-[#C8B2B5]" size={14} />
              <input
                type="text"
                placeholder="Cari catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#FFD0D8] bg-white pl-9 pr-3 py-2 text-xs text-[#523A3E] placeholder-gray-400 focus:outline-none"
              />
            </div>
            
            <button
              onClick={handleAddNewNote}
              className="rounded-xl px-3 p-2 bg-[#FF8DA1] hover:bg-[#FF6384] text-white shadow-xs transition-colors shrink-0"
              title="Buat Catatan Baru"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Quick Category Tab Filters */}
          <div className="flex flex-wrap gap-1 border-b border-[#FFF0F2] pb-2">
            <button
              onClick={() => setSelectedFilterCategory('All')}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                selectedFilterCategory === 'All'
                  ? 'bg-[#FF8DA1] text-white border-[#FF8DA1]'
                  : 'bg-white text-[#8A6167] border-[#FFECEF]'
              }`}
            >
              Semua
            </button>
            {Object.keys(CATEGORY_LABELS).map((catKey) => (
              <button
                key={catKey}
                onClick={() => setSelectedFilterCategory(catKey)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                  selectedFilterCategory === catKey
                    ? 'bg-[#FF8DA1] text-white border-[#FF8DA1]'
                    : 'bg-white text-[#8A6167] border-[#FFECEF]'
                }`}
              >
                {CATEGORY_LABELS[catKey as NoteCategoryType]}
              </button>
            ))}
          </div>

          {/* Note List Scrollable Block */}
          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-[#AC888C] text-center italic py-12 bg-white/40 rounded-xl">Catatan tidak ditemukan.</p>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === activeNoteId;
                return (
                  <button
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`w-full rounded-2xl p-4 border text-left transition-all ${
                      isActive
                        ? 'bg-[#FFEBEF]/80 border-[#FFB4C2] shadow-3xs'
                        : 'bg-white border-[#FFF0F2] hover:border-[#FFD0D8]'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${CATEGORY_COLORS[note.category]}`}>
                        {CATEGORY_LABELS[note.category]}
                      </span>
                      <span className="text-[9px] text-[#C4ABB0] font-mono leading-none">
                        {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="font-display font-extrabold text-xs text-[#523A3E] mt-2.5 truncate">
                      {note.title}
                    </h4>
                    <p className="text-[11px] text-[#866468] line-clamp-2 mt-1 whitespace-pre-wrap leading-tight">
                      {note.content}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Note Viewer / Editor Panel */}
        <div className="lg:col-span-8">
          {!activeNote ? (
            <div className="rounded-3xl border border-dashed border-[#FFD0D8] bg-white/40 p-20 text-center h-full flex flex-col justify-center items-center">
              <FileText size={48} className="text-[#FFD0D8] mb-3 animate-float" />
              <h3 className="font-display font-bold text-sm text-[#8A6167]">No Notes Selected</h3>
              <p className="text-xs text-[#AC888C] mt-1">Silakan pilih salah satu judul catatan di samping atau buat draf catatan baru.</p>
              <button
                onClick={handleAddNewNote}
                className="mt-4 rounded-xl bg-[#FF8DA1] text-white font-bold text-xs px-4 py-2 hover:bg-[#FF6384]"
              >
                Tulis Catatan Sekarang
              </button>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#FFD0D8] bg-white shadow-xs p-6 h-full flex flex-col justify-between">
              
              {/* Form editing view */}
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5 uppercase">
                      <Edit3 size={14} /> Editing Note
                    </span>
                    <button
                      onClick={handleSaveNote}
                      className="rounded-xl px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Save size={13} />
                      Simpan Catatan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#8A6167] uppercase mb-1">Judul Catatan</label>
                      <input
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        required
                        className="w-full rounded-xl border border-[#FFD0D8] px-3 py-2 text-xs text-[#523A3E] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#8A6167] uppercase mb-1">Kategori Catatan</label>
                      <select
                        value={noteCategory}
                        onChange={(e) => setNoteCategory(e.target.value as NoteCategoryType)}
                        className="w-full rounded-xl border border-[#FFD0D8] bg-white px-3 py-2 text-xs text-[#523A3E] focus:outline-none"
                      >
                        {Object.keys(CATEGORY_LABELS).map((ck) => (
                          <option key={ck} value={ck}>{CATEGORY_LABELS[ck as NoteCategoryType]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8A6167] uppercase mb-1">Ketik Isi Catatan</label>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      rows={12}
                      required
                      placeholder="Gunakan draf catatan dengan rapi..."
                      className="w-full font-mono text-xs rounded-xl border border-[#FFD0D8] px-3 py-3 text-[#332225] focus:outline-none shadow-3xs"
                    />
                  </div>
                </div>
              ) : (
                /* Static view check with interactive paper background */
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header bar controls */}
                    <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-2.5">
                      <div>
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full border font-bold ${CATEGORY_COLORS[activeNote.category]}`}>
                          {CATEGORY_LABELS[activeNote.category]}
                        </span>
                        <h3 className="font-display font-extrabold text-[#523A3E] text-base md:text-lg mt-2 tracking-tight">
                          {activeNote.title}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
                          <Clock size={10} />
                          Sunting terakhir: {new Date(activeNote.updatedAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                        </p>
                      </div>

                      {/* Header tools buttons */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={handleStartEdit}
                          className="rounded-xl px-3.5 py-1.5 border border-[#FFD0D8] bg-white hover:bg-[#FFF0F2] text-xs font-semibold text-[#8A6167] flex items-center gap-1"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNote(activeNote.id, activeNote.title)}
                          className="rounded-xl p-1.5 hover:bg-red-50 text-[#8A6167] hover:text-red-500 border border-transparent hover:border-red-100"
                          title="Hapus Catatan"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Paper Notebook Liner Layout simulating a cute vintage study desk sheet */}
                    <div className="bg-[#FCFCFC] border border-gray-100 rounded-2xl p-5 shadow-3xs min-h-[250px] relative">
                      <div className="absolute top-0 bottom-0 left-8 w-px bg-red-200 pointer-events-none opacity-40" /> {/* notepad red vertical line */}
                      <div className="pl-6 font-nunito text-xs text-[#523A3E] leading-relaxed whitespace-pre-wrap text-left">
                        {activeNote.content}
                      </div>
                    </div>
                  </div>

                  {/* Note quotes summary */}
                  <div className="mt-4 bg-[#FFF9F9] border border-[#FFECEF] rounded-xl p-3.5 text-[11px] text-[#A67E83] flex items-center gap-2">
                    <Heart size={12} className="text-rose-400 fill-[#FFBEC8]" />
                    <span>Catat rumus atau rangkuman secara singkat. Kunci belajar cerdas adalah pengulangan berkala!</span>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* CUSTOM COQUETTE DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#FFD0D8] shadow-2xl p-6 text-center animate-scale-up">
            <div className="h-12 w-12 rounded-full bg-[#FFF0F2] text-[#FF6384] flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="font-display font-extrabold text-sm text-[#523A3E] mb-2">Hapus Catatan Belajar? 🎀</h3>
            <p className="text-xs text-[#AC888C] leading-relaxed mb-6">
              Apakah Adel yakin ingin menghapus catatan <span className="font-bold text-[#FF6384]">"{itemToDelete.title}"</span>? Catatan yang dihapus tidak dapat dipulihkan.
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
                  setNotes((prev) => prev.filter((n) => n.id !== itemToDelete.id));
                  setActiveNoteId(notes.find((n) => n.id !== itemToDelete.id)?.id || null);
                  setIsEditing(false);
                  playChimeSound('bell');
                  addNotification('Catatan Dihapus', `Catatan "${itemToDelete.title}" telah dibuang.`, 'system');
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
