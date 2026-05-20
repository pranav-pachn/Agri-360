import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';
import ImagePanel from '../components/result/ImagePanel';
import DiseaseCard from '../components/result/DiseaseCard';
import RiskCard from '../components/result/RiskCard';
import RiskBreakdown from '../components/result/RiskBreakdown';
import YieldCard from '../components/result/YieldCard';
import LoanCard from '../components/result/LoanCard';
import RecommendationBox from '../components/result/RecommendationBox';
import ExplainabilityBox from '../components/result/ExplainabilityBox';
import SustainabilityCard from '../components/result/SustainabilityCard';
import { api } from '../services/api';
import { buildFallbackResultPayload, normalizeResultPayload } from '../services/resultDataMapper';

const Result = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (location.state?.analysisData) {
      setData(normalizeResultPayload(location.state.analysisData));
    } else {
      const fetchAnalysis = async () => {
        try {
          const analysis = await api.get(`/analysis/${id}`);
          if (isMounted) setData(normalizeResultPayload(analysis));
        } catch (error) {
          console.error('Failed to fetch analysis by id, using fallback:', error);
          if (isMounted) {
            setData(buildFallbackResultPayload({
              id: id || 'mock-analysis',
              dataMode: { source: 'frontend-mock', fallbackUsed: true },
            }));
          }
        }
      };
      fetchAnalysis();
    }

    return () => { isMounted = false; };
  }, [id, location.state]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950">
        <div className="h-14 w-14 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        <p className="animate-pulse text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
          Loading analysis report...
        </p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">

        {/* Page Header Card */}
        <div className="hero-panel">
          <div className="hero-glow -left-20 -top-20 h-56 w-56 bg-cyan-500" />
          <div className="hero-glow right-0 top-0 h-64 w-64 bg-emerald-500" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="section-kicker">Analysis Complete</span>
                <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                  {data?.dataMode?.fallbackUsed ? 'Fallback Data' : 'Live Data'}
                </span>
              </div>
              <h1 className="page-title">Crop Assessment Report</h1>
              <p className="section-subtitle">
                Comprehensive breakdown of crop health, risk factors, and financial eligibility based on your recent scan.
              </p>
            </div>
            <button
              onClick={() => navigate('/upload')}
              className="btn-saas-primary shrink-0"
            >
              <Plus className="h-4 w-4" />
              New Analysis
            </button>
          </div>
        </div>

        {/* Main Content: two-column */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.02fr_1.24fr]">

          {/* LEFT: Image + context */}
          <div className="flex flex-col gap-6">
            <ImagePanel imageUrl={data.image} />

            <div className="card flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed text-gray-400">
                This report is generated using advanced AI analysis. Results are estimates and should be verified with local agricultural experts for critical decisions.
              </p>
            </div>
          </div>

          {/* RIGHT: Result cards */}
          <div className="flex flex-col gap-6">
            <LoanCard
              trustScore={data.trustScore}
              eligibility={data.eligibility}
              rating={data.rating}
            />

            <DiseaseCard
              disease={data.disease}
              confidence={data.confidence}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <RiskCard riskLevel={data.riskLevel} riskScore={data.riskScore} />
              <RiskBreakdown
                data={{
                  riskScore: data.riskScore ?? 0,
                  riskCategory: data.riskLevel ?? data.riskCategory,
                  confidence: data.riskConfidence ?? data.confidence ?? 0.75,
                  breakdown: data.riskBreakdown ?? data.breakdown ?? [],
                  explanation: data.riskExplanation ?? data.explanation ?? '',
                }}
              />
              <YieldCard projectedYield={data.projectedYield} estimatedLoss={data.estimatedLoss} />
            </div>

            <RecommendationBox recommendations={data.recommendations} />
            <SustainabilityCard
              sustainabilityScore={data.sustainabilityScore}
              breakdown={data.sustainabilityBreakdown}
            />
            <ExplainabilityBox
              disease={data.disease}
              confidence={data.confidence}
              severity={data.severity}
              riskScore={data.riskScore}
              explanationText={data.explainabilityText}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Result;
