
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import FilterBar from "@/components/SwipeCard/FilterBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "@/components/ui/sonner";
import { API_BASE } from "@/lib/api";
import { SOCKET_URL } from "@/lib/api";
const RestaurantsPage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);

  const filterOptions = [
    {
      id: "cuisine",
      name: "Cuisine",
      values: ["Italian", "Indian", "Mexican", "Japanese", "Chinese"],
    },
    {
      id: "price",
      name: "Price Range",
      values: ["$", "$$", "$$$"],
    },
    {
      id: "rating",
      name: "Rating",
      values: ["4.5+", "4.0+", "3.5+"],
    },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const token = localStorage.getItem('immigrantConnect_token');

    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${API_BASE}/restaurants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAllRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        toast.error('Failed to load restaurants');
        console.error(err);
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile/restaurants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setFavoriteRestaurants(data);
      } catch (err) {
        toast.error('Failed to load favorites');
        console.error(err);
      }
    };

    fetchRestaurants();
    fetchFavorites();
  }, [isAuthenticated]);


  const handleFilterChange = (filterId: string, value: string) => {
    if (value === "") {
      setFilteredRestaurants(allRestaurants);
    } else {
      let filtered = allRestaurants;

      if (filterId === "cuisine") {
        filtered = filtered.filter(r => r.cuisine === value);
      } else if (filterId === "price") {
        filtered = filtered.filter(r => r.priceRange === value);
      } else if (filterId === "rating") {
        const threshold = parseFloat(value.replace("+", ""));
        filtered = filtered.filter(r => r.rating >= threshold);
      }

      setFilteredRestaurants(filtered);
    }
  };

  const handleAddToFavorites = async (restaurant) => {
    const token = localStorage.getItem('immigrantConnect_token');

    if (favoriteRestaurants.some(r => r._id === restaurant._id)) {
      toast("Already Saved", {
        description: `${restaurant.name} is already in your favorites`,
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/swipe/restaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ restaurantId: restaurant._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to like restaurant');

      setFavoriteRestaurants([...favoriteRestaurants, restaurant]);
      toast("Restaurant Saved!", {
        description: `${restaurant.name} added to your favorites`,
      });
    } catch (err) {
      toast.error("Failed to save restaurant");
      console.error(err);
    }
  };


  const handleRemoveFromFavorites = (id: string) => {
    setFavoriteRestaurants(favoriteRestaurants.filter(restaurant => restaurant.id !== id));
    toast("Restaurant Removed", {
      description: "Restaurant removed from your favorites",
    });
  };

  const handleViewDetails = (restaurant: typeof allRestaurants[0]) => {
    setSelectedRestaurant(restaurant);
  };

  const handleCloseDetails = () => {
    setSelectedRestaurant(null);
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

          <TabsContent value="browse" className="mt-0">
            <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />

            {selectedRestaurant ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img
                    src={`${SOCKET_URL}${selectedRestaurant.image || '/uploads/default.png'}`}
                    alt={selectedRestaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedRestaurant.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge>{selectedRestaurant.cuisine}</Badge>
                        <span className="text-sm text-gray-500">{selectedRestaurant.priceRange}</span>
                        <span className="text-sm">⭐ {selectedRestaurant.rating}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddToFavorites(selectedRestaurant)}
                      variant="outline"
                      className="text-primary border-primary"
                    >
                      Save
                    </Button>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1">Location & Contact</h3>
                      <p className="text-sm">{selectedRestaurant.address}</p>
                      <p className="text-sm">Phone: {selectedRestaurant.phone}</p>
                      <p className="text-sm">Website: {selectedRestaurant.website}</p>
                      <p className="text-sm">Hours: {selectedRestaurant.openHours}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">Popular Dishes</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedRestaurant.popularDishes.map((dish, index) => (
                          <Badge key={index} variant="secondary" className="bg-accent-orange">
                            {dish}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-primary hover:bg-secondary"
                    onClick={handleCloseDetails}
                  >
                    Back to List
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRestaurants.map((restaurant) => (
                  <Card key={restaurant.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`${SOCKET_URL}${restaurant.image || '/uploads/default.png'}`} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{restaurant.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{restaurant.cuisine}</Badge>
                            <span className="text-xs text-gray-500">{restaurant.priceRange}</span>
                            <span className="text-xs">⭐ {restaurant.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{restaurant.address}</p>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-primary border-primary"
                          onClick={() => handleAddToFavorites(restaurant)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-secondary"
                          onClick={() => handleViewDetails(restaurant)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No restaurants found matching your filters.</p>
                <Button
                  variant="link"
                  onClick={() => setFilteredRestaurants(allRestaurants)}
                  className="mt-2 text-primary"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {favoriteRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteRestaurants.map((restaurant) => (
                  <Card key={restaurant._id} className="overflow-hidden">
                    <div className="h-32 overflow-hidden">
                      <img
                        src={`${SOCKET_URL}${restaurant.image}`}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{restaurant.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{restaurant.cuisine}</Badge>
                            <span className="text-xs text-gray-500">{restaurant.priceRange}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{restaurant.phone}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleRemoveFromFavorites(restaurant.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't saved any restaurants yet.</p>
                <Button
                  variant="link"
                  onClick={() => setActiveTab("browse")}
                  className="mt-2 text-primary"
                >
                  Browse Restaurants
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

export default RestaurantsPage;
