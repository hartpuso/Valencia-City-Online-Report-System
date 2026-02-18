import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FacebookPanel from "@/components/FacebookPanel";
import FAQButton from "@/components/FAQButton";
import Footer from "@/components/Footer";
import DisclaimerModal from "@/components/DisclaimerModal";
import RequestFormModal from "@/components/RequestFormModal";

const Index = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleSubmitClick = () => {
    setShowDisclaimer(true);
  };

  const handleAgree = () => {
    setShowDisclaimer(false);
    setShowRequestForm(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <HeroSection onSubmitClick={handleSubmitClick} />
        <FacebookPanel />
      </main>

      <Footer />

      {/* Floating FAQ Button */}
      <FAQButton />

      {/* Modals */}
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAgree={handleAgree}
      />

      <RequestFormModal
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
      />
    </div>
  );
};

export default Index;
