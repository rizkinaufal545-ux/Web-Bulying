import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Users, FileText, CheckCircle, ArrowRight, BookOpen, Monitor, Play } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-primary">SMK Prima Unggul</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#tentang" className="text-stone-600 hover:text-primary transition-colors font-medium">Tentang</a>
              <a href="#profil" className="text-stone-600 hover:text-primary transition-colors font-medium">Profil Sekolah</a>
              <Link 
                to="/login" 
                className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Masuk ke Aplikasi
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">Stop Bullying Sekarang</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-stone-900 leading-tight mb-6">
                Lingkungan Sekolah <span className="text-primary">Aman & Nyaman</span> Untuk Semua
              </h1>
              <p className="text-lg text-stone-600 mb-8 max-w-lg leading-relaxed">
                Platform resmi SMK Prima Unggul untuk melaporkan tindakan bullying secara aman, cepat, dan rahasia. Mari bersama ciptakan sekolah tanpa kekerasan.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/login" 
                  className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group"
                >
                  Buat Laporan <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#tentang" 
                  className="bg-white text-stone-900 border border-stone-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-stone-50 transition-all"
                >
                  Pelajari Lebih Lanjut
                </a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <img 
                src="https://picsum.photos/seed/school/800/600" 
                alt="Students collaborating" 
                className="rounded-3xl shadow-2xl relative z-10 border-8 border-white"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-1">100%</div>
              <div className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider">Kerahasiaan</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">24/7</div>
              <div className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider">Layanan Lapor</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">3+</div>
              <div className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider">Jurusan Unggulan</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">Aktif</div>
              <div className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider">Pendampingan BK</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Bullying */}
      <section id="tentang" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Edukasi</h2>
            <h3 className="text-4xl font-bold text-stone-900 mb-6">Apa itu Bullying?</h3>
            <p className="text-stone-600 leading-relaxed">
              Bullying adalah perilaku tidak menyenangkan baik secara verbal, fisik, ataupun sosial di dunia nyata maupun dunia maya yang membuat seseorang merasa tidak nyaman, sakit hati dan tertekan baik dilakukan oleh perorangan ataupun kelompok.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Bullying Fisik', 
                desc: 'Tindakan memukul, menendang, atau merusak barang milik orang lain.',
                icon: <Users className="w-8 h-8" />
              },
              { 
                title: 'Bullying Verbal', 
                desc: 'Menghina, mengejek, atau menyebarkan rumor yang tidak benar.',
                icon: <FileText className="w-8 h-8" />
              },
              { 
                title: 'Cyber Bullying', 
                desc: 'Tindakan intimidasi melalui media sosial atau platform digital.',
                icon: <Monitor className="w-8 h-8" />
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-primary/20 transition-all"
              >
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-stone-900 mb-3">{item.title}</h4>
                <p className="text-stone-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* School Profile */}
      <section id="profil" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Profil Sekolah</h2>
              <h3 className="text-4xl font-bold text-stone-900 mb-6">SMK Prima Unggul</h3>
              <p className="text-stone-600 mb-8 leading-relaxed">
                SMK Prima Unggul adalah lembaga pendidikan kejuruan yang berfokus pada pengembangan talenta di bidang teknologi dan kreatif. Kami berkomitmen menciptakan lulusan yang kompeten dan berkarakter.
              </p>
              <div className="space-y-6">
                {[
                  { name: 'Teknik Komputer & Jaringan (TKJ)', icon: <Monitor className="w-6 h-6" /> },
                  { name: 'Rekayasa Perangkat Lunak (RPL)', icon: <Play className="w-6 h-6" /> },
                  { name: 'Multimedia', icon: <BookOpen className="w-6 h-6" /> }
                ].map((jurusan, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-200 shadow-sm">
                    <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
                      {jurusan.icon}
                    </div>
                    <span className="font-bold text-stone-800">{jurusan.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://picsum.photos/seed/tkj/400/500" alt="TKJ" className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
              <div className="space-y-4">
                <img src="https://picsum.photos/seed/rpl/400/240" alt="RPL" className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/mm/400/240" alt="Multimedia" className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="text-primary w-8 h-8" />
              <span className="font-bold text-2xl tracking-tight">SMK Prima Unggul</span>
            </div>
            <div className="flex gap-8 text-stone-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-white transition-colors">Kontak Kami</a>
            </div>
            <div className="text-stone-500 text-sm">
              &copy; 2026 SMK Prima Unggul. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
