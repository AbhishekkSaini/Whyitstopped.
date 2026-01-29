import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';

import Layout from './components/Layout';
import ArchiveList from './components/ArchiveList';
import SubmissionForm from './components/SubmissionForm';
import InsightsDashboard from './components/InsightsDashboard';
import AboutSection from './components/AboutSection';
import { MOCK_ARCHIVE } from './constants';
import { AbandonedIdea, AppTab } from '../types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('archive');
  // Initialize mock data with 'published' status
  const [ideas, setIdeas] = useState<AbandonedIdea[]>(MOCK_ARCHIVE.map(i => ({...i, status: 'published'})));
  useEffect(() => {
    async function loadIdeas() {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setIdeas(data as AbandonedIdea[]);
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
  };

  const newIdea: AbandonedIdea = {
    ...sanitizedIdea,
    id: `ARC-${(ideas.length + 1).toString().padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };

  // ui updated bc finally
  setIdeas([newIdea, ...ideas]);

  supabase.from('ideas').insert([
  {
    title: sanitizedIdea.title,
    description: sanitizedIdea.description,
    reflection: sanitizedIdea.reflection,
    stage: sanitizedIdea.stage,
    primary_reason: sanitizedIdea.primaryReason,
    secondary_reasons: sanitizedIdea.secondaryReasons,
    is_solo: sanitizedIdea.isSolo,
    is_tech_heavy: sanitizedIdea.isTechHeavy,
    status: 'pending',
  },
]).then(({ error }) => {
  if (error) {
    console.error('Supabase insert failed:', error);
  }
});
};


  

  const handleDelete = (id: string) => {
    if (window.confirm("Confirm deletion: This action will permanently remove this record from the local session archive.")) {
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    }
  };

  const renderContent = () => {
    // Only show published ideas in the archive and dashboard
const publishedIdeas = ideas;
    
    switch (activeTab) {
      case 'archive':
        return <ArchiveList ideas={publishedIdeas} onDelete={handleDelete} />;
      case 'submit':
        return <SubmissionForm onSubmit={handleNewSubmission} onCancel={() => setActiveTab('archive')} />;
      case 'dashboard':
        return <InsightsDashboard ideas={publishedIdeas} />;
      case 'about':
        return <AboutSection />;
      default:
        return <ArchiveList ideas={publishedIdeas} onDelete={handleDelete} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
