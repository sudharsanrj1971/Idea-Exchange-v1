import React, { useState, useEffect } from 'react';
import { Zap, Calculator, Sparkles, TrendingUp, Award, AlertCircle, Loader2 } from 'lucide-react';
import { scoringApi } from '../services/all.api';
import ReactMarkdown from 'react-markdown';

export default function Scoring() {
  const [sim, setSim] = useState({ pv: 7, er: 8, cc: 1.0, ar: 0.75 });
  const [totalScore, setTotalScore] = useState(0);
  const [aiText, setAiText] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const s = ((sim.pv * 0.6) + (sim.er * 0.4)) * (sim.cc * sim.ar);
    setTotalScore(s);
  }, [sim]);

  const handleAiAnalyze = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const res = await scoringApi.analyzeContribution(aiText);
      setAiResult(res.data.data.analysis);
    } catch (err) {
      setAiResult('⚠️ AI analysis failed. Please check your connection or try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  const getGrade = (s) => {
    if (s >= 8) return { label: 'A · Excellent', desc: 'Adoption highly likely', color: 'text-success' };
    if (s >= 6) return { label: 'B+ · Good', desc: 'Refine for expert review', color: 'text-primary' };
    if (s >= 4) return { label: 'B · Moderate', desc: 'Increase adoption rate', color: 'text-warning' };
    return { label: 'C · Weak', desc: 'Needs significant improvement', color: 'text-danger' };
  };

  const grade = getGrade(totalScore);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="ph">
        <h1 className="text-3xl font-syne font-extrabold flex items-center gap-3">
          <Zap className="text-primary" /> Quality × Impact Scoring
        </h1>
        <p className="text-gray-400 mt-1">Merit-based · Anti-gaming · Transparent algorithm · AI-powered analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Calculator className="text-primary" size={20} />
            <h2 className="font-syne font-bold text-lg">The Algorithm</h2>
          </div>
          
          <div className="bg-black/60 border border-primary/20 rounded-2xl p-6 font-mono text-xs text-primary leading-relaxed">
            <p>TotalScore =</p>
            <p className="pl-4">[(Peer_Upvotes × 0.6)</p>
            <p className="pl-4">+ (Expert_Rating × 0.4)]</p>
            <p className="pl-4">× (DiffSize_C × AdoptionRate)</p>
            <br />
            <p>PIS = Σ(TotalScore_i × TimeDecay_i)</p>
            <p className="pl-8">/ ProjectAgeInWeeks</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Complexity Coefficients (C)</h4>
            {[
              { t: 'Core Algorithm / Architecture', v: '1.00' },
              { t: 'Market Research / Feasibility', v: '0.80' },
              { t: 'UI/UX Prototype / Wireframe', v: '0.60' },
              { t: 'Documentation / Process Spec', v: '0.40' }
            ].map(row => (
              <div key={row.t} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-xs">
                <span className="text-gray-300">{row.t}</span>
                <span className="font-mono text-primary font-bold">{row.v}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-4">
            <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Anti-gaming: Expert reviews weighted at <b className="text-primary">0.4</b>, peer at <b className="text-primary">0.6</b>. Same-cohort votes penalized <b className="text-danger">0.85×</b>. Scores normalized at project level.
            </p>
          </div>
        </div>

        <div className="bg-surface border border-white/10 rounded-3xl p-8 space-y-8">
          <div className="flex items-center gap-3">
            <Sparkles className="text-primary" size={20} />
            <h2 className="font-syne font-bold text-lg">Score Simulator</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-400">Peer Upvotes (0–10)</span>
                <span className="font-mono text-primary">{sim.pv.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.1" value={sim.pv} 
                onChange={(e) => setSim({...sim, pv: parseFloat(e.target.value)})}
                className="w-full accent-primary h-1 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-400">Expert Rating (0–10)</span>
                <span className="font-mono text-primary">{sim.er.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.1" value={sim.er} 
                onChange={(e) => setSim({...sim, er: parseFloat(e.target.value)})}
                className="w-full accent-primary h-1 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-400">Complexity Coefficient</span>
                <span className="font-mono text-primary">{sim.cc.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1.0, 0.8, 0.6, 0.4].map(v => (
                  <button 
                    key={v} onClick={() => setSim({...sim, cc: v})}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                      sim.cc === v ? 'bg-primary border-primary text-dark' : 'bg-white/5 border-white/10 text-gray-500 hover:border-primary/50'
                    }`}
                  >
                    {v.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-400">Adoption Rate (0–100%)</span>
                <span className="font-mono text-primary">{(sim.ar * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="1" value={sim.ar * 100} 
                onChange={(e) => setSim({...sim, ar: parseFloat(e.target.value) / 100})}
                className="w-full accent-primary h-1 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-3xl p-8 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Estimated TotalScore</p>
            <div className="text-6xl font-syne font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {totalScore.toFixed(1)}
            </div>
            <div className={`mt-4 font-bold text-sm ${grade.color}`}>
              {grade.label}
            </div>
            <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">
              {grade.desc}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="bg-surface border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-secondary" size={20} />
            <h2 className="font-syne font-bold text-lg">AI Contribution Analyser</h2>
          </div>
          <div className="space-y-4">
            <textarea 
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-gray-300 focus:border-secondary/50 outline-none min-h-[120px] transition-all"
              placeholder="Paste your contribution description here and let the AI analyse its quality, complexity... (e.g. Optimized the Dijkstra algorithm for micro-routing with real-time weights from IoT sensors)"
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
            />
            <button 
              onClick={handleAiAnalyze}
              disabled={aiLoading || !aiText.trim()}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl text-dark font-syne font-black uppercase tracking-widest text-xs hover:scale-[1.01] transition-all active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
            >
              {aiLoading ? <Loader2 className="animate-spin inline mr-2" size={18} /> : '🤖 AI Contribution Analysis'}
            </button>
            
            {aiResult && (
              <div className="bg-surface-lighter border border-white/10 rounded-2xl p-6 mt-4 animate-in fade-in duration-500 overflow-hidden prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{aiResult}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-white/10 rounded-3xl p-8">
        <h3 className="font-syne font-bold text-lg mb-8 flex items-center gap-3">
          <Award className="text-primary" /> Reputation Points (RP) System
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {[
            { pts: '+15', title: 'Contribution Adopted by ≥2 Contributors', desc: 'Signals lasting technical value and direction impact.' },
            { pts: '+8', title: 'Peer Review Rated "Substantive"', desc: 'Validates quality of feedback, not just volume.' },
            { pts: '+20', title: 'Expert Validation Aligns with Community', desc: 'Highest signal of contribution quality and trust.' },
            { pts: '+12', title: 'Conflict Resolved via Dispute Mechanism', desc: 'Rewards collaborative over abandonment behaviors.' },
            { pts: '-5', title: 'Cohort-Bias Detected', desc: 'Friend-group upvote cluster detected, auto-penalty applied.', neg: true },
            { pts: '+5', title: 'Contribution Triggers State Transition', desc: 'Rewards key enablers of project milestones.' }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors group">
              <div className={`w-12 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                item.neg ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-secondary/10 text-secondary border border-secondary/20'
              }`}>
                {item.pts}
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
