import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, LayoutDashboard, Database, DollarSign } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/uiStores';
import socket from '../../services/socket';

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const { unreadCount, addNotification } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.on('notification:new', (data) => {
        addNotification(data.notification);
      });
    }
    return () => socket.off('notification:new');
  }, [user]);

  const handleLogout = () => {
    clearAuth();
    socket.disconnect();
    navigate('/login');
  };

  return (
    <nav className="bg-surface/95 border-b border-white/10 h-16 flex items-center justify-between px-6 sticky top-0 z-[100] backdrop-blur-xl">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-syne font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">IdeaXchange</Link>
        <div className="hidden lg:flex items-center gap-2">
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/ledger', label: '⛓️ Ledger' },
            { to: '/scoring', label: '⚡ Scoring' },
            { to: '/governance', label: '🔐 Governance' },
            { to: '/discover', label: '🌐 Discover' },
            { to: '/funding', label: '💰 Funding' },
            { to: '/projects/new', label: '+ Submit' }
          ].map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                location.pathname === link.to ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-2 text-[10px] font-mono text-success font-bold">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          LIVE
        </div>

        <div className="relative group">
          <button className="w-10 h-10 bg-surface border border-white/10 rounded-xl flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/50 transition-all">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-none mb-1">{user?.name}</p>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest leading-none">{user?.department || user?.role}</p>
          </div>
          <div 
            onClick={handleLogout}
            className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center font-bold text-dark text-xs cursor-pointer hover:scale-105 transition-transform active:scale-95"
            title="Logout"
          >
            {user?.name?.split(' ').map(x => x[0]).join('') || '??'}
          </div>
        </div>
      </div>
    </nav>
  );
}
