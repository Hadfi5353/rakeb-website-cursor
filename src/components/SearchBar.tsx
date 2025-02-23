
import { CalendarDays, MapPin, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const SearchBar = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-1 sm:p-2 flex flex-col sm:flex-row gap-2">
      <div className="flex-1 flex items-center gap-2 p-3 hover:bg-gray-50 rounded-md transition-colors group focus-within:bg-gray-50">
        <MapPin className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
        <Input
          type="text"
          placeholder="Où souhaitez-vous louer ?"
          className="w-full border-0 bg-transparent focus-visible:ring-0 p-0 placeholder:text-gray-400"
        />
      </div>
      
      <div className="flex-1 flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full h-full justify-start gap-2 px-3 font-normal hover:bg-gray-50"
            >
              <CalendarDays className="text-gray-400" size={20} />
              <div className="text-left">
                <div className="text-sm">
                  {startDate ? format(startDate, 'PP', { locale: fr }) : 'Date de début'}
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full h-full justify-start gap-2 px-3 font-normal hover:bg-gray-50"
            >
              <Clock className="text-gray-400" size={20} />
              <div className="text-left">
                <div className="text-sm">
                  {endDate ? format(endDate, 'PP', { locale: fr }) : 'Date de fin'}
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button className="w-full sm:w-auto px-8 py-6">
        <Search className="mr-2" size={20} />
        Rechercher
      </Button>
    </div>
  );
};

export default SearchBar;
