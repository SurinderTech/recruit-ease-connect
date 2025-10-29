import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StepIndicator } from "@/components/StepIndicator";
import { UploadCSV } from "./UploadCSV";
import { EmailTemplate } from "./EmailTemplate";
import { Dashboard } from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLogout={handleLogout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStep} />
        
        <div className="mt-8">
          {currentStep === 1 && (
            <UploadCSV 
              onNext={(id) => {
                setCampaignId(id);
                handleNext();
              }} 
              userId={user.id}
            />
          )}
          {currentStep === 2 && campaignId && (
            <EmailTemplate 
              onNext={handleNext} 
              campaignId={campaignId}
            />
          )}
          {currentStep === 3 && campaignId && (
            <Dashboard campaignId={campaignId} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
