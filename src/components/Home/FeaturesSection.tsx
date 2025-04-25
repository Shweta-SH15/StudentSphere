
import FeatureCard from "./FeatureCard";
import { Users, House, User, Coffee } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Find Friends",
      description: "Connect with students based on personality, nationality, and shared interests. Swipe to match and chat with new friends.",
      icon: <Users size={32} className="text-primary" />,
      path: "/friends",
      color: "bg-accent-purple",
    },
    {
      title: "Find Accommodation",
      description: "Browse accommodations filtered by property type, location, and budget. Swipe through options and connect with property owners.",
      icon: <House size={32} className="text-primary" />,
      path: "/accommodation",
      color: "bg-accent-green",
    },
    {
      title: "Find Restaurants",
      description: "Discover restaurants by cuisine type, price range, and distance. View menus, photos, and contact information in one place.",
      icon: <Coffee size={32} className="text-primary" />,
      path: "/restaurants",
      color: "bg-accent-orange",
    },
    {
      title: "Find Roommates",
      description: "Match with potential roommates based on lifestyle, gender, and personal preferences. Connect and split housing costs.",
      icon: <User size={32} className="text-primary" />,
      path: "/roommates",
      color: "bg-accent-purple",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">How ImmigrantConnect Helps You</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              path={feature.path}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
