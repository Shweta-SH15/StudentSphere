
import { Link } from "react-router-dom";
import { Users, House, User, Coffee } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Find Friends",
      description: "Connect with students based on personality, nationality, and shared interests. Swipe to match and chat with new friends.",
      icon: <Users size={32} className="text-primary" />,
      path: "/friends",
      color: "text-primary",
      borderClass: "glow-border-green",
    },
    {
      title: "Find Accommodation",
      description: "Browse accommodations filtered by property type, location, and budget. Swipe through options and connect with property owners.",
      icon: <House size={32} className="text-secondary" />,
      path: "/accommodation",
      color: "text-secondary",
      borderClass: "glow-border-red",
    },
    {
      title: "Find Restaurants",
      description: "Discover restaurants by cuisine type, price range, and distance. View menus, photos, and contact information in one place.",
      icon: <Coffee size={32} className="text-tertiary" />,
      path: "/restaurants",
      color: "text-tertiary",
      borderClass: "glow-border-blue",
    },
    {
      title: "Find Roommates",
      description: "Match with potential roommates based on lifestyle, gender, and personal preferences. Connect and split housing costs.",
      icon: <User size={32} className="text-purple-500" />,
      path: "/roommates",
      color: "text-purple-500",
      borderClass: "glow-border-purple",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#080c14]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-white">ImmigrantConnect</h2>
        <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          Our platform constantly expands to provide international students with all the resources they need
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`bg-opacity-5 rounded-lg p-6 ${feature.borderClass} hover:transform hover:scale-105 transition-all duration-300`}>
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className={`text-2xl font-bold mb-4 text-center ${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-gray-400 text-center mb-8">
                {feature.description}
              </p>
              <div className="flex justify-center">
                <Link 
                  to={feature.path} 
                  className={`inline-block py-2 px-6 rounded-full border ${feature.color} hover:bg-opacity-10 hover:bg-white transition-colors`}
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
