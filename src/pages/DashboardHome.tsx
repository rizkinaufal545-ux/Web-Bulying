import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Report } from '../types';

export default function DashboardHome() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processed: 0,
    completed: 0
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentReports();
  }, [profile]);

  const fetchStats = async () => {
    if (!profile) return;
    
    let query = supabase.from('reports').select('*', { count: 'exact', head: true });
    
    if (profile.role === 'siswa') {
      query = query.eq('reporter_id', profile.id);
    }

    const { count: total } = await query;
    const { count: pending } = await query.eq('status', 'pending');
    const { count: processed } = await query.eq('status', 'diproses');
    const { count: completed } = await query.eq('status', 'selesai');

    setStats({
      total: total || 0,
      pending: pending || 0,
      processed: processed || 0,
      completed: completed || 0
    });
  };

  const fetchRecentReports = async () => {
    if (!profile) return;

    let query = supabase
      .from('reports')
      .select('*, reporter:profiles(*)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (profile.role === 'siswa') {
      query = query.eq('reporter_id', profile.id);
    }

    const { data, error } = await query;
    if (!error && data) {
      setRecentReports(data);
    }
    setLoading(false);
  };

  const statCards = [
    { title: 'Total Laporan', value: stats.total, icon: FileText, color: 'bg-blue-500' },
    { title: 'Menunggu', value: stats.pending, icon: Clock, color: 'bg-amber-500' },
    { title: 'Diproses', value: stats.processed, icon: AlertTriangle, color: 'bg-primary' },
    { title: 'Selesai', value: stats.completed, icon: CheckCircle, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Halo, {profile?.full_name}! 👋</h1>
          <p className="text-stone-500">Berikut adalah ringkasan laporan bullying saat ini.</p>
        </div>
        {profile?.role === 'siswa' && (
          <Link 
            to="/app/reports/create"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <PlusCircle className="w-5 h-5" />
            Buat Laporan Baru
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl text-white", card.color)}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Statistik</span>
            </div>
            <div className="text-3xl font-bold text-stone-900">{card.value}</div>
            <div className="text-sm font-medium text-stone-500 mt-1">{card.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">Laporan Terbaru</h2>
            <Link 
              to={profile?.role === 'siswa' ? "/app/reports/history" : "/app/reports"}
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-stone-400 font-medium">Memuat data...</p>
              </div>
            ) : recentReports.length > 0 ? (
              <div className="divide-y divide-stone-100">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-stone-50 transition-colors flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        report.status === 'pending' ? "bg-amber-100 text-amber-600" :
                        report.status === 'diproses' ? "bg-primary/10 text-primary" :
                        "bg-green-100 text-green-600"
                      )}>
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 line-clamp-1">{report.description}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-stone-500 font-medium">
                          <span>📍 {report.location}</span>
                          <span>•</span>
                          <span>📅 {new Date(report.incident_date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            report.status === 'pending' ? "bg-amber-100 text-amber-700" :
                            report.status === 'diproses' ? "bg-primary/10 text-primary" :
                            "bg-green-100 text-green-700"
                          )}>
                            {report.status}
                          </span>
                          {report.is_anonymous && (
                            <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider">
                              Anonim
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link 
                      to={`/app/reports/${report.id}`}
                      className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-stone-200 transition-all"
                    >
                      <ArrowUpRight className="w-5 h-5 text-stone-400" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-stone-300" />
                </div>
                <h3 className="font-bold text-stone-900">Belum ada laporan</h3>
                <p className="text-stone-500 text-sm mt-1">Semua laporan yang masuk akan muncul di sini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-primary rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-2">Butuh Bantuan?</h3>
              <p className="text-primary-foreground/80 text-sm mb-6">
                Jika Anda merasa dalam bahaya segera hubungi guru piket atau petugas keamanan sekolah.
              </p>
              <button className="w-full bg-white text-primary py-3 rounded-xl font-bold hover:bg-stone-50 transition-all">
                Hubungi Guru BK
              </button>
            </div>
            <ShieldAlert className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
            <h3 className="font-bold text-stone-900 mb-4">Panduan Pelaporan</h3>
            <div className="space-y-4">
              {[
                { step: '01', text: 'Tulis deskripsi kejadian dengan jelas.' },
                { step: '02', text: 'Sebutkan lokasi dan waktu kejadian.' },
                { step: '03', text: 'Lampirkan bukti jika tersedia.' },
                { step: '04', text: 'Pilih opsi anonim jika ingin merahasiakan identitas.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-accent font-bold">{item.step}</span>
                  <p className="text-sm text-stone-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for cn
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
