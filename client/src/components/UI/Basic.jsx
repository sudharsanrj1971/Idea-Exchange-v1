import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ role }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

export function StateBadge({ state }) {
  const styles = {
    SUBMITTED: 'bg-primary/10 text-primary border-primary/20',
    COLLABORATING: 'bg-secondary/10 text-secondary border-secondary/20',
    VALIDATING: 'bg-warning/10 text-warning border-warning/20',
    CERTIFIED: 'bg-success/10 text-success border-success/20',
  };

  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-[0.2em] shadow-sm backdrop-blur-md ${styles[state] || ''}`}>
      ● {state}
    </span>
  );
}

export function ScoreGauge({ score = 0 }) {
  const color = score >= 8 ? '#00e5ff' : score >= 6 ? '#4f8ef7' : score >= 4 ? '#f59e0b' : '#ef4444';
  const percentage = (score / 10) * 100;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center group">
      <div className="absolute inset-0 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
      <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
        <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5"/>
        <circle 
          cx="40" cy="40" r={radius} 
          stroke={color} strokeWidth="4" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-syne font-black text-white leading-none">{score.toFixed(1)}</span>
        <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest mt-1">PIS</span>
      </div>
    </div>
  );
}
