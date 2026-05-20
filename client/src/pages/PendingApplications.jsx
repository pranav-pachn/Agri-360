import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Search, XCircle, ClipboardList, RefreshCw } from 'lucide-react';
import {
  getLoanApplicationsRequest,
  updateLoanApplicationStatusRequest,
} from '../services/farmersApi';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const RISK_PILL = {
  low: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
  medium: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
  high: 'bg-red-500/15 text-red-300 border border-red-500/20',
};

const STATUS_PILL = {
  approved: 'bg-emerald-500/15 text-emerald-300',
  rejected: 'bg-red-500/15 text-red-300',
  pending: 'bg-amber-500/15 text-amber-300',
};

export default function PendingApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState('');

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getLoanApplicationsRequest({
          status: statusFilter === 'all' ? '' : statusFilter,
          page,
          pageSize: PAGE_SIZE,
          search,
        });

        if (!response.ok) throw new Error(`Failed to load applications: ${response.status}`);

        const payload = await response.json();
        const data = payload?.data || {};

        if (!active) return;
        setItems(Array.isArray(data.items) ? data.items : []);
        setTotal(Number.isFinite(Number(data.total)) ? Number(data.total) : 0);
      } catch (loadError) {
        if (!active) return;
        setItems([]);
        setTotal(0);
        setError(loadError.message || 'Failed to load applications.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [page, search, statusFilter]);

  const setStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      const response = await updateLoanApplicationStatusRequest(applicationId, status);
      if (!response.ok) throw new Error(`Failed to update status: ${response.status}`);
      setItems(current =>
        current.map(item =>
          item.id === applicationId ? { ...item, status, updatedAt: new Date().toISOString() } : item
        )
      );
    } catch (updateError) {
      setError(updateError.message || 'Could not update application status.');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-inner">

        {/* Page Header */}
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="h-5 w-5 text-emerald-400" />
            <p className="section-kicker">Loan Officer Workspace</p>
          </div>
          <h1 className="page-title">Pending Applications</h1>
          <p className="section-subtitle">
            Review incoming applications, search by farmer or location, and update workflow status directly.
          </p>
        </div>

        {/* Filter + Search */}
        <div className="card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                placeholder="Search farmer, crop, location..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Status filters */}
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setPage(1); setStatusFilter(opt.value); }}
                  className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-all ${
                    statusFilter === opt.value
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-900/30'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>

        {/* Application list */}
        <div className="space-y-3">
          {loading ? (
            // Skeleton loading
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="card">
                  <div className="flex items-center gap-4">
                    <div className="skeleton h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-40" />
                      <div className="skeleton h-3 w-60" />
                    </div>
                    <div className="skeleton h-8 w-24 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="card flex flex-col items-center py-16 text-center">
              <ClipboardList className="h-12 w-12 text-slate-600 mb-4" />
              <p className="text-base font-semibold text-slate-300">No applications found</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            items.map((item) => {
              const riskKey = (item.riskCategory || 'medium').toLowerCase();
              const statusKey = (item.status || 'pending').toLowerCase();
              return (
                <article key={item.id} className="card hover:border-white/20">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-base font-bold text-white">{item.name}</h2>
                        <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${RISK_PILL[riskKey] || RISK_PILL.medium}`}>
                          {riskKey} risk
                        </span>
                        <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${STATUS_PILL[statusKey] || STATUS_PILL.pending}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500 mb-1">
                        {item.crop} · {item.location}
                      </p>
                      <p className="text-sm text-slate-400">
                        Trust Score:{' '}
                        <strong className="text-white">{item.trustScore || '—'}</strong>
                        {'  ·  '}
                        Amount:{' '}
                        <strong className="text-white">₹{Number(item.requestedAmount || 0).toLocaleString('en-IN')}</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        disabled={item.status === 'approved' || updatingId === item.id}
                        onClick={() => setStatus(item.id, 'approved')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        disabled={item.status === 'rejected' || updatingId === item.id}
                        onClick={() => setStatus(item.id, 'rejected')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Pagination footer */}
        <div className="card flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.1em]">
            Page {page} of {totalPages} &nbsp;·&nbsp; {total} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="btn-saas-secondary text-xs px-4 py-2"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="btn-saas-secondary text-xs px-4 py-2"
            >
              Next →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
