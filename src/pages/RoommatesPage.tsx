
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import SwipeCard from "@/components/SwipeCard/SwipeCard";
import FilterBar from "@/components/SwipeCard/FilterBar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "@/components/ui/sonner";

const RoommatesPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allRoommates, setAllRoommates] = useState([]);
  const [likedRoommates, setLikedRoommates] = useState([]);
  const [filteredRoommates, setFilteredRoommates] = useState([]);  
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);

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
        const res = await fetch("http://localhost:5000/api/profile/roommate-suggestions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAllRoommates(data);
        setFilteredRoommates(data);
      } catch (err) {
        toast.error("Failed to load roommates.");
        console.error(err);
      }
    };
  
    const fetchLikedRoommates = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile/roommates", {
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
        const res = await fetch("http://localhost:5000/api/swipe/roommate", {
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
                image={`http://localhost:5000${currentRoommate.profileImage || "/uploads/default.png"}`}
                title={currentRoommate.name}
                subtitle={`${currentRoommate.age} • ${currentRoommate.gender} • ${currentRoommate.occupation}`}
                details={
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1 text-sm">
                      <p><span className="font-medium">Budget:</span> {currentRoommate.budget}</p>
                      <p><span className="font-medium">Move-in Date:</span> {currentRoommate.moveInDate}</p>
                    </div>
                    <p className="text-sm">{currentRoommate.bio}</p>
                    <div>
                      <p className="text-xs font-medium mb-1">Lifestyle:</p>
                      <div className="flex flex-wrap gap-2">
                        {currentRoommate.lifestyle.map((item, index) => (
                          <Badge key={index} variant="secondary" className="bg-accent-green text-green-700">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Interests:</p>
                      <div className="flex flex-wrap gap-2">
                        {currentRoommate.interests.map((interest, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
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
                  <img src={`http://localhost:5000${roommate.profileImage || "/uploads/default.png"}`} />
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
