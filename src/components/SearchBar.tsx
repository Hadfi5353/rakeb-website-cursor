
import { CalendarDays, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdvancedSearch from "./cars/AdvancedSearch";

const SearchBar = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="flex-1 p-4">
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" size={20} />
            <input
              type="text"
              placeholder="Où souhaitez-vous louer ?"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-primary" size={20} />
            <input
              type="text"
              placeholder="Quand souhaitez-vous louer ?"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-4">
          <AdvancedSearch />
          <Button className="bg-primary hover:bg-primary-dark">
            <Search className="mr-2" size={20} />
            <span>Rechercher</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
