import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Silakan periksa email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(185,28,28,0.05),transparent_50%)]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Shield className="text-white w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-stone-900">Selamat Datang</h1>
          <p className="text-stone-500 mt-2">Masuk ke Sistem Laporan Bullying SMK Prima Unggul</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Email Sekolah</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-stone-400"
                  placeholder="nama@smkprimaunggul.sch.id"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-stone-700">Kata Sandi</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Lupa sandi?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-stone-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Masuk Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-stone-500 text-sm">
              Belum punya akun? <span className="text-stone-900 font-bold">Hubungi Admin/BK</span>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-stone-400 text-xs uppercase tracking-widest font-bold">
          &copy; 2026 SMK Prima Unggul
        </p>
      </motion.div>
    </div>
  );
}
