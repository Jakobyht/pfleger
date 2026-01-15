
import React, { useState } from 'react';
import { Profile, UserRole } from '../types';
import { MOCK_PROFILES, COLORS } from '../constants';

interface SwipeViewProps {
  userRole: UserRole;
  onMatch: (profile: Profile) => void;
  onOpenChat: (profile: Profile) => void;
  onToggleNav: () => void;
}

const SwipeView: React.FC<SwipeViewProps> = ({ userRole, onMatch, onOpenChat, onToggleNav }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchOverlay, setShowMatchOverlay] = useState<Profile | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const availableProfiles = MOCK_PROFILES.filter(p => p.role !== userRole);
  const currentProfile = availableProfiles[currentIndex];

  const handleSwipe = (liked: boolean) => {
    setIsFlipped(false);
    if (liked) {
      if (Math.random() > 0.3) {
        setShowMatchOverlay(currentProfile);
        onMatch(currentProfile);
      }
    }
    
    if (currentIndex < availableProfiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const toggleFlip = () => setIsFlipped(!isFlipped);

  if (!currentProfile) return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-white text-center font-bold">
      <div className="text-4xl mb-4">✨</div>
      <p className="text-xl">Keine weiteren Profile...</p>
      <button onClick={() => setCurrentIndex(0)} className="mt-6 px-8 py-3 bg-white/20 rounded-full border border-white/30">Neu laden</button>
    </div>
  );

  return (
    <div className="flex-1 px-4 pb-6 flex flex-col overflow-hidden max-w-xl mx-auto w-full">
      <div className="flex-1 bg-white/10 backdrop-blur-md rounded-[48px] border border-white/40 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Card Perspective Wrapper */}
        <div className="relative flex-1 p-4 perspective cursor-pointer" onClick={toggleFlip}>
          <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
            
            {/* Front Side */}
            <div className="flip-card-front">
              <div className="w-full h-full rounded-[38px] overflow-hidden relative shadow-inner bg-gray-200">
                <img 
                  src={currentProfile.photo} 
                  className="w-full h-full object-cover"
                  alt={currentProfile.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-8 left-0 right-0 px-8 text-center text-white">
                  <h3 className="text-4xl font-bold mb-1 tracking-tight">{currentProfile.name}, {currentProfile.role === 'CAREGIVER' ? '29' : '81'}</h3>
                  
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="glow-star" width="18" height="18" viewBox="0 0 24 24" fill={i < currentProfile.rating ? COLORS.GOLD : 'none'} stroke={COLORS.GOLD} strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-base font-semibold text-white/90">
                    {currentProfile.role === 'CAREGIVER' ? 'Pflegefachkraft aus München' : 'Benötigt Grundpflege'}
                  </p>
                </div>
              </div>
            </div>

            {/* Back Side (Details) */}
            <div className="flip-card-back bg-white rounded-[38px] p-8 flex flex-col shadow-inner">
               <h3 className="text-2xl font-bold text-gray-800 mb-4">Über {currentProfile.name}</h3>
               <p className="text-gray-600 leading-relaxed flex-1 overflow-y-auto">
                 {currentProfile.bio}
               </p>
               <div className="mt-4">
                  <p className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-2">Spezialisierungen</p>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">#{tag}</span>
                    ))}
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* Action Row */}
        <div className="px-6 py-6 flex items-center justify-between gap-3 shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); handleSwipe(false); }}
            className="w-14 h-14 bg-white flex items-center justify-center rounded-full glow-red shadow-lg hover:scale-110 active:scale-90 transition-transform flex-shrink-0"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF5A5F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); toggleFlip(); }}
            className="flex-1 py-3 px-4 bg-[#FFA45B] text-white rounded-full font-bold text-base shadow-lg glow-orange flex items-center justify-center gap-2 hover:bg-[#ffb473] active:scale-95 transition-all"
          >
            Mehr Infos <span className={`text-lg transition-transform ${isFlipped ? 'rotate-180' : ''}`}>↑</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleSwipe(true); }}
            className="w-14 h-14 bg-[#4CD964] flex items-center justify-center rounded-full glow-green shadow-lg hover:scale-110 active:scale-90 transition-transform flex-shrink-0"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeView;
