import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ImagePanel from '../components/result/ImagePanel';
import DiseaseCard from '../components/result/DiseaseCard';
import RiskCard from '../components/result/RiskCard';
import YieldCard from '../components/result/YieldCard';
import LoanCard from '../components/result/LoanCard';
import RecommendationBox from '../components/result/RecommendationBox';
import ExplainabilityBox from '../components/result/ExplainabilityBox';
import SustainabilityCard from '../components/result/SustainabilityCard';
import { buildFallbackResultPayload, normalizeResultPayload } from '../services/resultDataMapper';

const Result = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Check if we received data from router navigation (e.g. from upload page)
    if (location.state?.analysisData) {
      setData(normalizeResultPayload(location.state.analysisData));
    } else {
      const fetchAnalysis = async () => {
        try {
          const response = await fetch(`/api/analysis/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to load analysis: ${response.status}`);
          }

          const analysis = await response.json();
          if (isMounted) {
            setData(normalizeResultPayload(analysis));
          }
        } catch (error) {
          console.error('Failed to fetch analysis by id, using fallback:', error);
          if (isMounted) {
            setData(
              buildFallbackResultPayload({
                id: id || 'mock-analysis',
                dataMode: {
                  source: 'frontend-mock',
                  fallbackUsed: true,
                },
              })
            );
          }
        }
      };

      fetchAnalysis();
    }

    return () => {
      isMounted = false;
    };
  }, [id, location.state]);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-400 font-medium animate-pulse">Loading analysis report...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-bold tracking-wider uppercase">Analysis Complete</span>
              <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-200">
                {data?.dataMode?.fallbackUsed ? 'Fallback Data' : 'Real Data'}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Crop Assessment Report
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Comprehensive breakdown of crop health, risk factors, and financial eligibility based on your recent scan.
            </p>
          </div>
          <button 
            onClick={() => navigate('/upload')}
            className="flex items-center px-5 py-2.5 bg-slate-800 text-white font-medium rounded-xl border border-slate-700 hover:bg-slate-700 hover:border-slate-500 transition-all shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            New Analysis
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT SIDE: Image panel */}
          <div className="space-y-6 flex flex-col">
            <ImagePanel imageUrl={data.image} />
            
            {/* Optional context box that fits nicely under the image */}
            <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-800 text-sm text-slate-400">
              <p className="flex items-start">
                <svg className="w-5 h-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                This report is generated using advanced AI analysis. Results are estimates and should be verified with local agricultural experts for critical decisions.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Information Cards */}
          <div className="space-y-5 flex flex-col">
            
            {/* MOST IMPORTANT: Loan / Trust Score */}
            <LoanCard 
              trustScore={data.trustScore} 
              eligibility={data.eligibility} 
              rating={data.rating} 
            />

            {/* Disease Detection */}
            <DiseaseCard 
              disease={data.disease} 
              confidence={data.confidence} 
            />

            {/* Risk & Yield: Side-by-side on mobile, or responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <RiskCard 
                riskLevel={data.riskLevel} 
                riskScore={data.riskScore} 
              />
              <YieldCard 
                projectedYield={data.projectedYield} 
                estimatedLoss={data.estimatedLoss} 
              />
            </div>

            {/* Recommended Actions */}
            <RecommendationBox 
              recommendations={data.recommendations} 
            />

            {/* Sustainability */}
            <SustainabilityCard 
              sustainabilityScore={data.sustainabilityScore} 
              breakdown={data.sustainabilityBreakdown} 
            />

            {/* Explainability AI Text */}
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
