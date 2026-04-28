// src/components/Map.tsx
import React, { useState } from 'react';
// Mapbox token from environment variables
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
import { MapPin, Navigation, Globe2, Eye } from 'lucide-react';


const MAP_MODES = [
  { key: 'standard', label: 'Standard', icon: <Globe2 size={18} /> },
  { key: 'streetview', label: 'Street View', icon: <Eye size={18} /> },
  { key: 'traffic', label: 'Traffic', icon: <Navigation size={18} /> },
];

const Map: React.FC<{ location?: string }> = ({ location = 'India' }) => {
  const [mode, setMode] = useState<'standard' | 'streetview' | 'traffic'>('standard');
  const [showLocation, setShowLocation] = useState(false);

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const locationCoordinates: Record<string, { lat: number; lng: number }> = {
    'India': { lat: 20.5937, lng: 78.9629 },
    'Delhi': { lat: 28.6139, lng: 77.209 },
    'Mumbai': { lat: 19.076, lng: 72.8777 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
  };

  const coords = locationCoordinates[location] || locationCoordinates['India'];

  // Google Maps Embed API key (replace with your own if needed)
  const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  let mapUrl = '';
  let mapboxImgUrl = '';
  if (showLocation && userCoords) {
    // Use Mapbox Static Images API for user's location
    const lat = userCoords.lat;
    const lng = userCoords.lng;
    mapboxImgUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${lng},${lat})/${lng},${lat},15,0/600x400?access_token=${MAPBOX_TOKEN}`;
  } else if (mode === 'standard') {
    mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 2},${coords.lat - 2},${coords.lng + 2},${coords.lat + 2}&layer=mapnik`;
  } else if (mode === 'streetview') {
    mapUrl = `https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_MAPS_KEY}&location=${coords.lat},${coords.lng}&heading=210&pitch=10&fov=80`;
  } else if (mode === 'traffic') {
    mapUrl = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_KEY}&center=${coords.lat},${coords.lng}&zoom=12&maptype=roadmap&layer=traffic`;
  }

  // User location
  React.useEffect(() => {
    if (showLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, [showLocation]);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg relative">
      <div className="absolute top-2 left-2 z-10 flex gap-2">
        {MAP_MODES.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key as any)}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow ${mode === m.key ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700'}`}
            title={m.label}
          >
            {m.icon} {m.label}
          </button>
        ))}
        <button
          onClick={() => setShowLocation(l => !l)}
          className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow ${showLocation ? 'bg-blue-600 text-white' : 'bg-white text-blue-700'}`}
          title="Show My Location"
        >
          <MapPin size={16} /> My Location
        </button>
      </div>
      {showLocation && userCoords ? (
        <img
          src={mapboxImgUrl}
          alt="Your Location Map"
          className="w-full h-[400px] object-cover rounded-lg border"
        />
      ) : (
        <iframe
          title={`Map of ${location}`}
          className="w-full h-[400px]"
          frameBorder="0"
          src={mapUrl}
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
      <div className="p-4 bg-white dark:bg-gray-800 flex items-center gap-2">
        <MapPin size={20} className="text-red-500" />
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {location}
        </p>
        {showLocation && userCoords && (
          <span className="ml-4 text-xs text-blue-700">Your Location: {userCoords.lat.toFixed(3)}, {userCoords.lng.toFixed(3)}</span>
        )}
      </div>
    </div>
  );
};

export default Map;
