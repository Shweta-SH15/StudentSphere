import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import SwipeCard from "@/components/SwipeCard/SwipeCard";
import FilterBar from "@/components/SwipeCard/FilterBar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "@/components/ui/sonner";
import { API_BASE, SOCKET_URL } from "@/lib/api";
import { getAuth, getIdToken } from "firebase/auth";


const mockAccommodations = [
  {
    _id: "mock-a1",
    title: "Modern 2-Storey House",
    type: "2 Storey House",
    location: "Downtown",
    price: "$1,200/month",
    bedrooms: 3,
    bathrooms: 2,
    features: ["Furnished", "Utilities Included", "Laundry"],
    description: "Modern house close to university with backyard.",
    contact: "John Smith: 555-123-4567",
    image: "/uploads/sample1.jpg",
  },
  {
    _id: "mock-a2",
    title: "Cozy 1-Storey Home",
    type: "1 Storey House",
    location: "Suburbs",
    price: "$950/month",
    bedrooms: 2,
    bathrooms: 1,
    features: ["Pet Friendly", "Backyard", "Garage"],
    description: "Charming home in a quiet neighborhood, perfect for students.",
    contact: "Mary Johnson: 555-987-6543",
    image: "/uploads/sample2.jpg",
  },
  {
    _id: "mock-a3",
    title: "Spacious Basement Apartment",
    type: "House with Basement",
    location: "Near Campus",
    price: "$850/month",
    bedrooms: 1,
    bathrooms: 1,
    features: ["Private Entrance", "High-Speed Internet", "Partially Furnished"],
    description: "Ideal for single students looking for privacy and convenience.",
    contact: "Adam Blake: 555-234-1111",
    image: "/uploads/sample3.jpg",
  },
  {
    _id: "mock-a4",
    title: "Luxury Townhouse with Balcony",
    type: "2 Storey House",
    location: "Midtown",
    price: "$1,500/month",
    bedrooms: 3,
    bathrooms: 2.5,
    features: ["Balcony", "Central Heating", "Modern Kitchen"],
    description: "Elegant townhouse in a premium neighborhood.",
    contact: "Sophia Lin: 555-444-2222",
    image: "/uploads/sample4.jpg",
  },
  {
    _id: "mock-a5",
    title: "Shared Student Housing",
    type: "House with Basement",
    location: "College District",
    price: "$650/month",
    bedrooms: 5,
    bathrooms: 3,
    features: ["Study Room", "Shared Kitchen", "Laundry Included"],
    description: "Perfect for students wanting affordable housing with friends.",
    contact: "David Patel: 555-555-3333",
    image: "/uploads/sample5.jpg",
  },
  {
    _id: "mock-a6",
    title: "1BHK Near Downtown",
    type: "1 Storey House",
    location: "Downtown",
    price: "$1,000/month",
    bedrooms: 1,
    bathrooms: 1,
    features: ["Utilities Included", "Gym Access", "Security"],
    description: "Modern and safe place within walking distance to college.",
    contact: "Emily Zhang: 555-666-4444",
    image: "/uploads/sample6.jpg",
  },
  {
    _id: "mock-a7",
    title: "Budget Apartment for Singles",
    type: "Basement Apartment",
    location: "Near Campus",
    price: "$720/month",
    bedrooms: 1,
    bathrooms: 1,
    features: ["All Utilities", "Internet", "Kitchenette"],
    description: "Small, private, and cost-effective for solo living.",
    contact: "Mohammed Ali: 555-777-5555",
    image: "/uploads/sample7.jpg",
  },
  {
    _id: "mock-a8",
    title: "Fully Furnished Home",
    type: "2 Storey House",
    location: "Suburbs",
    price: "$1,300/month",
    bedrooms: 3,
    bathrooms: 2,
    features: ["Furnished", "Driveway Parking", "Garden"],
    description: "Great for small families or student groups.",
    contact: "Nina Kapoor: 555-888-6666",
    image: "/uploads/sample8.jpg",
  },
  {
    _id: "mock-a9",
    title: "Classic Studio Flat",
    type: "1 Storey House",
    location: "Downtown",
    price: "$950/month",
    bedrooms: 1,
    bathrooms: 1,
    features: ["Furnished", "Wi-Fi Included", "24/7 Security"],
    description: "Compact, modern, and fully equipped for single living.",
    contact: "Lucas Rivera: 555-999-7777",
    image: "/uploads/sample9.jpg",
  },
  {
    _id: "mock-a10",
    title: "Green View Apartment",
    type: "2 Storey House",
    location: "Midtown",
    price: "$1,100/month",
    bedrooms: 2,
    bathrooms: 2,
    features: ["Balcony", "Air Conditioning", "Parking"],
    description: "Scenic apartment with a peaceful environment.",
    contact: "Tanya Mehta: 555-101-8888",
    image: "/uploads/sample10.jpg",
  },
  {
    _id: "mock-a11",
    title: "Quiet Basement Studio",
    type: "Basement Apartment",
    location: "Suburbs",
    price: "$780/month",
    bedrooms: 1,
    bathrooms: 1,
    features: ["Laundry Access", "Quiet Neighbourhood", "Private Entry"],
    description: "Peaceful basement for study-focused lifestyle.",
    contact: "Brian O'Conner: 555-202-9999",
    image: "/uploads/sample11.jpg",
  }
];

const AccommodationPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allAccommodations, setAllAccommodations] = useState([]);
  const [likedAccommodations, setLikedAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);

  const filterOptions = [
    { id: "type", name: "Property Type", values: ["1 Storey House", "2 Storey House", "House with Basement"] },
    { id: "location", name: "Location", values: ["Downtown", "Suburbs", "Near Campus", "Midtown", "College District"] },
    { id: "price", name: "Price Range", values: ["Under $800", "$800-$1000", "$1000-$1200", "Above $1200"] },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const token = localStorage.getItem("immigrantConnect_token");

    const fetchAccommodations = async () => {
      try {
        const res = await fetch(`${API_BASE}/accommodations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const fallback = Array.isArray(data) && data.length ? data : mockAccommodations;
        setAllAccommodations(fallback);
        setFilteredAccommodations(fallback);
      } catch {
        setAllAccommodations(mockAccommodations);
        setFilteredAccommodations(mockAccommodations);
      }
    };

    const fetchLiked = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile/accommodations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLikedAccommodations(Array.isArray(data) ? data : []);
      } catch {
        setLikedAccommodations([]);
      }
    };

    fetchAccommodations();
    fetchLiked();
  }, [isAuthenticated]);

  const handleFilterChange = (filterId, value) => {
    let filtered = allAccommodations;

    if (filterId === "type") {
      filtered = filtered.filter(item => item.type === value);
    } else if (filterId === "location") {
      filtered = filtered.filter(item => item.location === value);
    } else if (filterId === "price") {
      filtered = filtered.filter(item => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ""));
        if (value === "Under $800") return price < 800;
        if (value === "$800-$1000") return price >= 800 && price <= 1000;
        if (value === "$1000-$1200") return price > 1000 && price <= 1200;
        if (value === "Above $1200") return price > 1200;
        return true;
      });
    }

    setFilteredAccommodations(filtered);
    setCurrentIndex(0);
  };

  const handleLike = async (id) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const token = await getIdToken(user, true);

    const accommodation = filteredAccommodations.find(item => item._id === id);
    if (!accommodation || likedAccommodations.some(item => item._id === id)) return;

    try {
      await fetch(`${API_BASE}/swipe/accommodation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accommodationId: id })
      });

      const updated = [...likedAccommodations, accommodation];
      setLikedAccommodations(updated);
      toast("Saved!", { description: `${accommodation.title} added to favorites.` });
    } catch (err) {
      toast.error("Failed to save.");
    }

    setCurrentIndex(i => (i + 1) % filteredAccommodations.length);
  };

  const handleDislike = () => {
    setCurrentIndex(i => (i + 1) % filteredAccommodations.length);
  };

  const handleUnlike = async (id) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const token = await getIdToken(user, true);

    try {
      await fetch(`${API_BASE}/swipe/unlike-accommodation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accommodationId: id })
      });

      const updated = likedAccommodations.filter(item => item._id !== id);
      setLikedAccommodations(updated);
      toast("Removed!", { description: "Removed from favorites." });
    } catch {
      toast.error("Failed to remove.");
    }
  };

  const current = filteredAccommodations[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Find Accommodation</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="saved">Saved ({likedAccommodations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />
            {filteredAccommodations.length && current ? (
              <SwipeCard
                id={current._id}
                image={`${SOCKET_URL}${current.image}`}
                title={current.title}
                subtitle={`${current.location} • ${current.price}`}
                details={
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{current.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{current.type}</Badge>
                      <Badge variant="outline">{current.bedrooms} Bed</Badge>
                      <Badge variant="outline">{current.bathrooms} Bath</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {current.features.map((f, i) => (
                        <Badge key={i} variant="secondary">{f}</Badge>
                      ))}
                    </div>
                  </div>
                }
                onLike={() => handleLike(current._id)}
                onDislike={handleDislike}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                No results.{" "}
                <Button variant="link" onClick={() => setFilteredAccommodations(allAccommodations)}>
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {likedAccommodations.length > 0 ? (
              likedAccommodations.map(item => (
                <div key={item._id} className="bg-white shadow p-4 rounded mb-4 flex">
                  <img src={`${SOCKET_URL}${item.image}`} className="w-24 h-24 rounded object-cover mr-4" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.location} • {item.price}</p>
                    <p className="text-sm text-gray-500">{item.contact}</p>
                    <Button size="sm" className="mt-2 bg-red-500 text-white" onClick={() => handleUnlike(item._id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-12">No saved accommodations yet.</p>
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

export default AccommodationPage;
