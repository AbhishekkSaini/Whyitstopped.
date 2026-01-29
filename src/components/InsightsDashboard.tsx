
import React, { useMemo, useEffect, useState } from 'react';
import { AbandonedIdea, DeathStage, FailureReason, SynthesisResult } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { getFailureSynthesis } from '../services/geminiService';

interface InsightsDashboardProps {
  ideas: AbandonedIdea[];
}

const COLORS = ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#334155', '#1e293b', '#0f172a', '#fb7185'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-xl rounded text-[11px] font-bold">
        <p className="text-slate-900 mb-1 uppercase tracking-wider">{payload[0].name}</p>
        <p className="text-slate-500">Count: <span className="text-slate-900">{payload[0].value}</span></p>
        {payload[0].payload.percent !== undefined && (
          <p className="text-slate-500">Share: <span className="text-rose-600">{(payload[0].payload.percent * 100).toFixed(1)}%</span></p>
        )}
      </div>
    );
  }
  return null;
};

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ ideas }) => {
  const [synthesis, setSynthesis] = useState<SynthesisResult>({ text: 'Analyzing repository trends...', sources: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSynthesis = async () => {
      setLoading(true);
      const result = await getFailureSynthesis(ideas);
      setSynthesis(result);
      setLoading(false);
    };
    fetchSynthesis();
  }, [ideas]);

  const reasonStats = useMemo(() => {
    const counts: Record<string, number> = {};
    ideas.forEach(i => {
      counts[i.primaryReason] = (counts[i.primaryReason] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [ideas]);

  const stageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    ideas.forEach(i => {
      counts[i.stage] = (counts[i.stage] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ 
      name, 
      value, 
      percent: value / ideas.length 
    }));
  }, [ideas]);

  const comparisonStats = useMemo(() => {
    const solo = ideas.filter(i => i.isSolo).length;
    const team = ideas.filter(i => !i.isSolo).length;
    const tech = ideas.filter(i => i.isTechHeavy).length;
    const nonTech = ideas.filter(i => !i.isTechHeavy).length;

    return [
      { name: 'Solo', count: solo },
      { name: 'Team', count: team },
      { name: 'Tech-Heavy', count: tech },
      { name: 'Non-Tech', count: nonTech },
    ];
  }, [ideas]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Analytics & Patterns</h2>
        <p className="text-slate-500 leading-relaxed font-light">
          Aggregated truth from {ideas.length} submissions. These visualizations display systemic failure patterns, cross-referenced with real-time market grounding.
        </p>
      </div>

      <div className="bg-slate-900 text-slate-100 p-8 rounded-lg border border-slate-800 shadow-2xl relative overflow-hidden">
        {loading && <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 animate-pulse" />}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className={`w-2 h-2 ${loading ? 'bg-amber-500 animate-bounce' : 'bg-rose-500'} rounded-full`} />
          System Synthesis (Grounding AI)
        </h3>
        <div className="prose prose-invert prose-slate max-w-none">
          <p className="text-lg leading-relaxed text-slate-300 font-light whitespace-pre-line mb-8">
            {synthesis.text}
          </p>
        </div>

        {synthesis.sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Grounding Sources</h4>
            <div className="flex flex-wrap gap-2">
              {synthesis.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] rounded border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Primary Reasons for Abandonment Bar Chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-6">Primary Lethality Reasons</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reasonStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150} 
                  style={{ fontSize: '10px', fontWeight: 'bold' }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar 
                  dataKey="value" 
                  name="Submissions"
                  fill="#334155" 
                  radius={[0, 4, 4, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stages of Abandonment Pie Chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-6">Death Stage Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {stageStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right" 
                  wrapperStyle={{ fontSize: '11px', paddingLeft: '10px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Founder Context Variables */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-6">Archetype Analysis: Solo vs Team / Tech Depth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" style={{ fontSize: '12px', fontWeight: '500' }} />
                <YAxis style={{ fontSize: '10px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Frequency" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;
