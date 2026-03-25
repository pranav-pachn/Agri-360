import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, FileText, Sparkles } from 'lucide-react';

export default function RecentReports({ reports }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getScoreColor = (score) => {
    if (score >= 700) return 'text-green-300';
    if (score >= 600) return 'text-blue-300';
    if (score >= 500) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getRiskIndicator = (score) => {
    if (score >= 700) return { dot: 'bg-green-400', label: 'Low risk' };
    if (score >= 550) return { dot: 'bg-yellow-400', label: 'Medium risk' };
    return { dot: 'bg-red-400', label: 'High risk' };
  };

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.8)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            <FileText className="h-3.5 w-3.5" />
            Last analyses
          </div>
          <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
          <p className="mt-1 text-sm text-slate-300">Latest agricultural intelligence and trust outcomes</p>
        </div>

        <div className="rounded-2xl bg-blue-900/50 p-3 text-blue-300">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="rounded-2xl border border-slate-600 py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-300">No previous reports found</p>
            <p className="text-sm text-slate-400">Upload your first crop image to get started</p>
          </div>
        ) : (
          reports.map((report) => {
            const riskIndicator = getRiskIndicator(report.score);

            return (
            <motion.div 
              key={report.id}
              onClick={() => navigate(`/result/${report.id}`)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              whileHover={{ y: -2, scale: 1.005 }}
              className="group rounded-2xl border border-slate-600 bg-slate-700 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-slate-600 hover:shadow-md cursor-pointer"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-sm">
                    <span className="text-lg font-bold text-white">
                      {report.crop.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{report.crop}</h4>
                    <p className="text-sm text-slate-300">{report.location}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(report.timestamp)}</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(report.score)}`}>
                    {report.score}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-600 pt-3">
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${riskIndicator.dot}`} />
                    <span>{riskIndicator.label}</span>
                  </div>
                  <span className="text-slate-500">|</span>
                  <span>Yield {report.yield ?? '--'} t/ha</span>
                </div>
                
                <div className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors group-hover:text-blue-300">
                  View details
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          )})
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-blue-800 bg-blue-900/50 p-4 text-blue-200">
        <span className="text-sm font-medium">Track crop health, dates, and trust outcomes over time to show consistent farm performance.</span>
      </div>
    </div>
  );
}
