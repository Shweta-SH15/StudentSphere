
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
import { SOCKET_URL } from "@/lib/api";

type Roommate = {
  _id: string;
  name: string;
  age: number;
  gender: string;
  occupation?: string;
  budget?: string;
  moveInDate?: string;
  profileImage?: string;
  bio?: string;
  lifestyle?: string[];
  interests?: string[];
};

const RoommatesPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allRoommates, setAllRoommates] = useState<Roommate[]>([]);
  const [likedRoommates, setLikedRoommates] = useState<Roommate[]>([]);
  const [filteredRoommates, setFilteredRoommates] = useState<Roommate[]>([]);  
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);
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
    profileImage: "/uploads/sample1.jpg",
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
    profileImage: "/uploads/sample2.jpg",
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
    profileImage: "/uploads/sample3.jpg",
    lifestyle: ["Non-smoker", "Night Owl"],
    interests: ["Cricket", "Finance", "Movies"],
  },
  {
    _id: "mock-r4",
    name: "Fatima Zahra",
    age: 23,
    gender: "Female",
    occupation: "Working Professional",
    budget: "$950",
    moveInDate: "2024-10-01",
    bio: "Professional looking for a responsible roommate.",
    profileImage: "/uploads/sample4.jpg",
    lifestyle: ["Early Riser", "Non-smoker", "Clean"],
    interests: ["Reading", "Yoga", "Volunteering"],
  },
  {
    _id: "mock-r5",
    name: "Noah Smith",
    age: 25,
    gender: "Male",
    occupation: "Intern",
    budget: "$800",
    moveInDate: "2024-06-15",
    bio: "Intern at a startup, love quiet evenings and coffee.",
    profileImage: "/uploads/sample5.jpg",
    lifestyle: ["Clean", "Night Owl"],
    interests: ["Startups", "Gaming", "Skiing"],
  },
];

  const filterOptions = [
    {
      id: "gender",
      name: "Gender",
      values: ["Male", "Female"],
    },
    {
      id: "age",
      name: "Age Range",
      values: ["18-21", "22-25", "26+"],
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      values: ["Non-smoker", "Early Riser", "Night Owl", "Pet Lover", "Clean"],
    },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const token = localStorage.getItem("immigrantConnect_token");

    const fetchRoommates = async () => {
  try {
    const res = await fetch(`${API_BASE}/profile/roommate-suggestions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    const fallback = Array.isArray(data) && data.length > 0 ? data : mockRoommates;

    setAllRoommates(fallback);
    setFilteredRoommates(fallback);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load roommates. Showing mock data.");
    setAllRoommates(mockRoommates);
    setFilteredRoommates(mockRoommates);
  }
};


    const fetchLikedRoommates = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile/roommates`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setLikedRoommates(data);
      } catch (err) {
        toast.error("Failed to load liked roommates.");
        console.error(err);
      }
    };

    fetchRoommates();
    fetchLikedRoommates();
  }, [isAuthenticated]);


  const handleFilterChange = (filterId: string, value: string) => {
    if (value === "") {
      // Reset filter for this category
      setFilteredRoommates(allRoommates);
    } else {
      let filtered;

      if (filterId === "gender") {
        filtered = allRoommates.filter(roommate => roommate.gender === value);
      } else if (filterId === "age") {
        filtered = allRoommates.filter(roommate => {
          if (value === "18-21") return roommate.age >= 18 && roommate.age <= 21;
          if (value === "22-25") return roommate.age >= 22 && roommate.age <= 25;
          if (value === "26+") return roommate.age >= 26;
          return true;
        });
      } else if (filterId === "lifestyle") {
        filtered = allRoommates.filter(roommate => roommate.lifestyle.includes(value));
      } else {
        filtered = allRoommates;
      }

      setFilteredRoommates(filtered);
      setCurrentIndex(0);
    }
  };

  const handleLike = async (id: string) => {
    const token = localStorage.getItem("immigrantConnect_token");
    const likedRoommate = filteredRoommates.find(r => r._id === id); // use _id from MongoDB

    if (likedRoommate) {
      try {
        const res = await fetch(`${API_BASE}/swipe/roommate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ roommateId: likedRoommate._id }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to like roommate");

        setLikedRoommates([...likedRoommates, likedRoommate]);
        toast("Roommate Saved!", {
          description: `You matched with ${likedRoommate.name}`,
        });
      } catch (err: any) {
        toast.error(err.message || "Could not like roommate");
      }
    }

    setCurrentIndex(prev => (prev + 1) % filteredRoommates.length);
  };


  const handleDislike = (id: string) => {
    // Move to next card
    setCurrentIndex(prevIndex => (prevIndex + 1) % filteredRoommates.length);
  };

  const handleMessageClick = (roommateName: string) => {
    toast("Coming Soon", {
      description: `Messaging ${roommateName} will be available in the next update!`,
    });
  };

  const currentRoommate = filteredRoommates[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Find Roommates</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="liked">Liked ({likedRoommates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="mt-0">
            <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />

            {filteredRoommates.length > 0 ? (
              <SwipeCard
              id={currentRoommate._id}
              image={`${SOCKET_URL}${currentRoommate.profileImage || "/uploads/default.png"}`}
              title={currentRoommate.name}
              subtitle={`${currentRoommate.age || "Not provided"} • ${currentRoommate.gender || "Not provided"}`}
              details={
                <div className="space-y-3">
                  <p className="text-sm">{currentRoommate.bio || "No bio provided."}</p>
                  <div>
                    <p className="text-xs font-medium mb-1">Lifestyle:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(currentRoommate.lifestyle) && currentRoommate.lifestyle.length > 0 ? (
                        currentRoommate.lifestyle.map((item: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-accent-green text-green-700">
                            {item}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(currentRoommate.interests) && currentRoommate.interests.length > 0 ? (
                        currentRoommate.interests.map((interest: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              }
              onLike={handleLike}
              onDislike={handleDislike}
            />
            
            
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No roommates found matching your filters.</p>
                <Button
                  variant="link"
                  onClick={() => setFilteredRoommates(allRoommates)}
                  className="mt-2 text-primary"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked">
            {likedRoommates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {likedRoommates.map((roommate) => (
                  <div key={roommate._id} className="bg-white rounded-lg shadow-sm p-4 flex">
                    <img src={`${SOCKET_URL}${roommate.profileImage || "/uploads/default.png"}`} />
                    <div className="flex-1">
                      <h3 className="font-semibold">{roommate.name}</h3>
                      <p className="text-sm text-gray-500">{roommate.age} • {roommate.gender}</p>
                      <p className="text-sm text-gray-600">{roommate.budget}</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-primary hover:bg-secondary"
                        onClick={() => handleMessageClick(roommate.name)}
                      >
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't liked any potential roommates yet.</p>
                <Button
                  variant="link"
                  onClick={() => setActiveTab("discover")}
                  className="mt-2 text-primary"
                >
                  Start Discovering
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView="login"
      />
    </div>
  );
};

export default RoommatesPage;
