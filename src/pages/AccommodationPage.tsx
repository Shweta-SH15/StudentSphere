
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
const mockAccommodations = [
  {
    id: "a1",
    title: "Modern 2-Storey House",
    type: "2 Storey House",
    location: "Downtown",
    price: "$1,200/month",
    bedrooms: 3,
    bathrooms: 2,
    features: ["Furnished", "Utilities Included", "Laundry"],
    description: "Beautiful modern house close to university with spacious rooms and backyard.",
    contact: "John Smith: 555-123-4567",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "a2",
    title: "Cozy 1-Storey Home",
    type: "1 Storey House",
    location: "Suburbs",
    price: "$950/month",
    bedrooms: 2,
    bathrooms: 1,
    features: ["Pet Friendly", "Backyard", "Garage"],
    description: "Charming single-storey home in a quiet neighborhood, perfect for students.",
    contact: "Mary Johnson: 555-987-6543",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "a3",
    title: "Basement Apartment",
    type: "House with Basement",
    location: "Near Campus",
    price: "$800/month",
    bedrooms: 1,
    bathrooms: 1,
    features: ["Private Entrance", "All Utilities", "Partially Furnished"],
    description: "Comfortable basement apartment in a family home, close to all amenities.",
    contact: "Robert Davis: 555-456-7890",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "a4",
    title: "Luxury 2-Storey Townhouse",
    type: "2 Storey House",
    location: "Midtown",
    price: "$1,400/month",
    bedrooms: 3,
    bathrooms: 2.5,
    features: ["Modern Kitchen", "Balcony", "In-unit Laundry"],
    description: "Spacious townhouse with modern finishes and amenities in a great location.",
    contact: "Jennifer Wilson: 555-789-0123",
    image: "https://images.unsplash.com/photo-1565953554309-d181306db7b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "a5",
    title: "Student House with Basement",
    type: "House with Basement",
    location: "College District",
    price: "$700/month",
    bedrooms: 5,
    bathrooms: 3,
    features: ["Shared Kitchen", "Study Room", "High-Speed Internet"],
    description: "Large house dedicated to student housing with basement rooms available.",
    contact: "David Brown: 555-234-5678",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
];

const AccommodationPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedAccommodations, setLikedAccommodations] = useState<typeof mockAccommodations>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState(mockAccommodations);
  const [activeTab, setActiveTab] = useState("discover");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);

  const filterOptions = [
    {
      id: "type",
      name: "Property Type",
      values: ["1 Storey House", "2 Storey House", "House with Basement"],
    },
    {
      id: "location",
      name: "Location",
      values: ["Downtown", "Suburbs", "Near Campus", "Midtown", "College District"],
    },
    {
      id: "price",
      name: "Price Range",
      values: ["Under $800", "$800-$1000", "$1000-$1200", "Above $1200"],
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
      setFilteredAccommodations(mockAccommodations);
    } else {
      let filtered;
      
      if (filterId === "type") {
        filtered = mockAccommodations.filter(accommodation => accommodation.type === value);
      } else if (filterId === "location") {
        filtered = mockAccommodations.filter(accommodation => accommodation.location === value);
      } else if (filterId === "price") {
        filtered = mockAccommodations.filter(accommodation => {
          const price = parseInt(accommodation.price.replace(/[^0-9]/g, ""));
          if (value === "Under $800") return price < 800;
          if (value === "$800-$1000") return price >= 800 && price <= 1000;
          if (value === "$1000-$1200") return price > 1000 && price <= 1200;
          if (value === "Above $1200") return price > 1200;
          return true;
        });
      } else {
        filtered = mockAccommodations;
      }
      
      setFilteredAccommodations(filtered);
      setCurrentIndex(0);
    }
  };

  const handleLike = (id: string) => {
    const likedAccommodation = filteredAccommodations.find(accommodation => accommodation.id === id);
    if (likedAccommodation) {
      setLikedAccommodations([...likedAccommodations, likedAccommodation]);
      toast("Property Saved!", {
        description: `You saved ${likedAccommodation.title}`,
      });
    }
    
    // Move to next card
    setCurrentIndex(prevIndex => (prevIndex + 1) % filteredAccommodations.length);
  };

  const handleDislike = (id: string) => {
    // Move to next card
    setCurrentIndex(prevIndex => (prevIndex + 1) % filteredAccommodations.length);
  };

  const handleContactClick = (property: string) => {
    toast("Contact Info Copied", {
      description: `Contact information for ${property} copied to clipboard!`,
    });
  };

  const currentAccommodation = filteredAccommodations[currentIndex];

  return (
    <div className="min-h-screen bg-[#080c14] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">Find Accommodation</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#0f1628]">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="saved">Saved ({likedAccommodations.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="mt-0">
            <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />
            
            {filteredAccommodations.length > 0 ? (
              <SwipeCard
                id={currentAccommodation.id}
                image={currentAccommodation.image}
                title={currentAccommodation.title}
                subtitle={`${currentAccommodation.location} • ${currentAccommodation.price}`}
                details={
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-gray-100 border-gray-700">{currentAccommodation.bedrooms} {currentAccommodation.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</Badge>
                      <Badge variant="outline" className="text-gray-100 border-gray-700">{currentAccommodation.bathrooms} {Number.isInteger(currentAccommodation.bathrooms) ? (currentAccommodation.bathrooms === 1 ? 'Bathroom' : 'Bathrooms') : 'Baths'}</Badge>
                      <Badge variant="outline" className="text-gray-100 border-gray-700">{currentAccommodation.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-300">{currentAccommodation.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentAccommodation.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="bg-accent-green text-green-700">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                }
                onLike={handleLike}
                onDislike={handleDislike}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No accommodations found matching your filters.</p>
                <Button 
                  variant="link" 
                  onClick={() => setFilteredAccommodations(mockAccommodations)}
                  className="mt-2 text-primary"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            {likedAccommodations.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {likedAccommodations.map((accommodation) => (
                  <div key={accommodation.id} className="bg-[#0f1628] rounded-lg border border-gray-800 p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={accommodation.image}
                        alt={accommodation.title}
                        className="w-full md:w-32 h-32 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-100">{accommodation.title}</h3>
                        <p className="text-sm text-gray-400">{accommodation.location} • {accommodation.price}</p>
                        <p className="text-sm mt-2 text-gray-300">{accommodation.bedrooms} Bed • {accommodation.bathrooms} Bath</p>
                        <p className="text-xs mt-2 text-gray-400">Contact: {accommodation.contact}</p>
                        <Button
                          size="sm"
                          className="mt-2 bg-primary hover:bg-secondary"
                          onClick={() => handleContactClick(accommodation.title)}
                        >
                          Contact Owner
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">You haven't saved any accommodations yet.</p>
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab("discover")}
                  className="mt-2 text-primary"
                >
                  Start Browsing
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

export default AccommodationPage;
