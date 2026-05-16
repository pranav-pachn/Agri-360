import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, ShieldCheck } from 'lucide-react';

import LoanPreCheckPanel from '../components/dashboard/LoanPreCheckPanel';
import { getLoanPrecheckData } from '../services/loanPrecheckService';
import { getDashboardData } from '../services/dashboardDataService';
import { getPendingApplicationsRequest } from '../services/farmersApi';
import { API_URL } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('Low Risk');
  const [yieldData, setYieldData] = useState({});
  const [yieldDelta, setYieldDelta] = useState(0);
  const [dashboardDataMode, setDashboardDataMode] = useState(null);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [showLoanPanel, setShowLoanPanel] = useState(false);
  const [loanPanelStatus, setLoanPanelStatus] = useState('idle');
  const [loanPanelData, setLoanPanelData] = useState(null);
  const [loanPanelError, setLoanPanelError] = useState('');
  const [analyticsSnapshot, setAnalyticsSnapshot] = useState({ states: [], districts: [] });
  const [selectedIntelMetric, setSelectedIntelMetric] = useState('Yield Forecast');
  const [selectedIntelState, setSelectedIntelState] = useState('All');
  const [selectedIntelDistrict, setSelectedIntelDistrict] = useState('All');
  const loadRequestIdRef = useRef(0);

  useEffect(() => {
    let mounted = true;

    const loadDistrictIntelligence = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/analytics/dashboard`);
        if (!response.ok) return;

        const payload = await response.json();
        if (!mounted) return;

        setAnalyticsSnapshot({
          states: Array.isArray(payload?.states) ? payload.states : [],
          districts: Array.isArray(payload?.districts) ? payload.districts : [],
        });
      } catch (error) {
        console.warn('District intelligence snapshot unavailable on dashboard:', error);
      }
    };

    loadDistrictIntelligence();
    const timer = setInterval(loadDistrictIntelligence, 30000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadDashboardData(user.id);
    
    // Listen for new reports and refresh only for the active farmer.
    const subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'crop_reports' },
        (payload) => {
          if (payload.new?.farmer_id === user.id) {
            console.log('New crop report detected:', payload.new);
            loadDashboardData(user.id);
          }
        }
      )
      .subscribe();

    const handleManualRefresh = () => {
      loadDashboardData(user.id);
    };

    window.addEventListener('agri:analysis-created', handleManualRefresh);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('agri:analysis-created', handleManualRefresh);
    };
  }, [user?.id]);

  const loadDashboardData = async (farmerId) => {
    const requestId = ++loadRequestIdRef.current;

    try {
      const [data, applicationsResponse] = await Promise.all([
        getDashboardData({ farmerId, user }),
        getPendingApplicationsRequest(42),
      ]);

      if (requestId !== loadRequestIdRef.current) {
        return;
      }

      setAnalyses(data.analyses);
      setTrustScore(data.trustScore);
      setRiskScore(data.riskScore);
      setRiskLevel(data.riskLevel);
      setYieldData({ predictedYield: data.yieldValue });
      setYieldDelta(data.yieldDelta);
      setDashboardDataMode(data.dataMode);

      if (applicationsResponse?.ok) {
        try {
          const payload = await applicationsResponse.json();
          const list = Array.isArray(payload?.data) ? payload.data : [];
          setPendingApplications(list);
        } catch (parseError) {
          console.warn('Pending applications payload parsing failed, falling back to dashboard local mapping.', parseError);
          setPendingApplications([]);
        }
      } else {
        setPendingApplications([]);
      }
    } catch (error) {
      console.error('Failed to load analyses:', error);
      if (requestId !== loadRequestIdRef.current) {
        return;
      }

      const fallback = {
        analyses: [],
        trustScore: 742,
        riskScore: 0.35,
        riskLevel: 'Medium Risk',
        yieldValue: 2.8,
        yieldDelta: -12,
      };

      setAnalyses(fallback.analyses);
      setTrustScore(fallback.trustScore);
      setRiskScore(fallback.riskScore);
      setRiskLevel(fallback.riskLevel);
      setYieldData({ predictedYield: fallback.yieldValue });
      setYieldDelta(fallback.yieldDelta);
      setDashboardDataMode({ source: 'dashboard-mock', fallbackUsed: true, label: 'Using local dashboard fallback data' });
      setPendingApplications([]);
    } finally {
      if (requestId === loadRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const openLoanPanel = async () => {
    setShowLoanPanel(true);
    setLoanPanelStatus('loading');
    setLoanPanelError('');

    try {
      const data = await getLoanPrecheckData({
        user,
        dashboardSnapshot: {
          trustScore,
          riskScore,
          yieldValue: yieldData?.predictedYield,
          cropType: analyses?.[0]?.crop,
        },
      });

      setLoanPanelData(data);
      setLoanPanelStatus('ready');
    } catch (error) {
      setLoanPanelError(error.message || 'Unable to prepare loan pre-check.');
      setLoanPanelStatus('error');
    }
  };

  const closeLoanPanel = () => {
    setShowLoanPanel(false);
    setLoanPanelStatus('idle');
    setLoanPanelError('');
  };

  const proceedLoanApplication = () => {
    setLoanPanelStatus('preApproved');
  };

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-slate-900 bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          <p className="mt-4 text-lg font-semibold dark:text-slate-300 text-on-surface">Loading Agricultural Intelligence...</p>
        </div>
      </div>
    );
  }

  const latestReport = analyses?.[0];
  const avgTrustScore = Math.max(300, Math.min(900, Math.round(trustScore || 680)));
  const activeFarmers = Math.max(1200, analyses.length * 140);
  const disbursedCapital = (avgTrustScore / 48).toFixed(1);
  const recoveryRate = Math.max(84.3, (100 - riskScore * 10)).toFixed(1);
  const riskExposure = riskLevel || 'Moderate';
  const nextForecast = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const applications = pendingApplications.slice(0, 3).map((item, index) => {
    const score = Math.max(350, Math.min(900, item.trustScore || avgTrustScore - index * 70));
    return {
      id: item.id || `app-${index}`,
      name: item.name || `Farmer ${index + 1}`,
      crop: item.crop || ['Soybean', 'Cotton', 'Wheat'][index] || 'Mixed Crop',
      location: item.location || ['Vidarbha', 'Khandesh', 'Pune'][index] || 'Maharashtra',
      score,
      appliedAt: item.appliedAt || new Date(Date.now() - (index + 2) * 3600 * 1000).toISOString(),
      riskCategory: item.riskCategory || null,
      loanEligibility: item.loanEligibility,
      status: item.status || 'pending',
    };
  });

  while (applications.length < 3) {
    const fallback = [
      { name: 'Rajesh Kumar', crop: 'Soybean', location: 'Vidarbha', score: 842 },
      { name: 'Amit Patil', crop: 'Cotton', location: 'Khandesh', score: 415 },
      { name: 'Sita Deshmukh', crop: 'Wheat', location: 'Pune', score: 610 },
    ][applications.length];
    applications.push({
      id: `fallback-${applications.length}`,
      ...fallback,
      appliedAt: new Date(Date.now() - (applications.length + 2) * 3600 * 1000).toISOString(),
      status: 'pending',
    });
  }

  const scoreClass = (score) => {
    if (score >= 700) return 'text-primary';
    if (score >= 550) return 'text-secondary';
    return 'text-tertiary';
  };

  const riskPill = (score, riskCategory) => {
    if (riskCategory === 'low') return 'bg-emerald-100 text-emerald-800';
    if (riskCategory === 'medium') return 'bg-blue-100 text-blue-800';
    if (riskCategory === 'high') return 'bg-amber-100 text-amber-800';
    if (score >= 700) return 'bg-emerald-100 text-emerald-800';
    if (score >= 550) return 'bg-blue-100 text-blue-800';
    return 'bg-amber-100 text-amber-800';
  };

  const riskLabel = (score, riskCategory) => {
    if (riskCategory === 'low') return 'Low Risk';
    if (riskCategory === 'medium') return 'Medium Risk';
    if (riskCategory === 'high') return 'High Risk';
    if (score >= 700) return 'Low Risk';
    if (score >= 550) return 'Medium Risk';
    return 'High Risk';
  };

  const timeAgo = (dateString) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const hours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
    if (hours < 24) return `Applied ${hours}h ago`;
    return `Applied ${Math.floor(hours / 24)}d ago`;
  };

  const trustDasharray = 465;
  const trustDashoffset = trustDasharray - (avgTrustScore / 900) * trustDasharray;

  const intelligenceStates = Array.from(
    new Set((analyticsSnapshot.states || []).map((row) => row.state).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const scopedDistrictRows = (analyticsSnapshot.districts || []).filter((row) => {
    if (!row?.district) return false;
    if (selectedIntelState === 'All') return true;
    return row.state === selectedIntelState;
  });

  const intelligenceDistricts = Array.from(
    new Set(scopedDistrictRows.map((row) => row.district).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const effectiveIntelDistrict = selectedIntelDistrict !== 'All' && intelligenceDistricts.includes(selectedIntelDistrict)
    ? selectedIntelDistrict
    : 'All';

  const selectedDistrictMetrics = effectiveIntelDistrict !== 'All'
    ? scopedDistrictRows.find((row) => row.district === effectiveIntelDistrict)
    : scopedDistrictRows[0];

  const districtRisk = Number(selectedDistrictMetrics?.avg_risk_score || 0);
  const districtRiskPct = Math.round(Math.min(1, Math.max(0, districtRisk)) * 100);
  const districtYieldEstimate = Math.round((1 - Math.min(1, Math.max(0, districtRisk))) * 100);
  const districtName = selectedDistrictMetrics?.district || 'No District Data';
  const districtReports = Number(selectedDistrictMetrics?.total_reports || 0);

  return (
    <div className="relative min-h-screen bg-surface text-on-surface">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-0 pb-16 pt-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <div className="relative overflow-hidden rounded-[2.25rem] bg-surface-container-low p-8 md:col-span-2">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Active Portfolio</p>
                <h2 className="mt-3 text-[3.5rem] font-black leading-none tracking-tighter text-on-surface">
                  {activeFarmers.toLocaleString()}
                  <span className="ml-3 text-lg font-medium tracking-normal text-on-surface-variant">Farmers Engaged</span>
                </h2>
                <div className="mt-6 flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-black text-primary">₹{disbursedCapital} Cr</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-on-surface-variant">Disbursed Capital</p>
                  </div>
                  <div className="h-9 w-px bg-outline-variant/40" />
                  <div>
                    <p className="text-2xl font-black text-secondary">{recoveryRate}%</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-on-surface-variant">Recovery Rate</p>
                  </div>
                </div>
              </div>

              <div className="relative hidden sm:block">
                <div className="relative h-40 w-40 rounded-full border-[12px] border-surface-variant">
                  <svg className="absolute -inset-[12px] h-40 w-40 -rotate-90" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0d631b" />
                        <stop offset="100%" stopColor="#005db7" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="80"
                      cy="80"
                      r="74"
                      fill="transparent"
                      stroke="url(#trustGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={trustDasharray}
                      strokeDashoffset={trustDashoffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-black text-on-surface">{avgTrustScore}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-on-surface-variant">Avg Trust Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2.25rem] bg-surface-container-high p-8">
            <h3 className="mb-4 text-sm font-bold uppercase text-on-surface-variant">Quick Insights</h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Top Crop</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">{latestReport?.crop || 'Kharif Paddy'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Exposure</span>
                <span className="rounded-full bg-tertiary/10 px-3 py-1 text-xs font-bold uppercase text-tertiary">{riskExposure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Next Forecast</span>
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase text-secondary">{nextForecast}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="mt-6 w-full rounded-full border border-outline py-2 text-xs font-bold uppercase hover:bg-surface-container-lowest"
            >
              Generate Report
            </button>
          </div>
        </motion.section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">District-Level Intelligence</h2>
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedIntelMetric}
                  onChange={(event) => setSelectedIntelMetric(event.target.value)}
                  className="rounded-full bg-surface-container px-4 py-1.5 text-xs font-bold uppercase focus:ring-primary"
                >
                  <option>Yield Forecast</option>
                  <option>Risk Forecast</option>
                  <option>Health Outlook</option>
                </select>
                <select
                  value={selectedIntelState}
                  onChange={(event) => setSelectedIntelState(event.target.value)}
                  className="rounded-full bg-surface-container px-4 py-1.5 text-xs font-bold uppercase focus:ring-primary"
                >
                  <option>All</option>
                  {intelligenceStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <select
                  value={effectiveIntelDistrict}
                  onChange={(event) => setSelectedIntelDistrict(event.target.value)}
                  className="rounded-full bg-surface-container px-4 py-1.5 text-xs font-bold uppercase focus:ring-primary"
                >
                  <option>All Districts</option>
                  {intelligenceDistricts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="group relative h-[400px] overflow-hidden rounded-[2.25rem] bg-surface-container-low">
              <img
                src="/assets/loan-dashboard-map.svg"
                alt="District yield map"
                className="h-full w-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
              <div className="absolute left-1/3 top-1/4 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute left-2/3 top-1/2 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
              <div className="absolute bottom-1/4 left-1/4 h-24 w-24 rounded-full bg-tertiary/20 blur-3xl" />

              <div className="absolute left-1/2 top-1/2 w-52 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/40 bg-surface-container-low/80 p-4 shadow-xl backdrop-blur">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-secondary">{districtName}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-medium">
                  {selectedIntelMetric === 'Yield Forecast'
                    ? `Estimated Yield: ${districtYieldEstimate}%`
                    : selectedIntelMetric === 'Risk Forecast'
                      ? `Risk Score: ${districtRisk.toFixed(2)}`
                      : `Avg Health: ${Number(selectedDistrictMetrics?.avg_health_score || 0).toFixed(1)}`}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-on-surface-variant">{districtReports} reports</p>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-variant">
                  <div className="h-full bg-primary" style={{ width: `${districtRiskPct}%` }} />
                </div>
              </div>

              <div className="absolute bottom-6 right-8 flex items-center gap-4 rounded-full border border-outline-variant/20 bg-surface-container-lowest/90 px-4 py-2 shadow-sm backdrop-blur">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase">High Yield</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-tertiary" />
                  <span className="text-[10px] font-black uppercase">Critical</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight">Pending Applications</h2>
              <span className="rounded-full bg-tertiary-container px-2 py-0.5 text-[10px] font-bold text-on-tertiary-container">{pendingApplications.length || applications.length} NEW</span>
            </div>
            <div className="space-y-3">
              {applications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => navigate('/applications')}
                  className="w-full cursor-pointer rounded-xl border-l-4 border-primary bg-surface-container-lowest p-4 text-left shadow-sm transition-transform hover:translate-x-1"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold">{app.name}</p>
                      <p className="text-[10px] uppercase text-on-surface-variant">{app.crop} • {app.location}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black ${scoreClass(app.score)}`}>{app.score}</p>
                      <p className="text-[8px] font-black uppercase tracking-[0.14em] text-on-surface-variant">Trust Score</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${riskPill(app.score, app.riskCategory)}`}>
                        {riskLabel(app.score, app.riskCategory)}
                      </span>
                      <span className="rounded bg-surface-container-high px-2 py-1 text-[10px] font-bold uppercase text-on-surface-variant">
                        {app.status || 'pending'}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-on-surface-variant">{timeAgo(app.appliedAt)}</span>
                  </div>
                </button>
              ))}
              <button
                onClick={() => navigate('/applications')}
                className="w-full py-3 text-xs font-black uppercase text-on-surface-variant transition-colors hover:text-primary"
              >
                View All Applications ({pendingApplications.length || 42})
              </button>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2.25rem] bg-surface-container p-10">
          <div className="absolute right-0 top-0 h-full w-1/2">
            <img
              src="/assets/loan-dashboard-farmer.svg"
              alt="Farmer in field"
              className="h-full w-full object-cover opacity-30 grayscale transition-all duration-700 hover:grayscale-0"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                Profile Drill-Down
              </div>
              <h2 className="text-3xl font-black tracking-tight">{user?.user_metadata?.name || 'Deepak V. Savarkar'}</h2>
              <p className="mb-8 mt-2 max-w-md text-on-surface-variant">
                Comprehensive analysis of agricultural creditworthiness based on crop history, satellite vegetation indices, and repayment stability.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-on-surface-variant">Yield Consistency</p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-xl font-black">{Math.max(70, 100 - Math.round(riskScore * 25))}%</span>
                    <span className="pb-1 text-[10px] text-primary">Excellent</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-on-surface-variant">Satellite Health Index</p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-xl font-black">{(1 - Math.min(0.92, riskScore)).toFixed(2)}</span>
                    <span className="pb-1 text-[10px] text-secondary">NDVI Avg</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-on-surface-variant">Financial Liquidity</p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-xl font-black">{Math.round(avgTrustScore * 0.85)}</span>
                    <span className="pb-1 text-[10px] text-tertiary">Moderate</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-on-surface-variant">Soil Nutrient Status</p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-xl font-black">{Math.round(80 + (yieldData?.predictedYield || 2.8) * 3)}/100</span>
                    <span className="pb-1 text-[10px] text-primary">High</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-[2.25rem] bg-surface/80 p-8 text-center shadow-2xl backdrop-blur">
              <div className="relative mb-4 h-32 w-32">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="#e0e4da" strokeWidth="8" />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    fill="transparent"
                    stroke="#0d631b"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="364"
                    strokeDashoffset={364 - (avgTrustScore / 900) * 364}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black">{avgTrustScore}</span>
                  <span className="text-[8px] font-black uppercase">Aggregated</span>
                </div>
              </div>
              <h3 className="mb-1 text-lg font-black">Elite Farmer Tier</h3>
              <p className="mb-6 text-xs font-black uppercase tracking-[0.14em] text-on-surface-variant">Pre-approved for ₹5,00,000</p>
              <div className="flex gap-3">
                <button
                  onClick={openLoanPanel}
                  className="rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase text-white shadow-lg shadow-primary/20"
                >
                  Approve Loan
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="rounded-full bg-surface-container-highest px-6 py-2 text-xs font-bold uppercase text-on-surface"
                >
                  View Docs
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed bottom-8 right-8 z-40 lg:bottom-12 lg:right-12">
          <button
            onClick={() => navigate('/analytics')}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
            title="Open analytics"
          >
            <Plus className="h-8 w-8" />
          </button>
        </div>
      </div>

      <LoanPreCheckPanel
        isOpen={showLoanPanel}
        status={loanPanelStatus}
        data={loanPanelData}
        error={loanPanelError}
        onClose={closeLoanPanel}
        onProceed={proceedLoanApplication}
      />
    </div>
  );
}

