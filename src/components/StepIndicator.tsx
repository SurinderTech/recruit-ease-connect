import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Template" },
  { number: 3, label: "Dashboard" },
];

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                currentStep > step.number
                  ? "bg-success text-success-foreground shadow-md"
                  : currentStep === step.number
                  ? "bg-gradient-primary text-primary-foreground shadow-glow animate-scale-in"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                currentStep >= step.number
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                currentStep > step.number
                  ? "bg-success"
                  : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
