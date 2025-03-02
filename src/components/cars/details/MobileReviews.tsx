
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MobileReviews = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Avis des locataires</h2>
        <div className="space-y-4">
          {[1, 2].map((review) => (
            <div key={review} className="border-b last:border-0 pb-4 last:pb-0">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm">John Doe</h3>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="ml-1 text-xs">5.0</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs">
                    Excellent véhicule, très propre et bien entretenu.
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Il y a 2 semaines
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileReviews;
