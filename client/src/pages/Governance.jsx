import React from 'react';
import { Shield, Key, Lock, Zap, Info, FileSearch } from 'lucide-react';

export default function Governance() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="ph">
        <h1 className="text-3xl font-syne font-extrabold flex items-center gap-3">
          <Shield className="text-primary" /> TSS Governance
        </h1>
        <p className="text-gray-400 mt-1">Threshold Signature Scheme · Multi-party authorization · Anti-hijack</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-primary" size={20} />
            <h2 className="font-syne font-bold text-lg">Quorum Formula</h2>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
            <code className="text-2xl font-mono text-primary">k = ⌈n/2⌉ + 1</code>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            For <span className="text-white font-bold">n = 5 authors</span> → <span className="text-primary font-bold">k = 4</span> signatures required. No single contributor can unilaterally modify critical project properties. Each author holds a cryptographic key share.
          </p>
          
          <div className="space-y-4 pt-4">
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Live Quorum — GreenCampus → CERTIFIED transition</h4>
            <div className="flex flex-wrap gap-6 justify-center">
              {[
                { n: 'SJ', s: 'signed', status: '✓' },
                { n: 'MS', s: 'signed', status: '✓' },
                { n: 'GS', s: 'signed', status: '✓' },
                { n: 'KR', s: 'signed', status: '✓' },
                { n: 'JV', s: 'pending', status: '⏳' }
              ].map(u => (
                <div key={u.n} className="flex flex-col items-center gap-3 group">
                  <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${
                    u.s === 'signed' ? 'border-success bg-success/10 shadow-[0_0_12px_rgba(52,211,153,0.2)]' : 'border-white/10 text-gray-600'
                  }`}>
                    {u.s === 'signed' ? <Key size={20} className="text-success" /> : <Lock size={20} />}
                  </div>
                  <div className={`text-[10px] font-mono font-bold ${u.s === 'signed' ? 'text-success' : 'text-gray-600'}`}>
                    {u.n} {u.status}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center pt-4">
              <span className="text-success text-xs font-bold bg-success/10 px-4 py-2 rounded-full border border-success/20">
                ✅ Quorum reached (4/5) — Transition authorized
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-primary" size={20} />
            <h2 className="font-syne font-bold text-lg">TSS-Protected Events</h2>
          </div>
          <div className="space-y-4">
            {[
              { t: 'Change declared core problem statement', s: 'majority re-sign required' },
              { t: 'Add stakeholder with equity rights', s: 'all original authors must approve' },
              { t: 'Transition to CERTIFIED state', s: 'quorum + impact score threshold exceeded' },
              { t: 'Initiate formal IP dispute', s: 'k signatures + admin notification' },
              { t: 'Transfer project ownership', s: 'unanimous required; pending update' },
              { t: 'Fork a project branch', s: 'owner-granted access, recorded in ledger' }
            ].map((ev, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-black/20 rounded-2xl border border-white/5 hover:bg-black/30 transition-all group">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 group-hover:scale-150 transition-transform" />
                <div>
                  <p className="text-sm font-bold text-gray-200">{ev.t}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">{ev.s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-white/10 rounded-3xl p-8 overflow-x-auto">
        <h3 className="font-syne font-bold text-sm mb-8 flex items-center gap-2 uppercase tracking-widest text-gray-500">
          <Zap size={16} /> Governed State Machine — Server-Side Enforced
        </h3>
        <div className="flex items-center min-w-[700px] gap-4">
          {[
            { n: 'Submitted', c: 'bg-warning/20 border-warning/40 text-warning', d: 'Owner completes problem stmt + declares stack.' },
            { n: 'Collaborating', c: 'bg-primary/20 border-primary/40 text-primary', d: 'Owner-granted access. ≥1 collaborator.' },
            { n: 'Validating', c: 'bg-secondary/20 border-secondary/40 text-secondary', d: '≥3 distinct verified authors contributed.' },
            { n: 'Certified', c: 'bg-success/20 border-success/40 text-success', d: 'Impact score ≥ threshold. Public funding.' }
          ].map((st, i) => (
            <React.Fragment key={st.n}>
              <div className="flex-1 text-center group">
                <div className={`py-4 rounded-2xl border-2 font-mono text-xs font-bold uppercase tracking-widest mb-4 transition-all group-hover:scale-105 ${st.c}`}>
                  {st.n}
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed px-2">{st.d}</p>
              </div>
              {i < 3 && <div className="text-white/10 font-bold mb-12">→</div>}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-12 p-4 bg-danger/5 border border-danger/20 rounded-2xl flex items-center gap-4 text-danger/80">
          <Info size={20} className="shrink-0" />
          <p className="text-xs leading-relaxed">
            All state transitions enforced server-side and logged as immutable ledger blocks. Client-side manipulation is architecturally impossible — transitions validated by Express.js middleware before any database write.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { t: 'Anti-Sybil', d: 'Institutional SSO verified. One student, one account. 0 successful attacks in 8-week pilot.' },
          { t: 'Forensic Traceability', d: 'Full audit trail: every action is a cryptographically linked block with SHA-256 anchors.' },
          { t: 'Fault Tolerance', d: '3-node Raft consensus cluster. Node failures tolerated. Writes confirmed by majority.' },
          { t: 'Collusion Detection', d: 'Friend-group upvotes clusters automatically down-weighted to align with independent experts.' }
        ].map(card => (
          <div key={card.t} className="bg-surface border border-white/10 rounded-3xl p-6 hover:bg-surface-lighter transition-all">
            <h4 className="text-sm font-syne font-bold mb-3">{card.t}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{card.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
