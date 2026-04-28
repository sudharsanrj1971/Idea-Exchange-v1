import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../services/all.api';
import { Loader2, Plus, X, Globe, Code, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProjectNew() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [techStack, setTechStack] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [hashPreview, setHashPreview] = useState('···· awaiting input ····');
  const navigate = useNavigate();

  const title = watch('title', '');
  const problemStatement = watch('problemStatement', '');
  const contributionTypeSize = watch('contributionType', '1.0');

  useEffect(() => {
    if (title || problemStatement) {
      // Simulate SHA-256 for preview
      let h = 0;
      const str = title + problemStatement;
      for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0;
      }
      const hex = Math.abs(h).toString(16).padStart(8, '0');
      setHashPreview((hex.repeat(8)).substring(0, 64));
    } else {
      setHashPreview('···· awaiting input ····');
    }
  }, [title, problemStatement]);

  const calculateCompleteness = () => {
    let score = 25; // 25 for auth verified
    if (title.trim()) score += 25;
    if (problemStatement.length >= 50) score += 25;
    if (techStack.length > 0) score += 25;
    return score;
  };

  const completeness = calculateCompleteness();

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(tagInput.trim())) {
        setTechStack([...techStack, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setTechStack(techStack.filter(t => t !== tag));
  };

  const availableTech = ['React', 'Node.js', 'MongoDB', 'Python', 'TensorFlow', 'Socket.io', 'AWS', 'Docker', 'Redis', 'TypeScript'];

  const onSubmit = async (data) => {
    try {
      const res = await projectApi.createProject({
        ...data,
        techStack
      });
      navigate(`/projects/${res.data.data.project._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-8">
        <header>
          <h1 className="text-3xl font-syne font-black text-white tracking-tight">Initiate Innovation Genesis</h1>
          <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest font-bold font-mono">Blockchain Node Status: <span className="text-success">READY</span></p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-surface p-8 rounded-3xl border border-white/10 space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
          
          <div className="space-y-6">
            <section>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Globe size={14} className="text-primary"/> Base Identity
              </label>
              <div className="space-y-4">
                <div>
                  <input 
                    {...register('title', { required: 'Project title is required' })} 
                    className="w-full px-6 py-5 bg-black/40 border border-white/10 rounded-2xl text-lg font-bold text-white placeholder:text-gray-700 focus:border-primary outline-none transition-all shadow-inner" 
                    placeholder="e.g., SmartRoute AI — Campus Micro-Transit System"
                  />
                  {errors.title && <p className="text-[10px] text-danger mt-2 font-bold px-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.title.message}</p>}
                </div>
                
                <div>
                  <textarea 
                    {...register('problemStatement', { 
                      required: 'Problem statement is required', 
                      minLength: { value: 50, message: 'Minimum 50 characters required for technical clarity' } 
                    })} 
                    rows={4}
                    className="w-full px-6 py-5 bg-black/40 border border-white/10 rounded-2xl text-sm text-gray-300 placeholder:text-gray-700 focus:border-primary outline-none transition-all resize-none shadow-inner leading-relaxed" 
                    placeholder="Describe the core problem this idea solves. Be specific about the pain point and who it affects..."
                  />
                  {errors.problemStatement && <p className="text-[10px] text-danger mt-2 font-bold px-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.problemStatement.message}</p>}
                </div>
              </div>
            </section>

            <section>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Code size={14} className="text-primary"/> Infrastructure Stack
              </label>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {availableTech.map(tech => (
                    <button
                      key={tech} type="button"
                      onClick={() => techStack.includes(tech) ? removeTag(tech) : setTechStack([...techStack, tech])}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        techStack.includes(tech) ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-600 hover:border-white/30'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-xs text-gray-400 placeholder:text-gray-800 focus:border-primary outline-none transition-all" 
                    placeholder="Or type custom stack and press Enter..."
                  />
                </div>
              </div>
            </section>

            <section>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                Contribution Type (Entropy Weight)
              </label>
              <select 
                {...register('contributionType')}
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-sm text-gray-400 focus:border-primary outline-none transition-all"
              >
                <option value="1.0">Core Algorithm / Architecture (C = 1.00)</option>
                <option value="0.8">Market Research / Feasibility Study (C = 0.80)</option>
                <option value="0.6">UI/UX Prototype / Wireframe (C = 0.60)</option>
                <option value="0.4">Documentation / Process Specification (C = 0.40)</option>
              </select>
            </section>

            <div className="bg-black/60 border border-primary/20 rounded-2xl p-6 font-mono text-[10px] text-gray-500 space-y-2 leading-relaxed">
              <p><span className="text-primary font-bold">Genesis Block Preview:</span></p>
              <p><span className="text-primary">SHA-256:</span> {hashPreview}</p>
              <p><span className="text-primary">Timestamp:</span> {new Date().toISOString()}</p>
              <p><span className="text-primary">Platform Key:</span> IX-ADHI-2025-SHA256</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 py-5 bg-gradient-to-r from-primary to-secondary text-dark font-syne font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={24} className="animate-spin mx-auto"/> : '🔒 Anchor Genesis to Chain'}
            </button>
            <button type="button" className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all">
              Save Draft
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-surface border border-white/10 rounded-3xl p-8 sticky top-24">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Submission Completeness</h3>
          
          <div className="flex items-end justify-between mb-2">
            <div className="text-5xl font-syne font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {completeness}%
            </div>
          </div>

          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out"
              style={{ width: `${completeness}%` }}
            />
          </div>

          <div className="space-y-4">
            {[
              { label: 'Idea title filled', met: title.trim().length > 0 },
              { label: 'Problem statement (min 50 chars)', met: problemStatement.length >= 50 },
              { label: 'Tech stack selected', met: techStack.length > 0 },
              { label: 'Author identity verified (SSO)', met: true }
            ].map((check, i) => (
              <div key={i} className={`flex items-center gap-3 text-xs font-bold ${check.met ? 'text-success' : 'text-gray-600'}`}>
                {check.met ? <CheckCircle2 size={16}/> : <div className="w-4 h-4 rounded-full border-2 border-current opacity-30"/>}
                {check.label}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-2xl">
             <div className="flex items-center gap-2 text-primary font-bold text-xs mb-3 uppercase tracking-widest">
               <Shield size={16}/> Genesis Trust
             </div>
             <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                Founding a project creates the genesis block (Block #0). Your identity will be permanently and cryptographically anchored as the <span className="text-white">Root Owner</span>.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
