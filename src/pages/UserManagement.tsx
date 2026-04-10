import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Shield, 
  GraduationCap, 
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile, UserRole } from '../types';
import { cn } from '../lib/utils';

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');
    
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nis?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manajemen User</h1>
          <p className="text-stone-500">Kelola data admin, guru, dan siswa yang terdaftar di sistem.</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus className="w-5 h-5" />
          Tambah User Baru
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Cari nama atau NIS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        />
      </div>

      {/* User Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-stone-400 font-medium">Memuat data user...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Identitas (NIS/NIP)</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Kelas</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 font-bold">
                          {user.full_name.charAt(0)}
                        </div>
                        <span className="font-bold text-stone-900">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        user.role === 'admin' ? "bg-purple-100 text-purple-700" :
                        user.role === 'guru' ? "bg-blue-100 text-blue-700" :
                        "bg-stone-100 text-stone-700"
                      )}>
                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                        {user.role === 'guru' && <UserIcon className="w-3 h-3" />}
                        {user.role === 'siswa' && <GraduationCap className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-stone-600 font-medium">
                      {user.nis || '-'}
                    </td>
                    <td className="px-6 py-5 text-sm text-stone-600 font-medium">
                      {user.kelas || '-'}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingUser(user);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-primary transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-red-50 rounded-xl text-stone-400 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-stone-900">
                {editingUser ? 'Edit User' : 'Tambah User Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
                <X className="w-6 h-6 text-stone-400" />
              </button>
            </div>
            <div className="p-8">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>Catatan:</strong> Untuk menambah user baru, pastikan user tersebut sudah terdaftar di <strong>Supabase Authentication</strong> terlebih dahulu. Form ini hanya untuk mengelola profil dan role di database.
                </p>
              </div>
              
              <form className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    defaultValue={editingUser?.full_name}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 uppercase ml-1">Role</label>
                    <select 
                      defaultValue={editingUser?.role || 'siswa'}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option value="siswa">Siswa</option>
                      <option value="guru">Guru / BK</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 uppercase ml-1">NIS / NIP</label>
                    <input 
                      type="text" 
                      defaultValue={editingUser?.nis}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase ml-1">Kelas (Opsional)</label>
                  <input 
                    type="text" 
                    defaultValue={editingUser?.kelas}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Contoh: XII RPL 2"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold mt-4 shadow-lg shadow-primary/20"
                >
                  Simpan Perubahan
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
