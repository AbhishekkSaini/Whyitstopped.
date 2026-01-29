
import React, { useState } from 'react';
import { DeathStage, FailureReason, AbandonedIdea } from '../../types';
import { DEATH_STAGES, FAILURE_REASONS } from '../constants';

interface SubmissionFormProps {
  // Fix: Exclude 'status' from the expected submission data as it's handled by the parent component
  onSubmit: (idea: Omit<AbandonedIdea, 'id' | 'timestamp' | 'status'>) => void;
  onCancel: () => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: DeathStage.IDEA,
    primaryReason: FailureReason.NO_TRACTION,
    secondaryReasons: [] as FailureReason[],
    reflection: '',
    isSolo: true,
    isTechHeavy: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim()) {
      newErrors.description = 'Project documentation is required.';
    } else if (formData.description.trim().length < 40) {
      newErrors.description = 'Please provide a more clinical description (min 40 chars) for research quality.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Fix: Now correctly matches the updated prop type omitting 'status'
      onSubmit(formData);
      setSubmitted(true);
    }
  };

  const toggleSecondary = (reason: FailureReason) => {
    if (reason === formData.primaryReason) return;
    setFormData(prev => ({
      ...prev,
      secondaryReasons: prev.secondaryReasons.includes(reason)
        ? prev.secondaryReasons.filter(r => r !== reason)
        : [...prev.secondaryReasons, reason]
    }));
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-24">
        <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Record Received</h2>
        <div className="bg-white border border-slate-200 p-6 rounded-lg mb-8 text-left space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Thank you for contributing to the collective knowledge base. 
          </p>
          <div className="flex gap-3 items-start p-3 bg-slate-50 rounded border border-slate-100">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 flex-shrink-0" />
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider leading-relaxed">
Submission received. Thank you for contributing to the archive.            </p>
          </div>
        </div>
        <button 
          onClick={onCancel} 
          className="px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded hover:bg-black transition-all shadow-md active:scale-95"
        >
          Return to Archive
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Primary Notice */}
      <div className="mb-12 p-8 bg-slate-900 text-white rounded-lg shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 14h-2V9h2v5zm0 4h-2v-2h2v2zM1 21h22L12 2 1 21z"/></svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-rose-500">Notice:</span> Archive Standards
          </h2>
          <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-light">
            <p>This repository is intended for <span className="text-white font-bold tracking-wide">serious builders, engineers, and professionals</span>. We seek technical and strategic clarity, not emotional venting.</p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-rose-500 font-bold">❌</span> Low-effort, abusive, or irrelevant entries are rejected.
              </li>
              <li className="flex gap-2">
                <span className="text-rose-500 font-bold">❌</span> Memes, jokes, or trolling will result in IP filtering.
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">✅</span> Honest, clinical reflections are highly valued.
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="text-slate-200 font-bold uppercase mr-2">Clarification:</span> 
              Documenting professional misconduct or toxic behavior is accepted. Using abusive, vulgar, or hateful language is not.
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Submit Analysis</h2>
        <p className="text-slate-500 text-sm">Contribute to the pattern recognition of failure.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Basic Info */}
        <section className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Project Identifier (Optional)</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. ShelfShare v1.0"
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Technical & Strategic Intent <span className="text-rose-500">*</span></label>
            <textarea 
              rows={5}
              value={formData.description}
              onChange={e => {
                setFormData(f => ({ ...f, description: e.target.value }));
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              placeholder="Example: We architected a p2p lending platform using QR identifiers, but underestimated the CAC relative to the $15 average order value..."
              className={`w-full bg-white border px-4 py-3 rounded text-sm focus:outline-none focus:ring-2 transition-all ${errors.description ? 'border-rose-400 focus:ring-rose-50' : 'border-slate-200 focus:ring-slate-100 focus:border-slate-300'}`}
            />
            {errors.description && <p className="mt-2 text-[10px] text-rose-500 font-bold uppercase tracking-tight">{errors.description}</p>}
          </div>
        </section>

        {/* The Stage */}
        <section>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Maturity at Stopping Point</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DEATH_STAGES.map(stage => (
              <button
                key={stage}
                type="button"
                onClick={() => setFormData(f => ({ ...f, stage }))}
                className={`px-3 py-3 text-[11px] font-bold uppercase tracking-tight border rounded transition-all text-center ${formData.stage === stage ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              >
                {stage}
              </button>
            ))}
          </div>
        </section>

        {/* Primary Reason */}
        <section>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Primary Lethality Factor</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {FAILURE_REASONS.map(reason => (
              <button
                key={reason}
                type="button"
                onClick={() => setFormData(f => ({ ...f, primaryReason: reason }))}
                className={`px-4 py-3 text-xs text-left border rounded transition-all flex items-center gap-3 ${formData.primaryReason === reason ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
              >
                <div className={`w-2 h-2 rounded-full border ${formData.primaryReason === reason ? 'bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-slate-100 border-slate-300'}`} />
                {reason}
              </button>
            ))}
          </div>
        </section>

        {/* Context */}
        <section className="p-6 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row gap-8">
           <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.isSolo} 
              onChange={e => setFormData(f => ({ ...f, isSolo: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Solo Founder</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.isTechHeavy} 
              onChange={e => setFormData(f => ({ ...f, isTechHeavy: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">Technical Complexity High</span>
          </label>
        </section>

        {/* Reflection */}
        <section>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Post-Mortem Synthesis (One Sentence)</label>
          <textarea 
            rows={2}
            value={formData.reflection}
            onChange={e => setFormData(f => ({ ...f, reflection: e.target.value }))}
            placeholder="Example: I mistook intellectual curiosity for a viable market demand."
            className="w-full bg-white border border-slate-200 px-4 py-3 rounded text-sm italic focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-300 transition-all"
          />
        </section>

        <div className="pt-8 border-t border-slate-200">
          <button
            type="submit"
            className="w-full py-5 bg-slate-900 text-white text-xs font-bold uppercase tracking-[0.2em] rounded hover:bg-black transition-all shadow-xl active:scale-[0.99]"
          >
            Commit to Archive
          </button>
          <p className="text-[9px] text-slate-400 text-center mt-6 uppercase tracking-widest font-medium">
            Subject to manual review before publication. No personal identifiers are stored.
          </p>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;
