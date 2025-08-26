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

// Helper: return correct image based on gender
const getProfileImage = (roommate) => {
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

const mockRoommates: Roommate[] = [
  {
    _id: "mock-r1",
    name: "Alex Chen",
    age: 22,
    gender: "Male",
    occupation: "Student",
    budget: "$900",
    moveInDate: "2024-09-01",
    bio: "CS student who enjoys calm nights and clean shared spaces.",
    lifestyle: ["Non-smoker", "Early Riser", "Clean"],
    interests: ["Basketball", "Gaming", "Coding"],
  },
  {
    _id: "mock-r2",
    name: "Laura García",
    age: 21,
    gender: "Female",
    occupation: "Student",
    budget: "$850",
    moveInDate: "2024-08-15",
    bio: "Love music, cooking, and traveling. Looking for a chill roommate.",
    lifestyle: ["Pet Lover", "Clean"],
    interests: ["Music", "Cooking", "Travel"],
  },
  {
    _id: "mock-r3",
    name: "Raj Patel",
    age: 24,
    gender: "Male",
    occupation: "Graduate Student",
    budget: "$1000",
    moveInDate: "2024-07-01",
    bio: "Quiet and respectful. Prefer tidy shared spaces.",
    lifestyle: ["Non-smoker", "Night Owl"],
    interests: ["Cricket", "Finance", "Movies"],
  },
  {
    _id: "mock-r4",
    name: "Emma Wilson",
    age: 23,
    gender: "Female",
    occupation: "Working Professional",
    budget: "$950",
    moveInDate: "2024-10-01",
    bio: "Professional looking for a responsible roommate.",
    lifestyle: ["Early Riser", "Non-smoker", "Clean"],
    interests: ["Reading", "Yoga", "Volunteering"],
  },
  {
    _id: "mock-r5",
    name: "Omar Hassan",
    age: 25,
    gender: "Male",
    occupation: "Intern",
    budget: "$800",
    moveInDate: "2024-06-15",
    bio: "Intern at a startup, love quiet evenings and coffee.",
    lifestyle: ["Clean", "Night Owl"],
    interests: ["Startups", "Gaming", "Skiing"],
  },
];

const RoommatesPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allRoommates, setAllRoommates] = useState([]);
  const [likedRoommates, setLikedRoommates] = useState([]);
  const [filteredRoommates, setFilteredRoommates] = useState([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const fetchData = async () => {
      const token = await getIdToken(getAuth().currentUser, true);

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
        setFilteredRoommates(combined);

        const localLiked = JSON.parse(localStorage.getItem("likedRoommates") || "[]");
        const mergedLiked = [...(Array.isArray(liked) ? liked : []), ...localLiked.filter(m => m._id.startsWith("mock-"))];
        setLikedRoommates(mergedLiked);
      } catch (err) {
        console.error("Error loading roommates:", err);
        setAllRoommates(mockRoommates);
        setFilteredRoommates(mockRoommates);
        const localLiked = JSON.parse(localStorage.getItem("likedRoommates") || "[]");
        setLikedRoommates(localLiked);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const saveMockLikes = (updated) => {
    localStorage.setItem("likedRoommates", JSON.stringify(updated.filter(r => r._id.startsWith("mock-"))));
    setLikedRoommates(updated);
  };

  const handleLike = async (id) => {
    const roommate = filteredRoommates.find(r => r._id === id);
    if (!roommate || likedRoommates.some(r => r._id === id)) return;

    const isMock = id.startsWith("mock-");
    if (isMock) {
      const updated = [...likedRoommates, roommate];
      saveMockLikes(updated);
      toast("Saved (Local)", { description: `You liked ${roommate.name}` });
    } else {
      try {
        const token = await getIdToken(getAuth().currentUser, true);
        await fetch(`${API_BASE}/swipe/roommate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
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

    setCurrentIndex((i) => (i + 1) % filteredRoommates.length);
  };

  const handleUnlike = async (id) => {
    const isMock = id.startsWith("mock-");
    const updated = likedRoommates.filter(r => r._id !== id);

    if (isMock) {
      saveMockLikes(updated);
      toast("Removed", { description: "Removed from local liked" });
    } else {
      try {
        const token = await getIdToken(getAuth().currentUser, true);
        await fetch(`${API_BASE}/swipe/unlike-roommate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
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
    setCurrentIndex((i) => (i + 1) % filteredRoommates.length);
  };

  const filterOptions = [
    { id: "gender", name: "Gender", values: ["Male", "Female"] },
    { id: "age", name: "Age Range", values: ["18-21", "22-25", "26+"] },
    { id: "lifestyle", name: "Lifestyle", values: ["Non-smoker", "Early Riser", "Night Owl", "Pet Lover", "Clean"] },
  ];

  const handleFilterChange = (filterId, value) => {
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
    setFilteredRoommates(filtered);
    setCurrentIndex(0);
  };

  const currentRoommate = filteredRoommates[currentIndex];

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
            {currentRoommate ? (
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
            ) : (
              <p className="text-center py-12 text-gray-500">No roommates found.</p>
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
                      <p className="text-sm text-gray-400">
                        {roommate.age} • {roommate.gender}
                      </p>
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
