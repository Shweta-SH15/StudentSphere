
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import CtaSection from "@/components/Home/CtaSection";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};

export default HomePage;
