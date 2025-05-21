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
import { API_BASE, SOCKET_URL } from "@/lib/api";
import { getAuth, getIdToken } from "firebase/auth";

const FriendsPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedFriends, setLikedFriends] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);
  const navigate = useNavigate();

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
      profileImage: "/uploads/sample1.jpg",
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
      profileImage: "/uploads/sample2.jpg",
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
      profileImage: "/uploads/sample3.jpg",
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
      profileImage: "/uploads/sample4.jpg",
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
      profileImage: "/uploads/sample5.jpg",
    },
  ];

  const filterOptions = [
    { id: "nationality", name: "Nationality", values: ["China", "Spain", "India", "Australia", "Egypt"] },
    { id: "interest", name: "Interest", values: ["Photography", "Music", "Sports", "Travel", "Cooking", "Art"] },
    { id: "language", name: "Language", values: ["English", "Mandarin", "Spanish", "Hindi", "Arabic", "French"] }
  ];

  // Restore liked friends from localStorage or DB
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
        setAllFriends(fallback);
        setFilteredFriends(fallback);
      } catch {
        setAllFriends(mockFriends);
        setFilteredFriends(mockFriends);
      }
    };

    const fetchLiked = async () => {
      const localLiked = localStorage.getItem("likedFriends");
      if (localLiked) {
        setLikedFriends(JSON.parse(localLiked));
      } else {
        try {
          const res = await fetch(`${API_BASE}/profile/friends`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setLikedFriends(data);
        } catch {
          setLikedFriends([]);
        }
      }
    };

    fetchFriends();
    fetchLiked();
  }, [isAuthenticated]);

  const saveLikedToStorage = (list) => {
    setLikedFriends(list);
    localStorage.setItem("likedFriends", JSON.stringify(list));
  };

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
    setFilteredFriends(filtered);
    setCurrentIndex(0);
  };

  const handleLike = async (id: string) => {
  const friend = filteredFriends.find(f => f._id === id);
  if (!friend || likedFriends.find(f => f._id === id)) return;

  const isMock = id.startsWith("mock-");
  const updatedLiked = [...likedFriends, friend];
  saveLikedToStorage(updatedLiked);

  if (isMock) {
    toast("Friend Liked!", { description: `You liked ${friend.name}` });
    setCurrentIndex((prev) => (prev + 1) % filteredFriends.length);
    return;
  }

  try {
    const user = getAuth().currentUser;
    const token = await getIdToken(user, true);

    const res = await fetch(`${API_BASE}/swipe/friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ friendId: id })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to like friend");
    }

    // Sync DB liked users after like
    const likedRes = await fetch(`${API_BASE}/profile/friends`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const likedData = await likedRes.json();
    const combined = [...likedData, ...updatedLiked.filter(f => f._id.startsWith("mock-"))];
    setLikedFriends(combined);
    localStorage.setItem("likedFriends", JSON.stringify(combined));

    toast("Friend Liked!", { description: `You liked ${friend.name}` });
  } catch (err) {
    console.error(err);
    toast.error("Could not like friend.");
  }

  setCurrentIndex(prev => (prev + 1) % filteredFriends.length);
};




  const handleUnlike = async (id) => {
    const updated = likedFriends.filter(f => f._id !== id);
    saveLikedToStorage(updated);

    try {
      const user = getAuth().currentUser;
      const token = await getIdToken(user, true);

      await fetch(`${API_BASE}/swipe/unlike-friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
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
            {filteredFriends.length > 0 && current ? (
              <SwipeCard
                id={current._id}
                image={`${SOCKET_URL}${current.profileImage || "/uploads/default.png"}`}
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
                onDislike={() => setCurrentIndex((prev) => (prev + 1) % filteredFriends.length)}
              />
            ) : (
              <div className="text-center py-12">
                <p>No friends found. Reset your filters?</p>
                <Button onClick={() => setFilteredFriends(allFriends)} className="mt-2">Reset Filters</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked">
            {likedFriends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {likedFriends.map((f) => (
                  <div
                    key={f._id}
                    className="bg-[#1f2937] text-white p-4 rounded-lg shadow flex gap-4"
                  >
                    <img
                      src={`${SOCKET_URL}${f.profileImage || "/uploads/default.png"}`}
                      alt={f.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{f.name}</h3>
                      <p className="text-sm text-gray-400">{f.nationality}</p>
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
