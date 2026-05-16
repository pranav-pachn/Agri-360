import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
	ArrowUpRight,
	BadgeCheck,
	CalendarClock,
	CircleAlert,
	HandCoins,
	MapPin,
	ShieldCheck,
	Sparkles,
	TrendingDown,
	TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../services/dashboardDataService';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const scoreToGrade = (score) => {
	if (score >= 750) return 'A';
	if (score >= 650) return 'B';
	return 'C';
};

const scoreToLoanBand = (score) => {
	if (score >= 780) return 'Excellent';
	if (score >= 700) return 'Strong';
	if (score >= 620) return 'Fair';
	return 'Needs Improvement';
};

const formatDate = (isoString) => {
	if (!isoString) return 'Unknown';
	const d = new Date(isoString);
	if (Number.isNaN(d.getTime())) return 'Unknown';
	return d.toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
};

export default function TrustScore() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const requestIdRef = useRef(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [payload, setPayload] = useState({
		trustScore: 700,
		riskScore: 0.4,
		riskLevel: 'Medium Risk',
		yieldValue: 2.7,
		yieldDelta: -8,
		analyses: [],
		dataMode: null,
	});

	useEffect(() => {
		if (!user?.id) {
			setLoading(false);
			return;
		}

		const load = async () => {
			const requestId = ++requestIdRef.current;
			setLoading(true);
			setError('');

			try {
				const data = await getDashboardData({ farmerId: user.id, user });
				if (requestId !== requestIdRef.current) return;
				setPayload(data);
			} catch (loadError) {
				if (requestId !== requestIdRef.current) return;
				setError(loadError?.message || 'Unable to load trust details.');
			} finally {
				if (requestId === requestIdRef.current) {
					setLoading(false);
				}
			}
		};

		load();
	}, [user]);

	const score = clamp(Number(payload.trustScore) || 0, 300, 900);
	const scorePercent = ((score - 300) / 600) * 100;
	const scoreArcLength = 2 * Math.PI * 92;
	const scoreStrokeOffset = scoreArcLength - (scorePercent / 100) * scoreArcLength;
	const grade = scoreToGrade(score);
	const recommendationBand = scoreToLoanBand(score);
	const latestReport = payload.analyses?.[0] || null;
	const riskScore = clamp(Number(payload.riskScore) || 0, 0, 1);
	const yieldDelta = Number(payload.yieldDelta) || 0;
	const yieldValue = Number(payload.yieldValue) || 0;

	const explainabilityFactors = useMemo(() => {
		const stability = clamp(Math.round((scorePercent + 20) / 1.2), 42, 98);
		const cropRisk = clamp(Math.round((1 - riskScore) * 100), 18, 96);
		const yieldConfidence = clamp(Math.round(64 + (yieldValue - 2.2) * 12), 22, 95);

		const latestDate = latestReport?.timestamp ? new Date(latestReport.timestamp) : null;
		const reportAgeDays = latestDate
			? Math.max(0, Math.round((Date.now() - latestDate.getTime()) / (1000 * 60 * 60 * 24)))
			: 12;
		const freshness = clamp(100 - reportAgeDays * 4, 28, 95);

		return [
			{
				label: 'Financial reliability',
				value: stability,
				note: 'Repayment potential from longitudinal behavior patterns',
			},
			{
				label: 'Crop-risk resilience',
				value: cropRisk,
				note: 'Weather and disease pressure impact on income certainty',
			},
			{
				label: 'Yield confidence',
				value: yieldConfidence,
				note: 'Expected harvest consistency across recent cycles',
			},
			{
				label: 'Data freshness',
				value: freshness,
				note: 'Recency of reports and telemetry updates',
			},
		];
	}, [scorePercent, riskScore, yieldValue, latestReport?.timestamp]);

	const summaryLine = useMemo(() => {
		if (recommendationBand === 'Excellent' || recommendationBand === 'Strong') {
			return 'Profile indicates a favorable lending posture with strong repayment confidence signals.';
		}

		if (recommendationBand === 'Fair') {
			return 'Profile is loan-eligible, with scope to improve terms through better crop risk controls.';
		}

		return 'Profile can improve quickly by reducing crop risk and increasing report consistency.';
	}, [recommendationBand]);

	if (loading) {
		return (
			<div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-10 text-white sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-6xl flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/70 py-20">
					<div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400" />
					<p className="mt-5 text-sm uppercase tracking-[0.22em] text-cyan-300">Loading trust intelligence</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-8 text-white sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl space-y-6">
				<header className="rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-slate-900 via-blue-950/70 to-slate-900 p-6 shadow-[0_25px_60px_-30px_rgba(14,116,144,0.7)] sm:p-8">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
								<ShieldCheck className="h-3.5 w-3.5" />
								Trust Intelligence Detail
							</div>
							<h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Trust Score Breakdown</h1>
							<p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">{summaryLine}</p>
							{payload?.dataMode?.label ? (
								<p className="mt-3 inline-flex rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
									{payload.dataMode.label}
								</p>
							) : null}
						</div>

						<button
							onClick={() => navigate('/dashboard')}
							className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
						>
							Back to Dashboard
							<ArrowUpRight className="h-4 w-4" />
						</button>
					</div>
				</header>

				{error ? (
					<div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
						<div className="flex items-center gap-2 font-semibold">
							<CircleAlert className="h-4 w-4" />
							Data warning
						</div>
						<p className="mt-2 text-amber-100/90">{error}</p>
					</div>
				) : null}

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
					<motion.article
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, ease: 'easeOut' }}
						className="xl:col-span-5 rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-emerald-800/80 via-green-800/70 to-cyan-900/70 p-6"
					>
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-white">Core Score</h2>
							<span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
								Grade {grade}
							</span>
						</div>

						<div className="mt-6 flex justify-center">
							<div className="relative h-60 w-60">
								<svg viewBox="0 0 240 240" className="h-full w-full -rotate-90">
									<circle cx="120" cy="120" r="92" stroke="rgba(255,255,255,0.16)" strokeWidth="18" fill="transparent" />
									<motion.circle
										cx="120"
										cy="120"
										r="92"
										stroke="#34d399"
										strokeWidth="18"
										fill="transparent"
										strokeLinecap="round"
										strokeDasharray={scoreArcLength}
										initial={{ strokeDashoffset: scoreArcLength }}
										animate={{ strokeDashoffset: scoreStrokeOffset }}
										transition={{ duration: 1.1, ease: 'easeOut' }}
									/>
								</svg>

								<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
									<p className="text-6xl font-black leading-none text-white">{score}</p>
									<p className="mt-2 text-xs uppercase tracking-[0.2em] text-emerald-100/80">out of 900</p>
									<p className="mt-4 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90">
										<BadgeCheck className="h-3.5 w-3.5" />
										{recommendationBand} profile
									</p>
								</div>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-4 text-sm">
							<div className="rounded-2xl border border-white/15 bg-slate-900/30 p-3">
								<p className="text-xs uppercase tracking-[0.16em] text-emerald-100/80">Yield outlook</p>
								<p className="mt-1 text-xl font-semibold text-white">{yieldValue.toFixed(1)} t/ac</p>
							</div>
							<div className="rounded-2xl border border-white/15 bg-slate-900/30 p-3">
								<p className="text-xs uppercase tracking-[0.16em] text-emerald-100/80">Risk score</p>
								<p className="mt-1 text-xl font-semibold text-white">{(riskScore * 100).toFixed(0)}%</p>
							</div>
						</div>
					</motion.article>

					<motion.article
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, ease: 'easeOut', delay: 0.04 }}
						className="xl:col-span-7 rounded-3xl border border-slate-700 bg-slate-800/75 p-6"
					>
						<h2 className="text-lg font-semibold text-white">Loan Recommendation</h2>

						<div className="mt-4 rounded-2xl border border-cyan-400/25 bg-cyan-500/10 p-4">
							<p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Suggested financing band</p>
							<p className="mt-1 text-2xl font-bold text-white">{recommendationBand}</p>
							<p className="mt-2 text-sm text-slate-200">{summaryLine}</p>
						</div>

						<div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
							<div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
								<p className="text-xs uppercase tracking-[0.16em] text-slate-400">Risk trend</p>
								<p className="mt-1 inline-flex items-center gap-1 text-lg font-semibold text-rose-300">
									<TrendingDown className="h-4 w-4" />
									{(riskScore * 100).toFixed(0)}%
								</p>
								<p className="mt-1 text-xs text-slate-400">{payload.riskLevel || 'Risk profile detected'}</p>
							</div>

							<div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
								<p className="text-xs uppercase tracking-[0.16em] text-slate-400">Yield delta</p>
								<p className="mt-1 inline-flex items-center gap-1 text-lg font-semibold text-emerald-300">
									<TrendingUp className="h-4 w-4" />
									{yieldDelta > 0 ? '+' : ''}
									{yieldDelta}%
								</p>
								<p className="mt-1 text-xs text-slate-400">vs. seasonal baseline</p>
							</div>

							<div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
								<p className="text-xs uppercase tracking-[0.16em] text-slate-400">Recent update</p>
								<p className="mt-1 inline-flex items-center gap-1 text-lg font-semibold text-cyan-300">
									<CalendarClock className="h-4 w-4" />
									{formatDate(latestReport?.timestamp)}
								</p>
								<p className="mt-1 text-xs text-slate-400">last report sync</p>
							</div>
						</div>

						<div className="mt-5 flex flex-wrap gap-3">
							<button
								onClick={() => navigate('/upload')}
								className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
							>
								<Sparkles className="h-4 w-4" />
								Improve with New Analysis
							</button>
							<button
								onClick={() => navigate('/dashboard')}
								className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
							>
								<HandCoins className="h-4 w-4" />
								Return to Loan Panel
							</button>
						</div>
					</motion.article>
				</section>

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
					<article className="xl:col-span-7 rounded-3xl border border-slate-700 bg-slate-800/70 p-6">
						<h2 className="text-lg font-semibold text-white">Explainability Factors</h2>
						<p className="mt-1 text-sm text-slate-400">Signals influencing this trust score and lender confidence.</p>

						<div className="mt-5 space-y-4">
							{explainabilityFactors.map((factor) => (
								<div key={factor.label} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
									<div className="flex items-center justify-between gap-4">
										<div>
											<p className="text-sm font-semibold text-white">{factor.label}</p>
											<p className="mt-1 text-xs text-slate-400">{factor.note}</p>
										</div>
										<p className="text-sm font-semibold text-cyan-200">{factor.value}%</p>
									</div>
									<div className="mt-3 h-2 rounded-full bg-slate-700">
										<div
											className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300"
											style={{ width: `${factor.value}%` }}
										/>
									</div>
								</div>
							))}
						</div>
					</article>

					<article className="xl:col-span-5 rounded-3xl border border-slate-700 bg-slate-800/70 p-6">
						<h2 className="text-lg font-semibold text-white">Regional Context</h2>

						<div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
							<p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
								<MapPin className="h-4 w-4" />
								{latestReport?.location || 'Location pending'}
							</p>
							<p className="mt-1 text-xs text-slate-400">Latest analyzed crop: {latestReport?.crop || 'Unknown crop'}</p>
						</div>

						<div className="mt-4 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-slate-900 p-4">
							<div className="relative h-40 rounded-xl border border-cyan-300/15 bg-slate-900/60">
								<div className="absolute left-5 top-6 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
								<div className="absolute bottom-8 right-8 h-20 w-20 rounded-full bg-emerald-400/20 blur-2xl" />
								<div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_0_6px_rgba(34,211,238,0.25)]" />
							</div>
							<p className="mt-3 text-xs text-slate-300">Geo-linked risk profile is refreshed with each new diagnosis report.</p>
						</div>

						<div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
							<p className="font-semibold text-white">Next best step</p>
							<p className="mt-2 leading-6">Upload a fresh crop image to reduce uncertainty in risk estimation and improve lending confidence.</p>
						</div>
					</article>
				</section>
			</div>
		</div>
	);
}
