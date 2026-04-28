import React, { useState } from 'react';
import { Search, Globe, Filter, Star, Clock, Users, Database } from 'lucide-react';

const ideas = [
  {
    id: 1,
    state: 'Collaborating',
    stateClass: 'text-primary bg-primary/10 border-primary/20',
    title: 'BioAlert — Wearable Campus Safety Monitor',
    desc: 'IoT wristband detecting falls and health anomalies in elderly campus staff. Raspberry Pi + MQTT.',
    blocks: 9,
    authors: 2,
    pis: 48,
    seeking: 'ML dev'
  },
  {
    id: 2,
    state: 'Validating',
    stateClass: 'text-secondary bg-secondary/10 border-secondary/20',
    title: 'AquaTrack — Campus Water Efficiency AI',
    desc: 'Sensor network + LSTM model detecting leaks and usage spikes across campus plumbing grid.',
    blocks: 17,
    authors: 3,
    pis: 81
  },
  {
    id: 3,
    state: 'Submitted',
    stateClass: 'text-warning bg-warning/10 border-warning/20',
    title: 'LibraryBot — NLP Book Request Assistant',
    desc: 'WhatsApp chatbot for library book reservations, renewals, and inter-library requests using Rasa.',
    blocks: 2,
    authors: 1,
    pis: 12,
    seeking: 'Open to collabs'
  },
  {
    id: 4,
    state: 'Certified',
    stateClass: 'text-success bg-success/10 border-success/20',
    title: 'ParkSmart — AI Parking Allocation',
    desc: 'Computer vision + ANPR system for automated campus parking management. 94% accuracy in pilot.',
    blocks: 28,
    authors: 4,
    pis: 94,
    funded: '₹2.5L awarded'
  }
];

export default function Discover() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Collaborating', 'Validating', 'Certified', 'CS / IT', 'Electronics', 'Mechanical', 'Seeking'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="ph">
        <h1 className="text-3xl font-syne font-extrabold flex items-center gap-3">
          <Globe className="text-primary" /> Discover Ideas
        </h1>
        <p className="text-gray-400 mt-1">Browse innovations from verified student contributors across departments</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, tech stack, or author..." 
            className="w-full bg-surface border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-primary/50 transition-all outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                activeFilter === f ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-white/5 text-gray-500 hover:border-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {ideas.map(idea => (
          <div key={idea.id} className="bg-surface border border-white/10 rounded-3xl p-6 hover:bg-surface-lighter hover:border-primary/30 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${idea.stateClass}`}>
                ● {idea.state}
              </span>
              {idea.funded && (
                <span className="text-[10px] font-bold bg-success/10 text-success border border-success/20 px-3 py-1 rounded-full">
                  💰 {idea.funded}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-syne font-bold text-white mb-2 group-hover:text-primary transition-colors">{idea.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-2">{idea.desc}</p>
            
            <div className="flex items-center gap-6 text-gray-500 mb-6">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                <Database size={14} /> {idea.blocks} Blocks
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                <Users size={14} /> {idea.authors} Authors
              </div>
              <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${idea.pis > 70 ? 'text-secondary' : 'text-primary'}`}>
                <Star size={14} /> PIS: {idea.pis}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gray-500">Platform Impact Score</span>
                <span className={idea.pis > 70 ? 'text-secondary' : 'text-primary'}>{idea.pis}/100</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${idea.pis > 70 ? 'bg-secondary' : 'bg-primary'}`}
                  style={{ width: `${idea.pis}%` }}
                />
              </div>
            </div>

            {idea.seeking && (
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-warning">
                  Seeking: {idea.seeking}
                </span>
                <button className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/20 transition-all">
                  Request to Collaborate
                </button>
              </div>
            )}
            {!idea.seeking && (
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-1">
                  <Clock size={12} /> Active development
                </span>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-white/30 transition-all">
                  View Detail
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
