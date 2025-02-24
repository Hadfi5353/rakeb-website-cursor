
import { useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Vehicle } from '@/lib/types';

interface VehicleMapProps {
  vehicle: Vehicle;
}

const VehicleMap = ({ vehicle }: VehicleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [vehicle.longitude, vehicle.latitude],
      zoom: 13
    });

    new mapboxgl.Marker()
      .setLngLat([vehicle.longitude, vehicle.latitude])
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [vehicle]);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Localisation</h2>
        <div 
          ref={mapContainer} 
          className="w-full h-[300px] rounded-lg overflow-hidden"
        />
      </CardContent>
    </Card>
  );
};

export default VehicleMap;
