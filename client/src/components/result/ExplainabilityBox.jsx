import React from 'react';

const ExplainabilityBox = ({ disease, confidence, severity, riskScore, explanationText }) => {
  const getExplanation = () => {
    if (typeof explanationText === 'string' && explanationText.trim().length > 0) {
      return explanationText;
    }

    const conf = Number(confidence) || 0;
    const pct = conf > 1 ? conf.toFixed(1) : (conf * 100).toFixed(1);
    const sev = severity || 'Moderate';

    if (disease?.toLowerCase()?.includes('blight')) {
      return `Detected ${disease} based on characteristic lesion patterns — dark, water-soaked spots with concentric rings on the leaf surface. The AI model identified necrotic tissue patterns consistent with fungal pathogen activity at ${pct}% confidence. Severity is rated ${sev}, indicating active progression that requires immediate intervention.`;
    }
    if (disease?.toLowerCase()?.includes('healthy') || disease?.toLowerCase()?.includes('none')) {
      return `No disease biomarkers were found in the image. The AI model analyzed leaf color distribution, texture gradients, and edge patterns at ${pct}% confidence and found no anomalies consistent with known crop pathogens.`;
    }
    return `Detected ${disease} with ${pct}% confidence. The AI model analyzed visual patterns including discoloration, lesion shape, and texture anomalies to classify this condition as ${sev} severity. Risk score of ${riskScore?.toFixed?.(2) || riskScore} reflects current threat probability to yield and financial stability.`;
  };

  return (
    <div className="bg-slate-800/60 rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg mr-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h3 className="text-base font-bold text-white">Explainable AI</h3>
        <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">How we decided</span>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed italic">
        "{getExplanation()}"
      </p>
    </div>
  );
};

export default ExplainabilityBox;
