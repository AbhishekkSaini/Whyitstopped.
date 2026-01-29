
import React, { useState, useMemo, useEffect } from 'react';
import { AbandonedIdea, DeathStage, FailureReason } from '../types';
import { DEATH_STAGES, FAILURE_REASONS } from '../constants';
import { format } from 'date-fns';
import { getQuickAnalysis } from '../services/geminiService';

interface ArchiveListProps {
  ideas: AbandonedIdea[];
  onDelete?: (id: string) => void;
}

const getReasonColorClass = (reason: FailureReason) => {
  switch (reason) {
    case FailureReason.TECH_COMPLEXITY:
      return 'bg-slate-100 text-slate-600 border-slate-200';
    case FailureReason.NO_TRACTION:
      return 'bg-amber-50 text-amber-600 border-amber-100';
    case FailureReason.LOST_MOTIVATION:
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case FailureReason.BURNOUT:
      return 'bg-violet-50 text-violet-600 border-violet-100';
    case FailureReason.NO_MONEY:
      return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    case FailureReason.TIME_CONSTRAINTS:
      return 'bg-sky-50 text-sky-600 border-sky-100';
    case FailureReason.SATURATED_MARKET:
      return 'bg-orange-50 text-orange-600 border-orange-100';
    case FailureReason.LEGAL:
      return 'bg-rose-50 text-rose-600 border-rose-100';
    case FailureReason.TEAM_CONFLICTS:
      return 'bg-cyan-50 text-cyan-600 border-cyan-100';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

const QuickAnalysisTag: React.FC<{ description: string }> = ({ description }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetch = async () => {
      setLoading(true);
      const res = await getQuickAnalysis(description);
      if (active) {
        setAnalysis(res);
        setLoading(false);
      }
    };
    fetch();
    return () => { active = false; };
  }, [description]);

  if (loading) return <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />;
  if (!analysis) return null;

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
      <span className="w-1 h-1 bg-rose-500 rounded-full" />
      AI Quick Take: {analysis}
    </div>
  );
};

const ArchiveList: React.FC<ArchiveListProps> = ({ ideas, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All Stages');
  const [reasonFilter, setReasonFilter] = useState<string>('All Reasons');

  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      const matchesSearch = 
        (idea.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (idea.reflection?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      const matchesStage = stageFilter === 'All Stages' || idea.stage === stageFilter;
      const matchesReason = reasonFilter === 'All Reasons' || idea.primaryReason === reasonFilter;

      return matchesSearch && matchesStage && matchesReason;
    });
  }, [ideas, searchTerm, stageFilter, reasonFilter]);

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">The Archive</h2>
        <p className="text-slate-500 leading-relaxed font-light">
          Below are the documented reasons why real projects stop — captured honestly, without hindsight bias. Objectivity is the key to pattern recognition.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Search Keywords</label>
            <input 
              type="text"
              placeholder="Filter by keyword, title, or reflection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-300 transition-all font-light"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Filter Stage</label>
            <select 
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded text-sm focus:outline-none transition-all cursor-pointer font-medium text-slate-700"
            >
              <option>All Stages</option>
              {DEATH_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Filter Reason</label>
            <select 
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded text-sm focus:outline-none transition-all cursor-pointer font-medium text-slate-700"
            >
              <option>All Reasons</option>
              {FAILURE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
          {filteredIdeas.length} records retrieved
        </div>
      </div>

      {/* List */}
      <div className="grid gap-8">
        {filteredIdeas.length > 0 ? filteredIdeas.map((idea) => (
          <article key={idea.id} className="bg-white border border-slate-200 p-8 rounded-lg shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col md:flex-row gap-8 relative group">
            <div className="md:w-32 flex-shrink-0 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Recorded</span>
              <div className="text-slate-900 font-bold text-sm">
                {format(new Date(idea.timestamp), 'MMM dd, yyyy')}
              </div>
              <div className="text-[10px] text-slate-400 mono mt-1">{idea.id}</div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{idea.title || 'Untitled Project'}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded">
                    {idea.stage}
                  </span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${getReasonColorClass(idea.primaryReason)}`}>
                    {idea.primaryReason}
                  </span>
                </div>
              </div>

              <div className="text-slate-700">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                  <span>The Intention</span>
                  <QuickAnalysisTag description={idea.description} />
                </h4>
                <p className="leading-relaxed text-sm font-light">{idea.description}</p>
              </div>

              {idea.reflection && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">The Truth</h4>
                  <p className="italic bg-slate-50 p-4 border-l-2 border-slate-300 text-sm text-slate-600 font-medium">"{idea.reflection}"</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{idea.isSolo ? 'Solo Founder' : 'Team Project'}</span>
                  <span className="opacity-30">•</span>
                  <span>{idea.isTechHeavy ? 'Tech-Centric' : 'Non-Tech'}</span>
                </div>
                
            
              </div>
            </div>
          </article>
        )) : (
          <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-lg">
            <p className="text-slate-400 italic font-light">No records match your current filter parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveList;
