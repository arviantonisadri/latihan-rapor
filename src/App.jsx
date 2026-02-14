import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Settings, 
  LayoutDashboard, 
  FileText, 
  ChevronRight, 
  Menu, 
  X,
  Plus,
  Save,
  Award,
  Calendar,
  Search,
  Download,
  Share2,
  CheckCircle,
  TrendingUp,
  GraduationCap, 
  Grid, 
  MoreHorizontal,
  LogOut, // Added
  Lock, // Added
  User // Added
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- MOCK DATA & CONFIGURATION ---

// Default Config untuk Lembaga A (Standard)
const initialConfig = {
  institutionName: "TPQ Al-Hidayah",
  institutionAddress: "Jl. H. Nawi Raya No. 12, Jakarta Selatan",
  institutionLogo: null,
  gradingType: "numeric", // 'numeric' (0-100) or 'predicate' (Mumtaz, Jayyid, etc)
  modules: {
    tilawah: true,
    tahfidz: true,
    adab: true
  },
  logoColor: "bg-emerald-600"
};

// Mock Data Santri (Initial)
const initialStudents = [
  { id: 1, name: "Ahmad Fatih", class: "Jilid 4", parent: "Bpk. Budi", attendance: 95, lastSurah: "An-Naba", lastAyat: 10 },
  { id: 2, name: "Siti Aisyah", class: "Al-Qur'an", parent: "Bpk. Rahman", attendance: 88, lastSurah: "Al-Baqarah", lastAyat: 15 },
  { id: 3, name: "Umar Faruq", class: "Tahfidz 1", parent: "Bpk. Hasan", attendance: 92, lastSurah: "Ya-Sin", lastAyat: 83 },
  { id: 4, name: "Fatimah Azzahra", class: "Jilid 2", parent: "Bpk. Yusuf", attendance: 100, lastSurah: "Al-Falaq", lastAyat: 5 },
];

// Mock Data Guru (Initial)
const initialTeachers = [
  { id: 1, name: "Ustadz Abdullah", phone: "081234567890", subject: "Tahfidz" },
  { id: 2, name: "Ustadzah Halimah", phone: "081987654321", subject: "Tilawati" },
];

// Mock Data Kelas (Initial)
const initialClasses = [
  { id: 1, name: "Jilid 1 (Dasar)", schedule: "Senin - Kamis, 16.00" },
  { id: 2, name: "Tahfidz A", schedule: "Senin - Jumat, 18.30" },
  { id: 3, name: "Al-Qur'an Dewasa", schedule: "Sabtu - Minggu, 08.00" },
];

// Mock Data Hafalan (History)
const mockHistory = [
  { day: 'Sen', pages: 1 },
  { day: 'Sel', pages: 2 },
  { day: 'Rab', pages: 1.5 },
  { day: 'Kam', pages: 3 },
  { day: 'Jum', pages: 2 },
  { day: 'Sab', pages: 4 },
];

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = "success" }) => {
  const colors = {
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[type]}`}>
      {children}
    </span>
  );
};

export default function App() {
  // State
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Auth State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [config, setConfig] = useState(initialConfig);
  const [students, setStudents] = useState(initialStudents);
  const [teachers, setTeachers] = useState(initialTeachers); 
  const [classes, setClasses] = useState(initialClasses); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [formData, setFormData] = useState({});

  // Responsive Handler
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handler Upload Logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, institutionLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler Auth
  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login success
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  // Handler Add Data
  const handleAdd = (type) => {
    setModalType(type);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleSaveData = () => {
    if (modalType === 'teacher') {
      const newTeacher = {
        id: teachers.length + 1,
        name: formData.name || "Guru Baru",
        phone: formData.phone || "-",
        subject: formData.subject || "Umum"
      };
      setTeachers([...teachers, newTeacher]);
    } else if (modalType === 'class') {
      const newClass = {
        id: classes.length + 1,
        name: formData.name || "Kelas Baru",
        schedule: formData.schedule || "Belum diatur"
      };
      setClasses([...classes, newClass]);
    }
    setIsModalOpen(false);
  };

  // --- SUB-VIEWS ---

  // 0. LOGIN VIEW
  const LoginView = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 animate-fade-in">
        <div className="text-center mb-8">
           <div className={`w-16 h-16 rounded-xl ${config.logoColor} flex items-center justify-center text-white font-bold mx-auto mb-4 shadow-lg shadow-emerald-200`}>
            <BookOpen size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">RaporKu Admin</h1>
          <p className="text-slate-500 mt-2">Masuk untuk mengelola data lembaga</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="admin"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full ${config.logoColor} text-white py-3 rounded-lg font-bold hover:opacity-90 transition shadow-lg shadow-emerald-100 flex items-center justify-center gap-2`}
          >
            Masuk Dashboard <ChevronRight size={18} />
          </button>
        </form>
        
        <p className="text-center text-xs text-slate-400 mt-8">
          &copy; 2024 RaporKu SaaS Platform
        </p>
      </div>
    </div>
  );

  // 1. DASHBOARD VIEW
  const DashboardView = () => (
    <div className="space-y-6 pb-20 md:pb-0 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assalamu'alaikum, Ustadz</h1>
          <p className="text-slate-500">Ringkasan aktivitas {config.institutionName} hari ini.</p>
        </div>
        <button 
          onClick={() => setActiveTab('grading')}
          className="hidden md:flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          <Plus size={18} /> Input Setoran
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Santri", val: students.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Guru", val: teachers.length, icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50" }, // Updated
          { label: "Rata-rata Nilai", val: config.gradingType === 'numeric' ? "88.5" : "Jayyid", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Kehadiran", val: "94%", icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, idx) => (
          <Card key={idx} className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-slate-800">{stat.val}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Grafik Hafalan Minggu Ini</h3>
            <select className="text-sm border rounded-lg px-2 py-1 text-slate-600 bg-slate-50">
              <option>Semua Kelas</option>
              <option>Tahfidz A</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="pages" 
                  stroke="#059669" 
                  strokeWidth={3} 
                  dot={{fill: '#059669', strokeWidth: 2, r: 4}} 
                  activeDot={{r: 6}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Setoran Terakhir</h3>
            <a href="#" className="text-xs text-emerald-600 font-medium hover:underline">Lihat Semua</a>
          </div>
          <div className="divide-y divide-slate-100">
            {students.slice(0, 4).map((student, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">Menghafal {student.lastSurah}: {student.lastAyat}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600">
                    {config.gradingType === 'numeric' ? '90' : 'Mumtaz'}
                  </span>
                  <p className="text-[10px] text-slate-400">10mnt lalu</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  // 2. INPUT NILAI / SANTRI VIEW
  const StudentsView = () => (
    <div className="space-y-6 pb-20 md:pb-0 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Data Santri & Penilaian</h1>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama santri..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {/* Tombol tambah santri (Placeholder) */}
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2">
            <Plus size={18} /> <span className="hidden md:inline">Tambah</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition duration-200">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className={`w-12 h-12 rounded-full ${config.logoColor} text-white flex items-center justify-center font-bold text-lg`}>
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{student.name}</h3>
                    <p className="text-sm text-slate-500">{student.class}</p>
                  </div>
                </div>
                <Badge type="info">Aktif</Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Hafalan Terakhir</span>
                  <span className="font-medium text-slate-800">{student.lastSurah}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Kehadiran</span>
                  <span className="font-medium text-emerald-600">{student.attendance}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => { setSelectedStudent(student); setActiveTab('grading'); }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 font-medium text-sm hover:bg-emerald-100 transition"
                >
                  <BookOpen size={16} /> Input Nilai
                </button>
                <button 
                  onClick={() => { setSelectedStudent(student); setActiveTab('report'); }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition"
                >
                  <FileText size={16} /> Rapor
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // --- NEW VIEW: DATA GURU ---
  const TeachersView = () => (
    <div className="space-y-6 pb-20 md:pb-0 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Data Guru / Asatidz</h1>
        <button 
          onClick={() => handleAdd('teacher')}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
        >
          <Plus size={18} /> Tambah Guru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="p-5 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{teacher.name}</h3>
                <p className="text-sm text-emerald-600 font-medium">{teacher.subject}</p>
                <p className="text-xs text-slate-400 mt-1">{teacher.phone}</p>
              </div>
            </div>
          </Card>
        ))}
        {teachers.length === 0 && <p className="text-slate-500 col-span-full text-center py-8">Belum ada data guru.</p>}
      </div>
    </div>
  );

  // --- NEW VIEW: DATA KELAS ---
  const ClassesView = () => (
    <div className="space-y-6 pb-20 md:pb-0 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Data Kelas & Jadwal</h1>
        <button 
          onClick={() => handleAdd('class')}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
        >
          <Plus size={18} /> Tambah Kelas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <Card key={cls.id} className="p-6 hover:shadow-md transition border-l-4 border-l-emerald-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{cls.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                  <Calendar size={16} />
                  <span>{cls.schedule}</span>
                </div>
              </div>
              <button className="text-slate-400 hover:text-emerald-600">
                <Settings size={18} />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge type="info">30 Santri</Badge>
              <Badge type="success">Aktif</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // 3. GRADING FORM (FLEXIBLE)
  const GradingView = () => {
    if (!selectedStudent) return <div className="p-8 text-center">Pilih santri terlebih dahulu dari menu Santri.</div>;
    // ... (Existing Grading View Code - No Changes needed logically, just passing through)
    return (
      <div className="max-w-3xl mx-auto pb-20 md:pb-0 animate-fade-in">
        <button 
          onClick={() => setActiveTab('students')}
          className="mb-4 text-slate-500 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium"
        >
          ← Kembali ke Data Santri
        </button>

        <Card className="overflow-hidden">
          <div className="bg-slate-50 p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Input Setoran & Penilaian</h2>
            <p className="text-slate-500">Santri: <span className="font-semibold text-emerald-600">{selectedStudent.name}</span></p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Bagian Tahfidz */}
            {config.modules.tahfidz && (
              <section>
                <h3 className="text-sm uppercase tracking-wide text-slate-400 font-bold mb-3">Target Tahfidz</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Surah</label>
                    <select className="w-full rounded-lg border-slate-200 border px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option>An-Naba</option>
                      <option>An-Nazi'at</option>
                      <option>Abasa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ayat</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Dari" className="w-full rounded-lg border-slate-200 border px-3 py-2" />
                      <span className="self-center text-slate-400">-</span>
                      <input type="number" placeholder="Sampai" className="w-full rounded-lg border-slate-200 border px-3 py-2" />
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className="border-t border-slate-100 my-2"></div>

            {/* Bagian Tilawah */}
            {config.modules.tilawah && (
              <section>
                <h3 className="text-sm uppercase tracking-wide text-slate-400 font-bold mb-3">Penilaian Kualitas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Makhraj', 'Tajwid', 'Kelancaran'].map((criteria) => (
                    <div key={criteria}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{criteria}</label>
                      {config.gradingType === 'numeric' ? (
                        <input 
                          type="number" 
                          max="100"
                          placeholder="0-100" 
                          className="w-full rounded-lg border-slate-200 border px-3 py-2" 
                        />
                      ) : (
                        <select className="w-full rounded-lg border-slate-200 border px-3 py-2">
                          <option>Mumtaz (Istimewa)</option>
                          <option>Jayyid Jiddan (Sangat Baik)</option>
                          <option>Jayyid (Baik)</option>
                          <option>Maqbul (Cukup)</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="border-t border-slate-100 my-2"></div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Ustadz/Ustadzah</label>
              <textarea 
                rows="3" 
                className="w-full rounded-lg border-slate-200 border px-3 py-2"
                placeholder="Berikan motivasi atau catatan perbaikan..."
              ></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition flex items-center gap-2">
                <Save size={18} /> Simpan Data
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // 4. SETTINGS VIEW
  const SettingsView = () => (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800">Pengaturan Lembaga</h1>
      
      {/* Profil Lembaga */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Settings size={20} className="text-slate-400" /> Identitas
        </h3>
        <div className="space-y-4">
          
          {/* Logo Upload Section */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className={`w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-white shrink-0`}>
              {config.institutionLogo ? (
                <img src={config.institutionLogo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <div className={`w-full h-full ${config.logoColor} flex items-center justify-center text-white`}>
                   <BookOpen size={24} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Logo Lembaga</label>
              <p className="text-xs text-slate-500 mb-3">Format: PNG, JPG (Max 2MB). Akan muncul di kop rapor.</p>
              <div className="flex gap-2">
                <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm">
                  Pilih Logo
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
                {config.institutionLogo && (
                  <button 
                    onClick={() => setConfig({...config, institutionLogo: null})}
                    className="text-red-500 text-sm font-medium hover:underline px-2"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lembaga</label>
            <input 
              type="text" 
              value={config.institutionName} 
              onChange={(e) => setConfig({...config, institutionName: e.target.value})}
              className="w-full rounded-lg border-slate-200 border px-3 py-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
            <textarea 
              rows="2"
              value={config.institutionAddress} 
              onChange={(e) => setConfig({...config, institutionAddress: e.target.value})}
              className="w-full rounded-lg border-slate-200 border px-3 py-2"
              placeholder="Contoh: Jl. Raya Kebayoran No. 12, Jakarta Selatan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tema Warna</label>
            <div className="flex gap-2">
              <button onClick={() => setConfig({...config, logoColor: 'bg-emerald-600'})} className="w-8 h-8 rounded-full bg-emerald-600 ring-2 ring-offset-2 ring-emerald-600"></button>
              <button onClick={() => setConfig({...config, logoColor: 'bg-blue-600'})} className="w-8 h-8 rounded-full bg-blue-600"></button>
              <button onClick={() => setConfig({...config, logoColor: 'bg-purple-600'})} className="w-8 h-8 rounded-full bg-purple-600"></button>
            </div>
          </div>
        </div>
      </Card>

      {/* Konfigurasi Rapor */}
      <Card className="p-6 border-l-4 border-l-amber-400">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FileText size={20} className="text-slate-400" /> Format Penilaian (SaaS Config)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipe Nilai</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setConfig({...config, gradingType: 'numeric'})}
                className={`p-3 rounded-lg border text-left ${config.gradingType === 'numeric' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200'}`}
              >
                <div className="font-bold text-slate-800">Angka (0-100)</div>
                <div className="text-xs text-slate-500">Standar sekolah umum</div>
              </button>
              <button 
                onClick={() => setConfig({...config, gradingType: 'predicate'})}
                className={`p-3 rounded-lg border text-left ${config.gradingType === 'predicate' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200'}`}
              >
                <div className="font-bold text-slate-800">Predikat (Arab)</div>
                <div className="text-xs text-slate-500">Mumtaz, Jayyid, Maqbul</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Modul Aktif</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={config.modules.tilawah} onChange={() => setConfig({...config, modules: {...config.modules, tilawah: !config.modules.tilawah}})} className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span className="text-slate-700">Tilawah & Tajwid</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={config.modules.tahfidz} onChange={() => setConfig({...config, modules: {...config.modules, tahfidz: !config.modules.tahfidz}})} className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span className="text-slate-700">Tahfidz (Hafalan)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={config.modules.adab} onChange={() => setConfig({...config, modules: {...config.modules, adab: !config.modules.adab}})} className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span className="text-slate-700">Adab & Karakter</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Logout Button (Mobile/Tablet visible) */}
      <button 
        onClick={handleLogout}
        className="w-full md:hidden flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-lg font-bold hover:bg-red-100 transition"
      >
        <LogOut size={18} /> Keluar Aplikasi
      </button>
    </div>
  );

  // 5. REPORT CARD PREVIEW
  const ReportCardView = () => {
    if (!selectedStudent) return <div className="p-8 text-center">Pilih santri terlebih dahulu.</div>;
    const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'});

    return (
      <div className="max-w-4xl mx-auto pb-20 md:pb-0 animate-fade-in">
        <button 
          onClick={() => setActiveTab('students')}
          className="mb-4 text-slate-500 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium print:hidden"
        >
          ← Kembali
        </button>

        <div className="bg-white p-8 md:p-12 shadow-lg rounded-xl print:shadow-none print:p-0">
          {/* Header Rapor */}
          <div className="text-center border-b-2 border-emerald-600 pb-6 mb-8 relative">
            <div className="flex flex-col items-center justify-center">
              {config.institutionLogo && (
                <img src={config.institutionLogo} alt="Logo" className="h-20 w-auto object-contain mb-4" />
              )}
              <h1 className="text-3xl font-bold text-emerald-800 uppercase tracking-wider leading-tight">{config.institutionName}</h1>
              {config.institutionAddress && (
                <p className="text-slate-600 text-sm mt-2 max-w-lg mx-auto">{config.institutionAddress}</p>
              )}
              <p className="text-slate-500 mt-2 text-xs font-medium uppercase tracking-widest">Laporan Hasil Belajar Santri</p>
            </div>
          </div>

          {/* Info Santri */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-sm">
            <div className="flex justify-between border-b border-slate-100 py-1">
              <span className="text-slate-500">Nama Santri</span>
              <span className="font-bold text-slate-800 uppercase">{selectedStudent.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-1">
              <span className="text-slate-500">Tahun Ajaran</span>
              <span className="font-medium text-slate-800">2023/2024</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-1">
              <span className="text-slate-500">Kelas / Kelompok</span>
              <span className="font-medium text-slate-800">{selectedStudent.class}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-1">
              <span className="text-slate-500">Semester</span>
              <span className="font-medium text-slate-800">Genap</span>
            </div>
          </div>

          {/* Tabel Nilai */}
          <div className="space-y-8">
            {config.modules.tahfidz && (
              <div>
                <h3 className="font-bold text-emerald-700 mb-2 border-l-4 border-emerald-500 pl-3">A. Program Tahfidz</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-800 text-sm">
                      <th className="border border-emerald-100 p-2 text-left">Materi / Surah</th>
                      <th className="border border-emerald-100 p-2 text-center w-24">Target</th>
                      <th className="border border-emerald-100 p-2 text-center w-24">Capaian</th>
                      <th className="border border-emerald-100 p-2 text-center w-32">Predikat</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border border-slate-100 p-2">Juz 30 (An-Naba s.d An-Nas)</td>
                      <td className="border border-slate-100 p-2 text-center">37 Surah</td>
                      <td className="border border-slate-100 p-2 text-center">35 Surah</td>
                      <td className="border border-slate-100 p-2 text-center font-bold text-emerald-600">
                        {config.gradingType === 'numeric' ? '92' : 'Mumtaz'}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-100 p-2">Surah Pilihan (Al-Mulk)</td>
                      <td className="border border-slate-100 p-2 text-center">30 Ayat</td>
                      <td className="border border-slate-100 p-2 text-center">30 Ayat</td>
                      <td className="border border-slate-100 p-2 text-center font-bold text-emerald-600">
                        {config.gradingType === 'numeric' ? '95' : 'Mumtaz'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {config.modules.tilawah && (
              <div>
                <h3 className="font-bold text-emerald-700 mb-2 border-l-4 border-emerald-500 pl-3">B. Kualitas Bacaan (Tahsin)</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-800 text-sm">
                      <th className="border border-emerald-100 p-2 text-left">Aspek Penilaian</th>
                      <th className="border border-emerald-100 p-2 text-center w-32">Nilai</th>
                      <th className="border border-emerald-100 p-2 text-left">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border border-slate-100 p-2">Makharijul Huruf</td>
                      <td className="border border-slate-100 p-2 text-center font-bold">
                        {config.gradingType === 'numeric' ? '88' : 'Jayyid Jiddan'}
                      </td>
                      <td className="border border-slate-100 p-2 text-slate-500 text-xs">Pengucapan huruf sudah sangat baik</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-100 p-2">Tajwid & Ghorib</td>
                      <td className="border border-slate-100 p-2 text-center font-bold">
                        {config.gradingType === 'numeric' ? '85' : 'Jayyid'}
                      </td>
                      <td className="border border-slate-100 p-2 text-slate-500 text-xs">Perhatikan panjang pendek mad</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Tanda Tangan */}
          <div className="mt-16 flex justify-between text-sm text-slate-600 print:mt-8">
            <div className="text-center">
              <p>Mengetahui,</p>
              <p>Orang Tua Wali</p>
              <div className="h-20"></div>
              <p className="font-bold border-t border-slate-300 px-4 pt-1">({selectedStudent.parent})</p>
            </div>
            <div className="text-center">
              <p>Jakarta, {date}</p>
              <p>Kepala {config.institutionName}</p>
              <div className="h-20"></div>
              <p className="font-bold border-t border-slate-300 px-4 pt-1">H. Abdullah S.Pd.I</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- GENERIC MODAL FORM ---
  const ModalForm = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
          <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800">
              {modalType === 'teacher' ? 'Tambah Data Guru' : 'Tambah Data Kelas'}
            </h3>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama {modalType === 'teacher' ? 'Guru' : 'Kelas'}</label>
              <input 
                type="text" 
                className="w-full rounded-lg border-slate-200 border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder={modalType === 'teacher' ? "Nama Lengkap" : "Contoh: Jilid 1 / Tahfidz A"}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            {modalType === 'teacher' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bidang Studi / Mengajar</label>
                  <input 
                    type="text" 
                    className="w-full rounded-lg border-slate-200 border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Contoh: Tahfidz, Tilawati, Iqra"
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon / WA</label>
                  <input 
                    type="text" 
                    className="w-full rounded-lg border-slate-200 border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="08..."
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </>
            )}

            {modalType === 'class' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jadwal</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg border-slate-200 border px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Contoh: Senin - Kamis, 16.00"
                  onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                />
              </div>
            )}
            
            <button 
              onClick={handleSaveData}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
            >
              Simpan Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- MAIN LAYOUT RENDER ---
  
  // 1. Check Login State Check
  if (!isLoggedIn) {
    return <LoginView />;
  }

  // 2. Render Main App if Logged In
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex overflow-hidden">
      
      {/* Modal Popup */}
      <ModalForm />

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 z-20`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className={`w-8 h-8 rounded-lg ${config.logoColor} flex items-center justify-center text-white font-bold`}>
            <BookOpen size={18} />
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">RaporKu</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'students', label: 'Data Santri', icon: Users },
            { id: 'teachers', label: 'Data Guru', icon: GraduationCap }, 
            { id: 'classes', label: 'Data Kelas', icon: Grid }, 
            { id: 'report', label: 'Cetak Rapor', icon: FileText },
            { id: 'settings', label: 'Pengaturan', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                <Users size={16} className="text-slate-500" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">Admin TPA</p>
                <p className="text-xs text-slate-500 truncate">Premium Plan</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition p-1"
              title="Keluar"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOPBAR */}
      <div className="md:hidden fixed top-0 w-full bg-white z-30 border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${config.logoColor} flex items-center justify-center text-white font-bold`}>
            <BookOpen size={18} />
          </div>
          <span className="font-bold text-lg text-slate-800">RaporKu</span>
        </div>
        <div className="flex gap-2">
          {activeTab !== 'dashboard' && (
            <button onClick={() => setActiveTab('settings')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
               <Settings size={20} />
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 overflow-y-auto h-screen p-4 pt-20 pb-24 md:p-8 md:ml-64 transition-all duration-300`}>
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'students' && <StudentsView />}
        {activeTab === 'teachers' && <TeachersView />}
        {activeTab === 'classes' && <ClassesView />}
        {activeTab === 'grading' && <GradingView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'report' && <ReportCardView />}
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-30 px-4 py-2 flex justify-between items-center pb-safe">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'students', label: 'Santri', icon: Users },
          { id: 'teachers', label: 'Guru', icon: GraduationCap },
          { id: 'classes', label: 'Kelas', icon: Grid },
          { id: 'report', label: 'Rapor', icon: FileText },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition min-w-[3.5rem] ${
              activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}