import React, { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PredictionFeedback = ({ predictionId, predictedDisease }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState('idle'); // 'idle' | 'feedback_given' | 'submitting'
  const [wasCorrect, setWasCorrect] = useState(null);
  const [correctedLabel, setCorrectedLabel] = useState('');
  
  const submitFeedback = async (isCorrect) => {
    setWasCorrect(isCorrect);
    
    if (isCorrect) {
      setStatus('submitting');
      try {
        await api.post('/mlops/prediction-feedback', {
          prediction_id: predictionId,
          was_correct: true,
          farmer_id: user?.id
        });
        setStatus('feedback_given');
      } catch (err) {
        console.error('Failed to submit feedback:', err);
        setStatus('idle');
      }
    } else {
      setStatus('needs_correction');
    }
  };

  const submitCorrection = async () => {
    if (!correctedLabel) return;
    
    setStatus('submitting');
    try {
      await api.post('/mlops/prediction-feedback', {
        prediction_id: predictionId,
        was_correct: false,
        corrected_label: correctedLabel,
        farmer_id: user?.id
      });
      setStatus('feedback_given');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setStatus('needs_correction');
    }
  };

  if (status === 'feedback_given') {
    return (
      <div className="bg-slate-800/60 rounded-2xl p-5 border border-emerald-500/20 text-center mt-6">
        <div className="mx-auto w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 text-emerald-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-white font-bold mb-1">Feedback Submitted</h3>
        <p className="text-sm text-slate-400">Thank you for helping improve the AgriMitra 360 AI Model!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 rounded-2xl p-5 border border-white/10 mt-6">
      <h3 className="text-sm font-bold text-white mb-1 tracking-wide uppercase">Prediction Feedback</h3>
      <p className="text-xs text-slate-400 mb-4">Help us improve the model. Was the prediction of <strong>{predictedDisease}</strong> correct?</p>
      
      {status === 'idle' || status === 'submitting' ? (
        <div className="flex gap-3">
          <button 
            disabled={status === 'submitting'}
            onClick={() => submitFeedback(true)}
            className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
          >
            Yes, it's correct
          </button>
          <button 
            disabled={status === 'submitting'}
            onClick={() => submitFeedback(false)}
            className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
          >
            No, it's wrong
          </button>
        </div>
      ) : (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">What is the actual condition?</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={correctedLabel}
              onChange={(e) => setCorrectedLabel(e.target.value)}
              placeholder="e.g. Healthy, Spider Mites..."
              className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
            <button 
              onClick={submitCorrection}
              disabled={!correctedLabel || status === 'submitting'}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionFeedback;
