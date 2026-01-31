
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { AbandonedIdea, DeathStage, FailureReason } from '../../types';
import { DEATH_STAGES, FAILURE_REASONS } from '../constants';
import { format, differenceInDays } from 'date-fns';

/** Never show "Unknown date". Use timestamp or created_at; fallback to neutral language. */
function safeFormatDate(idea: AbandonedIdea): string {
  const raw = idea.created_at ?? idea.timestamp;
  if (!raw) return 'Archived early';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return 'Archived early';
  return format(d, 'MMM dd, yyyy');
}

/** Optional hook line: "Solo founder, first project" / "Failed after MVP" / "Died in N days" */
function getContextHook(idea: AbandonedIdea, index: number): string | null {
  const raw = idea.created_at ?? idea.timestamp;
  const d = raw ? new Date(raw) : null;
  const daysAgo = d && !isNaN(d.getTime()) ? differenceInDays(new Date(), d) : null;

  if (idea.isSolo && index % 4 === 0) return 'Solo founder, first project';
  if (idea.stage === DeathStage.MVP && index % 5 === 2) return 'Failed after MVP';
  if (daysAgo !== null && daysAgo <= 90 && index % 3 === 1) return `Archived ${daysAgo} days ago`;
  return null;
}

interface ArchiveListProps {
  ideas: AbandonedIdea[];
  onDelete?: (id: string) => void;
  savedIds?: string[];
  onToggleSaved?: (id: string) => void;
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

/** Opinionated presets: label → stage, reason, soloOnly */
const EXPLORATION_PRESETS = [
  { label: 'Solo founder mistakes', stage: 'All Stages' as string, reason: 'All Reasons' as string, soloOnly: true },
  { label: 'MVP traps', stage: DeathStage.MVP, reason: 'All Reasons' as string, soloOnly: false },
  { label: 'Overengineering', stage: 'All Stages' as string, reason: FailureReason.TECH_COMPLEXITY, soloOnly: false },
  { label: 'Burnout cases', stage: 'All Stages' as string, reason: FailureReason.BURNOUT, soloOnly: false },
  { label: 'No traction', stage: 'All Stages' as string, reason: FailureReason.NO_TRACTION, soloOnly: false },
  { label: 'Clear all', stage: 'All Stages', reason: 'All Reasons', soloOnly: false },
] as const;

const ArchiveList: React.FC<ArchiveListProps> = ({ ideas, onDelete, savedIds = [], onToggleSaved }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All Stages');
  const [reasonFilter, setReasonFilter] = useState<string>('All Reasons');
  const [soloOnly, setSoloOnly] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const ideasToFilter = useMemo(() => {
    if (showSavedOnly && savedIds.length > 0) {
      return ideas.filter(i => savedIds.includes(i.id));
    }
    return ideas;
  }, [ideas, showSavedOnly, savedIds]);

  const reasonFrequency = useMemo(() => {
    const counts: Record<string, number> = {};
    ideasToFilter.forEach(i => {
      counts[i.primaryReason] = (counts[i.primaryReason] ?? 0) + 1;
    });
    return counts;
  }, [ideasToFilter]);

  const filteredIdeas = useMemo(() => {
    return ideasToFilter.filter(idea => {
      const matchesSearch =
        (idea.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (idea.reflection?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesStage = stageFilter === 'All Stages' || idea.stage === stageFilter;
      const matchesReason = reasonFilter === 'All Reasons' || idea.primaryReason === reasonFilter;
      const matchesSolo = !soloOnly || idea.isSolo;
      return matchesSearch && matchesStage && matchesReason && matchesSolo;
    });
  }, [ideasToFilter, searchTerm, stageFilter, reasonFilter, soloOnly]);

  const scrollToId = useCallback((id: string) => {
    const el = cardRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const relatedFor = useCallback((idea: AbandonedIdea, all: AbandonedIdea[]) => {
    return all
      .filter(i => i.id !== idea.id && (i.primaryReason === idea.primaryReason || i.stage === idea.stage))
      .slice(0, 3);
  }, []);

  const applyPreset = (preset: (typeof EXPLORATION_PRESETS)[number]) => {
    setStageFilter(preset.stage);
    setReasonFilter(preset.reason);
    setSoloOnly(preset.soloOnly);
  };

  const guidanceLine = useMemo(() => {
    if (ideasToFilter.length === 0) return 'Document failure. Recognize patterns.';
    const byReason = reasonFrequency;
    const top = Object.entries(byReason).sort((a, b) => b[1] - a[1])[0];
    const mvpCount = ideasToFilter.filter(i => i.stage === DeathStage.MVP).length;
    if (mvpCount >= ideasToFilter.length / 2) return 'Most failures here die after MVP.';
    if (top && top[1] >= 2) return `The most common lethality is not technical.`;
    return 'Every record is a data point. Look for patterns.';
  }, [ideasToFilter, reasonFrequency]);

  const handleRandomRecord = useCallback(() => {
    if (filteredIdeas.length === 0) return;
    const random = filteredIdeas[Math.floor(Math.random() * filteredIdeas.length)];
    if (random) scrollToId(random.id);
  }, [filteredIdeas]);

  return (
    <div className="space-y-14 animate-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-2xl">
        <h2 className="font-serif text-4xl font-semibold text-slate-900 mb-5 tracking-tight">The Archive</h2>
        <p className="text-slate-500 text-[15px] leading-relaxed font-normal max-w-xl">
          Documented reasons why real projects stop — captured honestly, without hindsight bias. Objectivity enables pattern recognition.
        </p>
      </div>

      {/* Guidance + Controls */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-xl shadow-card space-y-5">
        <p className="text-[13px] text-slate-600 font-medium italic border-l-[3px] border-slate-400 pl-4">
          {guidanceLine}
        </p>
        <div className="flex flex-wrap gap-2.5 items-center">
          {savedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSavedOnly(prev => !prev)}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-md border transition-all ${
                showSavedOnly ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              My list ({savedIds.length})
            </button>
          )}
          {EXPLORATION_PRESETS.map(p => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-md border transition-all ${
                stageFilter === p.stage && reasonFilter === p.reason && soloOnly === p.soloOnly
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
          {filteredIdeas.length > 0 && (
            <button
              type="button"
              onClick={handleRandomRecord}
              className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-md border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            >
              Random record
            </button>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4 pt-1">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Explore</label>
            <input
              type="text"
              placeholder="Keyword, title, or reflection..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Stage</label>
            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all cursor-pointer font-medium text-slate-700"
            >
              <option>All Stages</option>
              {DEATH_STAGES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Reason</label>
            <select
              value={reasonFilter}
              onChange={e => setReasonFilter(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all cursor-pointer font-medium text-slate-700"
            >
              <option>All Reasons</option>
              {FAILURE_REASONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-[11px] text-slate-600 font-semibold uppercase tracking-widest pt-1 border-t border-slate-100">
          {filteredIdeas.length} records
          {filteredIdeas.length > 0 && (
            <span className="text-slate-400 font-normal normal-case ml-1">
              · {new Set(filteredIdeas.map(i => i.primaryReason)).size} failure pattern{new Set(filteredIdeas.map(i => i.primaryReason)).size !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="grid gap-8">
        {filteredIdeas.length > 0 ? (
          filteredIdeas.map((idea, index) => {
            const count = reasonFrequency[idea.primaryReason] ?? 0;
            const densityLabel =
              count >= 3 ? 'Common failure' : count === 1 ? 'Rare failure' : `Seen ${count} times`;
            const isLargerCard = index % 3 === 2;
            const contextHook = getContextHook(idea, index);

            const related = relatedFor(idea, filteredIdeas);
            const nextIdea = filteredIdeas[index + 1];

            return (
              <article
                key={idea.id}
                ref={el => { cardRefs.current[idea.id] = el; }}
                className={`bg-white border border-slate-200/90 rounded-xl shadow-card hover:shadow-card-hover hover:border-slate-300/80 transition-all duration-200 flex flex-col md:flex-row gap-0 relative group overflow-hidden ${
                  isLargerCard ? 'p-10 md:p-10' : 'p-8'
                }`}
              >
                <div className="md:w-36 flex-shrink-0 pt-1 pb-6 md:pb-0 md:pr-8 md:border-r border-slate-200/80 bg-slate-50/50 md:bg-transparent md:-my-8 md:py-8 md:pl-0">
                  {onToggleSaved && (
                    <button
                      type="button"
                      onClick={() => onToggleSaved(idea.id)}
                      className="mb-3 p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700"
                      title={savedIds.includes(idea.id) ? 'Remove from my list' : 'Save to my list'}
                      aria-label={savedIds.includes(idea.id) ? 'Remove from my list' : 'Save to my list'}
                    >
                      {savedIds.includes(idea.id) ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      )}
                    </button>
                  )}
                  <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-[0.12em] block mb-2">Recorded</span>
                  <div className="font-serif text-slate-900 font-semibold text-[15px]">{safeFormatDate(idea)}</div>
                  <div className="text-[11px] text-slate-500 mt-2 font-mono tracking-tight break-all">{idea.id}</div>
                  <div className="mt-4 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    {densityLabel}
                  </div>
                </div>

                <div className="flex-1 space-y-6 md:pl-0 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h3 className="font-serif text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
                      {idea.title || 'Untitled Project'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider rounded-md">
                        {idea.stage}
                      </span>
                      <span
                        className={`px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-md border ${getReasonColorClass(
                          idea.primaryReason
                        )}`}
                      >
                        {idea.primaryReason}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-[0.1em] mb-2">
                      The Intention
                    </h4>
                    <p className="leading-relaxed text-sm text-slate-600 max-w-3xl">{idea.description}</p>
                  </div>

                  {idea.reflection && (
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-[0.1em] mb-3">
                        The Truth
                      </h4>
                      <p className="italic bg-slate-200/80 text-slate-800 font-medium text-[15px] leading-relaxed py-5 px-5 border-l-4 border-slate-600 rounded-r-md">
                        "{idea.reflection}"
                      </p>
                    </div>
                  )}

                  {(idea.failedAssumptions?.length ?? 0) > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">What I got wrong</h4>
                      <ul className="flex flex-wrap gap-1.5">
                        {(idea.failedAssumptions ?? []).map(a => (
                          <li key={a} className="px-2 py-1 bg-slate-100 text-slate-600 text-[11px] border border-slate-200 rounded-sm">
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {idea.ifRestarted?.trim() && (
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">If I restarted this</h4>
                      <p className="text-slate-700 text-sm border-l-2 border-slate-300 pl-3">{idea.ifRestarted}</p>
                    </div>
                  )}

                  {idea.timeline && (idea.timeline.ideaConceived || idea.timeline.mvpCompleted || idea.timeline.firstUser || idea.timeline.abandoned) && (
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Timeline</h4>
                      <p className="text-[12px] text-slate-600 font-mono">
                        {[idea.timeline.ideaConceived && `Idea ${idea.timeline.ideaConceived}`, idea.timeline.mvpCompleted && `MVP ${idea.timeline.mvpCompleted}`, idea.timeline.firstUser && `First user ${idea.timeline.firstUser}`, idea.timeline.abandoned && `Abandoned ${idea.timeline.abandoned}`].filter(Boolean).join(' → ')}
                      </p>
                    </div>
                  )}

                  {((idea.hiddenCosts?.length ?? 0) > 0 || (idea.audienceTags?.length ?? 0) > 0) && (
                    <div className="flex flex-wrap gap-3">
                      {(idea.hiddenCosts?.length ?? 0) > 0 && (
                        <span className="text-[11px] text-slate-600 uppercase tracking-wider">
                          Hidden cost: {(idea.hiddenCosts ?? []).join(', ')}
                        </span>
                      )}
                      {(idea.audienceTags?.length ?? 0) > 0 && (
                        <span className="text-[11px] text-slate-600 uppercase tracking-wider">
                          Useful for: {(idea.audienceTags ?? []).join(', ')}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200/80">
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <span>{idea.isSolo ? 'Solo Founder' : 'Team Project'}</span>
                      <span className="opacity-30">•</span>
                      <span>{idea.isTechHeavy ? 'Tech-Centric' : 'Non-Tech'}</span>
                      {contextHook && (
                        <>
                          <span className="opacity-30">•</span>
                          <span className="text-slate-500 normal-case font-medium">{contextHook}</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      {related.length > 0 && (
                        <span className="text-[11px] text-slate-600 uppercase tracking-wider">
                          Related:{' '}
                          {related.map((r, i) => (
                            <React.Fragment key={r.id}>
                              {i > 0 && ', '}
                              <button
                                type="button"
                                onClick={() => scrollToId(r.id)}
                                className="text-slate-600 hover:text-slate-900 underline underline-offset-1 font-medium normal-case"
                              >
                                {r.title || 'Untitled'}
                              </button>
                            </React.Fragment>
                          ))}
                        </span>
                      )}
                      {nextIdea && (
                        <button
                          type="button"
                          onClick={() => scrollToId(nextIdea.id)}
                          className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 uppercase tracking-wider"
                        >
                          Next: {nextIdea.title || 'Untitled'} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="text-center py-24 bg-white/80 border border-slate-200 border-dashed rounded-xl">
            <p className="text-slate-500 italic font-normal">No records match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveList;
