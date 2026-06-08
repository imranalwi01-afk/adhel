import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { Award, Clock, CheckSquare, Flame, TrendingUp, Sparkles } from 'lucide-react';
import { Subject, Grade, Assignment, Habit } from '../types';

interface StatsDashboardProps {
  grades: Grade[];
  assignments: Assignment[];
  habits: Habit[];
  subjects: Subject[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  grades,
  assignments,
  habits,
  subjects,
}) => {
  // 1. Weekly hours study dataset (Monday to Sunday)
  const studyHoursData = [
    { day: 'Sen', menit: 45 },
    { day: 'Sel', menit: 80 },
    { day: 'Rab', menit: 60 },
    { day: 'Kam', menit: 110 },
    { day: 'Jum', menit: 50 },
    { day: 'Sab', menit: 90 },
    { day: 'Min', menit: 35 },
  ];

  // 2. Assignment progress grouping for Pie Chart
  const todoCount = assignments.filter((a) => a.status === 'todo').length;
  const inProgressCount = assignments.filter((a) => a.status === 'in_progress').length;
  const completedCount = assignments.filter((a) => a.status === 'completed').length;

  const assignmentStatusData = [
    { name: 'To Do', value: todoCount, color: '#F87171' }, // soft red
    { name: 'In Progress', value: inProgressCount, color: '#FBBF24' }, // soft amber
    { name: 'Completed', value: completedCount, color: '#34D399' }, // soft emerald
  ].filter((item) => item.value > 0); // only show if count > 0

  // 3. Grade progress history sorting dynamically for Area Chart
  const sortedGradesData = [...grades]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((g) => ({
      name: g.title.substring(0, 10) + '...',
      nilai: g.score,
      subject: g.subjectName,
    }));

  // Calculations for dashboard indicators
  const totalAssignments = assignments.length;
  const completedAssignmentsValue = assignments.filter((a) => a.status === 'completed').length;
  const completionRatePercent = totalAssignments > 0 
    ? Math.round((completedAssignmentsValue / totalAssignments) * 100) 
    : 0;

  const activeHabitsCount = habits.length;
  const averageStreak = activeHabitsCount > 0 
    ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / activeHabitsCount) 
    : 0;

  const averageScore = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length) 
    : 0;

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="font-display font-bold text-xl text-[#523A3E] flex items-center gap-1.5">
          <Sparkles size={18} className="text-[#FF6384]" />
          Smart Academic Analytics
        </h2>
        <p className="text-xs text-[#AC888C] mt-0.5">Analisis hasil belajar, pengerjaan tugas, dan evaluasi fokus mingguan secara real-time.</p>
      </div>

      {/* Mini Bento stats indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#FFD0D8] rounded-2xl p-4 flex items-center gap-3">
          <div className="rounded-xl bg-[#FFF0F2] p-2.5 text-[#FF6384]">
            <Clock size={16} />
          </div>
          <div>
            <span className="text-[10px] text-[#A67E83] uppercase block font-semibold leading-none">Rata-Rata Belajar</span>
            <span className="text-base font-display font-bold text-[#523A3E] block mt-1">67 Menit / Hari</span>
          </div>
        </div>

        <div className="bg-white border border-[#FFD0D8] rounded-2xl p-4 flex items-center gap-3">
          <div className="rounded-xl bg-[#FFF0F2] p-2.5 text-emerald-500">
            <CheckSquare size={16} />
          </div>
          <div>
            <span className="text-[10px] text-[#A67E83] uppercase block font-semibold leading-none">Tingkat Tugas Selesai</span>
            <span className="text-base font-display font-bold text-[#523A3E] block mt-1">{completionRatePercent}%</span>
          </div>
        </div>

        <div className="bg-white border border-[#FFECA1] rounded-2xl p-4 flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-2.5 text-amber-500">
            <Flame size={16} />
          </div>
          <div>
            <span className="text-[10px] text-[#A67E83] uppercase block font-semibold leading-none">Streak Kebiasaan</span>
            <span className="text-base font-display font-bold text-[#523A3E] block mt-1">{averageStreak} Hari</span>
          </div>
        </div>

        <div className="bg-white border border-[#FFD0D8] rounded-2xl p-4 flex items-center gap-3">
          <div className="rounded-xl bg-[#FFF0F2] p-2.5 text-[#D4AF37]">
            <Award size={16} />
          </div>
          <div>
            <span className="text-[10px] text-[#A67E83] uppercase block font-semibold leading-none">Indeks Prestasi</span>
            <span className="text-base font-display font-bold text-[#523A3E] block mt-1">{averageScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Hours Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-[#FFECEF] rounded-2xl p-5 shadow-xs">
          <h3 className="font-display font-bold text-sm text-[#523A3E] mb-4 flex items-center gap-1.5">
            <Clock size={16} className="text-[#FF8DA1]" />
            Jam Belajar Fokus Mingguan (Menit)
          </h3>
          <div className="w-full h-64 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFF0F2" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#8A6167" />
                <YAxis tickLine={false} axisLine={false} stroke="#8A6167" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFBFB', borderColor: '#FFD0D8', borderRadius: '12px' }} 
                  labelStyle={{ fontWeight: 'bold', color: '#523A3E' }} 
                />
                <Bar dataKey="menit" fill="#FF8DA1" radius={[8, 8, 0, 0]}>
                  {studyHoursData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#FF6384' : '#FF9FB1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion Donut chart */}
        <div className="lg:col-span-5 bg-white border border-[#FFECEF] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="font-display font-bold text-sm text-[#523A3E] mb-3 flex items-center gap-1.5">
            <CheckSquare size={16} className="text-[#FF8DA1]" />
            Grafik Penyebaran Status Tugas
          </h3>

          {assignments.length === 0 ? (
            <p className="text-xs text-[#AC888C] text-center italic py-20">Belum ada tugas untuk dianalisis.</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-3">
              <div className="w-40 h-40 font-mono text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assignmentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {assignmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '10px', borderColor: '#FFF0F2' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends Custom list column */}
              <div className="text-xs space-y-2 text-left shrink-0">
                {assignmentStatusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-md" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-gray-700">{item.name}:</span>
                    <span className="font-bold text-gray-900">{item.value} tugas</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 text-center text-[10px] text-[#A67E83] italic border-t border-gray-50 pt-2 font-medium">
            Progres Kinerja Belajar Sekolah {completionRatePercent}% Selesai
          </div>
        </div>

        {/* Grade Progress Line chart */}
        <div className="lg:col-span-12 bg-white border border-[#FFECEF] rounded-2xl p-5 shadow-xs">
          <h3 className="font-display font-bold text-sm text-[#523A3E] mb-4 flex items-center gap-1.5">
            <TrendingUp size={16} className="text-[#FF8DA1]" />
            Evaluasi Grafik Nilai Tugas & Ujian
          </h3>

          {grades.length === 0 ? (
            <p className="text-xs text-[#AC888C] italic text-center py-16">Silakan input beberapa nilai di Grade Tracker terlebih dahulu.</p>
          ) : (
            <div className="w-full h-64 text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedGradesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNilai" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8DA1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#FF8DA1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFF2F4" />
                  <XAxis dataKey="name" stroke="#8A6167" tickLine={false} axisLine={false} />
                  <YAxis domain={[50, 100]} stroke="#8A6167" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFBFB', borderColor: '#FFD0D8', borderRadius: '12px' }} 
                    labelStyle={{ fontWeight: 'bold' }} 
                  />
                  <Area type="monotone" dataKey="nilai" stroke="#FF6384" strokeWidth={3} fillOpacity={1} fill="url(#colorNilai)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
