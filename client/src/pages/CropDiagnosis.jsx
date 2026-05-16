import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UploadBox from '../components/upload/UploadBox';
import ImagePreview from '../components/upload/ImagePreview';
import AnalyzeButton from '../components/upload/AnalyzeButton';
import LoadingOverlay from '../components/upload/LoadingOverlay';
import DiseaseCard from '../components/result/DiseaseCard';
import RiskCard from '../components/result/RiskCard';
import YieldCard from '../components/result/YieldCard';
import LoanCard from '../components/result/LoanCard';
import RecommendationBox from '../components/result/RecommendationBox';
import SustainabilityCard from '../components/result/SustainabilityCard';
import { buildFallbackResultPayload, normalizeResultPayload } from '../services/resultDataMapper';

const CROP_OPTIONS = [
	'Apple', 'Banana', 'Barley', 'Black Pepper', 'Cabbage',
	'Cardamom', 'Carrot', 'Cashew', 'Cauliflower', 'Chili',
	'Coffee', 'Cotton', 'Garlic', 'Ginger', 'Gram',
	'Grapes', 'Groundnut', 'Jute', 'Lemon', 'Maize',
	'Mango', 'Mustard', 'Onion', 'Orange', 'Papaya',
	'Peas', 'Potato', 'Rice', 'Rubber', 'Soybean',
	'Sugarcane', 'Sunflower', 'Tea', 'Tomato', 'Turmeric', 'Wheat',
];

const sideLinks = [
	{ label: 'Overview', to: '/dashboard' },
	{ label: 'Crop Intelligence', to: '/upload', active: true },
	{ label: 'Credit Pulse', to: '/analytics' },
	{ label: 'Support', to: '/chat' },
	{ label: 'Profile', to: '/profile' },
];

const CropDiagnosis = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [imageFile, setImageFile] = useState(null);
	const [previewURL, setPreviewURL] = useState(null);
	const [loading, setLoading] = useState(false);
	const [analysisResult, setAnalysisResult] = useState(null);

	const [cropType, setCropType] = useState('');
	const [farmLocation, setFarmLocation] = useState('');
	const [fertilizerUsage, setFertilizerUsage] = useState('Medium');

	const confidenceLevel = useMemo(() => {
		const value = Number(analysisResult?.confidence ?? 0);
		if (value >= 90) return 'High';
		if (value >= 70) return 'Medium';
		return 'Low';
	}, [analysisResult]);

	const handleFileSelect = (file) => {
		setImageFile(file);
		const objectUrl = URL.createObjectURL(file);
		setPreviewURL(objectUrl);
		setAnalysisResult(null);
	};

	const handleRemoveImage = () => {
		setImageFile(null);
		if (previewURL) URL.revokeObjectURL(previewURL);
		setPreviewURL(null);
		setAnalysisResult(null);
	};

	const handleAnalyze = async () => {
		if (!imageFile) return;

		setLoading(true);

		try {
			const formData = new FormData();
			formData.append('image', imageFile);
			formData.append('crop', cropType);
			formData.append('location', farmLocation || 'Maharashtra');
			formData.append('fertilizerUsage', fertilizerUsage || 'Medium');
			if (user?.id) {
				formData.append('farmerId', user.id);
			}

			let normalized;
			try {
				const response = await fetch('/api/analyze', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`API error: ${response.status}`);
				}

				const json = await response.json();
				normalized = normalizeResultPayload(json.data, {
					image: previewURL,
				});
			} catch (apiError) {
				console.warn('Analyze API unavailable, using fallback:', apiError.message);
				normalized = buildFallbackResultPayload({
					id: `mock-${Date.now()}`,
					image: previewURL,
					crop: cropType,
					location: farmLocation || 'Maharashtra',
					dataMode: {
						source: 'frontend-mock',
						fallbackUsed: true,
					},
				});
			}

			setAnalysisResult(normalized);
			window.dispatchEvent(new Event('agri:analysis-created'));
		} catch (error) {
			console.error('Crop analysis failed:', error);
			alert('Could not complete analysis. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100">
			<div className="mx-auto max-w-[1500px] px-4 pb-28 pt-8 md:px-8 lg:px-10">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
					<aside className="hidden lg:col-span-2 lg:block">
						<div className="sticky top-24 rounded-2xl border border-slate-700/70 bg-slate-800/60 p-4 backdrop-blur">
							<p className="px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300/80">Digital Agronomist</p>
							<nav className="mt-4 space-y-1" aria-label="Diagnosis side navigation">
								{sideLinks.map((link) => (
									<Link
										key={link.label}
										to={link.to}
										className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
											link.active
												? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white'
												: 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
										}`}
									>
										{link.label}
									</Link>
								))}
							</nav>
							<button
								onClick={() => navigate('/analytics')}
								className="mt-6 w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500"
							>
								Apply for Credit
							</button>
						</div>
					</aside>

					<div className="lg:col-span-10">
						<header className="mb-8 rounded-2xl border border-slate-700/70 bg-slate-800/50 p-6">
							<p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-300/80">Crop Intelligence Engine</p>
							<h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Diagnosis & Recovery</h1>
							<p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
								Upload a leaf sample to run AI diagnosis and immediately review risk, yield impact,
								trust-readiness, and treatment recommendations in one workflow.
							</p>
						</header>

						<div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
							<section className="xl:col-span-4 space-y-5">
								<div className="rounded-2xl border border-slate-700/70 bg-slate-800/70 p-5">
									<div className="mb-4 flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-slate-950">1</div>
										<h2 className="text-lg font-bold text-white">Capture & Upload</h2>
									</div>
									{!previewURL ? (
										<UploadBox onFileSelect={handleFileSelect} />
									) : (
										<ImagePreview previewURL={previewURL} fileName={imageFile?.name} onRemove={handleRemoveImage} />
									)}
								</div>

								<div className="rounded-2xl border border-slate-700/70 bg-slate-800/70 p-5">
									<div className="mb-4 flex items-center justify-between">
										<h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-300">Inference Engine</h3>
										<span className="rounded-full border border-emerald-300/30 bg-emerald-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-200">
											Active
										</span>
									</div>
									<div className="space-y-2 text-sm text-slate-300">
										<div className="flex items-center justify-between"><span>Architecture</span><strong>MobileNetV2</strong></div>
										<div className="flex items-center justify-between"><span>Quantization</span><strong>INT8 Optimized</strong></div>
										<div className="flex items-center justify-between"><span>Latency</span><strong>~142ms</strong></div>
									</div>
								</div>

								<div className="rounded-2xl border border-slate-700/70 bg-slate-800/70 p-5 space-y-4">
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Crop Type</label>
										<input
											list="diagnosis-crop-options"
											value={cropType}
											onChange={(e) => setCropType(e.target.value)}
											placeholder="Select crop"
											className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
										/>
										<datalist id="diagnosis-crop-options">
											{CROP_OPTIONS.map((crop) => (
												<option key={crop} value={crop} />
											))}
										</datalist>
									</div>
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Farm Location</label>
										<input
											value={farmLocation}
											onChange={(e) => setFarmLocation(e.target.value)}
											placeholder="e.g. Maharashtra"
											className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
										/>
									</div>
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Fertilizer Usage</label>
										<select
											value={fertilizerUsage}
											onChange={(e) => setFertilizerUsage(e.target.value)}
											className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
										>
											<option value="Low">Low</option>
											<option value="Medium">Medium</option>
											<option value="High">High</option>
										</select>
									</div>

									<AnalyzeButton disabled={!previewURL || !cropType || loading} onClick={handleAnalyze} />
								</div>
							</section>

							<section className="xl:col-span-8 space-y-6">
								<div className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-800/70">
									<div className="grid grid-cols-1 lg:grid-cols-2">
										<div className="relative min-h-[300px] bg-slate-900">
											{previewURL ? (
												<img src={previewURL} alt="Leaf diagnosis sample" className="h-full w-full object-cover" />
											) : (
												<div className="flex h-full min-h-[300px] items-center justify-center px-6 text-center text-slate-400">
													Upload a leaf image to render diagnostic overlays and confidence insight.
												</div>
											)}

											{analysisResult && (
												<div className="absolute left-3 top-3 rounded-xl border border-slate-200/20 bg-slate-950/70 px-3 py-2">
													<p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300">Health Score</p>
													<p className="text-2xl font-black text-amber-300">{Math.max(0, 100 - Math.round((analysisResult.riskScore || 0) * 100))}</p>
												</div>
											)}
										</div>

										<div className="p-6 lg:p-7">
											{!analysisResult ? (
												<div className="flex h-full flex-col justify-center">
													<p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Awaiting Diagnosis</p>
													<h2 className="mt-2 text-2xl font-black text-white">Run analysis to generate recovery plan</h2>
													<p className="mt-3 text-sm text-slate-300">
														After analysis, this panel will show detected disease, confidence, severity, and immediate interventions.
													</p>
												</div>
											) : (
												<>
													<p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rose-300">Action Required</p>
													<h2 className="mt-1 text-3xl font-black text-white">{analysisResult.disease}</h2>
													<div className="mt-4 grid grid-cols-2 gap-3">
														<div className="rounded-xl border border-slate-600/60 bg-slate-900/50 p-3">
															<p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Confidence</p>
															<p className="text-xl font-bold text-emerald-300">{analysisResult.confidence}%</p>
														</div>
														<div className="rounded-xl border border-slate-600/60 bg-slate-900/50 p-3">
															<p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Severity</p>
															<p className="text-xl font-bold text-amber-300">{analysisResult.severity || confidenceLevel}</p>
														</div>
													</div>

													<p className="mt-4 text-sm text-slate-300">
														AI has detected likely pathology indicators from the submitted sample.
														Follow the treatment guidance below and re-check in 3-5 days.
													</p>

													<button
														onClick={() => navigate(`/result/${analysisResult.id || Date.now()}`, { state: { analysisData: analysisResult } })}
														className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500"
													>
														Open Full Report
													</button>
												</>
											)}
										</div>
									</div>
								</div>

								{analysisResult && (
									<>
										<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
											<DiseaseCard disease={analysisResult.disease} confidence={analysisResult.confidence} />
											<RiskCard riskLevel={analysisResult.riskLevel} riskScore={analysisResult.riskScore} />
											<YieldCard projectedYield={analysisResult.projectedYield} estimatedLoss={analysisResult.estimatedLoss} />
											<LoanCard trustScore={analysisResult.trustScore} eligibility={analysisResult.eligibility} rating={analysisResult.rating} />
										</div>

										<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
											<RecommendationBox recommendations={analysisResult.recommendations} />
											<SustainabilityCard
												sustainabilityScore={analysisResult.sustainabilityScore}
												breakdown={analysisResult.sustainabilityBreakdown}
											/>
										</div>
									</>
								)}
							</section>
						</div>
					</div>
				</div>
			</div>

			<nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-slate-700/70 bg-slate-950/95 px-2 py-2 lg:hidden">
				<Link to="/dashboard" className="rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Home</Link>
				<Link to="/upload" className="rounded-xl bg-emerald-600/20 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-300">Crops</Link>
				<Link to="/analytics" className="rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Finance</Link>
				<Link to="/profile" className="rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Profile</Link>
			</nav>

			<LoadingOverlay isVisible={loading} />
		</div>
	);
};

export default CropDiagnosis;
