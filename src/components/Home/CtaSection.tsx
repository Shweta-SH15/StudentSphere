
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "../Auth/AuthModal";

const CtaSection = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-tertiary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-100">
          Join thousands of international students who have found their community, housing, 
          favorite restaurants, and roommates through ImmigrantConnect.
        </p>
        
        {!isAuthenticated && (
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Create Your Free Account
          </Button>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView="signup"
      />
    </section>
  );
};

export default CtaSection;
