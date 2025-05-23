import { Button } from "@/components/ui/button";

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  openHours: string;
  image: string;
  menu: {
    category: string;
    items: {
      name: string;
      description: string;
      price: string;
      image: string;
    }[];
  }[];
}

interface RestaurantModalProps {
  restaurant: Restaurant;
  onClose: () => void;
}

const RestaurantModal: React.FC<RestaurantModalProps> = ({ restaurant, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-[#121826] text-white rounded-lg p-6 w-full max-w-2xl shadow-xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
        <p className="text-sm text-gray-400 mb-2">{restaurant.address}</p>
        <p className="text-sm mb-2"><strong>Phone:</strong> {restaurant.phone}</p>
        <p className="text-sm mb-2">
          <strong>Website:</strong>{" "}
          <a href={`https://${restaurant.website}`} className="underline text-blue-400" target="_blank">{restaurant.website}</a>
        </p>
        <p className="text-sm mb-4"><strong>Open Hours:</strong> {restaurant.openHours}</p>

        {restaurant.menu.map((section, index) => (
          <div key={index} className="mt-6">
            <h3 className="text-lg font-semibold mb-2">{section.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.items.map((item, i) => (
                <div key={i} className="bg-[#1f2937] p-3 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-full h-28 object-cover rounded mb-2" />
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-300">{item.description}</p>
                  <p className="text-sm mt-1 text-green-300">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 text-right">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantModal;
