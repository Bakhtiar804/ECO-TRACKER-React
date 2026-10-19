// Custom hook for AQI data fetching with caching and error handling
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllCitiesAQI, fetchHistoricalAQI, CITY_COORDS } from '../services/aqiService';
import { REFRESH_INTERVALS } from '../utils/constants';

export function useAQIData(waqiToken = null) {
  const [cityData, setCityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const abortControllerRef = useRef(null);
  const lastFetchRef = useRef(0);

  const fetchData = useCallback(async (isManualRefresh = false) => {
    // Cooldown for manual refresh
    const now = Date.now();
    if (isManualRefresh && now - lastFetchRef.current < REFRESH_INTERVALS.AQI_MANUAL_COOLDOWN_MS) {
      return;
    }
    lastFetchRef.current = now;

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrors({});

    try {
      const results = await fetchAllCitiesAQI(waqiToken);

      const newData = {};
      const newErrors = {};

      results.forEach(result => {
        if (result.success) {
          newData[result.data.cityKey] = result.data;
        } else {
          newErrors[result.cityKey] = result.error;
        }
      });

      setCityData(newData);
      setErrors(newErrors);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error('AQI fetch error:', error);
      setErrors({ global: error.message });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [waqiToken]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(false);
    }, REFRESH_INTERVALS.AQI_AUTO_REFRESH_MS);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refresh = useCallback(() => fetchData(true), [fetchData]);

  const getCityData = useCallback((cityKey) => cityData[cityKey], [cityData]);
  const getCityError = useCallback((cityKey) => errors[cityKey], [errors]);

  return {
    cityData,
    loading,
    errors,
    lastUpdated,
    isRefreshing,
    refresh,
    getCityData,
    getCityError,
  };
}

// Hook for historical data for charts
export function useHistoricalAQI(cityKey, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !cityKey) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    fetchHistoricalAQI(cityKey)
      .then(result => {
        if (mounted) {
          setData(result);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [cityKey, enabled]);

  return { data, loading, error };
}

// Hook for city coordinates
export function useCityCoords(cityKey) {
  return CITY_COORDS[cityKey] || null;
}