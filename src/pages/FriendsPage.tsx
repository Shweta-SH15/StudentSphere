
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
const mockFriends = [
  {
    id: "f1",
    name: "Alex Chen",
    age: 22,
    nationality: "China",
    university: "University of Toronto",
    interests: ["Photography", "Basketball", "Coding"],
    languages: ["Mandarin", "English"],
    bio: "Computer Science student looking to make international friends and practice my English.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "f2",
    name: "Laura García",
    age: 20,
    nationality: "Spain",
    university: "McGill University",
    interests: ["Music", "Hiking", "Politics"],
    languages: ["Spanish", "English", "French"],
    bio: "International Relations student who loves exploring the city and going to live music events.",
    image: "https://randomuser.me/api/portraits/women/43.jpg",
  },
  {
    id: "f3",
    name: "Raj Patel",
    age: 24,
    nationality: "India",
    university: "University of British Columbia",
    interests: ["Cricket", "Cooking", "Startups"],
    languages: ["Hindi", "English"],
    bio: "MBA student with a passion for entrepreneurship and connecting people.",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
  },
  {
    id: "f4",
    name: "Emma Wilson",
    age: 21,
    nationality: "Australia",
    university: "Queen's University",
    interests: ["Swimming", "Travel", "Art"],
    languages: ["English"],
    bio: "Fine Arts student looking for friends to explore galleries and museums with.",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    id: "f5",
    name: "Omar Hassan",
    age: 23,
    nationality: "Egypt",
    university: "York University",
    interests: ["Soccer", "History", "Film"],
    languages: ["Arabic", "English"],
    bio: "Film studies major hoping to find friends with similar interests in cinema and culture.",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
  },
];

const FriendsPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedFriends, setLikedFriends] = useState<typeof mockFriends>([]);
  const [filteredFriends, setFilteredFriends] = useState(mockFriends);
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);

  const filterOptions = [
    {
      id: "nationality",
      name: "Nationality",
      values: ["China", "Spain", "India", "Australia", "Egypt"],
    },
    {
      id: "interest",
      name: "Interest",
      values: ["Photography", "Music", "Sports", "Travel", "Cooking", "Art"],
    },
    {
      id: "language",
      name: "Language",
      values: ["English", "Mandarin", "Spanish", "Hindi", "Arabic", "French"],
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
      setFilteredFriends(mockFriends);
    } else {
      let filtered;
      
      if (filterId === "nationality") {
        filtered = mockFriends.filter(friend => friend.nationality === value);
      } else if (filterId === "interest") {
        filtered = mockFriends.filter(friend => friend.interests.includes(value));
      } else if (filterId === "language") {
        filtered = mockFriends.filter(friend => friend.languages.includes(value));
      } else {
        filtered = mockFriends;
      }
      
      setFilteredFriends(filtered);
      setCurrentIndex(0);
    }
  };

  const handleLike = (id: string) => {
    const likedFriend = filteredFriends.find(friend => friend.id === id);
    if (likedFriend) {
      setLikedFriends([...likedFriends, likedFriend]);
      toast("New Friend Added!", {
        description: `You liked ${likedFriend.name}`,
      });
    }
    
    // Move to next card
    setCurrentIndex(prevIndex => (prevIndex + 1) % filteredFriends.length);
  };

  const handleDislike = (id: string) => {
    // Move to next card
    setCurrentIndex(prevIndex => (prevIndex + 1) % filteredFriends.length);
  };

  const handleMessageClick = (friendName: string) => {
    toast("Coming Soon", {
      description: `Messaging ${friendName} will be available in the next update!`,
    });
  };

  const currentFriend = filteredFriends[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Find Friends</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="liked">Liked ({likedFriends.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="mt-0">
            <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />
            
            {filteredFriends.length > 0 ? (
              <SwipeCard
                id={currentFriend.id}
                image={currentFriend.image}
                title={currentFriend.name}
                subtitle={`${currentFriend.age} • ${currentFriend.nationality}`}
                details={
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{currentFriend.university}</p>
                    <p className="text-sm">{currentFriend.bio}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentFriend.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="bg-accent-purple text-primary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Languages:</p>
                      <div className="flex flex-wrap gap-1">
                        {currentFriend.languages.map((language, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {language}
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
                <p className="text-gray-500">No friends found matching your filters.</p>
                <Button 
                  variant="link" 
                  onClick={() => setFilteredFriends(mockFriends)}
                  className="mt-2 text-primary"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="liked">
            {likedFriends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {likedFriends.map((friend) => (
                  <div key={friend.id} className="bg-white rounded-lg shadow-sm p-4 flex">
                    <img
                      src={friend.image}
                      alt={friend.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{friend.name}</h3>
                      <p className="text-sm text-gray-500">{friend.nationality}</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-primary hover:bg-secondary"
                        onClick={() => handleMessageClick(friend.name)}
                      >
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't liked any friends yet.</p>
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

export default FriendsPage;
