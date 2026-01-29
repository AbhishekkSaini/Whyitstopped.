
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-16 py-8">
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">The Philosophy of WhyItStopped</h2>
        <p className="text-lg text-slate-600 leading-relaxed font-light">
          Success stories suffer from survivor bias. We celebrate the destination but rarely map the minefields. 
          <span className="font-bold text-slate-900"> WhyItStopped</span> is an objective repository designed to document the exact coordinates where momentum dies.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest">Research Goal</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            By aggregating thousands of abandoned ideas, we can identify systemic failure patterns. We want to know if "burnout" is correlated with technical complexity, or if "lack of traction" is simply the default state of non-solo founders.
          </p>
        </section>
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Safe & Neutral</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            This is not a social network. There are no likes, no comments, and no public judgment. Every record is treated as a clinical data point in the collective history of builder efforts.
          </p>
        </section>
      </div>

      <section className="bg-slate-900 text-white p-10 rounded-lg shadow-2xl">
        <h3 className="text-xl font-bold mb-6">Archive Standards</h3>
        <div className="grid grid-cols-1 gap-8 text-slate-300 text-sm leading-relaxed">
          <div className="space-y-2">
            <h4 className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">What we document</h4>
            <p>Honest, clinical post-mortems. Technical hurdles. Strategic miscalculations. Team dynamics (including toxic experiences when described objectively).</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-rose-400 font-bold uppercase text-[10px] tracking-widest">What we reject</h4>
            <p>Memes, jokes, trolling, hateful language, venting without insight, and low-effort entries. Our curation team filters the archive to maintain research integrity.</p>
          </div>
        </div>
      </section>

      <section className="pt-12 border-t border-slate-200">
        <p className="text-xs text-slate-400 text-center font-medium uppercase tracking-[0.3em]">
          Knowledge through Failure. Integrity through Anonymity.
        </p>
      </section>
    </div>
  );
};

export default AboutSection;
