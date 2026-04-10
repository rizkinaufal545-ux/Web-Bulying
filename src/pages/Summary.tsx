import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  CheckCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function Summary() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for visualization since we might not have enough real data
    const mockData = [
      { name: 'Jan', total: 4, selesai: 2 },
      { name: 'Feb', total: 7, selesai: 5 },
      { name: 'Mar', total: 5, selesai: 4 },
      { name: 'Apr', total: 8, selesai: 3 },
    ];
    setData(mockData);
    setLoading(false);
  }, []);

  const COLORS = ['#B91C1C', '#EAB308', '#16A34A', '#2563EB'];

  const statusData = [
    { name: 'Menunggu', value: 3 },
    { name: 'Diproses', value: 5 },
    { name: 'Selesai', value: 12 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Rekap Laporan Bullying</h1>
          <p className="text-stone-500">Analisis data dan statistik laporan bullying SMK Prima Unggul.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-600 font-bold hover:bg-stone-50 transition-all">
            <Calendar className="w-4 h-4" />
            Bulan Ini
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" />
            Ekspor PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Tingkat Penyelesaian', value: '85%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Rata-rata Respon', value: '2.4 Hari', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Total Kasus Aktif', value: '8', icon: ShieldAlert, color: 'text-primary', bg: 'bg-primary/5' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", item.bg, item.color)}>
              <item.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-500">{item.title}</p>
              <p className="text-2xl font-bold text-stone-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <h3 className="font-bold text-stone-900 mb-6">Tren Laporan Bulanan</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#B91C1C" radius={[4, 4, 0, 0]} name="Total Laporan" />
                <Bar dataKey="selesai" fill="#16A34A" radius={[4, 4, 0, 0]} name="Selesai" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <h3 className="font-bold text-stone-900 mb-6">Distribusi Status Laporan</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-stone-900">20</span>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Locations */}
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
        <h3 className="font-bold text-stone-900 mb-6">Lokasi Kejadian Terbanyak</h3>
        <div className="space-y-4">
          {[
            { location: 'Kantin Sekolah', count: 8, percentage: 40 },
            { location: 'Lapangan Basket', count: 5, percentage: 25 },
            { location: 'Belakang Kelas XII', count: 4, percentage: 20 },
            { location: 'Toilet Siswa', count: 3, percentage: 15 },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-stone-700">{item.location}</span>
                <span className="text-stone-900">{item.count} Laporan</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
