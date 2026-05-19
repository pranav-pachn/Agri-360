import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateFarmerProfileRequest, syncFarmerProfileRequest } from '../services/farmersApi';
import {
  User, MapPin, Globe, Wheat, Ruler, Tractor,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const CROP_OPTIONS = [
  'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Soybean',
  'Groundnut', 'Sunflower', 'Tomato', 'Potato', 'Onion', 'Banana',
  'Mango', 'Chilli', 'Turmeric', 'Ginger', 'Pulses', 'Other',
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी (Hindi)' },
  { value: 'mr', label: 'मराठी (Marathi)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
  { value: 'te', label: 'తెలుగు (Telugu)' },
  { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'ml', label: 'മലയാളം (Malayalam)' },
  { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: '< 2 years' },
  { value: 'intermediate', label: '2–5 years' },
  { value: 'experienced', label: '5–10 years' },
  { value: 'expert', label: '10+ years' },
];

const FARM_SIZE_OPTIONS = [
  { value: 'small', label: '< 1 acre' },
  { value: 'medium', label: '1–5 acres' },
  { value: 'large', label: '5–20 acres' },
  { value: 'xlarge', label: '20+ acres' },
];

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 'identity', label: 'Identity', icon: User },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'farm', label: 'Farm Details', icon: Wheat },
  { id: 'preferences', label: 'Preferences', icon: Globe },
];

// ─── Field component ──────────────────────────────────────────────────────────

const Field = ({ label, required, children, hint }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-slate-600">{hint}</p>}
  </div>
);

const inputCls =
  'w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20';

const selectCls =
  'w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 appearance-none';

// ─── Pill selector ────────────────────────────────────────────────────────────

const PillSelector = ({ options, value, onChange, name }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const val = typeof opt === 'string' ? opt : opt.value;
      const lbl = typeof opt === 'string' ? opt : opt.label;
      const active = value === val;
      return (
        <button
          key={val}
          type="button"
          onClick={() => onChange({ target: { name, value: val } })}
          className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-all ${
            active
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-900/30'
              : 'border border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
          }`}
        >
          {lbl}
        </button>
      );
    })}
  </div>
);

// ─── Step panels ──────────────────────────────────────────────────────────────

function StepIdentity({ form, onChange }) {
  return (
    <div className="space-y-5">
      <Field label="Full Name" required>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="e.g. Ramesh Kumar"
          className={inputCls}
        />
      </Field>
      <Field label="Phone Number" hint="Used for alerts only — never shared">
        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="+91 98765 43210"
          className={inputCls}
        />
      </Field>
      <Field label="Farming Experience">
        <PillSelector
          name="experience"
          options={EXPERIENCE_OPTIONS}
          value={form.experience}
          onChange={onChange}
        />
      </Field>
    </div>
  );
}

function StepLocation({ form, onChange }) {
  return (
    <div className="space-y-5">
      <Field label="State" required>
        <select name="state" value={form.state} onChange={onChange} className={selectCls}>
          <option value="">Select your state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field label="District / City" required>
        <input
          name="district"
          value={form.district}
          onChange={onChange}
          placeholder="e.g. Guntur"
          className={inputCls}
        />
      </Field>
      <Field label="Village / Taluka" hint="Optional — helps improve local weather accuracy">
        <input
          name="village"
          value={form.village}
          onChange={onChange}
          placeholder="e.g. Tenali"
          className={inputCls}
        />
      </Field>
      <Field label="PIN Code">
        <input
          name="pincode"
          value={form.pincode}
          onChange={onChange}
          placeholder="e.g. 522001"
          maxLength={6}
          className={inputCls}
        />
      </Field>
    </div>
  );
}

function StepFarm({ form, onChange }) {
  return (
    <div className="space-y-5">
      <Field label="Primary Crop" required>
        <PillSelector
          name="primaryCrop"
          options={CROP_OPTIONS}
          value={form.primaryCrop}
          onChange={onChange}
        />
      </Field>
      <Field label="Farm Size">
        <PillSelector
          name="farmSize"
          options={FARM_SIZE_OPTIONS}
          value={form.farmSize}
          onChange={onChange}
        />
      </Field>
      <Field label="Other Crops Grown" hint="Comma-separated, e.g. Wheat, Onion">
        <input
          name="otherCrops"
          value={form.otherCrops}
          onChange={onChange}
          placeholder="Wheat, Onion, Tomato"
          className={inputCls}
        />
      </Field>
    </div>
  );
}

function StepPreferences({ form, onChange }) {
  return (
    <div className="space-y-5">
      <Field label="Preferred Language">
        <PillSelector
          name="language"
          options={LANGUAGE_OPTIONS}
          value={form.language}
          onChange={onChange}
        />
      </Field>
      <Field label="Irrigation Type" hint="Helps calibrate weather impact scores">
        <select name="irrigationType" value={form.irrigationType} onChange={onChange} className={selectCls}>
          <option value="">Select type</option>
          <option value="rainfed">Rain-fed only</option>
          <option value="canal">Canal irrigation</option>
          <option value="drip">Drip / Sprinkler</option>
          <option value="borewell">Borewell / Tube well</option>
          <option value="mixed">Mixed</option>
        </select>
      </Field>
      <Field label="Soil Type" hint="Optional — used for risk model calibration">
        <select name="soilType" value={form.soilType} onChange={onChange} className={selectCls}>
          <option value="">Select soil type</option>
          <option value="clay">Clay</option>
          <option value="sandy">Sandy</option>
          <option value="loamy">Loamy</option>
          <option value="black">Black cotton soil</option>
          <option value="red">Red laterite</option>
          <option value="alluvial">Alluvial</option>
        </select>
      </Field>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const INITIAL_FORM = {
  name: '',
  phone: '',
  experience: '',
  state: '',
  district: '',
  village: '',
  pincode: '',
  primaryCrop: '',
  farmSize: '',
  otherCrops: '',
  language: 'en',
  irrigationType: '',
  soilType: '',
};

const STEP_REQUIRED = {
  identity: (f) => Boolean(f.name.trim()),
  location: (f) => Boolean(f.state && f.district.trim()),
  farm: (f) => Boolean(f.primaryCrop),
  preferences: () => true,
};

export default function FarmerSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const currentStep = STEPS[step];
  const isValid = STEP_REQUIRED[currentStep.id]?.(form) ?? true;
  const isLast = step === STEPS.length - 1;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!isValid) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    if (!isValid) return;
    setSaving(true);
    setError('');

    // Build location string for the dashboard weather lookup
    const locationParts = [form.district, form.state].filter(Boolean);
    const location = locationParts.join(', ');

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      experience: form.experience,
      location,
      state: form.state,
      district: form.district,
      village: form.village.trim(),
      pincode: form.pincode.trim(),
      primary_crop: form.primaryCrop,
      farm_size: form.farmSize,
      other_crops: form.otherCrops.trim(),
      language: form.language,
      irrigation_type: form.irrigationType,
      soil_type: form.soilType,
    };

    try {
      // Try update (PUT) first. If it fails, the profile likely doesn't exist yet.
      let res = await updateFarmerProfileRequest(user.id, payload);
      
      if (!res.ok) {
        // Create the base profile record
        const syncRes = await syncFarmerProfileRequest({ 
          userId: user.id, 
          email: user.email,
          name: payload.name,
          location: payload.location
        });
        
        if (!syncRes.ok) throw new Error(`Creation failed: ${syncRes.status}`);
        
        // Now that the record exists, run the update again to save the remaining fields
        res = await updateFarmerProfileRequest(user.id, payload);
      }
      
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      
      setDone(true);
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      console.error('Profile save error:', err);
      setError('Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Done state ──────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-[#060e1a] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-2xl shadow-emerald-900/40">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Profile saved!</h2>
          <p className="text-sm text-slate-400">Taking you to your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Main layout ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#060e1a] flex items-center justify-center px-4 py-12">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-500/[0.04] blur-[100px]" />
      </div>

      <div className="relative w-full max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-emerald-400 mb-4">
            <Tractor className="h-3.5 w-3.5" />
            Farmer Setup
          </div>
          <h1 className="text-3xl font-black text-white">Tell us about your farm</h1>
          <p className="mt-2 text-sm text-slate-400">
            This helps us personalise risk scores, weather alerts, and crop insights for you.
          </p>
        </div>

        {/* Step progress bar */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                    : 'border border-slate-700 bg-slate-800 text-slate-500'
                }`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`hidden sm:block text-xs font-semibold transition-colors ${
                  active ? 'text-white' : done ? 'text-emerald-400' : 'text-slate-600'
                }`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`ml-2 h-px flex-1 transition-colors ${done ? 'bg-emerald-500/40' : 'bg-slate-700/60'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="card">
          {/* Step heading */}
          <div className="mb-6">
            <p className="section-kicker">Step {step + 1} of {STEPS.length}</p>
            <h2 className="mt-1 text-xl font-bold text-white">{currentStep.label}</h2>
          </div>

          {/* Step content */}
          {step === 0 && <StepIdentity form={form} onChange={handleChange} />}
          {step === 1 && <StepLocation form={form} onChange={handleChange} />}
          {step === 2 && <StepFarm form={form} onChange={handleChange} />}
          {step === 3 && <StepPreferences form={form} onChange={handleChange} />}

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className="btn-saas-secondary disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex gap-2">
              {!isLast && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isValid}
                  className="btn-saas-primary disabled:pointer-events-none disabled:opacity-40"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
              {isLast && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving || !isValid}
                  className="btn-saas-primary disabled:pointer-events-none disabled:opacity-40"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skip link */}
        <p className="mt-4 text-center text-xs text-slate-600">
          Already set up?{' '}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 underline underline-offset-2 hover:text-slate-200 transition-colors"
          >
            Go to dashboard
          </button>
        </p>
      </div>
    </div>
  );
}
