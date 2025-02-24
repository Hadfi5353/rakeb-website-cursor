
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2 } from "lucide-react";

interface FilterState {
  priceRange: [number, number];
  transmission: string[];
  features: string[];
}

const transmissionOptions = [
  { id: "manual", label: "Manuelle" },
  { id: "automatic", label: "Automatique" },
];

const featureOptions = [
  { id: "ac", label: "Climatisation" },
  { id: "gps", label: "GPS" },
  { id: "bluetooth", label: "Bluetooth" },
  { id: "usb", label: "Ports USB" },
  { id: "camera", label: "Caméra de recul" },
];

const AdvancedSearch = () => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    transmission: [],
    features: [],
  });

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] }));
  };

  const handleTransmissionChange = (id: string) => {
    setFilters(prev => ({
      ...prev,
      transmission: prev.transmission.includes(id)
        ? prev.transmission.filter(item => item !== id)
        : [...prev.transmission, id]
    }));
  };

  const handleFeatureChange = (id: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter(item => item !== id)
        : [...prev.features, id]
    }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="w-4 h-4 mr-2" />
          Filtres avancés
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtres de recherche</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <Label>Prix par jour (Dh)</Label>
            <div className="px-2">
              <Slider
                min={0}
                max={1000}
                step={50}
                value={[filters.priceRange[0], filters.priceRange[1]]}
                onValueChange={handlePriceChange}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{filters.priceRange[0]} Dh</span>
                <span>{filters.priceRange[1]} Dh</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Transmission</Label>
            <div className="grid gap-2">
              {transmissionOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={filters.transmission.includes(option.id)}
                    onCheckedChange={() => handleTransmissionChange(option.id)}
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Équipements</Label>
            <div className="grid gap-2">
              {featureOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={filters.features.includes(option.id)}
                    onCheckedChange={() => handleFeatureChange(option.id)}
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedSearch;
