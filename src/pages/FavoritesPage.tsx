import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAuth, getIdToken } from "firebase/auth";
import { SOCKET_URL, API_BASE } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

const FavoritesPage = () => {
  const { isAuthenticated } = useAuth();
  const [friends, setFriends] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadFavorites = async () => {
      const token = await getIdToken(getAuth().currentUser, true);

      try {
        // Real likes from backend
        const [fRes, rRes, aRes, restRes] = await Promise.all([
          fetch(`${API_BASE}/profile/friends`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/profile/roommates`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/profile/accommodations`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/profile/restaurants`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const [realFriends, realRoommates, realAccommodations, realRestaurants] = await Promise.all([
          fRes.json(),
          rRes.json(),
          aRes.json(),
          restRes.json()
        ]);

        // Mock likes from localStorage
        const localFriends = JSON.parse(localStorage.getItem("likedFriends") || "[]");
        const localRoommates = JSON.parse(localStorage.getItem("likedRoommates") || "[]");
        const localAccommodations = JSON.parse(localStorage.getItem("likedAccommodations") || "[]");
        const localRestaurants = JSON.parse(localStorage.getItem("likedRestaurants") || "[]");

        // Combine backend + mock items
        const combined = (real, mock) => [...real, ...mock.filter(m => m._id?.startsWith("mock-"))];

        setFriends(combined(realFriends || [], localFriends));
        setRoommates(combined(realRoommates || [], localRoommates));
        setAccommodations(combined(realAccommodations || [], localAccommodations));
        setRestaurants(combined(realRestaurants || [], localRestaurants));
      } catch (err) {
        console.error("Failed to fetch liked items:", err);
        toast.error("Could not load all liked items");
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  const renderCard = (item, type) => (
    <Card key={item._id} className="bg-[#121826] text-white overflow-hidden shadow-md">
      <div className="h-36 overflow-hidden">
        <img
          src={`${SOCKET_URL}${item.profileImage || item.image || "/uploads/default.png"}`}
          alt={item.name || item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.name || item.title}</h3>
        {type === "friend" && (
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline">{item.nationality}</Badge>
            {(item.interest || []).slice(0, 3).map((i, idx) => (
              <Badge key={idx} variant="secondary">{i}</Badge>
            ))}
          </div>
        )}
        {type === "roommate" && (
          <>
            <p className="text-sm text-gray-400">Age: {item.age}</p>
            <p className="text-sm text-gray-400">Gender: {item.gender}</p>
          </>
        )}
        {type === "accommodation" && (
          <>
            <p className="text-sm text-gray-400">{item.location}</p>
            <p className="text-sm text-gray-400">{item.price || item.priceRange}</p>
          </>
        )}
        {type === "restaurant" && (
          <>
            <p className="text-sm text-gray-400">{item.cuisine || item.cuisineType?.join(", ")}</p>
            <p className="text-sm text-gray-500">{item.address}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1a] py-10 px-4 text-white">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Your Favorites</h1>

        <Tabs defaultValue="friends" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-4 bg-[#121826] mb-6 rounded text-white">
            <TabsTrigger value="friends" className="data-[state=active]:bg-[#1f2937]">Friends</TabsTrigger>
            <TabsTrigger value="roommates" className="data-[state=active]:bg-[#1f2937]">Roommates</TabsTrigger>
            <TabsTrigger value="accommodations" className="data-[state=active]:bg-[#1f2937]">Accommodations</TabsTrigger>
            <TabsTrigger value="restaurants" className="data-[state=active]:bg-[#1f2937]">Restaurants</TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map(f => renderCard(f, "friend"))}
              {friends.length === 0 && <p className="text-center col-span-3 text-gray-400">No favorite friends yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="roommates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roommates.map(r => renderCard(r, "roommate"))}
              {roommates.length === 0 && <p className="text-center col-span-3 text-gray-400">No favorite roommates yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="accommodations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accommodations.map(a => renderCard(a, "accommodation"))}
              {accommodations.length === 0 && <p className="text-center col-span-3 text-gray-400">No saved accommodations yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="restaurants">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(r => renderCard(r, "restaurant"))}
              {restaurants.length === 0 && <p className="text-center col-span-3 text-gray-400">No favorite restaurants yet.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FavoritesPage;
