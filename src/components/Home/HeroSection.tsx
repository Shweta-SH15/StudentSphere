
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "../Auth/AuthModal";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup">("signup");

  const openAuthModal = (view: "login" | "signup") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  return (
    <section className="relative bg-gradient-to-r from-primary to-tertiary text-white py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your Complete Guide to Student Life Abroad
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Join ImmigrantConnect to find friends, accommodation, restaurants, and roommates - 
            everything you need for a successful journey as an international student.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => openAuthModal("signup")}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-primary"
                onClick={() => openAuthModal("login")}
              >
                I Already Have an Account
              </Button>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView={authModalView}
      />
    </section>
  );
};

export default HeroSection;
