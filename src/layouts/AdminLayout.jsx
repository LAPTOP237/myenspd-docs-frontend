import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { 
  Home, User, FileText, CheckCircle, LogOut, Menu, X, ChevronDown, Search 
} from 'lucide-react';

const adminMenuItems = [
  { path: '/dashboard/admin', icon: Home, label: 'Accueil', exact: true },
  { path: '/dashboard/admin/users', icon: User, label: 'Utilisateurs' },
  { path: '/dashboard/admin/requests', icon: FileText, label: 'Demandes' },
  { path: '/dashboard/admin/templates', icon: CheckCircle, label: 'Templates' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Overlay mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">MyENSPD</h1>
                  <p className="text-xs text-gray-500">Docs</p>
                </div>
              </div>
              <button 
                className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
    


        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {adminMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive ? 'bg-primary text-white shadow-soft' : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error-light transition-all">
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur, demande ou template..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-gray-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <NavLink
                    to="/dashboard/admin/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    <span>Mon Profil</span>
                  </NavLink>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-error hover:bg-error-light">
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
