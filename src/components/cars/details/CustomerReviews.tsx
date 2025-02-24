
import { Star } from "lucide-react";

const CustomerReviews = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Avis des locataires</h2>
      <div className="space-y-6">
        {[1, 2, 3].map((review) => (
          <div key={review} className="border-b last:border-0 pb-6 last:pb-0">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">John Doe</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">5.0</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Excellent véhicule, très propre et bien entretenu. La location s'est très bien passée.
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Il y a 2 semaines
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
