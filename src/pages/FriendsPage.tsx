
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


const FriendsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const token = localStorage.getItem('immigrantConnect_token');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedFriends, setLikedFriends] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);
  const navigate = useNavigate();

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
      return;
    }

    const fetchFriends = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile/friend-suggestions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setAllFriends(data); // store all for filtering
        setFilteredFriends(data); // show initially
      } catch (err) {
        console.error(err);
        toast.error('Failed to load friends');
      }
    };
    
    const fetchLiked = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile/friends', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setLikedFriends(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load liked friends');
      }
    };

    fetchFriends();
    fetchLiked();
  }, [isAuthenticated]);


  const handleFilterChange = (filterId: string, value: string) => {
    if (value === "") {
      // Reset filter for this category
      setFilteredFriends(allFriends);
    } else {
      let filtered;

      if (filterId === "nationality") {
        filtered = allFriends.filter(friend => friend.nationality === value);
      } else if (filterId === "interest") {
        filtered = allFriends.filter(friend => friend.interests.includes(value));
      } else if (filterId === "language") {
        filtered = allFriends.filter(friend => friend.languages.includes(value));
      } else {
        filtered = allFriends;
      }

      setFilteredFriends(filtered);
      setCurrentIndex(0);
    }
  };

  const handleLike = async (id: string) => {
    const likedFriend = filteredFriends.find(friend => friend._id === id); // _id comes from MongoDB

    if (likedFriend) {
      try {
        const res = await fetch('http://localhost:5000/api/swipe/friend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ friendId: likedFriend._id })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to like');

        setLikedFriends([...likedFriends, likedFriend]);
        toast("New Friend Added!", {
          description: `You liked ${likedFriend.name}`,
        });
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Could not like friend');
      }
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
                id={currentFriend._id}
                image={`http://localhost:5000${currentFriend.profileImage || '/uploads/default.png'}`}
                title={currentFriend.name}
                subtitle={`${currentFriend.age} • ${currentFriend.nationality}`}
                details={
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{currentFriend.university}</p>
                    <p className="text-sm">{currentFriend.bio}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(currentFriend.interest || []).map((item, index) => (
                        <Badge key={index} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Languages:</p>
                      <div className="flex flex-wrap gap-1">
                        {(currentFriend.language || []).map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lang}
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
                  onClick={() => setFilteredFriends(allFriends)}
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
                  <div key={friend._id} className="bg-white rounded-lg shadow-sm p-4 flex">
                    <img
                      src={`http://localhost:5000${friend.profileImage || '/uploads/default.png'}`}
                      alt={friend.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{friend.name}</h3>
                      <p className="text-sm text-gray-500">{friend.nationality}</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-primary hover:bg-secondary"
                        onClick={() => navigate(`/chat?with=${friend._id}`)}
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
