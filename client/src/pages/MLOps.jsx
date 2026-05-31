import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle, Target, Database } from 'lucide-react';
import { api } from '../services/api';

const MLOps = () => {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    averageConfidence: 0,
    mostCommonDisease: 'N/A',
    modelAccuracy: 0
  });
  
  const [modelVersions, setModelVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/mlops/monitoring');
        if (statsRes?.data) setStats(statsRes.data);
        
        const versionsRes = await api.get('/mlops/model-versions');
        if (versionsRes?.data) setModelVersions(versionsRes.data);
      } catch (err) {
        console.error('Failed to load MLOps data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <header className="hero-panel mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <span className="section-kicker">Machine Learning Operations</span>
          </div>
          <h1 className="page-title">Monitoring Dashboard</h1>
          <p className="section-subtitle">Real-time performance metrics, user feedback loop, and model registry.</p>
        </header>

        {/* Monitoring Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Total Predictions</h3>
            </div>
            <p className="text-4xl font-black text-white">{stats.totalPredictions}</p>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Avg Confidence</h3>
            </div>
            <p className="text-4xl font-black text-white">{Number(stats.averageConfidence).toFixed(1)}%</p>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Most Common</h3>
            </div>
            <p className="text-2xl font-bold text-white truncate" title={stats.mostCommonDisease}>{stats.mostCommonDisease}</p>
          </div>
          
          <div className="card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckCircle className="h-24 w-24 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">User Accuracy</h3>
              </div>
              <p className="text-4xl font-black text-white">{Number(stats.modelAccuracy).toFixed(1)}%</p>
              <p className="text-xs text-slate-400 mt-2">Based on farmer feedback loop</p>
            </div>
          </div>
        </div>

        {/* Model Registry Table */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Model Registry</h2>
              <p className="text-sm text-slate-400">Historical versions and training metrics.</p>
            </div>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold text-slate-300 border border-slate-700">
              {modelVersions.length} versions
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Version</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Accuracy</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Dataset Size</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Classes</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date Trained</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody>
                {modelVersions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500 text-sm italic">No model versions registered yet.</td>
                  </tr>
                ) : (
                  modelVersions.map((v, i) => (
                    <tr key={v.id} className={`border-b border-white/5 ${i === 0 ? 'bg-emerald-500/5' : ''}`}>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded font-mono text-xs font-bold ${i === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'}`}>
                          {v.version} {i === 0 && '(Active)'}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-white">{(v.accuracy * 100).toFixed(1)}%</td>
                      <td className="py-4 px-4 text-slate-300">{v.dataset_size.toLocaleString()} imgs</td>
                      <td className="py-4 px-4 text-slate-300">{v.num_classes}</td>
                      <td className="py-4 px-4 text-slate-300">{new Date(v.date_trained).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-sm text-slate-400 max-w-xs truncate" title={v.notes}>{v.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MLOps;
