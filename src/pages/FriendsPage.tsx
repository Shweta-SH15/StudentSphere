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

  // 🔹 Your mock users
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
    { id: "nationality", name: "Nationality", values: ["China", "Spain", "India", "Australia", "Egypt"] },
    { id: "interest", name: "Interest", values: ["Photography", "Music", "Sports", "Travel", "Cooking", "Art"] },
    { id: "language", name: "Language", values: ["English", "Mandarin", "Spanish", "Hindi", "Arabic", "French"] }
  ];

  const getProfileImage = (friend: any) => {
    if (friend.gender === "male") return maleAvatar;
    if (friend.gender === "female") return femaleAvatar;
    return otherAvatar;
  };

  // 🔹 Filter out already liked friends
  const getDiscoverFriends = (friends: any[]) =>
    friends.filter(f => !likedFriends.find(l => l._id === f._id));

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const fetchFriends = async () => {
      try {
        const user = getAuth().currentUser;
        const token = await getIdToken(user!, true);

        // ✅ get backend users
        const res = await fetch(`${API_BASE}/profile/friend-suggestions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dbFriends = await res.json();

        // ✅ merge mocks + DB
        const merged = [...mockFriends, ...(Array.isArray(dbFriends) ? dbFriends : [])];
        // remove duplicates
        const unique = merged.filter((f, i, arr) => arr.findIndex(x => x._id === f._id) === i);

        setAllFriends(unique);
        setFilteredFriends(getDiscoverFriends(unique));
      } catch (err) {
        console.error(err);
        setAllFriends(mockFriends);
        setFilteredFriends(getDiscoverFriends(mockFriends));
      }
    };

    const fetchLiked = async () => {
      try {
        const user = getAuth().currentUser;
        const token = await getIdToken(user!, true);

        const res = await fetch(`${API_BASE}/profile/friends`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const liked = await res.json();
        setLikedFriends(liked);
      } catch (err) {
        console.error("Failed to fetch liked friends", err);
      }
    };

    fetchFriends();
    fetchLiked();
  }, [isAuthenticated]);

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
    setFilteredFriends(getDiscoverFriends(filtered));
    setCurrentIndex(0);
  };

  const handleLike = async (id: string) => {
    const friend = allFriends.find(f => f._id === id);
    if (!friend || likedFriends.find(f => f._id === id)) return;

    const updatedLiked = [...likedFriends, friend];
    setLikedFriends(updatedLiked);

    try {
      const user = getAuth().currentUser;
      const token = await getIdToken(user!, true);

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

    setFilteredFriends(getDiscoverFriends(allFriends));
    setCurrentIndex(prev => (prev + 1) % Math.max(1, getDiscoverFriends(allFriends).length));
  };

  const handleDislike = (id: string) => {
    setCurrentIndex(prev => (prev + 1) % Math.max(1, filteredFriends.length));
  };

  const handleUnlike = async (id: string) => {
    const updated = likedFriends.filter(f => f._id !== id);
    setLikedFriends(updated);

    try {
      const user = getAuth().currentUser;
      const token = await getIdToken(user!, true);

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

  const current = filteredFriends.length > 0
    ? filteredFriends[currentIndex % filteredFriends.length]
    : null;

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
            {current && (
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
                      {current.interest?.map((tag: string, i: number) => (
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
