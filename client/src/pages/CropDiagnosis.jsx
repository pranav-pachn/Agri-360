import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { api } from '../services/api';
import { normalizeResultPayload } from '../services/resultDataMapper';

const CROP_OPTIONS = [
	'Apple', 'Banana', 'Barley', 'Black Pepper', 'Cabbage',
	'Cardamom', 'Carrot', 'Cashew', 'Cauliflower', 'Chili',
	'Coffee', 'Cotton', 'Garlic', 'Ginger', 'Gram',
	'Grapes', 'Groundnut', 'Jute', 'Lemon', 'Maize',
	'Mango', 'Mustard', 'Onion', 'Orange', 'Papaya',
	'Peas', 'Potato', 'Rice', 'Rubber', 'Soybean',
	'Sugarcane', 'Sunflower', 'Tea', 'Tomato', 'Turmeric', 'Wheat',
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

	const actionState = useMemo(() => {
		const disease = String(analysisResult?.disease || '').toLowerCase();
		const severity = String(analysisResult?.severity || '').toLowerCase();

		if (!analysisResult) {
			return { label: 'Awaiting Diagnosis', className: 'text-slate-400' };
		}

		if (disease.includes('healthy') || severity === 'none') {
			return { label: 'No Immediate Action', className: 'text-emerald-300' };
		}

		if (severity === 'high' || severity === 'critical') {
			return { label: 'Immediate Treatment Recommended', className: 'text-rose-300' };
		}

		return { label: 'Monitor Crop', className: 'text-amber-300' };
	}, [analysisResult]);

	const displayedHealthScore = useMemo(() => {
		const directHealthScore = Number(analysisResult?.healthScore);
		if (Number.isFinite(directHealthScore) && directHealthScore > 0) {
			return Math.max(0, Math.min(100, Math.round(directHealthScore)));
		}

		return Math.max(0, 100 - Math.round((analysisResult?.riskScore || 0) * 100));
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

			const json = await api.post('/analyze', formData);
			const normalized = normalizeResultPayload(json.data, {
				image: previewURL,
			});

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
		<div className="page-wrapper">
			<div className="page-inner">
				<div>
						<header className="card mb-2">
							<p className="section-kicker">Crop Intelligence Engine</p>
							<h1 className="mt-2 page-title">Diagnosis &amp; Recovery</h1>
							<p className="section-subtitle">
								Upload a leaf sample to run AI diagnosis and immediately review risk, yield impact,
								trust-readiness, and treatment recommendations in one workflow.
							</p>
						</header>

						<div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
							<section className="xl:col-span-4 space-y-5">
								<div className="card">
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

								<div className="card">
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

								<div className="card space-y-4">
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
								<div className="overflow-hidden card p-0">
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
													<p className="text-2xl font-black text-amber-300">{displayedHealthScore}</p>
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
													<p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${actionState.className}`}>{actionState.label}</p>
													<h2 className="mt-1 text-3xl font-black text-white">{analysisResult.disease}</h2>
													<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
														<div className="card-compact">
															<p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Confidence</p>
															<p className="text-xl font-bold text-emerald-300">{analysisResult.confidence}%</p>
														</div>
														<div className="card-compact">
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
														className="btn-saas-primary mt-5"
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
										<div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
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
			<LoadingOverlay isVisible={loading} />
		</div>
	);
};

export default CropDiagnosis;
