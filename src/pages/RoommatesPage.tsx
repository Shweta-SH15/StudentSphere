
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import SwipeCard from "@/components/SwipeCard/SwipeCard";
import FilterBar from "@/components/SwipeCard/FilterBar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "@/components/ui/sonner";

// Mock data
const mockRoommates = [
  {
    id: "rm1",
    name: "Michael Park",
    age: 23,
    gender: "Male",
    occupation: "Graduate Student",
    budget: "$800-$1000/month",
    moveInDate: "September 1, 2023",
    lifestyle: ["Non-smoker", "Early Riser", "Quiet"],
    interests: ["Reading", "Hiking", "Cooking"],
    bio: "Engineering student looking for a roommate with similar study-focused lifestyle. Clean and organized.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: "rm2",
    name: "Sophia Chen",
    age: 21,
    gender: "Female",
    occupation: "Undergraduate Student",
    budget: "$600-$800/month",
    moveInDate: "August 15, 2023",
    lifestyle: ["Non-smoker", "Night Owl", "Social"],
    interests: ["Art", "Movies", "Traveling"],
    bio: "Art history student looking for a roommate who is respectful of shared spaces and doesn't mind occasional gatherings.",
    image: "https://randomuser.me/api/portraits/women/39.jpg",
  },
  {
    id: "rm3",
    name: "David Kim",
    age: 24,
    gender: "Male",
    occupation: "Working Professional",
    budget: "$900-$1200/month",
    moveInDate: "October 1, 2023",
    lifestyle: ["Non-smoker", "Clean", "Active"],
    interests: ["Fitness", "Technology", "Music"],
    bio: "Software developer who works from home a few days a week. Looking for a roommate who is tidy and respects privacy.",
    image: "https://randomuser.me/api/portraits/men/28.jpg",
  },
  {
    id: "rm4",
    name: "Emma Rodriguez",
    age: 22,
    gender: "Female",
    occupation: "Undergraduate Student",
    budget: "$700-$900/month",
    moveInDate: "September 1, 2023",
    lifestyle: ["Non-smoker", "Pet Lover", "Vegetarian"],
    interests: ["Yoga", "Photography", "Volunteering"],
    bio: "Environmental science student with a small cat. Looking for pet-friendly roommate who shares a passion for sustainability.",
    image: "https://randomuser.me/api/portraits/women/62.jpg",
  },
  {
    id: "rm5",
    name: "James Wilson",
    age: 25,
    gender: "Male",
    occupation: "Graduate Student",
    budget: "$800-$1100/month",
    moveInDate: "August 20, 2023",
    lifestyle: ["Occasional Smoker", "Night Owl", "Social"],
    interests: ["Music", "Sports", "Gaming"],
    bio: "Music student who practices during the day. Looking for a roommate who appreciates music and has a similar schedule.",
    image: "https://randomuser.me/api/portraits/men/37.jpg",
  },
];

const RoommatesPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedRoommates, setLikedRoommates] = useState<typeof mockRoommates>([]);
  const [filteredRoommates, setFilteredRoommates] = useState(mockRoommates);
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
    }
  }, [isAuthenticated]);

  const handleFilterChange = (filterId: string, value: string) => {
    if (value === "") {
      // Reset filter for this category
      setFilteredRoommates(mockRoommates);
    } else {
      let filtered;
      
      if (filterId === "gender") {
        filtered = mockRoommates.filter(roommate => roommate.gender === value);
      } else if (filterId === "age") {
        filtered = mockRoommates.filter(roommate => {
          if (value === "18-21") return roommate.age >= 18 && roommate.age <= 21;
          if (value === "22-25") return roommate.age >= 22 && roommate.age <= 25;
          if (value === "26+") return roommate.age >= 26;
          return true;
        });
      } else if (filterId === "lifestyle") {
        filtered = mockRoommates.filter(roommate => roommate.lifestyle.includes(value));
      } else {
        filtered = mockRoommates;
      }
      
      setFilteredRoommates(filtered);
      setCurrentIndex(0);
    }
  };

  const handleLike = (id: string) => {
    const likedRoommate = filteredRoommates.find(roommate => roommate.id === id);
    if (likedRoommate) {
      setLikedRoommates([...likedRoommates, likedRoommate]);
      toast("Roommate Saved!", {
        description: `You matched with ${likedRoommate.name}`,
      });
    }
    
    // Move to next card
    setCurrentIndex(prevIndex => (prevIndex + 1) % filteredRoommates.length);
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
                id={currentRoommate.id}
                image={currentRoommate.image}
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
                  onClick={() => setFilteredRoommates(mockRoommates)}
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
                  <div key={roommate.id} className="bg-white rounded-lg shadow-sm p-4 flex">
                    <img
                      src={roommate.image}
                      alt={roommate.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
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
