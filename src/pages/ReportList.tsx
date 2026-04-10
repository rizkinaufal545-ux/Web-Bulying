import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Report, ReportStatus } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function ReportList() {
  const { profile } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');

  useEffect(() => {
    fetchReports();
  }, [profile, statusFilter]);

  const fetchReports = async () => {
    if (!profile) return;
    setLoading(true);

    let query = supabase
      .from('reports')
      .select('*, reporter:profiles(*)')
      .order('created_at', { ascending: false });

    if (profile.role === 'siswa') {
      query = query.eq('reporter_id', profile.id);
    }

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (!error && data) {
      setReports(data);
    }
    setLoading(false);
  };

  const updateStatus = async (reportId: string, newStatus: ReportStatus) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', reportId);

      if (error) throw error;
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredReports = reports.filter(report => 
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            {profile?.role === 'siswa' ? 'Riwayat Laporan Saya' : 'Daftar Laporan Bullying'}
          </h1>
          <p className="text-stone-500">
            {profile?.role === 'siswa' 
              ? 'Pantau status laporan yang telah Anda kirimkan.' 
              : 'Kelola dan tindak lanjuti laporan bullying dari siswa.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-white border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan deskripsi atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Table/List */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-stone-400 font-medium">Memuat data laporan...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Laporan</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Pelapor</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Waktu Kejadian</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          report.status === 'pending' ? "bg-amber-100 text-amber-600" :
                          report.status === 'diproses' ? "bg-primary/10 text-primary" :
                          "bg-green-100 text-green-600"
                        )}>
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 line-clamp-1">{report.description}</p>
                          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {report.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {report.is_anonymous ? (
                        <div className="flex items-center gap-2 text-stone-400 italic text-sm">
                          <EyeOff className="w-4 h-4" /> Anonim
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-stone-900 text-sm">{report.reporter?.full_name}</p>
                          <p className="text-xs text-stone-500">{report.reporter?.kelas}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-stone-700 font-medium">
                        {format(new Date(report.incident_date), 'dd MMM yyyy', { locale: id })}
                      </p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">
                        Dilaporkan: {format(new Date(report.created_at), 'dd/MM/yy HH:mm')}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        report.status === 'pending' ? "bg-amber-100 text-amber-700" :
                        report.status === 'diproses' ? "bg-primary/10 text-primary" :
                        "bg-green-100 text-green-700"
                      )}>
                        {report.status === 'pending' && <Clock className="w-3 h-3" />}
                        {report.status === 'diproses' && <AlertTriangle className="w-3 h-3" />}
                        {report.status === 'selesai' && <CheckCircle className="w-3 h-3" />}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {profile?.role !== 'siswa' && (
                          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => updateStatus(report.id, 'diproses')}
                              className={cn(
                                "p-1.5 rounded-md text-xs font-bold transition-all",
                                report.status === 'diproses' ? "bg-primary text-white shadow-sm" : "text-stone-500 hover:text-primary"
                              )}
                            >
                              Proses
                            </button>
                            <button 
                              onClick={() => updateStatus(report.id, 'selesai')}
                              className={cn(
                                "p-1.5 rounded-md text-xs font-bold transition-all",
                                report.status === 'selesai' ? "bg-green-600 text-white shadow-sm" : "text-stone-500 hover:text-green-600"
                              )}
                            >
                              Selesai
                            </button>
                          </div>
                        )}
                        <button className="p-2 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-900 transition-all">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-stone-200" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Tidak ada laporan ditemukan</h3>
            <p className="text-stone-500 mt-2 max-w-xs mx-auto">
              Coba ubah kata kunci pencarian atau filter status untuk melihat laporan lain.
            </p>
          </div>
        )}

        {/* Pagination Placeholder */}
        <div className="p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <p className="text-sm text-stone-500 font-medium">
            Menampilkan <span className="text-stone-900 font-bold">{filteredReports.length}</span> dari <span className="text-stone-900 font-bold">{reports.length}</span> laporan
          </p>
          <div className="flex items-center gap-2">
            <button disabled className="p-2 border border-stone-200 rounded-lg text-stone-400 disabled:opacity-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button disabled className="p-2 border border-stone-200 rounded-lg text-stone-400 disabled:opacity-50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons missing in imports
function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function EyeOff(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88 3.59 3.59" />
      <path d="M2 12s3-7 10-7a7.14 7.14 0 0 1 3.49.93" />
      <path d="M22 12s-3 7-10 7a6.78 6.78 0 0 1-3.91-1.24" />
      <path d="M15.08 15.08a3 3 0 0 1-4.16-4.16" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
