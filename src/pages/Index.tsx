import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StepIndicator } from "@/components/StepIndicator";
import { UploadCSV } from "./UploadCSV";
import { EmailTemplate } from "./EmailTemplate";
import { Dashboard } from "./Dashboard";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStep} />
        
        <div className="mt-8">
          {currentStep === 1 && <UploadCSV onNext={handleNext} />}
          {currentStep === 2 && <EmailTemplate onNext={handleNext} />}
          {currentStep === 3 && <Dashboard />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
