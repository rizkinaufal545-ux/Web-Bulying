import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  GraduationCap, 
  BarChart3, 
  LogOut, 
  Shield, 
  Menu, 
  X,
  PlusCircle,
  History
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { 
      title: 'Dashboard', 
      path: '/app', 
      icon: LayoutDashboard, 
      roles: ['admin', 'guru', 'siswa'] 
    },
    { 
      title: 'Laporan Bullying', 
      path: '/app/reports', 
      icon: FileText, 
      roles: ['admin', 'guru'] 
    },
    { 
      title: 'Buat Laporan', 
      path: '/app/reports/create', 
      icon: PlusCircle, 
      roles: ['siswa'] 
    },
    { 
      title: 'Riwayat Laporan', 
      path: '/app/reports/history', 
      icon: History, 
      roles: ['siswa'] 
    },
    { 
      title: 'Manajemen User', 
      path: '/app/users', 
      icon: Users, 
      roles: ['admin'] 
    },
    { 
      title: 'Data Siswa', 
      path: '/app/students', 
      icon: GraduationCap, 
      roles: ['admin'] 
    },
    { 
      title: 'Rekap Laporan', 
      path: '/app/summary', 
      icon: BarChart3, 
      roles: ['admin', 'guru'] 
    },
  ];

  const filteredMenu = menuItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-stone-200 sticky top-0 h-screen">
        <div className="p-6 border-b border-stone-100">
          <Link to="/app" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-stone-900 leading-none">Prima Unggul</h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-accent mt-1">Anti-Bullying</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-stone-400 group-hover:text-primary")} />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="bg-stone-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 text-accent rounded-full flex items-center justify-center font-bold">
                {profile?.full_name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-stone-900 truncate">{profile?.full_name}</p>
                <p className="text-xs text-stone-500 capitalize">{profile?.role}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Mobile Sidebar Content (similar to desktop) */}
              <div className="p-6 flex justify-between items-center border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <Shield className="text-primary w-8 h-8" />
                  <span className="font-bold text-stone-900">Prima Unggul</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-stone-400" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {filteredMenu.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl font-medium",
                      location.pathname === item.path ? "bg-primary text-white" : "text-stone-500"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-stone-100">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 text-stone-500"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 lg:flex-none">
            <h2 className="font-bold text-stone-900 lg:text-lg">
              {menuItems.find(i => i.path === location.pathname)?.title || 'Aplikasi'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-stone-900">{profile?.full_name}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-accent">{profile?.role}</span>
            </div>
            <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 font-bold border border-stone-200">
              {profile?.full_name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
