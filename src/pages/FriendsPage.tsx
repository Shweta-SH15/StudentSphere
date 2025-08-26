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
  const [likedFriends, setLikedFriends] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);
  const [swipeHistory, setSwipeHistory] = useState({}); // ✅ { friendId: "like" | "dislike" }
  const navigate = useNavigate();

  // Mock data (now includes gender)
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
  ];

  const filterOptions = [
    { id: "nationality", name: "Nationality", values: ["China", "Spain", "India", "Australia", "Egypt"] },
    { id: "interest", name: "Interest", values: ["Photography", "Music", "Sports", "Travel", "Cooking", "Art"] },
    { id: "language", name: "Language", values: ["English", "Mandarin", "Spanish", "Hindi", "Arabic", "French"] }
  ];

  // Helper: get default image by gender
  const getProfileImage = (friend) => {
    if (friend.gender === "male") return maleAvatar;
    if (friend.gender === "female") return femaleAvatar;
    return otherAvatar;
  };

  // ✅ Helper: filter out already liked/swiped friends
  const filterOutSwiped = (friends) => {
    const localHistory = JSON.parse(localStorage.getItem("swipeHistory") || "{}");
    const localLiked = JSON.parse(localStorage.getItem("likedFriends") || "[]");
    return friends.filter(f => !localHistory[f._id] && !localLiked.find(l => l._id === f._id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const token = localStorage.getItem('immigrantConnect_token');

    const fetchFriends = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile/friend-suggestions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const fallback = Array.isArray(data) && data.length ? data : mockFriends;

        // ✅ filter out already liked/swiped friends
        const filtered = filterOutSwiped(fallback);

        setAllFriends(filtered);
        setFilteredFriends(filtered);
      } catch {
        const filtered = filterOutSwiped(mockFriends);
        setAllFriends(filtered);
        setFilteredFriends(filtered);
      }
    };

    const fetchLiked = async () => {
      const localLiked = JSON.parse(localStorage.getItem("likedFriends") || "[]");
      setLikedFriends(localLiked);

      const localHistory = JSON.parse(localStorage.getItem("swipeHistory") || "{}");
      setSwipeHistory(localHistory);
    };

    fetchFriends();
    fetchLiked();
  }, [isAuthenticated]);

  const saveLikedToStorage = (list) => {
    setLikedFriends(list);
    localStorage.setItem("likedFriends", JSON.stringify(list));
  };

  // ✅ Update handleFilterChange to always exclude already liked/swiped
  const handleFilterChange = (filterId, value) => {
    let filtered = allFriends;
    if (value) {
      filtered = filtered.filter(friend => {
        if (filterId === "nationality") return friend.nationality === value;
        if (filterId === "interest") return friend.interest?.includes(value);
        if (filterId === "language") return friend.language?.includes(value);
        return true;
      });
    }
    filtered = filterOutSwiped(filtered);
    setFilteredFriends(filtered);
    setCurrentIndex(0);
  };

  const handleLike = async (id) => {
    const friend = filteredFriends.find(f => f._id === id);
    if (!friend || likedFriends.find(f => f._id === id)) return;

    // ✅ Persist swipe history
    setSwipeHistory(prev => {
      const updated = { ...prev, [id]: "like" };
      localStorage.setItem("swipeHistory", JSON.stringify(updated));
      return updated;
    });

    const updatedLiked = [...likedFriends, friend];
    saveLikedToStorage(updatedLiked);

    const isMock = id.startsWith("mock-");
    if (isMock) {
      toast("Friend Liked!", { description: `You liked ${friend.name}` });
      setCurrentIndex(prev => prev + 1);
      return;
    }

    try {
      const user = getAuth().currentUser;
      const token = await getIdToken(user, true);

      await fetch(`${API_BASE}/swipe/friend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ friendId: id })
      });

      toast("Friend Liked!", { description: `You liked ${friend.name}` });
    } catch (err) {
      console.error(err);
      toast.error("Could not like friend.");
    }

    setCurrentIndex(prev => prev + 1);
  };

  const handleDislike = (id) => {
    // ✅ Persist swipe history
    setSwipeHistory(prev => {
      const updated = { ...prev, [id]: "dislike" };
      localStorage.setItem("swipeHistory", JSON.stringify(updated));
      return updated;
    });
    setCurrentIndex(prev => prev + 1);
  };

  const handleUnlike = async (id) => {
    const updated = likedFriends.filter(f => f._id !== id);
    saveLikedToStorage(updated);

    try {
      const user = getAuth().currentUser;
      const token = await getIdToken(user, true);

      await fetch(`${API_BASE}/swipe/unlike-friend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ friendId: id })
      });

      toast("Removed from liked");
    } catch (err) {
      console.error(err);
    }
  };

  const current = filteredFriends[currentIndex];

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
            {filteredFriends.length > 0 && currentIndex < filteredFriends.length ? (
              <div className="relative">
                <SwipeCard
                  id={current._id}
                  image={getProfileImage(current)}
                  title={current.name}
                  subtitle={`${current.age} • ${current.nationality}`}
                  details={
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{current.university}</p>
                      <p className="text-sm">{current.bio}</p>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {current.interest?.map((tag, i) => (
                          <Badge key={i}>{tag}</Badge>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Languages: {current.language?.join(", ") || "N/A"}
                      </div>
                    </div>
                  }
                  onLike={() => handleLike(current._id)}
                  onDislike={() => handleDislike(current._id)}
                />

                {swipeHistory[current._id] === "like" && (
                  <span className="absolute top-3 right-3 text-3xl animate-pulse text-pink-500 drop-shadow-lg">
                    ❤️
                  </span>
                )}
                {swipeHistory[current._id] === "dislike" && (
                  <span className="absolute top-3 right-3 text-3xl animate-pulse text-red-500 drop-shadow-lg">
                    ❌
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-6">🎉 You’ve viewed all friends!</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {Object.entries(swipeHistory).map(([id, choice]) => {
                    const f = allFriends.find(friend => friend._id === id);
                    if (!f) return null;
                    return (
                      <div
                        key={id}
                        className="relative bg-[#1f2937] rounded-xl p-4 shadow-md flex flex-col items-center"
                      >
                        <img
                          src={getProfileImage(f)}
                          alt={f.name}
                          className="w-24 h-24 object-cover rounded-full mb-3"
                        />
                        <h3 className="text-lg font-semibold">{f.name}</h3>
                        <p className="text-sm text-gray-400">{f.nationality}</p>

                        {choice === "like" && (
                          <span className="absolute top-3 right-3 text-2xl animate-pulse text-pink-500 drop-shadow-lg">
                            ❤️
                          </span>
                        )}
                        {choice === "dislike" && (
                          <span className="absolute top-3 right-3 text-2xl animate-pulse text-red-500 drop-shadow-lg">
                            ❌
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked">
            {likedFriends.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {likedFriends.map((f) => (
                  <div
                    key={f._id}
                    className="flex items-start bg-[#1f2937] rounded-lg overflow-hidden shadow-md"
                  >
                    <img
                      src={getProfileImage(f)}
                      alt={f.name}
                      className="w-28 h-28 object-cover rounded-l-lg"
                    />
                    <div className="flex-1 p-4">
                      <h3 className="text-lg font-semibold">{f.name}</h3>
                      <p className="text-sm text-gray-400 mb-1">{f.nationality}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => navigate(`/chat?with=${f._id}`)}
                        >
                          Message
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleUnlike(f._id)}
                        >
                          Remove
                        </Button>
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
