
import { Card, CardContent } from "@/components/ui/card";
import { Vehicle } from "@/lib/types";

interface VehicleDescriptionProps {
  vehicle?: Vehicle;
}

const VehicleDescription = ({ vehicle }: VehicleDescriptionProps) => {
  if (!vehicle) return null;
  
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-600 text-sm">{vehicle.description}</p>
      </CardContent>
    </Card>
  );
};

export default VehicleDescription;
