import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut } from 'lucide-react';

// Import dashboard components
import TrustCard from '../components/dashboard/TrustCard';
import RiskCard from '../components/dashboard/RiskCard';
import YieldCard from '../components/dashboard/YieldCard';
import AIInsightPanel from '../components/dashboard/AIInsightPanel';
import RecentReports from '../components/dashboard/RecentReports';
import QuickActions from '../components/dashboard/QuickActions';
import LoanPreCheckPanel from '../components/dashboard/LoanPreCheckPanel';
import { getLoanPrecheckData } from '../services/loanPrecheckService';
import { getDashboardData } from '../services/dashboardDataService';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('Low Risk');
  const [yieldData, setYieldData] = useState({});
  const [yieldDelta, setYieldDelta] = useState(0);
  const [dashboardDataMode, setDashboardDataMode] = useState(null);
  const [showLoanPanel, setShowLoanPanel] = useState(false);
  const [loanPanelStatus, setLoanPanelStatus] = useState('idle');
  const [loanPanelData, setLoanPanelData] = useState(null);
  const [loanPanelError, setLoanPanelError] = useState('');

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

    return () => subscription.unsubscribe();
  }, [user?.id]);

  const loadDashboardData = async (farmerId) => {
    try {
      const data = await getDashboardData({ farmerId, user });
      setAnalyses(data.analyses);
      setTrustScore(data.trustScore);
      setRiskScore(data.riskScore);
      setRiskLevel(data.riskLevel);
      setYieldData({ predictedYield: data.yieldValue });
      setYieldDelta(data.yieldDelta);
      setDashboardDataMode(data.dataMode);
    } catch (error) {
      console.error('Failed to load analyses:', error);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/login');
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading Agricultural Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">🌾</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-white">AgriMitra 360</h1>
              <span className="ml-2 text-sm text-gray-300">Agricultural Intelligence Platform</span>
              {dashboardDataMode?.fallbackUsed && (
                <span className="ml-3 rounded-full border border-amber-300/40 bg-amber-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200">
                  Demo Mode
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Welcome back,</span>
              <span className="font-semibold text-white">{user?.name || 'Farmer'}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

      {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <TrustCard score={trustScore} />
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            <RiskCard risk={riskScore} />
            <YieldCard yieldValue={yieldData.predictedYield ?? 0} trendDelta={yieldDelta} />
          </div>
        </div>

        <AIInsightPanel
          riskLevel={riskLevel}
          riskScore={riskScore}
          yieldValue={yieldData.predictedYield ?? 0}
          yieldDelta={yieldDelta}
        />

        {/* Second Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentReports reports={analyses} />
          <QuickActions onApplyLoan={openLoanPanel} />
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
