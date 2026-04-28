import React from 'react';
import { Database, CheckCircle2, FileText, Lock, Users, ArrowDown, Shield } from 'lucide-react';

const blocks = [
  {
    index: 0,
    type: 'Genesis',
    author: 'Sudharsan J',
    time: '2025-03-01 · 09:14:22 UTC',
    hash: '000000a3f9b2c18e74d5f6a092b3e14c7d8f25a1b9e4c72f3d0a8b1c6e9f4d2a',
    delta: 'Initial submission: SmartRoute AI — Campus Micro-Transit. Tech stack declared: Node.js, React, TensorFlow.js, MongoDB, Socket.io. Problem statement locked and signed.',
    tags: ['🔒 First-to-File Proof', 'PDF Exportable'],
    isGenesis: true
  },
  {
    index: 1,
    type: 'Algorithm',
    author: 'Sudharsan J',
    time: '2025-03-03 · 14:37:09 UTC',
    hash: '7c4b8d2e1f9a3c5e7b0d4f6a8c2e4f1b3d5e7a9c1e3f5b7d9a1c3e5f7b9d1e3f',
    delta: 'Δ Core routing algorithm: Dijkstra variant with real-time IoT weight updates. 847 lines. Complexity O((V+E)log V). Unit tests: 94% coverage.',
    scores: { peer: 8.7, expert: 9.1, c: 1.0, adopt: 0.86, total: 74.8 }
  },
  {
    index: 2,
    type: 'UI/UX',
    author: 'Mamtha S',
    time: '2025-03-05 · 11:22:41 UTC',
    hash: '2a4c6e8f0b2d4f6a8c0e2f4b6d8a0c2e4f6b8d0a2c4e6f8b0d2a4c6e8f0b2d4f',
    delta: 'Δ Dashboard wireframes + Figma prototype. React component architecture. Real-time bus overlay via Leaflet.js. Mobile-first responsive grid system.',
    scores: { peer: 7.2, expert: 7.8, c: 0.6, adopt: 0.72, total: 31.1 }
  },
  {
    index: 3,
    type: 'TSS',
    author: 'TSS Quorum Event',
    time: '2025-03-07 · 16:05:18 UTC',
    hash: 'f1e3d5b7a9c1e3f5b7d9a1c3e5f7b9d1e3f5b7d9a1c3e5f7b9d1e3f5b7d9a1c3',
    delta: 'State transition: SUBMITTED → COLLABORATING. k=2/2 original authors signed. Sudharsan J ✓ · Mamtha S ✓. Gnanavel S granted collaborator access.',
    tags: ['🔐 TSS Protected', 'Quorum Verified', 'Immutable'],
    isSpecial: true
  }
];

export default function Ledger() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="ph">
        <h1 className="text-3xl font-syne font-extrabold flex items-center gap-3">
          <Database className="text-primary" /> JSON-Chain Ledger
        </h1>
        <p className="text-gray-400 mt-1">SmartRoute AI · 14 blocks · SHA-256 anchored · Raft consensus cluster</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-white/10 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Chain ID</p>
              <code className="text-xs text-primary bg-primary/5 px-2 py-1 rounded">0x3f7a…c82e</code>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-success text-xs font-bold">
                <CheckCircle2 size={16} /> Chain Intact
              </div>
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:border-primary/30 transition-all flex items-center gap-2">
                <FileText size={14} /> Export Audit
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {blocks.map((block, i) => (
              <div key={i} className="relative">
                {i < blocks.length - 1 && (
                  <div className="absolute left-[26px] bottom-[-24px] w-[1px] h-6 bg-gradient-to-b from-primary/40 to-transparent z-10" />
                )}
                
                <div className={`bg-surface border ${block.isSpecial ? 'border-danger/30' : 'border-white/10'} rounded-3xl p-6 hover:bg-surface-lighter transition-all group`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-[10px] ${
                      block.isGenesis ? 'bg-secondary/20 border border-secondary/40 text-secondary' : 
                      block.isSpecial ? 'bg-danger/20 border border-danger/40 text-danger' : 
                      'bg-primary/10 border border-primary/30 text-primary'
                    }`}>
                      B{block.index}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-sm ${block.isSpecial ? 'text-danger' : 'text-white'}`}>{block.author}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          block.type === 'Genesis' ? 'bg-secondary/10 border-secondary/30 text-secondary' :
                          block.type === 'TSS' ? 'bg-danger/10 border-danger/30 text-danger' :
                          'bg-primary/10 border-primary/30 text-primary'
                        }`}>
                          {block.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">{block.time}</p>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-[10px] text-gray-500 break-all mb-4">
                    <span className="text-primary">SHA-256:</span> {block.hash}
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">{block.delta}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {block.tags?.map((tag, j) => (
                      <span key={j} className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-gray-400">
                        {tag}
                      </span>
                    ))}
                    {block.scores && (
                      <div className="flex items-center gap-2">
                        {['peer', 'expert'].map(s => (
                          <span key={s} className="text-[10px] bg-secondary/10 border border-secondary/20 rounded-lg px-2 py-1 text-secondary uppercase font-bold">
                            {s}: {block.scores[s]}
                          </span>
                        ))}
                        <span className="text-[10px] text-success font-mono font-bold">SCORE: {block.scores.total}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-white/10 rounded-3xl p-6">
            <h3 className="font-syne font-bold text-sm mb-4 flex items-center gap-2">
              <Shield size={16} className="text-primary" /> Chain Integrity
            </h3>
            <div className="space-y-3">
              {[
                { k: 'Total Blocks', v: '14' },
                { k: 'Hash Verified', v: '14/14 ✓', s: 'text-success' },
                { k: 'Tamper Detected', v: 'None ✓', s: 'text-success' },
                { k: 'TSS Events', v: '2', s: 'text-danger' },
                { k: 'Consensus', v: 'Raft 3/3 ✓', s: 'text-success' }
              ].map(item => (
                <div key={item.k} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0">
                  <span className="text-gray-500 uppercase tracking-widest font-bold text-[9px]">{item.k}</span>
                  <span className={`font-mono ${item.s || ''}`}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-white/10 rounded-3xl p-6">
            <h3 className="font-syne font-bold text-sm mb-4 flex items-center gap-2">
              <Lock size={16} className="text-primary" /> First-to-File
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Genesis timestamp = cryptographic IP priority. Includes submitter ID, UTC timestamp, SHA-256 hash + platform signing key.
            </p>
            <button className="w-full py-3 bg-primary/10 border border-primary/20 rounded-xl font-bold text-primary text-xs hover:bg-primary/20 transition-all">
              Export Signed PDF Receipt
            </button>
          </div>

          <div className="bg-surface border border-white/10 rounded-3xl p-6">
            <h3 className="font-syne font-bold text-sm mb-4 flex items-center gap-2">
              <Users size={16} className="text-primary" /> Contributors (3)
            </h3>
            <div className="space-y-4">
              {[
                { n: 'Sudharsan J', r: 'Owner', b: 6, c: 'bg-primary' },
                { n: 'Mamtha S', r: 'Collab', b: 5, c: 'bg-danger' },
                { n: 'Gnanavel S', r: 'Collab', b: 3, c: 'bg-warning' }
              ].map(u => (
                <div key={u.n} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${u.c} flex items-center justify-center font-bold text-dark`}>
                    {u.n.split(' ').map(x => x[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{u.n}</p>
                    <p className="text-[10px] text-gray-500">{u.b} blocks · {u.r}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
