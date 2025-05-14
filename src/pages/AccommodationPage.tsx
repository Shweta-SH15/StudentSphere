
// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/button";
// import SwipeCard from "@/components/SwipeCard/SwipeCard";
// import FilterBar from "@/components/SwipeCard/FilterBar";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import AuthModal from "@/components/Auth/AuthModal";
// import { toast } from "@/components/ui/sonner";
// import { API_BASE } from "@/lib/api";
// import { SOCKET_URL } from "@/lib/api";

// const AccommodationPage = () => {
//   const { isAuthenticated } = useAuth();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [allAccommodations, setAllAccommodations] = useState([]);
//   const [likedAccommodations, setLikedAccommodations] = useState([]);
//   const [filteredAccommodations, setFilteredAccommodations] = useState([]);
//   const [activeTab, setActiveTab] = useState("discover");
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);

//   const filterOptions = [
//     {
//       id: "type",
//       name: "Property Type",
//       values: ["1 Storey House", "2 Storey House", "House with Basement"],
//     },
//     {
//       id: "location",
//       name: "Location",
//       values: ["Downtown", "Suburbs", "Near Campus", "Midtown", "College District"],
//     },
//     {
//       id: "price",
//       name: "Price Range",
//       values: ["Under $800", "$800-$1000", "$1000-$1200", "Above $1200"],
//     },
//   ];

//   useEffect(() => {
//     if (!isAuthenticated) {
//       setIsAuthModalOpen(true);
//       return;
//     }

//     const token = localStorage.getItem('immigrantConnect_token');

//     const fetchAccommodations = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/accommodations`, {          
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         setAllAccommodations(data);
//         setFilteredAccommodations(data);
//       } catch (err) {
//         toast.error('Failed to load accommodations.');
//         console.error(err);
//       }
//     };

//     const fetchLiked = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/profile/accommodations`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         setLikedAccommodations(data);
//       } catch (err) {
//         toast.error('Failed to load saved properties.');
//         console.error(err);
//       }
//     };

//     fetchAccommodations();
//     fetchLiked();
//   }, [isAuthenticated]);


//   const handleFilterChange = (filterId: string, value: string) => {
//     if (value === "") {
//       // Reset filter for this category
//       setFilteredAccommodations(allAccommodations);
//     } else {
//       let filtered;

//       if (filterId === "type") {
//         filtered = allAccommodations.filter(accommodation => accommodation.type === value);
//       } else if (filterId === "location") {
//         filtered = allAccommodations.filter(accommodation => accommodation.location === value);
//       } else if (filterId === "price") {
//         filtered = allAccommodations.filter(accommodation => {
//           const price = parseInt(accommodation.price.replace(/[^0-9]/g, ""));
//           if (value === "Under $800") return price < 800;
//           if (value === "$800-$1000") return price >= 800 && price <= 1000;
//           if (value === "$1000-$1200") return price > 1000 && price <= 1200;
//           if (value === "Above $1200") return price > 1200;
//           return true;
//         });
//       } else {
//         filtered = allAccommodations;
//       }

//       setFilteredAccommodations(filtered);
//       setCurrentIndex(0);
//     }
//   };

//   const handleLike = async (id: string) => {
//     const token = localStorage.getItem('immigrantConnect_token');
//     const likedAccommodation = filteredAccommodations.find(accommodation => accommodation._id === id);

//     if (likedAccommodation) {
//       try {
//         const res = await fetch(`${API_BASE}/swipe/accommodation`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ accommodationId: likedAccommodation._id }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || 'Failed to like');

//         setLikedAccommodations([...likedAccommodations, likedAccommodation]);
//         toast('Property Saved!', {
//           description: `You saved ${likedAccommodation.title}`,
//         });
//       } catch (err: any) {
//         toast.error(err.message || 'Could not save accommodation');
//       }
//     }

//     setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredAccommodations.length);
//   };


//   const handleDislike = (id: string) => {
//     // Move to next card
//     setCurrentIndex(prevIndex => (prevIndex + 1) % filteredAccommodations.length);
//   };

//   const handleContactClick = (contactInfo: string) => {
//     navigator.clipboard.writeText(contactInfo)
//       .then(() => {
//         toast("Contact Info Copied", {
//           description: `Contact: ${contactInfo} copied to clipboard!`,
//         });
//       })
//       .catch(() => {
//         toast.error("Failed to copy contact info");
//       });
//   };


//   const currentAccommodation = filteredAccommodations[currentIndex];

//   return (
//     <div className="min-h-screen bg-[#080c14] py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">Find Accommodation</h1>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
//           <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#0f1628]">
//             <TabsTrigger value="discover">Discover</TabsTrigger>
//             <TabsTrigger value="saved">Saved ({likedAccommodations.length})</TabsTrigger>
//           </TabsList>

//           <TabsContent value="discover" className="mt-0">
//             <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />

//             {filteredAccommodations.length > 0 ? (
//               <SwipeCard
//                 id={currentAccommodation._id}
//                 image={`${SOCKET_URL}${currentAccommodation.image}`}
//                 title={currentAccommodation.title}
//                 subtitle={`${currentAccommodation.location} • ${currentAccommodation.price}`}
//                 details={
//                   <div className="space-y-3">
//                     <div className="flex flex-wrap gap-2">
//                       <Badge variant="outline" className="text-gray-100 border-gray-700">{currentAccommodation.bedrooms} {currentAccommodation.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</Badge>
//                       <Badge variant="outline" className="text-gray-100 border-gray-700">{currentAccommodation.bathrooms} {Number.isInteger(currentAccommodation.bathrooms) ? (currentAccommodation.bathrooms === 1 ? 'Bathroom' : 'Bathrooms') : 'Baths'}</Badge>
//                       <Badge variant="outline" className="text-gray-100 border-gray-700">{currentAccommodation.type}</Badge>
//                     </div>
//                     <p className="text-sm text-gray-300">{currentAccommodation.description}</p>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {currentAccommodation.features.map((feature, index) => (
//                         <Badge key={index} variant="secondary" className="bg-accent-green text-green-700">
//                           {feature}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 }
//                 onLike={handleLike}
//                 onDislike={handleDislike}
//               />
//             ) : (
//               <div className="text-center py-12">
//                 <p className="text-gray-400">No accommodations found matching your filters.</p>
//                 <Button
//                   variant="link"
//                   onClick={() => setFilteredAccommodations(allAccommodations)}
//                   className="mt-2 text-primary"
//                 >
//                   Reset Filters
//                 </Button>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="saved">
//             {likedAccommodations.length > 0 ? (
//               <div className="grid grid-cols-1 gap-4">
//                 {likedAccommodations.map((accommodation) => (
//                   <div key={accommodation._id} className="bg-[#0f1628] rounded-lg border border-gray-800 p-4">
//                     <div className="flex flex-col md:flex-row gap-4">
//                       <img
//                         src={`${SOCKET_URL}${accommodation.image}`}
//                         alt={accommodation.title}
//                         className="w-full md:w-32 h-32 object-cover rounded"
//                       />
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-100">{accommodation.title}</h3>
//                         <p className="text-sm text-gray-400">{accommodation.location} • {accommodation.price}</p>
//                         <p className="text-sm mt-2 text-gray-300">{accommodation.bedrooms} Bed • {accommodation.bathrooms} Bath</p>
//                         <p className="text-xs mt-2 text-gray-400">Contact: {accommodation.contact}</p>
//                         <Button
//                           size="sm"
//                           className="mt-2 bg-primary hover:bg-secondary"
//                           onClick={() => handleContactClick(accommodation.contact)}
//                         >
//                           Contact Owner
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <p className="text-gray-400">You haven't saved any accommodations yet.</p>
//                 <Button
//                   variant="link"
//                   onClick={() => setActiveTab("discover")}
//                   className="mt-2 text-primary"
//                 >
//                   Start Browsing
//                 </Button>
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>

//       <AuthModal
//         isOpen={isAuthModalOpen}
//         onClose={() => setIsAuthModalOpen(false)}
//         defaultView="login"
//       />
//     </div>
//   );
// };

// export default AccommodationPage;
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

// ✅ Mock data (auto-used if backend fails or empty)
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

    const token = localStorage.getItem('immigrantConnect_token');

    const fetchAccommodations = async () => {
      try {
        const res = await fetch(`${API_BASE}/accommodations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const fallback = data?.length ? data : mockAccommodations;
        setAllAccommodations(fallback);
        setFilteredAccommodations(fallback);
      } catch (err) {
        console.error(err);
        setAllAccommodations(mockAccommodations);
        setFilteredAccommodations(mockAccommodations);
        toast.error("Using mock accommodation data");
      }
    };

    const fetchLiked = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile/accommodations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLikedAccommodations(data);
      } catch (err) {
        toast.error("Failed to load saved accommodations");
      }
    };

    fetchAccommodations();
    fetchLiked();
  }, [isAuthenticated]);

  const handleFilterChange = (filterId: string, value: string) => {
    if (!value) return setFilteredAccommodations(allAccommodations);

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
      });
    }

    setFilteredAccommodations(filtered);
    setCurrentIndex(0);
  };

  const handleLike = async (id: string) => {
    const token = localStorage.getItem('immigrantConnect_token');
    const liked = filteredAccommodations.find(item => item._id === id);

    if (!liked) return;

    try {
      const res = await fetch(`${API_BASE}/swipe/accommodation`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ accommodationId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setLikedAccommodations([...likedAccommodations, liked]);
      toast("Saved!", { description: `${liked.title} added to your favorites.` });
    } catch (err: any) {
      toast.error(err.message || "Error saving accommodation");
    }

    setCurrentIndex((i) => (i + 1) % filteredAccommodations.length);
  };

  const handleDislike = () => {
    setCurrentIndex((i) => (i + 1) % filteredAccommodations.length);
  };

  const handleContactClick = (contact: string) => {
    navigator.clipboard.writeText(contact)
      .then(() => toast("Copied!", { description: `Contact: ${contact}` }))
      .catch(() => toast.error("Failed to copy contact"));
  };

  const current = filteredAccommodations[currentIndex];

  return (
    <div className="min-h-screen bg-[#080c14] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">Find Accommodation</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#0f1628]">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="saved">Saved ({likedAccommodations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <FilterBar options={filterOptions} onFilterChange={handleFilterChange} />
            {filteredAccommodations.length ? (
              <SwipeCard
                id={current._id}
                image={`${SOCKET_URL}${current.image}`}
                title={current.title}
                subtitle={`${current.location} • ${current.price}`}
                details={
                  <div className="space-y-3">
                    <p className="text-sm text-gray-300">{current.description}</p>
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
                onDislike={() => handleDislike()}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                No accommodations found.{" "}
                <Button variant="link" onClick={() => setFilteredAccommodations(allAccommodations)}>Reset Filters</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {likedAccommodations.length ? (
              likedAccommodations.map(item => (
                <div key={item._id} className="bg-[#0f1628] border border-gray-800 p-4 rounded-lg mb-4">
                  <div className="flex gap-4">
                    <img src={`${SOCKET_URL}${item.image}`} alt={item.title} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.location} • {item.price}</p>
                      <p className="text-xs text-gray-400 mt-1">Contact: {item.contact}</p>
                      <Button size="sm" className="mt-2" onClick={() => handleContactClick(item.contact)}>Contact Owner</Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-12">No saved accommodations yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView="login" />
    </div>
  );
};

export default AccommodationPage;
