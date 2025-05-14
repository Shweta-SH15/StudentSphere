
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
import { SOCKET_URL } from "@/lib/api";

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
    {
    _id: "mock-f6",
    name: "Anna Müller",
    age: 25,
    nationality: "Germany",
    university: "University of Waterloo",
    interest: ["Reading", "Philosophy", "Languages"],
    language: ["German", "English"],
    bio: "Linguistics student who loves learning about cultures and connecting through languages.",
    profileImage: "/uploads/sample6.jpg",
  },
  {
    _id: "mock-f7",
    name: "Carlos Silva",
    age: 22,
    nationality: "Brazil",
    university: "Concordia University",
    interest: ["Dance", "Volunteering", "Technology"],
    language: ["Portuguese", "English"],
    bio: "Tech enthusiast and dancer, always ready to meet new people and share stories.",
    profileImage: "/uploads/sample7.jpg",
  },
  {
    _id: "mock-f8",
    name: "Yuki Tanaka",
    age: 21,
    nationality: "Japan",
    university: "Simon Fraser University",
    interest: ["Anime", "Gaming", "Robotics"],
    language: ["Japanese", "English"],
    bio: "Robotics student into gaming and Japanese pop culture. Let's connect!",
    profileImage: "/uploads/sample8.jpg",
  },
  {
    _id: "mock-f9",
    name: "Fatima Zahra",
    age: 23,
    nationality: "Morocco",
    university: "University of Ottawa",
    interest: ["Cooking", "Poetry", "Travel"],
    language: ["Arabic", "French", "English"],
    bio: "A dreamer and traveler with a taste for spicy food and soulful poetry.",
    profileImage: "/uploads/sample9.jpg",
  },
  {
    _id: "mock-f10",
    name: "Noah Smith",
    age: 24,
    nationality: "Canada",
    university: "University of Alberta",
    interest: ["Skiing", "Startups", "Fitness"],
    language: ["English", "French"],
    bio: "Startup founder who enjoys cold weather, strong coffee, and meaningful conversations.",
    profileImage: "/uploads/sample10.jpg",
  }

];


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
    const response = await fetch(`${API_BASE}/profile/friend-suggestions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();

    const fallback = Array.isArray(data) && data.length > 0 ? data : mockFriends;

    setAllFriends(fallback);
    setFilteredFriends(fallback);
  } catch (err) {
    console.error(err);
    toast.error('Failed to load friends. Using mock data.');
    setAllFriends(mockFriends);
    setFilteredFriends(mockFriends);
  }
};

    
    const fetchLiked = async () => {
      try {
        const response = await fetch(`${API_BASE}/profile/friends`, {
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
        const res = await fetch(`${API_BASE}/swipe/friend`, {
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
                image={`${SOCKET_URL}${currentFriend.profileImage || '/uploads/default.png'}`}
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
                      src={`${SOCKET_URL}${friend.profileImage || '/uploads/default.png'}`}
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
