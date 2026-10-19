// Application constants

export const CITIES = [
  { key: 'karachi', name: 'Karachi', province: 'Sindh' },
  { key: 'lahore', name: 'Lahore', province: 'Punjab' },
  { key: 'islamabad', name: 'Islamabad', province: 'Federal Capital' },
  { key: 'peshawar', name: 'Peshawar', province: 'Khyber Pakhtunkhwa' },
];

export const CITY_KEYS = CITIES.map(c => c.key);

export const VEHICLE_TYPES = [
  { value: 'car', label: 'Car' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'bus', label: 'Bus' },
  { value: 'train', label: 'Train' },
  { value: 'other', label: 'Other' },
];

export const CAR_FUEL_TYPES = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
];

export const BUS_TYPES = [
  { value: 'local', label: 'Local/Urban Bus' },
  { value: 'coach', label: 'Coach/Intercity Bus' },
];

export const TRAIN_TYPES = [
  { value: 'electric', label: 'Electric Train' },
  { value: 'diesel', label: 'Diesel Train' },
];

export const FLIGHT_TYPES = [
  { value: 'domestic', label: 'Domestic (< 1000 km)' },
  { value: 'shortHaul', label: 'Short Haul International (1000-3700 km)' },
  { value: 'longHaul', label: 'Long Haul International (> 3700 km)' },
];

export const STORAGE_KEYS = {
  CALCULATOR_INPUTS: 'ecotracker_calculator_inputs',
  SELECTED_CITY: 'ecotracker_selected_city',
  AQI_CACHE: 'ecotracker_aqi_cache',
};

export const REFRESH_INTERVALS = {
  AQI_AUTO_REFRESH_MS: 10 * 60 * 1000, // 10 minutes
  AQI_MANUAL_COOLDOWN_MS: 30 * 1000,   // 30 seconds
};

export const CHART_COLORS = {
  primary: '#0284C7',
  secondary: '#38D399',
  danger: '#DC2626',
  warning: '#F59E0B',
  info: '#6366F1',
  transport: '#0284C7',
  electricity: '#DC2626',
  waste: '#F59E0B',
  flights: '#6366F1',
};