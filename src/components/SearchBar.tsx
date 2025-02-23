
import { CalendarDays, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-1 sm:p-2 flex flex-col sm:flex-row gap-2">
      <div className="flex-1 flex items-center gap-2 p-3 hover:bg-gray-50 rounded-md transition-colors">
        <MapPin className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Où souhaitez-vous louer ?"
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
      
      <div className="flex-1 flex items-center gap-2 p-3 hover:bg-gray-50 rounded-md transition-colors">
        <CalendarDays className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Quand souhaitez-vous louer ?"
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
      
      <Button className="w-full sm:w-auto px-8 py-6">
        <Search className="mr-2" size={20} />
        Rechercher
      </Button>
    </div>
  );
};

export default SearchBar;
