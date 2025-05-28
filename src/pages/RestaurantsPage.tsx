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
import RestaurantModal from "@/components/RestaurantModal";

const getImageUrl = (path: string) => {
  if (!path) return "/images/default.png"; // fallback image
  if (path.startsWith("/images")) return path; // served from public folder
  return `${SOCKET_URL}${path}`; // served from server
};


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
    image: "/images/restaurants/res-1.jpg",
    menu: [
      {
        category: "Appetizers",
        items: [
          { name: "Bruschetta", description: "Grilled bread topped with tomato and basil", price: "$7", image: "/images/restaurants/menu-r1/bruschetta.jpg" },
          { name: "Caprese Salad", description: "Fresh mozzarella, tomatoes, and basil", price: "$8", image: "/images/restaurants/menu-r1/caprese.jpg" },
          { name: "Garlic Bread", description: "Toasted bread with garlic and butter", price: "$6", image: "/images/restaurants/menu-r1/GarlicBread.jpg" }
        ]
      },
      {
        category: "Main Course",
        items: [
          { name: "Lasagna", description: "Layered pasta with beef and béchamel sauce", price: "$14", image: "/images/restaurants/menu-r1/lasagna.jpg" },
          { name: "Margherita Pizza", description: "Tomato, mozzarella, and fresh basil", price: "$13", image: "/images/restaurants/menu-r1/MargheritaPizza.jpg" },
          { name: "Spaghetti Carbonara", description: "Pasta with pancetta and creamy sauce", price: "$15", image: "/images/restaurants/menu-r1/Spaghetti.jpg" }
        ]
      },
      {
        category: "Desserts",
        items: [
          { name: "Tiramisu", description: "Coffee-flavored layered dessert", price: "$6", image: "/images/restaurants/menu-r1/Tiramisu.jpg" },
          { name: "Panna Cotta", description: "Creamy Italian custard with berry coulis", price: "$7", image: "/images/restaurants/menu-r1/PannaCotta.jpg" },
          { name: "Gelato", description: "Italian-style ice cream (chocolate/vanilla)", price: "$5", image: "/images/restaurants/menu-r1/Gelato.jpg" }
        ]
      }
    ]
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
    image: "/images/restaurants/res-2.jpg",
    menu: [
      {
        category: "Starters",
        items: [
          { name: "Samosa", description: "Deep-fried pastry with spiced potatoes", price: "$5", image: "/images/restaurants/menu-r2/samosa.jpg" },
          { name: "Paneer Pakora", description: "Battered and fried cottage cheese", price: "$6", image: "/images/restaurants/menu-r2/pakora.jpg" },
          { name: "Chicken Tikka", description: "Spiced grilled chicken skewers", price: "$8", image: "/images/restaurants/menu-r2/chickenTikka.jpg" }
        ]
      },
      {
        category: "Main Course",
        items: [
          { name: "Butter Chicken", description: "Creamy tomato-based chicken curry", price: "$15", image: "/images/restaurants/menu-r2/butterchicken.jpg" },
          { name: "Paneer Tikka Masala", description: "Grilled paneer in spiced gravy", price: "$14", image: "/images/restaurants/menu-r2/paneer.jpg" },
          { name: "Lamb Rogan Josh", description: "Slow-cooked lamb in curry", price: "$17", image: "/images/restaurants/menu-r2/roganjosh.jpg" }
        ]
      },
      {
        category: "Sides",
        items: [
          { name: "Garlic Naan", description: "Fluffy bread with garlic", price: "$3", image: "/images/restaurants/menu-r2/naan.jpg" },
          { name: "Vegetable Biryani", description: "Aromatic rice with mixed vegetables", price: "$12", image: "/images/restaurants/menu-r2/biryani.jpg" },
          { name: "Raita", description: "Yogurt with cucumber and spices", price: "$2", image: "/images/restaurants/menu-r2/raita.jpg" }
        ]
      }
    ]
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
    image: "/images/restaurants/res-3.jpg",
    menu: [
      {
        category: "Tacos",
        items: [
          { name: "Tacos al Pastor", description: "Spit-grilled pork with pineapple", price: "$9", image: "/images/dishes/alpastor.jpg" },
          { name: "Fish Tacos", description: "Grilled fish with lime crema", price: "$10", image: "/images/dishes/fishtacos.jpg" },
          { name: "Carnitas Tacos", description: "Slow-cooked pork with onions", price: "$9", image: "/images/dishes/carnitas.jpg" }
        ]
      },
      {
        category: "Sides",
        items: [
          { name: "Guacamole", description: "Fresh avocado dip", price: "$5", image: "/images/dishes/guacamole.jpg" },
          { name: "Elote", description: "Mexican street corn", price: "$4", image: "/images/dishes/elote.jpg" },
          { name: "Nachos", description: "Tortilla chips with cheese and jalapeños", price: "$7", image: "/images/dishes/nachos.jpg" }
        ]
      },
      {
        category: "Desserts",
        items: [
          { name: "Churros", description: "Fried dough with cinnamon sugar", price: "$4", image: "/images/dishes/churros.jpg" },
          { name: "Flan", description: "Caramel custard dessert", price: "$5", image: "/images/dishes/flan.jpg" },
          { name: "Tres Leches Cake", description: "Sponge cake soaked in milk", price: "$6", image: "/images/dishes/tresleches.jpg" }
        ]
      }
    ]
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
    image: "/images/restaurants/res-4.jpg",
    menu: [
      {
        category: "Rolls",
        items: [
          { name: "Dragon Roll", description: "Shrimp tempura, eel, avocado", price: "$16", image: "/images/dishes/dragonroll.jpg" },
          { name: "California Roll", description: "Crab, avocado, cucumber", price: "$12", image: "/images/dishes/californiaroll.jpg" },
          { name: "Spicy Tuna Roll", description: "Tuna with spicy mayo", price: "$13", image: "/images/dishes/spicytuna.jpg" }
        ]
      },
      {
        category: "Sashimi",
        items: [
          { name: "Sashimi Platter", description: "Assorted sliced raw fish", price: "$22", image: "/images/dishes/sashimi.jpg" },
          { name: "Salmon Sashimi", description: "Fresh sliced salmon", price: "$18", image: "/images/dishes/salmon.jpg" },
          { name: "Tuna Sashimi", description: "Premium tuna cuts", price: "$19", image: "/images/dishes/tunasashimi.jpg" }
        ]
      },
      {
        category: "Soups",
        items: [
          { name: "Miso Soup", description: "Soybean paste soup with tofu", price: "$4", image: "/images/dishes/miso.jpg" },
          { name: "Clear Soup", description: "Light broth with mushrooms", price: "$4", image: "/images/dishes/clearsoup.jpg" },
          { name: "Udon Soup", description: "Thick wheat noodles in broth", price: "$9", image: "/images/dishes/udon.jpg" }
        ]
      }
    ]
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
    image: "/images/restaurants/res-5.jpg",
    menu: [
      {
        category: "Appetizers",
        items: [
          { name: "Spring Rolls", description: "Crispy vegetable rolls", price: "$6", image: "/images/dishes/springrolls.jpg" },
          { name: "Crab Rangoon", description: "Fried wontons with cream cheese", price: "$7", image: "/images/dishes/crabrangoon.jpg" },
          { name: "Scallion Pancakes", description: "Pan-fried Chinese flatbread", price: "$5", image: "/images/dishes/scallionpancake.jpg" }
        ]
      },
      {
        category: "Main Course",
        items: [
          { name: "Kung Pao Chicken", description: "Spicy stir-fried chicken", price: "$13", image: "/images/dishes/kungpao.jpg" },
          { name: "Peking Duck", description: "Roast duck with pancakes", price: "$20", image: "/images/dishes/pekingduck.jpg" },
          { name: "Beef and Broccoli", description: "Stir-fried beef with broccoli", price: "$14", image: "/images/dishes/beefbroccoli.jpg" }
        ]
      },
      {
        category: "Dim Sum",
        items: [
          { name: "Shumai", description: "Steamed pork dumplings", price: "$9", image: "/images/dishes/shumai.jpg" },
          { name: "Har Gow", description: "Shrimp dumplings", price: "$10", image: "/images/dishes/hargow.jpg" },
          { name: "Char Siu Bao", description: "BBQ pork buns", price: "$8", image: "/images/dishes/charsiu.jpg" }
        ]
      }
    ]
  }
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

    // 🔐 Don't try to POST mock data to backend
    const isMock = restaurant._id.startsWith("mock-");
    if (isMock) {
      const updated = [...favoriteRestaurants, restaurant];
      saveFavoritesToStorage(updated);
      toast("Saved (Local)", { description: `${restaurant.name} added locally.` });
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
      saveFavoritesToStorage(updated);
      toast("Saved", { description: `${restaurant.name} added to your favorites.` });
    } catch (err) {
      console.error("❌ Like failed:", err);
      toast.error("Failed to save to server.");
    }
  };


  const handleRemoveFromFavorites = (id) => {
    const updated = favoriteRestaurants.filter(r => r._id !== id);
    saveFavoritesToStorage(updated);
    toast("Removed", { description: "Removed from favorites." });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] py-8 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Find Restaurants</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#121826] text-white">
            <TabsTrigger className="text-white data-[state=active]:bg-[#1f2937]" value="browse">Browse</TabsTrigger>
            <TabsTrigger className="text-white data-[state=active]:bg-[#1f2937]" value="favorites">Favorites ({favoriteRestaurants.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {filteredRestaurants.map(r => (
                <Card key={r._id} className="overflow-hidden">
                  <img src={getImageUrl(r.image)} className="h-40 w-full object-cover" />
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
                    <img src={getImageUrl(r.image)} className="h-32 w-full object-cover" />
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

      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}

    </div>
  );
};

export default RestaurantsPage;
