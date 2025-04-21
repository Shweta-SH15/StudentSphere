
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import FilterBar from "@/components/SwipeCard/FilterBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "@/components/ui/sonner";

// Mock data
const mockRestaurants = [
  {
    id: "r1",
    name: "Bella Italia",
    cuisine: "Italian",
    priceRange: "$$",
    rating: 4.5,
    address: "123 College St, Downtown",
    phone: "555-123-4567",
    website: "www.bellaitalia.com",
    openHours: "11:00 AM - 10:00 PM",
    popularDishes: ["Margherita Pizza", "Lasagna", "Tiramisu"],
    image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "r2",
    name: "Spice of India",
    cuisine: "Indian",
    priceRange: "$$",
    rating: 4.3,
    address: "456 University Ave, Midtown",
    phone: "555-234-5678",
    website: "www.spiceofindia.com",
    openHours: "12:00 PM - 11:00 PM",
    popularDishes: ["Butter Chicken", "Naan", "Biryani"],
    image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2336&q=80",
  },
  {
    id: "r3",
    name: "El Mariachi",
    cuisine: "Mexican",
    priceRange: "$",
    rating: 4.6,
    address: "789 Main St, Downtown",
    phone: "555-345-6789",
    website: "www.elmariachi.com",
    openHours: "11:30 AM - 9:30 PM",
    popularDishes: ["Tacos al Pastor", "Guacamole", "Churros"],
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2335&q=80",
  },
  {
    id: "r4",
    name: "Sushi Paradise",
    cuisine: "Japanese",
    priceRange: "$$$",
    rating: 4.8,
    address: "101 Queen St, Financial District",
    phone: "555-456-7890",
    website: "www.sushiparadise.com",
    openHours: "5:00 PM - 11:00 PM",
    popularDishes: ["Dragon Roll", "Sashimi Platter", "Miso Soup"],
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "r5",
    name: "Golden Dragon",
    cuisine: "Chinese",
    priceRange: "$$",
    rating: 4.2,
    address: "222 Chinatown St, East Side",
    phone: "555-567-8901",
    website: "www.goldendragon.com",
    openHours: "11:00 AM - 12:00 AM",
    popularDishes: ["Kung Pao Chicken", "Dim Sum", "Peking Duck"],
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2129&q=80",
  },
];

const RestaurantsPage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof mockRestaurants[0] | null>(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<typeof mockRestaurants>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
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
    }
  }, [isAuthenticated]);

  const handleFilterChange = (filterId: string, value: string) => {
    if (value === "") {
      // Reset filter for this category
      setFilteredRestaurants(mockRestaurants);
    } else {
      let filtered;
      
      if (filterId === "cuisine") {
        filtered = mockRestaurants.filter(restaurant => restaurant.cuisine === value);
      } else if (filterId === "price") {
        filtered = mockRestaurants.filter(restaurant => restaurant.priceRange === value);
      } else if (filterId === "rating") {
        filtered = mockRestaurants.filter(restaurant => {
          if (value === "4.5+") return restaurant.rating >= 4.5;
          if (value === "4.0+") return restaurant.rating >= 4.0;
          if (value === "3.5+") return restaurant.rating >= 3.5;
          return true;
        });
      } else {
        filtered = mockRestaurants;
      }
      
      setFilteredRestaurants(filtered);
    }
  };

  const handleAddToFavorites = (restaurant: typeof mockRestaurants[0]) => {
    if (!favoriteRestaurants.some(r => r.id === restaurant.id)) {
      setFavoriteRestaurants([...favoriteRestaurants, restaurant]);
      toast("Restaurant Saved!", {
        description: `${restaurant.name} added to your favorites`,
      });
    } else {
      toast("Already Saved", {
        description: `${restaurant.name} is already in your favorites`,
      });
    }
  };

  const handleRemoveFromFavorites = (id: string) => {
    setFavoriteRestaurants(favoriteRestaurants.filter(restaurant => restaurant.id !== id));
    toast("Restaurant Removed", {
      description: "Restaurant removed from your favorites",
    });
  };

  const handleViewDetails = (restaurant: typeof mockRestaurants[0]) => {
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
                    src={selectedRestaurant.image}
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
                        src={restaurant.image}
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
                  onClick={() => setFilteredRestaurants(mockRestaurants)}
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
                  <Card key={restaurant.id} className="overflow-hidden">
                    <div className="h-32 overflow-hidden">
                      <img
                        src={restaurant.image}
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
