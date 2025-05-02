
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import SwipeCard from "@/components/SwipeCard/SwipeCard";
import FilterBar from "@/components/SwipeCard/FilterBar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthModal from "@/components/Auth/AuthModal";
import { toast } from "@/components/ui/sonner";
import { API_BASE } from "@/lib/api";
import { SOCKET_URL } from "@/lib/api";

const AccommodationPage = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allAccommodations, setAllAccommodations] = useState([]);
  const [likedAccommodations, setLikedAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
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
      return;
    }

    const token = localStorage.getItem('immigrantConnect_token');

    const fetchAccommodations = async () => {
      try {
        const res = await fetch(`${API_BASE}/accommodations`, {          
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAllAccommodations(data);
        setFilteredAccommodations(data);
      } catch (err) {
        toast.error('Failed to load accommodations.');
        console.error(err);
      }
    };

    const fetchLiked = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile/accommodations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setLikedAccommodations(data);
      } catch (err) {
        toast.error('Failed to load saved properties.');
        console.error(err);
      }
    };

    fetchAccommodations();
    fetchLiked();
  }, [isAuthenticated]);


  const handleFilterChange = (filterId: string, value: string) => {
    if (value === "") {
      // Reset filter for this category
      setFilteredAccommodations(allAccommodations);
    } else {
      let filtered;

      if (filterId === "type") {
        filtered = allAccommodations.filter(accommodation => accommodation.type === value);
      } else if (filterId === "location") {
        filtered = allAccommodations.filter(accommodation => accommodation.location === value);
      } else if (filterId === "price") {
        filtered = allAccommodations.filter(accommodation => {
          const price = parseInt(accommodation.price.replace(/[^0-9]/g, ""));
          if (value === "Under $800") return price < 800;
          if (value === "$800-$1000") return price >= 800 && price <= 1000;
          if (value === "$1000-$1200") return price > 1000 && price <= 1200;
          if (value === "Above $1200") return price > 1200;
          return true;
        });
      } else {
        filtered = allAccommodations;
      }

      setFilteredAccommodations(filtered);
      setCurrentIndex(0);
    }
  };

  const handleLike = async (id: string) => {
    const token = localStorage.getItem('immigrantConnect_token');
    const likedAccommodation = filteredAccommodations.find(accommodation => accommodation._id === id);

    if (likedAccommodation) {
      try {
        const res = await fetch(`${API_BASE}/swipe/accommodation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accommodationId: likedAccommodation._id }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to like');

        setLikedAccommodations([...likedAccommodations, likedAccommodation]);
        toast('Property Saved!', {
          description: `You saved ${likedAccommodation.title}`,
        });
      } catch (err: any) {
        toast.error(err.message || 'Could not save accommodation');
      }
    }

    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredAccommodations.length);
  };


  const handleDislike = (id: string) => {
    // Move to next card
    setCurrentIndex(prevIndex => (prevIndex + 1) % filteredAccommodations.length);
  };

  const handleContactClick = (contactInfo: string) => {
    navigator.clipboard.writeText(contactInfo)
      .then(() => {
        toast("Contact Info Copied", {
          description: `Contact: ${contactInfo} copied to clipboard!`,
        });
      })
      .catch(() => {
        toast.error("Failed to copy contact info");
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
                id={currentAccommodation._id}
                image={`${SOCKET_URL}${currentAccommodation.image}`}
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
                  onClick={() => setFilteredAccommodations(allAccommodations)}
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
                  <div key={accommodation._id} className="bg-[#0f1628] rounded-lg border border-gray-800 p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={`${SOCKET_URL}${accommodation.image}`}
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
                          onClick={() => handleContactClick(accommodation.contact)}
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
