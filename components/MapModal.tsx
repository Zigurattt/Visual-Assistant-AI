import React, { useEffect, useRef } from 'react';
import { useCollection } from '../hooks/useCollection';
import { useGeolocation } from '../hooks/useGeolocation';
import { useLanguage } from '../hooks/useLanguage';
import { CloseIcon, MapIcon } from './icons';

// Leaflet is loaded from CDN, so we declare it
declare var L: any;

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose }) => {
  const { collection } = useCollection();
  const { location: userLocation } = useGeolocation();
  const { t } = useLanguage();
  const mapInstance = useRef<any>(null);
  const mapContainerId = "map-container";

  useEffect(() => {
    if (isOpen && !mapInstance.current && document.getElementById(mapContainerId)) {
        // Initialize map
        const defaultLocation = [40.7128, -74.0060]; // New York City as a fallback
        const initialCenter = userLocation ? [userLocation.latitude, userLocation.longitude] : defaultLocation;
        
        mapInstance.current = L.map(mapContainerId).setView(initialCenter, 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance.current);

        // Add user location marker
        if (userLocation) {
            L.marker([userLocation.latitude, userLocation.longitude], {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: '<div class="pulsing-dot"></div>',
                    iconSize: [20, 20]
                })
            }).addTo(mapInstance.current)
              .bindPopup('Your Location')
              .openPopup();
        }
        
        // Add collection item markers
        const itemMarkers = [];
        collection.forEach(item => {
            if (item.location) {
                const popupContent = `
                    <div class="map-popup">
                        <img src="${item.image}" alt="${item.name}" />
                        <b>${item.name}</b>
                    </div>
                `;
                const marker = L.marker([item.location.latitude, item.location.longitude])
                 .bindPopup(popupContent);
                itemMarkers.push(marker);
            }
        });

        if (itemMarkers.length > 0) {
            const group = L.featureGroup(itemMarkers).addTo(mapInstance.current);
            // Optionally zoom to fit all markers
            // mapInstance.current.fitBounds(group.getBounds().pad(0.5));
        }

    } else if (isOpen && mapInstance.current) {
        // Invalidate size if modal was hidden and is shown again
        setTimeout(() => {
            mapInstance.current?.invalidateSize();
        }, 100);
    }
  }, [isOpen, userLocation, collection]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <style>{`
        .leaflet-popup-content-wrapper { border-radius: 8px; }
        .map-popup { text-align: center; width: 120px; }
        .map-popup img { width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 5px; }
        .map-popup b { font-size: 14px; }
        .user-location-marker .pulsing-dot {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #0ea5e9;
            border: 3px solid #fff;
            box-shadow: 0 0 0 rgba(14, 165, 233, 0.4);
            animation: pulse-map 2s infinite;
        }
        @keyframes pulse-map {
            0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
            100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
        }
      `}</style>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col p-6 relative transition-all duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
           <div className="flex items-center gap-3">
             <MapIcon className="w-7 h-7 text-cyan-500" />
             <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.mapTitle}</h2>
           </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div id={mapContainerId} className="flex-grow w-full h-full rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden">
            {/* Map will be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default MapModal;