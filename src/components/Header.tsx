import { Mail } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full py-6 px-4 bg-gradient-primary shadow-glow">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <Mail className="w-8 h-8 text-primary-foreground" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
          🚀 RecruitEase – Smart Bulk Email Sender
        </h1>
      </div>
    </header>
  );
};
