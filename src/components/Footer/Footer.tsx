
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-xl">🌎</span>
              <span>ImmigrantConnect</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Your complete platform to connect with other international students,
              find accommodation, discover restaurants, and match with potential roommates.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/friends" className="text-gray-400 hover:text-white transition-colors">
                  Find Friends
                </Link>
              </li>
              <li>
                <Link to="/accommodation" className="text-gray-400 hover:text-white transition-colors">
                  Find Accommodation
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-400 hover:text-white transition-colors">
                  Find Restaurants
                </Link>
              </li>
              <li>
                <Link to="/roommates" className="text-gray-400 hover:text-white transition-colors">
                  Find Roommates
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <p className="text-gray-400 text-sm mb-2">
              Have questions or feedback? Reach out to us.
            </p>
            <a href="mailto:support@immigrantconnect.com" className="text-primary hover:underline">
              support@immigrantconnect.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ImmigrantConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
