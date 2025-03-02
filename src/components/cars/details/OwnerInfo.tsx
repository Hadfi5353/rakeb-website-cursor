
import { MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OwnerInfo = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div>
            <h3 className="font-semibold">Mohammed A.</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              4.9 · Membre depuis 2023
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          Contacter le propriétaire
        </Button>
      </CardContent>
    </Card>
  );
};

export default OwnerInfo;
