import { GeoLocation } from '../types';
import { DEFAULT_CENTER } from './mockData';

export const CITY_PRESETS: { name: string; lat: number; lng: number; address: string }[] = [
  {
    name: 'Bengaluru - MG Road & Brigade Hub',
    lat: 12.9716,
    lng: 77.5946,
    address: 'Near MG Road Metro, Central Bengaluru, Karnataka',
  },
  {
    name: 'New Delhi - Connaught Place Outer Circle',
    lat: 28.6304,
    lng: 77.2177,
    address: 'Outer Circle, Connaught Place, New Delhi',
  },
  {
    name: 'Mumbai - Lower Parel Commercial District',
    lat: 18.9950,
    lng: 72.8270,
    address: 'Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra',
  },
  {
    name: 'Hyderabad - Hitec City Cyber Towers',
    lat: 17.4504,
    lng: 78.3808,
    address: 'Hitec City, Madhapur, Hyderabad, Telangana',
  },
  {
    name: 'Chennai - Marina Beach Promenade',
    lat: 13.0475,
    lng: 80.2824,
    address: 'Kamarajar Salai, Triplicane, Chennai, Tamil Nadu',
  },
];

// Haversine formula for distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

// Request real browser geolocation with instant fallback
export function getBrowserLocation(): Promise<GeoLocation> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        lat: DEFAULT_CENTER.lat,
        lng: DEFAULT_CENTER.lng,
        address: 'MG Road Hub, Central Bengaluru (Simulated Baseline)',
        timestamp: Date.now(),
        accuracy: 15,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy || 10),
          address: `Live GPS Fix (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
          timestamp: Date.now(),
        });
      },
      (err) => {
        console.warn('Geolocation access failed or denied, using high-accuracy fallback:', err.message);
        resolve({
          lat: DEFAULT_CENTER.lat,
          lng: DEFAULT_CENTER.lng,
          address: 'Central Urban Sector 4 (Default GPS Fallback)',
          timestamp: Date.now(),
          accuracy: 20,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 10000,
      }
    );
  });
}
