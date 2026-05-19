import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Edit2, Check, X, MapPin, Globe, User, LogOut, ShieldAlert } from 'lucide-react';
import { getFarmerProfileRequest, updateFarmerProfileRequest } from '../services/farmersApi';

const LANGUAGE_LABELS = {
  en: 'English', hi: 'Hindi', mr: 'Marathi', ta: 'Tamil', ml: 'Malayalam',
};

function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getFarmerProfileRequest(user.id);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data.data);
      setEditData(data.data || {});
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Unable to load your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => { setEditData(profile || {}); setIsEditing(true); };
  const handleCancel = () => { setIsEditing(false); setEditData(profile || {}); };

  const handleSave = async () => {
    try {
      const response = await updateFarmerProfileRequest(user.id, editData);
      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      setProfile(data.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to save profile. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Derive initials for avatar
  const initials = (profile?.name || user?.email || 'FA')
    .split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-400 animate-pulse">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Page Header */}
        <div>
          <p className="section-kicker">Account</p>
          <h1 className="mt-2 section-title">Your Profile</h1>
          <p className="section-subtitle">Manage your farmer account, preferences, and identity</p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="card overflow-hidden p-0">
          {/* Card hero strip */}
          <div className="relative h-24 bg-gradient-to-r from-emerald-600/20 via-slate-800/60 to-blue-600/10">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
          </div>

          {/* Avatar row */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-slate-800 bg-gradient-to-br from-emerald-500 to-green-600 text-2xl font-black text-white shadow-xl">
                {initials}
              </div>
              {!isEditing && (
                <button onClick={handleEdit} className="btn-saas-secondary">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">{profile?.name || 'Farmer'}</h2>
              <p className="mt-0.5 text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Fields */}
          <div className="px-6 py-6 space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[140px_1fr] sm:items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <User className="h-4 w-4" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              ) : (
                <p className="text-sm text-white font-medium">{profile?.name || '—'}</p>
              )}
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[140px_1fr] sm:items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <MapPin className="h-4 w-4" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={editData.location || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Maharashtra, India"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              ) : (
                <p className="text-sm text-white font-medium">{profile?.location || 'Not specified'}</p>
              )}
            </div>

            {/* Language */}
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[140px_1fr] sm:items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <Globe className="h-4 w-4" />
                Language
              </label>
              {isEditing ? (
                <select
                  name="language"
                  value={editData.language || 'en'}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {Object.entries(LANGUAGE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-white font-medium">
                  {LANGUAGE_LABELS[profile?.language] || 'English'}
                </p>
              )}
            </div>

            {/* Member since */}
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[140px_1fr] sm:items-center">
              <label className="text-sm font-medium text-slate-400">Member Since</label>
              <p className="text-sm text-slate-400">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                  : '—'}
              </p>
            </div>

            {/* Action buttons when editing */}
            {isEditing && (
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="btn-saas-primary flex-1 justify-center">
                  <Check className="h-4 w-4" />
                  Save Changes
                </button>
                <button onClick={handleCancel} className="btn-saas-secondary flex-1 justify-center">
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-500/20">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-red-400">Danger Zone</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">Sign out of your account</p>
              <p className="text-xs text-slate-400 mt-0.5">You will be redirected to the login page.</p>
            </div>
            <button onClick={handleSignOut} className="btn-saas-danger shrink-0">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
