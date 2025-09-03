import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import SwipeCard from "@/components/SwipeCard/SwipeCard";
import FilterBar from "@/components/SwipeCard/FilterBar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "@/components/ui/sonner";
import { API_BASE } from "@/lib/api";
import { getAuth, getIdToken } from "firebase/auth";

// Default avatars
const maleAvatar = "/images/male.jpg";
const femaleAvatar = "/images/female.jpg";
const otherAvatar = "/images/other.jpg";

const getProfileImage = (roommate: any) => {
  if (roommate.gender?.toLowerCase() === "male") return maleAvatar;
  if (roommate.gender?.toLowerCase() === "female") return femaleAvatar;
  return otherAvatar;
};

type Roommate = {
  _id: string;
  name: string;
  age: number;
  gender: string;
  occupation?: string;
  budget?: string;
  moveInDate?: string;
  bio?: string;
  lifestyle?: string[];
  interests?: string[];
};

const mockRoommates = [
  {
    _id: "mock-r1",
    name: "Alex Chen",
    age: 22,
    gender: "Male",
    occupation: "Computer Science Student",
    budget: "$900",
    moveInDate: "2024-09-01",
    bio: "Computer Science student looking to make international friends and practice my English.",
    lifestyle: ["Non-smoker", "Early Riser"],
    interests: ["Photography", "Basketball", "Coding"],
  },
  {
    _id: "mock-r2",
    name: "Laura García",
    age: 20,
    gender: "Female",
    occupation: "International Relations Student",
    budget: "$850",
    moveInDate: "2024-08-15",
    bio: "International Relations student who loves exploring the city and going to live music events.",
    lifestyle: ["Pet Lover", "Clean"],
    interests: ["Music", "Hiking", "Politics"],
  },
  {
    _id: "mock-r3",
    name: "Raj Patel",
    age: 24,
    gender: "Male",
    occupation: "MBA Student",
    budget: "$1000",
    moveInDate: "2024-07-01",
    bio: "MBA student with a passion for entrepreneurship and connecting people.",
    lifestyle: ["Non-smoker", "Night Owl"],
    interests: ["Cricket", "Cooking", "Startups"],
  },
  {
    _id: "mock-r4",
    name: "Emma Wilson",
    age: 21,
    gender: "Female",
    occupation: "Fine Arts Student",
    budget: "$950",
    moveInDate: "2024-10-01",
    bio: "Fine Arts student looking for friends to explore galleries and museums with.",
    lifestyle: ["Early Riser", "Clean"],
    interests: ["Swimming", "Travel", "Art"],
  },
  {
    _id: "mock-r5",
    name: "Omar Hassan",
    age: 23,
    gender: "Male",
    occupation: "Film Studies Major",
    budget: "$800",
    moveInDate: "2024-06-15",
    bio: "Film studies major hoping to find friends with similar interests in cinema and culture.",
    lifestyle: ["Night Owl", "Clean"],
    interests: ["Soccer", "History", "Film"],
  },
  {
    _id: "mock-r6",
    name: "Sophia Müller",
    age: 22,
    gender: "Female",
    occupation: "Engineering Student",
    budget: "$870",
    moveInDate: "2024-09-10",
    bio: "Engineering student exploring Canada and technology trends.",
    lifestyle: ["Non-smoker", "Early Riser"],
    interests: ["Tech", "Travel", "Photography"],
  },
  {
    _id: "mock-r7",
    name: "Daniel Kim",
    age: 21,
    gender: "Male",
    occupation: "Computer Science Student",
    budget: "$880",
    moveInDate: "2024-08-01",
    bio: "Gamer and coder looking to meet international friends.",
    lifestyle: ["Night Owl", "Clean"],
    interests: ["Gaming", "Coding", "Music"],
  },
  {
    _id: "mock-r8",
    name: "Fatima Ali",
    age: 23,
    gender: "Female",
    occupation: "Student",
    budget: "$820",
    moveInDate: "2024-07-15",
    bio: "Love food and adventures, always up for new experiences.",
    lifestyle: ["Pet Lover", "Clean"],
    interests: ["Cooking", "Travel", "Reading"],
  },
  {
    _id: "mock-r9",
    name: "Lucas Silva",
    age: 24,
    gender: "Male",
    occupation: "Student",
    budget: "$890",
    moveInDate: "2024-09-20",
    bio: "Soccer and music fan, looking to meet fellow students.",
    lifestyle: ["Non-smoker", "Night Owl"],
    interests: ["Soccer", "Music", "Hiking"],
  },
  {
    _id: "mock-r10",
    name: "Aisha Mohammed",
    age: 22,
    gender: "Female",
    occupation: "Art Student",
    budget: "$900",
    moveInDate: "2024-10-05",
    bio: "Art lover and fashion enthusiast eager to connect with friends.",
    lifestyle: ["Clean", "Early Riser"],
    interests: ["Fashion", "Art", "Photography"],
  },
  {
    _id: "mock-r11",
    name: "Mateo Rossi",
    age: 23,
    gender: "Male",
    occupation: "Student",
    budget: "$880",
    moveInDate: "2024-08-25",
    bio: "Foodie and traveler, loves meeting new people.",
    lifestyle: ["Non-smoker", "Clean"],
    interests: ["Cooking", "Travel", "Soccer"],
  },
  {
    _id: "mock-r12",
    name: "Elena Petrova",
    age: 21,
    gender: "Female",
    occupation: "Art Student",
    budget: "$860",
    moveInDate: "2024-09-12",
    bio: "Art student seeking friends who enjoy creative activities.",
    lifestyle: ["Early Riser", "Pet Lover"],
    interests: ["Art", "Music", "Photography"],
  },
  {
    _id: "mock-r13",
    name: "Mohammed Khan",
    age: 24,
    gender: "Male",
    occupation: "Tech Student",
    budget: "$910",
    moveInDate: "2024-07-30",
    bio: "Tech enthusiast and cricket fan looking for like-minded friends.",
    lifestyle: ["Night Owl", "Clean"],
    interests: ["Cricket", "Technology", "Reading"],
  },
  {
    _id: "mock-r14",
    name: "Hannah Lee",
    age: 22,
    gender: "Female",
    occupation: "Political Science Student",
    budget: "$870",
    moveInDate: "2024-08-18",
    bio: "Debate club member looking to expand my social circle internationally.",
    lifestyle: ["Non-smoker", "Early Riser"],
    interests: ["Debate", "Politics", "Travel"],
  },
  {
    _id: "mock-r15",
    name: "Tariq Al-Farsi",
    age: 23,
    gender: "Male",
    occupation: "History Student",
    budget: "$850",
    moveInDate: "2024-09-07",
    bio: "History student and football fan, eager to meet new friends.",
    lifestyle: ["Night Owl", "Clean"],
    interests: ["Football", "History", "Music"],
  },
];


const RoommatesPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allRoommates, setAllRoommates] = useState<Roommate[]>([]);
  const [likedRoommates, setLikedRoommates] = useState<Roommate[]>([]);
  const [filteredRoommates, setFilteredRoommates] = useState<Roommate[]>([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);

  // 🔹 Utility to remove liked ones
  const getDiscoverRoommates = (list: Roommate[]) => {
    return list.filter(r => !likedRoommates.find(l => l._id === r._id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const fetchData = async () => {
      const token = await getIdToken(getAuth().currentUser!, true);
      try {
        const [resSuggestions, resLiked] = await Promise.all([
          fetch(`${API_BASE}/profile/roommate-suggestions`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE}/profile/roommates`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        const suggestions = await resSuggestions.json();
        const liked = await resLiked.json();

        const combined = [...mockRoommates, ...(Array.isArray(suggestions) ? suggestions : [])];
        setAllRoommates(combined);
        setFilteredRoommates(getDiscoverRoommates(combined));

        const localLiked = JSON.parse(localStorage.getItem("likedRoommates") || "[]");
        const mergedLiked = [...(Array.isArray(liked) ? liked : []), ...localLiked.filter(m => m._id.startsWith("mock-"))];
        setLikedRoommates(mergedLiked);
      } catch (err) {
        console.error("Error loading roommates:", err);
        setAllRoommates(mockRoommates);
        setFilteredRoommates(getDiscoverRoommates(mockRoommates));
        const localLiked = JSON.parse(localStorage.getItem("likedRoommates") || "[]");
        setLikedRoommates(localLiked);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const saveMockLikes = (updated: Roommate[]) => {
    localStorage.setItem("likedRoommates", JSON.stringify(updated.filter(r => r._id.startsWith("mock-"))));
    setLikedRoommates(updated);
  };

  const handleLike = async (id: string) => {
    const roommate = allRoommates.find(r => r._id === id);
    if (!roommate || likedRoommates.some(r => r._id === id)) return;

    const isMock = id.startsWith("mock-");
    if (isMock) {
      const updated = [...likedRoommates, roommate];
      saveMockLikes(updated);
      toast("Saved (Local)", { description: `You liked ${roommate.name}` });
    } else {
      try {
        const token = await getIdToken(getAuth().currentUser!, true);
        await fetch(`${API_BASE}/swipe/roommate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ roommateId: id })
        });

        const likedRes = await fetch(`${API_BASE}/profile/roommates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const likedData = await likedRes.json();
        const updated = [...likedData, ...likedRoommates.filter(m => m._id.startsWith("mock-"))];
        setLikedRoommates(updated);
        toast("Saved", { description: `You liked ${roommate.name}` });
      } catch (err) {
        console.error("Failed to like roommate:", err);
        toast.error("Could not like roommate");
      }
    }

    // 🔹 Refresh list without liked roommate
    setFilteredRoommates(getDiscoverRoommates(allRoommates));
    setCurrentIndex(prev => (prev + 1) % Math.max(1, getDiscoverRoommates(allRoommates).length));
  };

  const handleUnlike = async (id: string) => {
    const isMock = id.startsWith("mock-");
    const updated = likedRoommates.filter(r => r._id !== id);

    if (isMock) {
      saveMockLikes(updated);
      toast("Removed", { description: "Removed from local liked" });
    } else {
      try {
        const token = await getIdToken(getAuth().currentUser!, true);
        await fetch(`${API_BASE}/swipe/unlike-roommate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ roommateId: id })
        });
        saveMockLikes(updated);
        toast("Removed", { description: "Removed from liked" });
      } catch {
        toast.error("Failed to remove");
      }
    }
  };

  const handleDislike = () => {
    setCurrentIndex(prev => (prev + 1) % Math.max(1, filteredRoommates.length));
  };

  const filterOptions = [
    { id: "gender", name: "Gender", values: ["Male", "Female"] },
    { id: "age", name: "Age Range", values: ["18-21", "22-25", "26+"] },
    { id: "lifestyle", name: "Lifestyle", values: ["Non-smoker", "Early Riser", "Night Owl", "Pet Lover", "Clean"] },
  ];

  const handleFilterChange = (filterId: string, value: string) => {
    let filtered = allRoommates;
    if (filterId === "gender") {
      filtered = filtered.filter(r => r.gender === value);
    } else if (filterId === "age") {
      filtered = filtered.filter(r =>
        value === "18-21" ? r.age <= 21 :
          value === "22-25" ? r.age >= 22 && r.age <= 25 :
            r.age >= 26
      );
    } else if (filterId === "lifestyle") {
      filtered = filtered.filter(r => r.lifestyle?.includes(value));
    }
    setFilteredRoommates(getDiscoverRoommates(filtered));
    setCurrentIndex(0);
  };

  const currentRoommate = filteredRoommates.length > 0
    ? filteredRoommates[currentIndex % filteredRoommates.length]
    : null;

  return (
    <div className="min-h-screen bg-[#0a0f1a] py-8 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Find Roommates</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#121826] text-white">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="liked">Liked ({likedRoommates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />
            {currentRoommate && (
              <SwipeCard
                id={currentRoommate._id}
                image={getProfileImage(currentRoommate)}
                title={currentRoommate.name}
                subtitle={`${currentRoommate.age} • ${currentRoommate.gender}`}
                details={
                  <div className="space-y-3">
                    <p className="text-sm">{currentRoommate.bio}</p>
                    <p className="text-xs text-gray-500">{currentRoommate.budget} • Move-in: {currentRoommate.moveInDate}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(currentRoommate.lifestyle || []).map((item, i) => (
                        <Badge key={i} variant="outline">{item}</Badge>
                      ))}
                    </div>
                  </div>
                }
                onLike={() => handleLike(currentRoommate._id)}
                onDislike={handleDislike}
              />
            )}
          </TabsContent>

          <TabsContent value="liked">
            {likedRoommates.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {likedRoommates.map((roommate) => (
                  <div key={roommate._id} className="bg-[#1f2937] text-white p-4 rounded-lg shadow flex">
                    <img
                      src={getProfileImage(roommate)}
                      alt={roommate.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{roommate.name}</h3>
                      <p className="text-sm text-gray-400">{roommate.age} • {roommate.gender}</p>
                      <p className="text-sm text-gray-500">{roommate.occupation}</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleUnlike(roommate._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-gray-500">No liked roommates yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView="login" />
    </div>
  );
};

export default RoommatesPage;
