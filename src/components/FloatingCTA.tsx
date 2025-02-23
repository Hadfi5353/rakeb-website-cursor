
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingCTA = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button 
        className="bg-primary hover:bg-primary-dark shadow-lg transition-all duration-300 hover:scale-105"
        size="lg"
      >
        <Phone className="w-4 h-4 mr-2" />
        Besoin d'aide ?
      </Button>
    </div>
  );
};

export default FloatingCTA;
