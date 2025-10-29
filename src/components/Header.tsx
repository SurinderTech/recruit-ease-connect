import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

interface HeaderProps {
  onLogout?: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          🚀 RecruitEase
        </h1>
        {onLogout && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
