// FriendsPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import SwipeCard from "@/components/SwipeCard/SwipeCard";
import FilterBar from "@/components/SwipeCard/FilterBar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "@/lib/api";
import { getAuth, getIdToken } from "firebase/auth";

// Default avatars
const maleAvatar = "/images/male.jpg";
const femaleAvatar = "/images/female.jpg";
const otherAvatar = "/images/other.jpg";

const FriendsPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedFriends, setLikedFriends] = useState<any[]>([]);
  const [allFriends, setAllFriends] = useState<any[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);
  const navigate = useNavigate();

  // Mock users (kept locally)
  const mockFriends = [
    {
      _id: "mock-f1",
      name: "Alex Chen",
      age: 22,
      nationality: "China",
      university: "University of Toronto",
      interest: ["Photography", "Basketball", "Coding"],
      language: ["Mandarin", "English"],
      bio: "Computer Science student looking to make international friends and practice my English.",
      gender: "male",
    },
    {
      _id: "mock-f2",
      name: "Laura García",
      age: 20,
      nationality: "Spain",
      university: "McGill University",
      interest: ["Music", "Hiking", "Politics"],
      language: ["Spanish", "English", "French"],
      bio: "International Relations student who loves exploring the city and going to live music events.",
      gender: "female",
    },
    {
      _id: "mock-f3",
      name: "Raj Patel",
      age: 24,
      nationality: "India",
      university: "University of British Columbia",
      interest: ["Cricket", "Cooking", "Startups"],
      language: ["Hindi", "English"],
      bio: "MBA student with a passion for entrepreneurship and connecting people.",
      gender: "male",
    },
    {
      _id: "mock-f4",
      name: "Emma Wilson",
      age: 21,
      nationality: "Australia",
      university: "Queen's University",
      interest: ["Swimming", "Travel", "Art"],
      language: ["English"],
      bio: "Fine Arts student looking for friends to explore galleries and museums with.",
      gender: "female",
    },
    {
      _id: "mock-f5",
      name: "Omar Hassan",
      age: 23,
      nationality: "Egypt",
      university: "York University",
      interest: ["Soccer", "History", "Film"],
      language: ["Arabic", "English"],
      bio: "Film studies major hoping to find friends with similar interests in cinema and culture.",
      gender: "male",
    },
    {
      _id: "mock-f6",
      name: "Sophia Müller",
      age: 22,
      nationality: "Germany",
      university: "University of Waterloo",
      interest: ["Tech", "Travel", "Photography"],
      language: ["German", "English"],
      bio: "Engineering student exploring Canada and technology trends.",
      gender: "female",
    },
    {
      _id: "mock-f7",
      name: "Daniel Kim",
      age: 21,
      nationality: "Korea",
      university: "University of Toronto",
      interest: ["Gaming", "Coding", "Music"],
      language: ["Korean", "English"],
      bio: "Gamer and coder looking to meet international friends.",
      gender: "male",
    },
    {
      _id: "mock-f8",
      name: "Fatima Ali",
      age: 23,
      nationality: "Pakistan",
      university: "York University",
      interest: ["Cooking", "Travel", "Reading"],
      language: ["Urdu", "English"],
      bio: "Love food and adventures, always up for new experiences.",
      gender: "female",
    },
    {
      _id: "mock-f9",
      name: "Lucas Silva",
      age: 24,
      nationality: "Brazil",
      university: "McMaster University",
      interest: ["Soccer", "Music", "Hiking"],
      language: ["Portuguese", "English"],
      bio: "Soccer and music fan, looking to meet fellow students.",
      gender: "male",
    },
    {
      _id: "mock-f10",
      name: "Aisha Mohammed",
      age: 22,
      nationality: "UAE",
      university: "University of Waterloo",
      interest: ["Fashion", "Art", "Photography"],
      language: ["Arabic", "English"],
      bio: "Art lover and fashion enthusiast eager to connect with friends.",
      gender: "female",
    },
    // 10 new friends
    {
      _id: "mock-f11",
      name: "Mateo Rossi",
      age: 23,
      nationality: "Italy",
      university: "University of Milan",
      interest: ["Cooking", "Travel", "Soccer"],
      language: ["Italian", "English"],
      bio: "Foodie and traveler, loves meeting new people.",
      gender: "male",
    },
    {
      _id: "mock-f12",
      name: "Elena Petrova",
      age: 21,
      nationality: "Russia",
      university: "Lomonosov Moscow State University",
      interest: ["Art", "Music", "Photography"],
      language: ["Russian", "English"],
      bio: "Art student seeking friends who enjoy creative activities.",
      gender: "female",
    },
    {
      _id: "mock-f13",
      name: "Mohammed Khan",
      age: 24,
      nationality: "Pakistan",
      university: "Lahore University",
      interest: ["Cricket", "Technology", "Reading"],
      language: ["Urdu", "English"],
      bio: "Tech enthusiast and cricket fan looking for like-minded friends.",
      gender: "male",
    },
    {
      _id: "mock-f14",
      name: "Hannah Lee",
      age: 22,
      nationality: "USA",
      university: "Harvard University",
      interest: ["Debate", "Politics", "Travel"],
      language: ["English"],
      bio: "Debate club member looking to expand my social circle internationally.",
      gender: "female",
    },
    {
      _id: "mock-f15",
      name: "Tariq Al-Farsi",
      age: 23,
      nationality: "Oman",
      university: "Sultan Qaboos University",
      interest: ["Football", "History", "Music"],
      language: ["Arabic", "English"],
      bio: "History student and football fan, eager to meet new friends.",
      gender: "male",
    }
  ];


  const filterOptions = [
    { id: "nationality", name: "Nationality", values: ["China","Spain","India","Australia","Egypt"] },
    { id: "interest", name: "Interest", values: ["Photography","Music","Sports","Travel","Cooking","Art"] },
    { id: "language", name: "Language", values: ["English","Mandarin","Spanish","Hindi","Arabic","French"] }
  ];

  const getProfileImage = (friend: any) => {
    if (!friend) return otherAvatar;
    if ((friend.gender || "").toLowerCase() === "male") return maleAvatar;
    if ((friend.gender || "").toLowerCase() === "female") return femaleAvatar;
    return otherAvatar;
  };

  // helper: only show users not in likedFriends
  const getDiscoverFriends = (friends: any[], liked = likedFriends) =>
    friends.filter(f => !liked.some(l => String(l._id) === String(f._id)));

  // fallback token getter: try firebase id token, otherwise localStorage 'immigrantConnect_token'
  const getAuthToken = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        return await getIdToken(user, true);
      }
    } catch (err) {
      console.warn("getIdToken failed:", err);
    }
    // fallback token (if you used earlier custom JWT)
    return localStorage.getItem("immigrantConnect_token") || null;
  };

  // Safe fetch that handles non-json and non-ok responses
  const fetchJsonSafe = async (url: string, opts: RequestInit = {}) => {
    try {
      const res = await fetch(url, opts);
      const text = await res.text();
      if (!res.ok) {
        console.warn(`Non-OK response from ${url} status ${res.status}, body:`, text);
        return null;
      }
      try {
        return JSON.parse(text);
      } catch (err) {
        console.warn(`Non-JSON but OK response from ${url}:`, text);
        return null;
      }
    } catch (err) {
      console.error(`Fetch failed for ${url}:`, err);
      return null;
    }
  };

  // Load friends + liked from DB, merge with mocks, dedupe
  useEffect(() => {
    if (!isAuthenticated) {
      // show mock users even when not logged-in
      setAllFriends(mockFriends);
      setFilteredFriends(getDiscoverFriends(mockFriends, []));
      setIsAuthModalOpen(true);
      // load mock liked from localStorage if present
      try {
        const localLiked = JSON.parse(localStorage.getItem("likedFriends") || "[]");
        setLikedFriends(Array.isArray(localLiked) ? localLiked : []);
      } catch {
        setLikedFriends([]);
      }
      return;
    }

    const load = async () => {
      try {
        const token = await getAuthToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Query both endpoints in parallel and be tolerant of failures
        const [suggestionsRes, likedRes] = await Promise.all([
          fetchJsonSafe(`${API_BASE}/profile/friend-suggestions`, { headers }),
          fetchJsonSafe(`${API_BASE}/profile/friends`, { headers }),
        ]);

        const dbFriends = Array.isArray(suggestionsRes) ? suggestionsRes : [];
        const dbLiked = Array.isArray(likedRes) ? likedRes : [];

        // local mock liked (persisted)
        let localLiked: any[] = [];
        try {
          localLiked = JSON.parse(localStorage.getItem("likedFriends") || "[]");
          if (!Array.isArray(localLiked)) localLiked = [];
        } catch {
          localLiked = [];
        }

        // merge liked: server liked + persisted mock liked
        const mergedLiked = [...dbLiked, ...localLiked.filter(m => String(m._id).startsWith("mock-"))];
        setLikedFriends(mergedLiked);

        // merge DB friends + mocks, dedupe by _id
        const combined = [...mockFriends, ...dbFriends];
        const unique: any[] = [];
        const seen = new Set<string>();
        for (const f of combined) {
          if (!f || !f._id) continue;
          const id = String(f._id);
          if (seen.has(id)) continue;
          seen.add(id);
          unique.push(f);
        }

        setAllFriends(unique);
        // filtered = unique minus liked
        const discover = getDiscoverFriends(unique, mergedLiked);
        setFilteredFriends(discover);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Failed loading friends:", err);
        toast.error("Could not load friends. Check console for details.");
        // fallback to mocks
        setAllFriends(mockFriends);
        setFilteredFriends(getDiscoverFriends(mockFriends, []));
      }
    };

    load();
  }, [isAuthenticated]);

  // persist liked mock items locally so they survive reload
  useEffect(() => {
    try {
      // only persist mock-liked entries (those starting with mock-)
      const mockOnly = likedFriends.filter(l => String(l._id).startsWith("mock-"));
      localStorage.setItem("likedFriends", JSON.stringify(mockOnly));
    } catch (err) {
      console.error("Could not persist likedFriends:", err);
    }
  }, [likedFriends]);

  const handleFilterChange = (filterId: string, value: string) => {
    let filtered = allFriends;
    if (value) {
      filtered = filtered.filter(friend => {
        if (filterId === "nationality") return friend.nationality === value;
        if (filterId === "interest") return friend.interest?.includes(value);
        if (filterId === "language") return friend.language?.includes(value);
        return true;
      });
    }
    const discover = getDiscoverFriends(filtered);
    setFilteredFriends(discover);
    setCurrentIndex(0);
  };

  const saveLikedToState = (list: any[]) => {
    setLikedFriends(list);
    // persisted via effect above
  };

  const handleLike = async (id: string) => {
    const friend = allFriends.find(f => String(f._id) === String(id));
    if (!friend) return;

    // Avoid duplicates
    if (likedFriends.some(f => String(f._id) === String(id))) return;

    // optimistic update
    const updatedLiked = [...likedFriends, friend];
    saveLikedToState(updatedLiked);

    // call backend for real users
    try {
      if (!String(id).startsWith("mock-")) {
        const user = getAuth().currentUser;
        if (!user) throw new Error("No firebase user");
        const token = await getIdToken(user, true);
        await fetch(`${API_BASE}/swipe/friend`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ friendId: id })
        });
      }
      toast("Friend Liked!", { description: `You liked ${friend.name}` });
    } catch (err) {
      console.error("Failed to send like to backend:", err);
      toast.error("Could not like friend (server error).");
    }

    // remove liked users from filteredFriends so they won't be reshown
    const remaining = getDiscoverFriends(allFriends, updatedLiked);
    setFilteredFriends(remaining);

    // advance index safely within the new filtered list (infinite)
    if (remaining.length === 0) {
      setCurrentIndex(0);
    } else {
      // place pointer on next item
      const newIndex = (currentIndex) % remaining.length;
      setCurrentIndex((newIndex + 1) % remaining.length);
    }
  };

  const handleDislike = (id?: string) => {
    // just move to next unliked user (loop)
    if (filteredFriends.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % filteredFriends.length);
  };

  const handleUnlike = async (id: string) => {
    const updated = likedFriends.filter(f => String(f._id) !== String(id));
    saveLikedToState(updated);

    try {
      if (!String(id).startsWith("mock-")) {
        const user = getAuth().currentUser;
        if (!user) throw new Error("No firebase user");
        const token = await getIdToken(user, true);
        await fetch(`${API_BASE}/swipe/unlike-friend`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ friendId: id })
        });
      }
      toast("Removed from liked");
      // ensure unliked user comes back into discover set
      setFilteredFriends(getDiscoverFriends(allFriends, updated));
    } catch (err) {
      console.error("Failed unlike:", err);
      toast.error("Failed to remove like (server error).");
    }
  };

  const current = filteredFriends.length > 0 ? filteredFriends[currentIndex % filteredFriends.length] : null;

  return (
    <div className="min-h-screen bg-[#0a0f1a] py-8 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Find Friends</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#121826] text-white">
            <TabsTrigger className="text-white data-[state=active]:bg-[#1f2937]" value="discover">Discover</TabsTrigger>
            <TabsTrigger className="text-white data-[state=active]:bg-[#1f2937]" value="liked">Liked ({likedFriends.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />
            {current ? (
              <SwipeCard
                id={current._id}
                image={getProfileImage(current)}
                title={current.name}
                subtitle={`${current.age ?? ""} ${current.nationality ? `• ${current.nationality}` : ""}`}
                details={
                  <div className="space-y-2">
                    {current.university && <p className="text-sm text-gray-600">{current.university}</p>}
                    {current.bio && <p className="text-sm">{current.bio}</p>}
                    <div className="flex gap-2 flex-wrap mt-2">
                      {(current.interest || []).map((tag: string, i: number) => <Badge key={i}>{tag}</Badge>)}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Languages: {(current.language || []).join(", ") || "N/A"}
                    </div>
                  </div>
                }
                onLike={() => handleLike(current._id)}
                onDislike={() => handleDislike(current._id)}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>No new friends to show — you've liked all available profiles.</p>
                <p className="text-xs mt-2 text-gray-500">If you expect DB users here, check DevTools/Network for the `/profile/*` responses.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked">
            {likedFriends.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {likedFriends.map((f) => (
                  <div key={f._id} className="flex items-start bg-[#1f2937] rounded-lg overflow-hidden shadow-md">
                    <img src={getProfileImage(f)} alt={f.name} className="w-28 h-28 object-cover rounded-l-lg" />
                    <div className="flex-1 p-4">
                      <h3 className="text-lg font-semibold">{f.name}</h3>
                      <p className="text-sm text-gray-400 mb-1">{f.nationality}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate(`/chat?with=${f._id}`)}>Message</Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleUnlike(f._id)}>Remove</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>You haven't liked anyone yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default FriendsPage;
