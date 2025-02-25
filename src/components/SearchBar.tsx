
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { moroccanCities } from "@/lib/data/moroccan-cities";
import { DateRange } from "react-day-picker";
import { useIsMobile } from "@/hooks/use-mobile";

const SearchBar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [location, setLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (value.length > 0) {
      const filtered = moroccanCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setLocation(city);
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDates = dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, 'yyyy-MM-dd')}:${format(dateRange.to, 'yyyy-MM-dd')}`
      : '';
    
    const searchParams = new URLSearchParams({
      location: location,
      dates: formattedDates,
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg relative">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="flex-1 p-4 relative">
          <Label htmlFor="location" className="sr-only">Lieu</Label>
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" size={20} />
            <Input
              id="location"
              type="text"
              placeholder="Où souhaitez-vous louer ?"
              className="w-full border-none shadow-none focus-visible:ring-0"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              autoComplete="off"
            />
          </div>
          {showSuggestions && filteredCities.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="text-gray-400" size={16} />
                    {city}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4">
          <Label htmlFor="dates" className="sr-only">Dates</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start border-none text-left font-normal shadow-none hover:bg-transparent",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-3 h-5 w-5 text-primary" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "d MMM", { locale: fr })} -{" "}
                      {format(dateRange.to, "d MMM, yyyy", { locale: fr })}
                    </>
                  ) : (
                    format(dateRange.from, "d MMM, yyyy", { locale: fr })
                  )
                ) : (
                  "Sélectionnez les dates"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className={cn(
                isMobile ? 
                "fixed inset-x-0 bottom-0 w-full bg-white rounded-t-xl shadow-lg" : 
                "relative w-auto rounded-lg bg-white"
              )}
              style={{
                maxHeight: isMobile ? '85vh' : 'none',
                overflowY: isMobile ? 'auto' : 'visible'
              }}
              align="center"
            >
              <div className={cn(
                "relative",
                isMobile && "pt-2 pb-8"
              )}>
                {isMobile && (
                  <div className="absolute right-4 top-2 z-50">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsCalendarOpen(false)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(newDateRange) => {
                    setDateRange(newDateRange);
                    if (newDateRange?.to) {
                      setIsCalendarOpen(false);
                    }
                  }}
                  numberOfMonths={isMobile ? 1 : 2}
                  locale={fr}
                  className="mx-auto"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center p-4">
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-base md:text-sm h-11 md:h-10">
            <Search className="mr-2" size={20} />
            Rechercher
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
