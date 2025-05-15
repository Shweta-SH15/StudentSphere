// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { API_BASE, SOCKET_URL } from "@/lib/api";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "@/components/ui/sonner";
// import { getAuth } from "firebase/auth";

// const FavoritesPage = () => {
//   const { isAuthenticated } = useAuth();
//   const [friends, setFriends] = useState<any[]>([]);
//   const [roommates, setRoommates] = useState<any[]>([]);
//   const [accommodations, setAccommodations] = useState<any[]>([]);
//   const [restaurants, setRestaurants] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       try {
//         if (!isAuthenticated) return;

//         const user = getAuth().currentUser;
//         const token = await user?.getIdToken(true);
//         if (!token) {
//           toast.error("Authentication token not found. Please log in again.");
//           return;
//         }

//         const headers = { Authorization: `Bearer ${token}` };

//         const [fRes, rRes, aRes, restRes] = await Promise.all([
//           fetch(`${API_BASE}/swipe/friends`, { headers }),
//           fetch(`${API_BASE}/swipe/roommates`, { headers }),
//           fetch(`${API_BASE}/swipe/accommodations`, { headers }),
//           fetch(`${API_BASE}/swipe/restaurants`, { headers }),
//         ]);

//         if (!fRes.ok) console.error("Friends error:", await fRes.clone().json());
//         if (!rRes.ok) console.error("Roommates error:", await rRes.clone().json());
//         if (!aRes.ok) console.error("Accommodations error:", await aRes.clone().json());
//         if (!restRes.ok) console.error("Restaurants error:", await restRes.clone().json());

//         const [fData, rData, aData, restData] = await Promise.all([
//           fRes.json(),
//           rRes.json(),
//           aRes.json(),
//           restRes.json(),
//         ]);

//         setFriends(Array.isArray(fData) ? fData : []);
//         setRoommates(Array.isArray(rData) ? rData : []);
//         setAccommodations(Array.isArray(aData) ? aData : []);
//         setRestaurants(Array.isArray(restData) ? restData : []);
//       } catch (err) {
//         toast.error("Failed to load favorites");
//         console.error("Favorites fetch error:", err);
//       }
//     };

//     fetchFavorites();
//   }, [isAuthenticated]);

//   const renderCard = (item: any, type: string) => (
//     <Card key={item._id} className="overflow-hidden">
//       <div className="h-36 overflow-hidden">
//         <img
//           src={`${SOCKET_URL}${item.profileImage || item.image || "/uploads/default.png"}`}
//           alt={item.name || item.title}
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <CardContent className="p-4">
//         <h3 className="font-semibold text-lg mb-1">{item.name || item.title}</h3>
//         {type === "friend" && (
//           <>
//             <Badge variant="outline" className="mr-2">{item.nationality}</Badge>
//             <Badge variant="outline">{(item.interest || []).join(", ")}</Badge>
//           </>
//         )}
//         {type === "roommate" && (
//           <>
//             <p className="text-sm text-gray-500">Age: {item.age}</p>
//             <p className="text-sm text-gray-500">Gender: {item.gender}</p>
//           </>
//         )}
//         {type === "accommodation" && (
//           <>
//             <p className="text-sm text-gray-500">{item.location}</p>
//             <p className="text-sm text-gray-500">{item.price}</p>
//           </>
//         )}
//         {type === "restaurant" && (
//           <>
//             <p className="text-sm">{item.cuisine}</p>
//             <p className="text-sm text-gray-500">{item.address}</p>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="container mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-6">Your Favorites</h1>

//         <Tabs defaultValue="friends" className="w-full max-w-5xl mx-auto">
//           <TabsList className="grid grid-cols-4 mb-6">
//             <TabsTrigger value="friends">Friends</TabsTrigger>
//             <TabsTrigger value="roommates">Roommates</TabsTrigger>
//             <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
//             <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
//           </TabsList>

//           <TabsContent value="friends">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {friends.map(f => renderCard(f, "friend"))}
//               {friends.length === 0 && (
//                 <p className="text-center w-full col-span-3">No favorite friends yet.</p>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="roommates">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {roommates.map(r => renderCard(r, "roommate"))}
//               {roommates.length === 0 && (
//                 <p className="text-center w-full col-span-3">No favorite roommates yet.</p>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="accommodations">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {accommodations.map(a => renderCard(a, "accommodation"))}
//               {accommodations.length === 0 && (
//                 <p className="text-center w-full col-span-3">No saved accommodations yet.</p>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="restaurants">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {restaurants.map(r => renderCard(r, "restaurant"))}
//               {restaurants.length === 0 && (
//                 <p className="text-center w-full col-span-3">No favorite restaurants yet.</p>
//               )}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default FavoritesPage;

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SOCKET_URL } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

const FavoritesPage = () => {
  const { isAuthenticated } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const f = JSON.parse(localStorage.getItem("likedFriends") || "[]");
      const r = JSON.parse(localStorage.getItem("likedRoommates") || "[]");
      const a = JSON.parse(localStorage.getItem("likedMockAccommodations") || "[]");
      const rest = JSON.parse(localStorage.getItem("likedRestaurants") || "[]");

      setFriends(Array.isArray(f) ? f : []);
      setRoommates(Array.isArray(r) ? r : []);
      setAccommodations(Array.isArray(a) ? a : []);
      setRestaurants(Array.isArray(rest) ? rest : []);
    } catch (err) {
      console.error("Failed to load local favorites", err);
      toast.error("Failed to load saved favorites");
    }
  }, [isAuthenticated]);

  const renderCard = (item: any, type: string) => (
    <Card key={item._id} className="overflow-hidden">
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
          <>
            <Badge variant="outline" className="mr-2">{item.nationality}</Badge>
            <Badge variant="outline">{(item.interest || []).join(", ")}</Badge>
          </>
        )}
        {type === "roommate" && (
          <>
            <p className="text-sm text-gray-500">Age: {item.age}</p>
            <p className="text-sm text-gray-500">Gender: {item.gender}</p>
          </>
        )}
        {type === "accommodation" && (
          <>
            <p className="text-sm text-gray-500">{item.location}</p>
            <p className="text-sm text-gray-500">{item.price}</p>
          </>
        )}
        {type === "restaurant" && (
          <>
            <p className="text-sm">{item.cuisine}</p>
            <p className="text-sm text-gray-500">{item.address}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Your Favorites</h1>

        <Tabs defaultValue="friends" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="roommates">Roommates</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map(f => renderCard(f, "friend"))}
              {friends.length === 0 && (
                <p className="text-center w-full col-span-3">No favorite friends yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="roommates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roommates.map(r => renderCard(r, "roommate"))}
              {roommates.length === 0 && (
                <p className="text-center w-full col-span-3">No favorite roommates yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="accommodations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accommodations.map(a => renderCard(a, "accommodation"))}
              {accommodations.length === 0 && (
                <p className="text-center w-full col-span-3">No saved accommodations yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="restaurants">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(r => renderCard(r, "restaurant"))}
              {restaurants.length === 0 && (
                <p className="text-center w-full col-span-3">No favorite restaurants yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FavoritesPage;
