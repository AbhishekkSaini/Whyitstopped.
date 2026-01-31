import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';

import Layout from './components/Layout';
import ArchiveList from './components/ArchiveList';
import SubmissionForm from './components/SubmissionForm';
import InsightsDashboard from './components/InsightsDashboard';
import AboutSection from './components/AboutSection';
import { MOCK_ARCHIVE } from './constants';
import { AbandonedIdea, AppTab, FailureReason } from '../types';

const SAVED_KEY = 'whyitstopped-saved';

function normalizeIdeaRow(row: Record<string, unknown>): AbandonedIdea {
  return {
    ...row,
    id: row.id as string,
    timestamp: (row.timestamp ?? row.created_at) as string,
    created_at: row.created_at as string | undefined,
    title: row.title as string | undefined,
    description: row.description as string,
    stage: row.stage as AbandonedIdea['stage'],
    primaryReason: (row.primary_reason ?? row.primaryReason) as AbandonedIdea['primaryReason'],
    secondaryReasons: (row.secondary_reasons ?? row.secondaryReasons ?? []) as FailureReason[],
    reflection: row.reflection as string | undefined,
    failedAssumptions: (row.failed_assumptions ?? row.failedAssumptions ?? []) as string[],
    ifRestarted: (row.if_restarted ?? row.ifRestarted) as string | undefined,
    timeline: (row.timeline as AbandonedIdea['timeline']) ?? undefined,
    hiddenCosts: (row.hidden_costs ?? row.hiddenCosts) as string[] | undefined,
    audienceTags: (row.audience_tags ?? row.audienceTags) as string[] | undefined,
    isSolo: (row.is_solo ?? row.isSolo) as boolean,
    isTechHeavy: (row.is_tech_heavy ?? row.isTechHeavy) as boolean,
    status: (row.status as AbandonedIdea['status']) ?? 'published',
  } as AbandonedIdea;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('archive');
  const [ideas, setIdeas] = useState<AbandonedIdea[]>(MOCK_ARCHIVE.map(i => ({ ...i, status: 'published' as const })));
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedIds));
    } catch {
      // ignore
    }
  }, [savedIds]);

  const toggleSaved = (id: string) => {
    setSavedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };
  useEffect(() => {
    async function loadIdeas() {
      if (!supabase) {
        console.warn('Read-only archive mode — using local data.');
        return;
      }
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setIdeas((data as Record<string, unknown>[]).map(normalizeIdeaRow));
      }
    }

    loadIdeas();
  }, []);

  const sanitizeText = (text: string): string => {
    if (!text) return '';
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const handleRegex = /@\w+/g;

    return text
      .replace(emailRegex, '[REDACTED]')
      .replace(phoneRegex, '[REDACTED]')
      .replace(handleRegex, '[REDACTED]')
      .trim();
  };
const handleNewSubmission = (
  ideaData: Omit<AbandonedIdea, 'id' | 'timestamp' | 'status'>
) => {
  const sanitizedIdea = {
    ...ideaData,
    title: sanitizeText(ideaData.title || ''),
    description: sanitizeText(ideaData.description),
    reflection: sanitizeText(ideaData.reflection || ''),
    ifRestarted: ideaData.ifRestarted ? sanitizeText(ideaData.ifRestarted) : undefined,
  };

  const newIdea: AbandonedIdea = {
    ...sanitizedIdea,
    failedAssumptions: ideaData.failedAssumptions ?? [],
    ifRestarted: sanitizedIdea.ifRestarted,
    timeline: ideaData.timeline,
    hiddenCosts: ideaData.hiddenCosts,
    audienceTags: ideaData.audienceTags,
    id: `ARC-${(ideas.length + 1).toString().padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };

  // updated bc finally
  setIdeas([newIdea, ...ideas]);

  if (!supabase) {
    console.warn('Read-only mode — submission saved locally only.');
    return;
  }

  supabase
    .from('ideas')
    .insert([
      {
        title: sanitizedIdea.title,
        description: sanitizedIdea.description,
        reflection: sanitizedIdea.reflection,
        stage: sanitizedIdea.stage,
        primary_reason: sanitizedIdea.primaryReason,
        secondary_reasons: sanitizedIdea.secondaryReasons,
        is_solo: sanitizedIdea.isSolo,
        is_tech_heavy: sanitizedIdea.isTechHeavy,
        failed_assumptions: newIdea.failedAssumptions,
        if_restarted: newIdea.ifRestarted,
        timeline: newIdea.timeline,
        hidden_costs: newIdea.hiddenCosts,
        audience_tags: newIdea.audienceTags,
        status: 'pending',
      },
    ])
    .then(({ error }) => {
      if (error) {
        console.error('Supabase insert failed:', error);
      }
    });
};

const handleDelete = async (id: string) => {
  if (!window.confirm('Permanently delete this record?')) return;

  if (!supabase) {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
    return;
  }

  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    return;
  }

  setIdeas(prev => prev.filter(idea => idea.id !== id));
};


  const renderContent = () => {
    // Only show published ideas in the archive and dashboard
const publishedIdeas = ideas;
    
    switch (activeTab) {
      case 'archive':
        return (
          <ArchiveList
            ideas={publishedIdeas}
            onDelete={handleDelete}
            savedIds={savedIds}
            onToggleSaved={toggleSaved}
          />
        );
      case 'submit':
        return <SubmissionForm onSubmit={handleNewSubmission} onCancel={() => setActiveTab('archive')} />;
      case 'dashboard':
        return <InsightsDashboard ideas={publishedIdeas} />;
      case 'about':
        return <AboutSection />;
      default:
        return (
          <ArchiveList
            ideas={publishedIdeas}
            onDelete={handleDelete}
            savedIds={savedIds}
            onToggleSaved={toggleSaved}
          />
        );
    }
  };

  const readOnly = supabase === null;

  return (
    <>
      {readOnly && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-xs font-medium text-amber-800 uppercase tracking-wider">
          Read-only archive. Submissions saved locally only.
        </div>
      )}
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
