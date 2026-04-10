import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Send, 
  MapPin, 
  Calendar, 
  Image as ImageIcon, 
  AlertCircle, 
  Loader2,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function CreateReport() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    incident_date: new Date().toISOString().split('T')[0],
    is_anonymous: false,
    evidence_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('reports').insert({
        reporter_id: formData.is_anonymous ? null : profile.id,
        description: formData.description,
        location: formData.location,
        incident_date: formData.incident_date,
        evidence_url: formData.evidence_url || null,
        is_anonymous: formData.is_anonymous,
        status: 'pending'
      });

      if (error) throw error;
      navigate('/app/reports/history');
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Buat Laporan Bullying</h1>
        <p className="text-stone-500">Sampaikan kejadian yang Anda alami atau lihat dengan jujur dan detail.</p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-primary/5 border-b border-stone-100 flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-sm text-stone-600 leading-relaxed">
            Laporan Anda akan ditinjau oleh tim Guru BK. Kami menjamin kerahasiaan identitas Anda jika Anda memilih opsi <strong>Anonim</strong>.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Identity Toggle */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                formData.is_anonymous ? "bg-stone-200 text-stone-600" : "bg-primary/10 text-primary"
              )}>
                {formData.is_anonymous ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-stone-900 text-sm">
                  {formData.is_anonymous ? 'Lapor Sebagai Anonim' : 'Lapor Dengan Identitas'}
                </p>
                <p className="text-xs text-stone-500">
                  {formData.is_anonymous ? 'Nama Anda tidak akan terlihat oleh siapapun.' : `Melaporkan sebagai: ${profile?.full_name}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, is_anonymous: !prev.is_anonymous }))}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                formData.is_anonymous ? "bg-primary" : "bg-stone-200"
              )}
            >
              <span className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                formData.is_anonymous ? "translate-x-5" : "translate-x-0"
              )} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Deskripsi Kejadian</label>
              <textarea 
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-stone-400 resize-none"
                placeholder="Ceritakan apa yang terjadi secara detail..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Lokasi Kejadian</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                  <input 
                    type="text" 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-stone-400"
                    placeholder="Contoh: Kantin, Kelas X RPL 1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Tanggal Kejadian</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                  <input 
                    type="date" 
                    required
                    value={formData.incident_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, incident_date: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 ml-1">Bukti Foto (Link URL)</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input 
                  type="url" 
                  value={formData.evidence_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, evidence_url: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-stone-400"
                  placeholder="https://link-foto-bukti.com"
                />
              </div>
              <p className="text-[10px] text-stone-400 ml-1 italic">*Opsional. Anda bisa mengunggah foto ke layanan hosting gambar dan menempelkan linknya di sini.</p>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Kirim Laporan <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
