import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Search, XCircle } from 'lucide-react';
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

        if (!response.ok) {
          throw new Error(`Failed to load applications: ${response.status}`);
        }

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
    return () => {
      active = false;
    };
  }, [page, search, statusFilter]);

  const setStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      const response = await updateLoanApplicationStatusRequest(applicationId, status);
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      setItems((current) =>
        current.map((item) =>
          item.id === applicationId
            ? { ...item, status, updatedAt: new Date().toISOString() }
            : item
        )
      );
    } catch (updateError) {
      setError(updateError.message || 'Could not update application status.');
    } finally {
      setUpdatingId('');
    }
  };

  const riskPill = (riskCategory) => {
    if (riskCategory === 'low') return 'bg-emerald-100 text-emerald-800';
    if (riskCategory === 'medium') return 'bg-blue-100 text-blue-800';
    return 'bg-amber-100 text-amber-800';
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto w-full max-w-7xl space-y-6 py-2">
        <header className="rounded-[2rem] bg-surface-container-low p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Loan Officer Workspace</p>
          <h1 className="mt-2 text-4xl font-black leading-none tracking-tight">Pending Applications</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-on-surface-variant">
            Review incoming applications, search by farmer or location, and update workflow status directly.
          </p>
        </header>

        <section className="rounded-[2rem] bg-surface-container-high p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Search farmer, crop, location..."
                className="w-full rounded-full bg-surface-container-lowest py-2 pl-10 pr-4 text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setPage(1);
                    setStatusFilter(option.value);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] ${
                    statusFilter === option.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-lowest text-on-surface-variant'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</p>
          ) : null}
        </section>

        <section className="space-y-3">
          {loading ? (
            <div className="rounded-2xl bg-surface-container-low px-6 py-10 text-sm text-on-surface-variant">Loading applications...</div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl bg-surface-container-low px-6 py-10 text-sm text-on-surface-variant">No applications match your filters.</div>
          ) : (
            items.map((item) => (
              <article key={item.id} className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black">{item.name}</h2>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${riskPill(item.riskCategory)}`}>
                        {item.riskCategory || 'medium'} risk
                      </span>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-on-surface-variant">
                      {item.crop} • {item.location}
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      Trust Score: <strong className="text-on-surface">{item.trustScore || '--'}</strong>
                      {'  '}|{'  '}
                      Requested Amount: <strong className="text-on-surface">₹{Number(item.requestedAmount || 0).toLocaleString('en-IN')}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                      {item.status}
                    </span>
                    <button
                      disabled={item.status === 'approved' || updatingId === item.id}
                      onClick={() => setStatus(item.id, 'approved')}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      disabled={item.status === 'rejected' || updatingId === item.id}
                      onClick={() => setStatus(item.id, 'rejected')}
                      className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold uppercase text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <footer className="flex items-center justify-between rounded-2xl bg-surface-container-high px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant">
            Showing page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="rounded-full bg-surface-container-lowest px-4 py-2 text-xs font-bold uppercase disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="rounded-full bg-surface-container-lowest px-4 py-2 text-xs font-bold uppercase disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
