
import React, { useState } from 'react';
import { Profile, UserRole } from '../types';
import { COLORS } from '../constants';

interface ProfileEditViewProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
}

const ProfileEditView: React.FC<ProfileEditViewProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<Profile>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="h-full bg-white overflow-y-auto pb-20 p-8">
      <h2 className="text-2xl font-bold text-black mb-6">Setup Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-2">
            <img 
              src={formData.photo} 
              className="w-full h-full object-cover rounded-full border-4 border-gray-100 shadow-sm"
              alt="Profile"
            />
            <label className="absolute bottom-0 right-0 bg-[#7B4AE2] text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <input type="file" className="hidden" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Full Name</label>
          <input
            type="text"
            required
            className="w-full p-4 bg-white text-black border-gray-200 border-2 rounded-xl focus:ring-2 focus:ring-[#7B4AE2] focus:outline-none placeholder-gray-400"
            placeholder="e.g. Maria Müller"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Location / Radius</label>
          <input
            type="text"
            required
            className="w-full p-4 bg-white text-black border-gray-200 border-2 rounded-xl focus:ring-2 focus:ring-[#7B4AE2] focus:outline-none placeholder-gray-400"
            placeholder="Berlin, 10km"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Bio</label>
          <textarea
            required
            rows={3}
            className="w-full p-4 bg-white text-black border-gray-200 border-2 rounded-xl focus:ring-2 focus:ring-[#7B4AE2] focus:outline-none placeholder-gray-400"
            placeholder="Tell us a bit about yourself..."
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-[#FFA45B] to-[#F26A8D] text-white rounded-full font-bold text-lg shadow-xl active:scale-95 transition-transform"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default ProfileEditView;
