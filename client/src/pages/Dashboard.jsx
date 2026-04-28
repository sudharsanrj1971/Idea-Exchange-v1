import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectApi } from '../services/all.api';
import { useAuthStore } from '../store/authStore';
import { StateBadge, ScoreGauge } from '../components/UI/Basic';
import { Plus, LayoutGrid, Clock, Award, Activity, Database, Zap, Shield } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['my-projects'],
    queryFn: () => projectApi.getProjects(1, 10)
  });

  if (isLoading) return <div className="p-12 text-center text-gray-500 animate-pulse">Synchronizing Dashboard...</div>;

  const projects = projectsData?.data?.data?.projects || [];

  return (
    <div className="p-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-syne font-black text-white tracking-tight flex items-center gap-3">
             Welcome back, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Institutional Ledger Portfolio Status: <span className="text-success">ACTIVE</span></p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3">
             <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Reputation</div>
             <div className="text-xl font-syne font-black text-primary">{user?.reputationPoints || 0} RP</div>
          </div>
          <Link to="/projects/new" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-dark font-syne font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,229,255,0.2)]">
            <Plus size={18}/> New Idea
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Database, label: 'Ledger Blocks', val: '38', trend: '↑ +12 wk', color: 'text-primary' },
          { icon: Zap, label: 'Avg Iterations/Idea', val: '12.4', trend: '↑ 288%', color: 'text-secondary' },
          { icon: Shield, label: 'Attribution Trust', val: '92.4%', trend: '↑ 105%', color: 'text-success' },
          { icon: Award, label: 'Global Rank', val: '#12', trend: 'Top 12%', color: 'text-warning' }
        ].map(stat => (
          <div key={stat.label} className="bg-surface border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all group">
            <div className={`mb-4 ${stat.color}`}><stat.icon size={20} /></div>
            <div className="text-3xl font-syne font-black text-white">{stat.val}</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">{stat.label}</div>
            <div className="text-[10px] text-success font-mono mt-2">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <LayoutGrid size={14}/> My Active Ideas
              </h2>
            </div>
            {projects.length === 0 ? (
              <div className="bg-surface/50 border border-dashed border-white/10 rounded-3xl p-12 text-center text-gray-500">
                No active projects found. Start by creating a project.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <Link key={project._id} to={`/projects/${project._id}`} className="block bg-surface p-8 rounded-3xl border border-white/5 hover:border-primary/30 hover:scale-[1.02] transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-6">
                      <StateBadge state={project.state} />
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">PIS Score</div>
                        <div className="text-xl font-syne font-black text-primary">{project.impactScore || 0}</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-syne font-black text-white mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-8 leading-relaxed font-sans">{project.problemStatement}</p>
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                       <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">14 blocks · {project.collaborators?.length || 1} authors</span>
                       <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-[10px] font-black text-dark border-2 border-surface shadow-xl">SJ</div>
                          {project.collaborators?.slice(0, 2).map((c, i) => (
                            <div key={i} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-[10px] font-black text-dark border-2 border-surface shadow-xl">
                              {c.name?.split(' ').map(x => x[0]).join('') || '??'}
                            </div>
                          ))}
                       </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section>
             <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Activity size={14}/> Recent Network Activity
             </h2>
             <div className="bg-surface rounded-3xl border border-white/5 p-6 space-y-6">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex gap-4 group cursor-pointer border-b border-white/5 pb-6 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                      <Clock size={16}/>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 font-medium">New block #104 added to <span className="text-white font-bold">HealthTrack</span></p>
                      <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-bold">12 minutes ago</p>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          <section className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
             <h3 className="text-sm font-bold text-primary mb-2 tracking-tight">Certification Pathway</h3>
             <p className="text-xs text-gray-400 leading-relaxed">Your projects need <span className="text-white font-bold">3 peer reviews</span> and <span className="text-white font-bold">1 expert validation</span> to reach Certified status.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
