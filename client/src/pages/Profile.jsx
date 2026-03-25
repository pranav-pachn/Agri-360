import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Edit2, Check, X, Leaf, MapPin, Globe } from 'lucide-react';

function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/farmers/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

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

  const handleEdit = () => {
    setEditData(profile || {});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profile || {});
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/v1/farmers/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

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
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-spin" />
          <p className="text-slate-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-slate-400">Manage your farmer account and preferences</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/30 rounded-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 p-6 border-b border-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {profile?.name || 'Farmer'}
                  </h2>
                  <p className="text-slate-400 text-sm">{user?.email}</p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <p className="text-slate-200">{profile?.name || '-'}</p>
              )}
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={editData.location || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g., Maharashtra, India"
                />
              ) : (
                <p className="text-slate-200">{profile?.location || 'Not specified'}</p>
              )}
            </div>

            {/* Language Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language
              </label>
              {isEditing ? (
                <select
                  name="language"
                  value={editData.language || 'en'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                  <option value="ta">Tamil</option>
                  <option value="ml">Malayalam</option>
                </select>
              ) : (
                <p className="text-slate-200">
                  {profile?.language === 'en' ? 'English' :
                   profile?.language === 'hi' ? 'Hindi' :
                   profile?.language === 'mr' ? 'Marathi' :
                   profile?.language === 'ta' ? 'Tamil' :
                   profile?.language === 'ml' ? 'Malayalam' : 'English'}
                </p>
              )}
            </div>

            {/* Created Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Member Since
              </label>
              <p className="text-slate-400">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}
              </p>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex-1 justify-center"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex-1 justify-center"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-8 space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
