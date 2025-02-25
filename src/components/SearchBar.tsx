
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Search } from "lucide-react";
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
  const suggestionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Gérer la fermeture du menu de suggestions
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fermer les suggestions lors du scroll
  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        setShowSuggestions(false);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile]);

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
    setShowSuggestions(false);
    setIsCalendarOpen(false);
    
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
    <form ref={formRef} onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg overflow-visible relative">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="flex-1 p-4 relative">
          <Label htmlFor="location" className="sr-only">Lieu</Label>
          <div className="flex items-center gap-3">
            <MapPin className="text-primary flex-shrink-0" size={20} />
            <Input
              id="location"
              type="text"
              placeholder="Où souhaitez-vous louer ?"
              className="w-full border-none shadow-none focus-visible:ring-0"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              onFocus={() => setIsCalendarOpen(false)}
              autoComplete="off"
            />
          </div>
          {showSuggestions && filteredCities.length > 0 && (
            <div 
              ref={suggestionRef}
              className="fixed md:absolute left-0 right-0 md:top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[50vh] overflow-auto z-[100] mx-4 md:mx-0"
              style={{
                top: isMobile ? '50%' : 'auto',
                transform: isMobile ? 'translateY(-50%)' : 'none',
              }}
            >
              {filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="w-full px-4 py-4 md:py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors text-base"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="text-gray-400 flex-shrink-0" size={16} />
                    {city}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4">
          <Label htmlFor="dates" className="sr-only">Dates</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start border-none text-left font-normal shadow-none hover:bg-transparent",
                  !dateRange?.from && "text-muted-foreground"
                )}
                onClick={() => setShowSuggestions(false)}
              >
                <CalendarDays className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
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
              className="w-[calc(100vw-2rem)] md:w-auto p-0 z-[100]" 
              align="start"
              side={isMobile ? "bottom" : "bottom"}
              sideOffset={8}
            >
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
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center p-4">
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium text-base md:text-sm h-12 md:h-10"
          >
            <Search className="mr-2 flex-shrink-0" size={20} />
            Rechercher
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
