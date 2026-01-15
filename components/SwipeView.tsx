
import React, { useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { COLORS } from '../constants';
import { collection, getDocs, query, where, addDoc, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

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
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!auth.currentUser) return;
      setLoading(true);
      try {
        // 1. Fetch all profiles
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const allProfiles: Profile[] = [];
        querySnapshot.forEach((doc) => {
          allProfiles.push(doc.data() as Profile);
        });

        // 2. Fetch my swipes (history)
        // We want to exclude anyone I have already swiped on (left or right)
        const swipesQuery = query(
          collection(db, "swipes"),
          where("fromUserId", "==", auth.currentUser.uid)
        );
        const swipesSnapshot = await getDocs(swipesQuery);
        const swipedUserIds = new Set<string>();
        swipesSnapshot.forEach(doc => {
          swipedUserIds.add(doc.data().toUserId);
        });

        // 3. Filter profiles
        const filtered = allProfiles.filter(p =>
          p.id !== auth.currentUser?.uid &&
          p.role !== userRole &&
          !swipedUserIds.has(p.id)
        );

        setProfiles(filtered);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [userRole]);

  const currentProfile = profiles[currentIndex];

  const checkForMutualLike = async (targetUserId: string) => {
    if (!auth.currentUser) return false;

    try {
      // Check if the other user has already liked us
      // We query the 'swipes' collection where fromUserId == targetUserId AND toUserId == currentUserId AND liked == true
      const q = query(
        collection(db, "swipes"),
        where("fromUserId", "==", targetUserId),
        where("toUserId", "==", auth.currentUser.uid),
        where("liked", "==", true)
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking mutual like:", error);
      return false;
    }
  };

  const createMatch = async (otherUser: Profile) => {
    if (!auth.currentUser) return;
    try {
      // Create a match document
      await addDoc(collection(db, "matches"), {
        users: [auth.currentUser.uid, otherUser.id],
        timestamp: new Date(),
        lastMessage: '',
        lastMessageTimestamp: new Date()
      });
    } catch (e) {
      console.error("Error creating match:", e);
    }
  };

  const handleSwipe = async (liked: boolean) => {
    setIsFlipped(false);

    if (currentProfile && auth.currentUser) {
      try {
        // 1. Record the swipe (history)
        await addDoc(collection(db, "swipes"), {
          fromUserId: auth.currentUser.uid,
          toUserId: currentProfile.id,
          liked: liked,
          timestamp: new Date()
        });

        if (liked) {
          // 2. Check for mutual like
          const isMatch = await checkForMutualLike(currentProfile.id);

          if (isMatch) {
            await createMatch(currentProfile);
            setShowMatchOverlay(currentProfile);
            onMatch(currentProfile);
          }
        }
      } catch (error) {
        console.error("Error processing swipe:", error);
      }
    }

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // End of stack
      setCurrentIndex(profiles.length);
    }
  };

  const toggleFlip = () => setIsFlipped(!isFlipped);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
    </div>
  );

  if (!currentProfile) return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-white text-center font-bold">
      <div className="text-4xl mb-4">✨</div>
      <p className="text-xl mb-2">Keine weiteren Profile...</p>
      <p className="text-sm opacity-80">Schau später wieder vorbei!</p>
      <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 bg-white/20 rounded-full border border-white/30 hover:bg-white/30 transition-colors">Neu laden</button>
    </div>
  );

  if (showMatchOverlay) {
    return (
      <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF7E5F] to-[#D471ED] mb-4">It's a Match!</h2>
        <div className="flex items-center justify-center gap-4 mb-8">
          <img src={auth.currentUser?.photoURL || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-full border-4 border-white" />
          <div className="text-4xl">❤️</div>
          <img src={showMatchOverlay.photo} className="w-24 h-24 rounded-full border-4 border-white" />
        </div>
        <p className="text-white text-xl mb-8">Du und {showMatchOverlay.name} habt euch gefunden.</p>
        <button
          onClick={() => {
            setShowMatchOverlay(null);
            onOpenChat(showMatchOverlay);
          }}
          className="w-full py-4 bg-gradient-to-r from-[#FF7E5F] to-[#D471ED] text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform mb-4"
        >
          Nachricht schreiben
        </button>
        <button
          onClick={() => setShowMatchOverlay(null)}
          className="text-white/70 font-bold hover:text-white"
        >
          Weiter swipen
        </button>
      </div>
    );
  }

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
                  <h3 className="text-4xl font-bold mb-1 tracking-tight">{currentProfile.name}</h3>

                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="glow-star" width="18" height="18" viewBox="0 0 24 24" fill={i < currentProfile.rating ? COLORS.GOLD : 'none'} stroke={COLORS.GOLD} strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>

                  <p className="text-base font-semibold text-white/90">
                    {currentProfile.location}
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeView;
