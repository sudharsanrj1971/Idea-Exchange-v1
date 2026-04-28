import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Database, Lock, Cpu, BarChart3 } from 'lucide-react';
import GoogleButton from '../components/UI/GoogleButton';

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-drift"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-drift" style={{ animationDelay: '-6s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-[460px]">
        <div className="bg-surface/90 border border-white/10 rounded-[32px] p-10 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-2xl shadow-[0_0_24px_rgba(0,229,255,0.25)]">
              💡
            </div>
            <div>
              <h1 className="text-2xl font-syne font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">IdeaXchange</h1>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-0.5">Decentralized Micro-Contribution Ledger</p>
            </div>
          </div>

          <h2 className="text-3xl font-syne font-extrabold text-white mb-2 leading-tight tracking-tight">Secure Student Innovation</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Every micro-contribution cryptographically anchored, timestamped, and non-repudiable. Your ideas, provably yours.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { icon: Shield, label: 'SHA-256' },
              { icon: Database, label: 'JSON-Chain' },
              { icon: Lock, label: 'TSS Governed' },
              { icon: BarChart3, label: 'Anti-Sybil' }
            ].map((tag, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-[10px] font-mono font-bold text-primary">
                <tag.icon size={12} /> {tag.label}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <GoogleButton mode="signin" />
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest leading-none"><span className="bg-surface px-2 text-gray-600">or institutional login</span></div>
            </div>

            <Link to="/login" className="block w-full py-4 bg-transparent border border-primary/30 rounded-2xl text-primary font-bold text-sm text-center hover:bg-primary/5 transition-all shadow-[0_0_20px_rgba(0,229,255,0.1)]">
              🏫 Institutional SSO / LDAP
            </Link>
          </div>

          <p className="mt-8 text-center text-[10px] text-gray-500 leading-relaxed">
            Secured by institutional identity — one verified student, one account.<br />
            <Link to="/about" className="text-primary hover:underline font-bold mt-1 inline-block">Read about our cryptographic attribution model →</Link>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-0 bg-surface/70 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          {[
            { v: '288%', l: 'Collab ↑' },
            { v: '80%', l: 'Dropout ↓' },
            { v: '92.4%', l: 'Attribution' },
            { v: '100%', l: 'Disputes ✓' }
          ].map((stat, i) => (
            <div key={i} className="text-center py-4 border-r border-white/10 last:border-0">
              <div className="text-lg font-syne font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.v}</div>
              <div className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter mt-0.5">{stat.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
