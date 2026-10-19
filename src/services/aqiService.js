// AQI Service - Handles air quality data fetching
// Primary: Open-Meteo Air Quality API (free, no key, global coverage)
// Fallback: WAQI API (requires token, ground station data)

import { CITIES } from '../utils/constants';

// City coordinates for Open-Meteo API
export const CITY_COORDS = {
  karachi: { lat: 24.8607, lon: 67.0011, name: 'Karachi' },
  lahore: { lat: 31.5204, lon: 74.3587, name: 'Lahore' },
  islamabad: { lat: 33.6844, lon: 73.0479, name: 'Islamabad' },
  peshawar: { lat: 34.0151, lon: 71.5249, name: 'Peshawar' },
};

// Open-Meteo API base URL
const OPEN_METEO_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// WAQI API (fallback)
const WAQI_BASE = 'https://api.waqi.info/feed';

// AQI Category thresholds (US EPA Standard)
export const AQI_CATEGORIES = [
  { max: 50, label: 'Good', color: '#00E400', class: 'badge-good' },
  { max: 100, label: 'Moderate', color: '#FFFF00', class: 'badge-moderate' },
  { max: 150, label: 'Unhealthy for Sensitive Groups', color: '#FF7E00', class: 'badge-usg' },
  { max: 200, label: 'Unhealthy', color: '#FF0000', class: 'badge-unhealthy' },
  { max: 300, label: 'Very Unhealthy', color: '#8F3F97', class: 'badge-very-unhealthy' },
  { max: Infinity, label: 'Hazardous', color: '#7E0023', class: 'badge-hazardous' },
];

/**
 * Get AQI category from US AQI value
 */
export function getAQICategory(aqi) {
  if (aqi === null || aqi === undefined || isNaN(aqi)) return null;
  return AQI_CATEGORIES.find(cat => aqi <= cat.max) || AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(isoString) {
  if (!isoString) return 'Unknown';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-PK', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Fetch air quality from Open-Meteo API
 * Returns modeled forecast data (CAMS global model, ~45km resolution)
 */
export async function fetchOpenMeteoAQI(cityKey) {
  const coords = CITY_COORDS[cityKey];
  if (!coords) throw new Error(`Unknown city: ${cityKey}`);

  const params = new URLSearchParams({
    latitude: coords.lat.toString(),
    longitude: coords.lon.toString(),
    current: 'us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi',
    timezone: 'Asia/Karachi',
    forecast_days: '1',
    past_days: '1',
  });

  const response = await fetch(`${OPEN_METEO_BASE}?${params}`);

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error('No current data from Open-Meteo');
  }

  const current = data.current;
  const timestamp = current.time;

  return {
    source: 'open-meteo',
    city: coords.name,
    cityKey,
    aqi: current.us_aqi ?? null,
    aqiCategory: getAQICategory(current.us_aqi),
    pm25: current.pm2_5 ?? null,
    pm10: current.pm10 ?? null,
    co: current.carbon_monoxide ?? null,
    no2: current.nitrogen_dioxide ?? null,
    so2: current.sulphur_dioxide ?? null,
    o3: current.ozone ?? null,
    europeanAqi: current.european_aqi ?? null,
    timestamp,
    formattedTime: formatTimestamp(timestamp),
    // Note: This is modeled forecast data, not ground station observations
    isModeled: true,
    dataSource: 'CAMS Global Atmospheric Composition Forecast (45km resolution)',
  };
}

/**
 * Fetch air quality from WAQI API (fallback)
 * Returns ground station observations
 */
export async function fetchWAQIAQI(cityKey, token) {
  // WAQI uses city names or station IDs
  const cityNames = {
    karachi: 'karachi',
    lahore: 'lahore',
    islamabad: 'islamabad',
    peshawar: 'peshawar',
  };

  const cityName = cityNames[cityKey];
  if (!cityName) throw new Error(`Unknown city for WAQI: ${cityKey}`);

  const response = await fetch(`${WAQI_BASE}/${cityName}/?token=${token}`);

  if (!response.ok) {
    throw new Error(`WAQI API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== 'ok') {
    throw new Error(`WAQI API returned error: ${data.data || 'Unknown error'}`);
  }

  const aqiData = data.data;
  const iaqi = aqiData.iaqi || {};
  const time = aqiData.time || {};

  return {
    source: 'waqi',
    city: aqiData.city?.name || CITY_COORDS[cityKey]?.name || cityKey,
    cityKey,
    aqi: aqiData.aqi ?? null,
    aqiCategory: getAQICategory(aqiData.aqi),
    pm25: iaqi.pm25?.v ?? null,
    pm10: iaqi.pm10?.v ?? null,
    co: iaqi.co?.v ?? null,
    no2: iaqi.no2?.v ?? null,
    so2: iaqi.so2?.v ?? null,
    o3: iaqi.o3?.v ?? null,
    timestamp: time.iso || time.s || new Date().toISOString(),
    formattedTime: formatTimestamp(time.iso || time.s),
    station: aqiData.city?.name,
    isModeled: false,
    dataSource: 'WAQI Ground Station Network',
  };
}

/**
 * Fetch AQI for a single city with fallback
 */
export async function fetchCityAQI(cityKey, waqiToken = null) {
  // Try Open-Meteo first (free, no key)
  try {
    return await fetchOpenMeteoAQI(cityKey);
  } catch (openMeteoError) {
    console.warn(`Open-Meteo failed for ${cityKey}:`, openMeteoError.message);

    // Fallback to WAQI if token provided
    if (waqiToken) {
      try {
        return await fetchWAQIAQI(cityKey, waqiToken);
      } catch (waqiError) {
        console.warn(`WAQI failed for ${cityKey}:`, waqiError.message);
        throw new Error(`Both APIs failed for ${cityKey}: Open-Meteo: ${openMeteoError.message}, WAQI: ${waqiError.message}`);
      }
    }

    throw openMeteoError;
  }
}

/**
 * Fetch AQI for all four cities in parallel
 */
export async function fetchAllCitiesAQI(waqiToken = null) {
  const cityKeys = Object.keys(CITY_COORDS);

  const results = await Promise.allSettled(
    cityKeys.map(key => fetchCityAQI(key, waqiToken))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return { success: true, data: result.value };
    } else {
      return {
        success: false,
        cityKey: cityKeys[index],
        error: result.reason.message,
      };
    }
  });
}

/**
 * Get historical data for charts (past 24 hours from Open-Meteo)
 */
export async function fetchHistoricalAQI(cityKey, hours = 24) {
  const coords = CITY_COORDS[cityKey];
  if (!coords) throw new Error(`Unknown city: ${cityKey}`);

  const params = new URLSearchParams({
    latitude: coords.lat.toString(),
    longitude: coords.lon.toString(),
    hourly: 'us_aqi,pm2_5,pm10',
    timezone: 'Asia/Karachi',
    past_days: '1',
    forecast_days: '0',
  });

  const response = await fetch(`${OPEN_METEO_BASE}?${params}`);

  if (!response.ok) {
    throw new Error(`Historical data fetch failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.hourly) {
    throw new Error('No hourly data available');
  }

  // Get last N hours of data
  const { time, us_aqi, pm2_5, pm10 } = data.hourly;
  const startIndex = Math.max(0, time.length - hours);

  return {
    labels: time.slice(startIndex).map(t => {
      const date = new Date(t);
      return date.toLocaleTimeString('en-PK', {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }),
    aqi: us_aqi.slice(startIndex),
    pm25: pm2_5.slice(startIndex),
    pm10: pm10.slice(startIndex),
    rawTimestamps: time.slice(startIndex),
  };
}