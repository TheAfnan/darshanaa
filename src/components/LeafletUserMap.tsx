// src/components/LeafletUserMap.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet + Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function SetViewOnUser({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 15);
    }
  }, [coords, map]);
  return null;
}

const LeafletUserMap: React.FC = () => {
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          setError('Location access denied or unavailable.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg relative">
      <div className="p-2 bg-white text-sm font-semibold">My Location Map</div>
      <div style={{ height: 400, width: '100%' }}>
        <MapContainer
          center={userCoords || [20.5937, 78.9629]} // Default: India
          zoom={userCoords ? 15 : 5}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userCoords && (
            <>
              <Marker position={userCoords}>
                <Popup>You are here!</Popup>
              </Marker>
              <SetViewOnUser coords={userCoords} />
            </>
          )}
        </MapContainer>
      </div>
      {error && <div className="text-red-600 p-2">{error}</div>}
      {userCoords && (
        <div className="p-2 text-xs text-blue-700">Your Location: {userCoords[0].toFixed(4)}, {userCoords[1].toFixed(4)}</div>
      )}
    </div>
  );
};

export default LeafletUserMap;
