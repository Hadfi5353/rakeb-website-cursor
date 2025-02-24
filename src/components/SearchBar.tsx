
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      location: location,
      dates: dates,
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="flex-1 p-4">
          <Label htmlFor="location" className="sr-only">Lieu</Label>
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" size={20} />
            <Input
              id="location"
              type="text"
              placeholder="Où souhaitez-vous louer ?"
              className="w-full border-none shadow-none focus-visible:ring-0"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <Label htmlFor="dates" className="sr-only">Dates</Label>
          <div className="flex items-center gap-3">
            <CalendarDays className="text-primary" size={20} />
            <Input
              id="dates"
              type="text"
              placeholder="Quand souhaitez-vous louer ?"
              className="w-full border-none shadow-none focus-visible:ring-0"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center p-4">
          <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary-dark">
            <Search className="mr-2" size={20} />
            Rechercher
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
