import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import FilterBar from "@/components/SwipeCard/FilterBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "@/components/ui/sonner";
import { API_BASE, SOCKET_URL } from "@/lib/api";
import { getAuth, getIdToken } from "firebase/auth"; // Add this at the top if not already

const RestaurantsPage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);

  const mockRestaurants = [
  {
    _id: "mock-r1",
    name: "Bella Italia",
    cuisine: "Italian",
    priceRange: "$$",
    rating: 4.5,
    address: "123 College St, Downtown",
    phone: "555-123-4567",
    website: "www.bellaitalia.com",
    openHours: "11:00 AM - 10:00 PM",
    popularDishes: ["Margherita Pizza", "Lasagna", "Tiramisu"],
    image: "/uploads/sample1.jpg",
  },
  {
    _id: "mock-r2",
    name: "Spice of India",
    cuisine: "Indian",
    priceRange: "$$",
    rating: 4.3,
    address: "456 University Ave, Midtown",
    phone: "555-234-5678",
    website: "www.spiceofindia.com",
    openHours: "12:00 PM - 11:00 PM",
    popularDishes: ["Butter Chicken", "Naan", "Biryani"],
    image: "/uploads/sample2.jpg",
  },
  {
    _id: "mock-r3",
    name: "El Mariachi",
    cuisine: "Mexican",
    priceRange: "$",
    rating: 4.6,
    address: "789 Main St, Downtown",
    phone: "555-345-6789",
    website: "www.elmariachi.com",
    openHours: "11:30 AM - 9:30 PM",
    popularDishes: ["Tacos al Pastor", "Guacamole", "Churros"],
    image: "/uploads/sample3.jpg",
  },
  {
    _id: "mock-r4",
    name: "Sushi Paradise",
    cuisine: "Japanese",
    priceRange: "$$$",
    rating: 4.8,
    address: "101 Queen St, Financial District",
    phone: "555-456-7890",
    website: "www.sushiparadise.com",
    openHours: "5:00 PM - 11:00 PM",
    popularDishes: ["Dragon Roll", "Sashimi Platter", "Miso Soup"],
    image: "/uploads/sample4.jpg",
  },
  {
    _id: "mock-r5",
    name: "Golden Dragon",
    cuisine: "Chinese",
    priceRange: "$$",
    rating: 4.2,
    address: "222 Chinatown St, East Side",
    phone: "555-567-8901",
    website: "www.goldendragon.com",
    openHours: "11:00 AM - 12:00 AM",
    popularDishes: ["Kung Pao Chicken", "Dim Sum", "Peking Duck"],
    image: "/uploads/sample5.jpg",
  },
];

  const filterOptions = [
    { id: "cuisine", name: "Cuisine", values: ["Italian", "Indian", "Mexican", "Japanese", "Chinese"] },
    { id: "price", name: "Price Range", values: ["$", "$$", "$$$"] },
    { id: "rating", name: "Rating", values: ["4.5+", "4.0+", "3.5+"] },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const storedLikes = localStorage.getItem("likedRestaurants");
    if (storedLikes) setFavoriteRestaurants(JSON.parse(storedLikes));

    const token = localStorage.getItem("immigrantConnect_token");

    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${API_BASE}/restaurants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const fallback = Array.isArray(data) && data.length > 0 ? data : mockRestaurants;
        setAllRestaurants(fallback);
        setFilteredRestaurants(fallback);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load. Showing mock data.");
        setAllRestaurants(mockRestaurants); 
        setFilteredRestaurants(mockRestaurants);
      }
    };

    fetchRestaurants();
  }, [isAuthenticated]);

  const handleFilterChange = (filterId: string, value: string) => {
    if (!value) return setFilteredRestaurants(allRestaurants);

    let filtered = allRestaurants;

    if (filterId === "cuisine") {
      filtered = filtered.filter(r => r.cuisine === value);
    } else if (filterId === "price") {
      filtered = filtered.filter(r => r.priceRange === value);
    } else if (filterId === "rating") {
      const minRating = parseFloat(value.replace("+", ""));
      filtered = filtered.filter(r => r.rating >= minRating);
    }

    setFilteredRestaurants(filtered);
  };

  const saveFavoritesToStorage = (list) => {
    localStorage.setItem("likedRestaurants", JSON.stringify(list));
    setFavoriteRestaurants(list);
  };

  
const handleAddToFavorites = async (restaurant) => {
  if (favoriteRestaurants.find(r => r._id === restaurant._id)) {
    toast("Already saved", { description: `${restaurant.name} is already saved.` });
    return;
  }

  try {
    const user = getAuth().currentUser;
    const token = await getIdToken(user, true);

    const res = await fetch(`${API_BASE}/swipe/restaurant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ restaurantId: restaurant._id }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save");

    const updated = [...favoriteRestaurants, restaurant];
    localStorage.setItem("likedRestaurants", JSON.stringify(updated));
    setFavoriteRestaurants(updated);
    toast("Saved", { description: `${restaurant.name} added to your favorites.` });
  } catch (err) {
    console.error(err);
    toast.error("Failed to save to server.");
  }
};

  const handleRemoveFromFavorites = (id) => {
    const updated = favoriteRestaurants.filter(r => r._id !== id);
    saveFavoritesToStorage(updated);
    toast("Removed", { description: "Removed from favorites." });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Find Restaurants</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favoriteRestaurants.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {filteredRestaurants.map(r => (
                <Card key={r._id} className="overflow-hidden">
                  <img src={`${SOCKET_URL}${r.image}`} className="h-40 w-full object-cover" />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{r.name}</h3>
                    <p className="text-sm text-gray-500">{r.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge>{r.cuisine}</Badge>
                      <Badge variant="outline">{r.priceRange}</Badge>
                      <span className="text-sm">⭐ {r.rating}</span>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={() => handleAddToFavorites(r)}>Save</Button>
                      <Button onClick={() => setSelectedRestaurant(r)}>View</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            {favoriteRestaurants.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {favoriteRestaurants.map(r => (
                  <Card key={r._id} className="overflow-hidden">
                    <img src={`${SOCKET_URL}${r.image}`} className="h-32 w-full object-cover" />
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{r.name}</h3>
                      <p className="text-sm text-gray-500">{r.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge>{r.cuisine}</Badge>
                        <Badge variant="outline">{r.priceRange}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-3 text-red-600 border-red-300"
                        onClick={() => handleRemoveFromFavorites(r._id)}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">No saved restaurants yet.</p>
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

export default RestaurantsPage;
