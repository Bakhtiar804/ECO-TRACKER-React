// Dashboard Page Component
import { useState, useCallback, useMemo } from 'react';
import { LocationIcon, RefreshIcon, LeafIcon, CarIcon, OxygenIcon, TreeIcon, AlertIcon, CheckIcon } from './Icons';
import { AQICard } from './AQICard';
import { CityComparison } from './CityComparison';
import { AQIChart } from './Charts';
import { useAQIData, useHistoricalAQI } from '../hooks/useAQIData';
import { CITIES } from '../utils/constants';

export function Dashboard() {
  const [selectedCity, setSelectedCity] = useState('karachi');

  // Get WAQI token from environment (for fallback)
  const waqiToken = import.meta.env.VITE_WAQI_TOKEN || null;

  const {
    cityData,
    loading,
    errors,
    lastUpdated,
    isRefreshing,
    refresh,
    getCityData,
    getCityError,
  } = useAQIData(waqiToken);

  // Get data for selected city
  const currentCityData = getCityData(selectedCity);
  const currentCityError = getCityError(selectedCity);

  // Historical data for charts
  const { data: historicalData, loading: histLoading, error: histError } = useHistoricalAQI(selectedCity);

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const selectedCityInfo = CITIES.find(c => c.key === selectedCity);

  // Calculate derived metrics for selected city (like original)
  const derivedMetrics = useMemo(() => {
    if (!currentCityData) return null;
    
    const aqi = currentCityData.aqi ?? 100;
    const pm25 = currentCityData.pm25 ?? 35;
    
    // Estimated vehicles based on city population and AQI
    const cityPopulation = {
      karachi: 20000000,
      lahore: 14000000,
      islamabad: 1200000,
      peshawar: 4000000,
    };
    const baseVehicles = cityPopulation[selectedCity] * 0.12; // ~12% vehicle ownership
    const activeVehicles = Math.round(baseVehicles * (0.7 + (aqi / 500) * 0.3));
    
    // Oxygen deficit calculation
    const treeCoverage = {
      karachi: 4.2,
      lahore: 3.8,
      islamabad: 22.5,
      peshawar: 5.1,
    };
    const oxygenDeficit = Math.round(-(treeCoverage[selectedCity] * 1000 + aqi * 15));
    
    // Tree count estimate
    const treeDensity = {
      karachi: 1.2,
      lahore: 0.9,
      islamabad: 4.5,
      peshawar: 1.5,
    };
    const treeCount = Math.round(treeDensity[selectedCity] * 1000000);
    
    return {
      activeVehicles: (activeVehicles / 1000000).toFixed(1),
      oxygenDeficit,
      treeCount: (treeCount / 1000000).toFixed(1),
      treeCoverage: treeCoverage[selectedCity],
    };
  }, [currentCityData, selectedCity]);

  return (
    <main className="main-container" id="dashboard" role="main">
      {/* Hero Header */}
      <header className="hero-header">
        <span className="badge-pill">
          <LeafIcon size={14} aria-hidden="true" />
          Live City Environmental Intelligence
        </span>
        <h1>Track Local Emissions, <br /><span className="highlight-text">Heal Your Environment.</span></h1>
        <p>Real-time data on air quality, vehicle impact, and tree oxygen deficit across major urban centers.</p>

        {/* City Selector - Improved */}
        <div className="city-selector-wrapper">
          <label id="city-select-label" className="selector-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, color: 'var(--text-slate)', fontSize: '0.95rem' }}>
            <LocationIcon size={20} aria-hidden="true" />
            <span>Select Region</span>
          </label>
          <div className="city-dropdown-wrapper">
            <select
              id="citySelect"
              className="city-dropdown"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-labelledby="city-select-label"
              aria-label="Select city for detailed AQI view"
            >
              {CITIES.map(city => (
                <option key={city.key} value={city.key}>
                  {city.name}, {city.province}
                </option>
              ))}
            </select>
            <LocationIcon size={20} className="dropdown-icon" aria-hidden="true" style={{ color: 'var(--sky-blue)' }} />
          </div>
        </div>
      </header>

      {/* Featured City Card - Changes with selector */}
      {currentCityData && (
        <section className="featured-city-section" aria-labelledby="featured-heading">
          <div className="featured-city-card" style={{ borderLeftColor: currentCityData.aqiCategory?.color || '#0284C7' }}>
            <div className="featured-city-header">
              <div className="featured-city-info">
                <h2 id="featured-heading" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
                  {selectedCityInfo?.name}, {selectedCityInfo?.province}
                </h2>
                <span className="status-badge featured-badge" style={{ 
                  backgroundColor: currentCityData.aqiCategory?.color + '20', 
                  color: currentCityData.aqiCategory?.color,
                  border: `1px solid ${currentCityData.aqiCategory?.color}40`,
                  fontSize: '0.85rem',
                  padding: '6px 14px'
                }}>
                  {currentCityData.aqiCategory?.label || 'Unknown'}
                </span>
              </div>
              <div className="featured-city-aqi">
                <div className="aqi-main-value">
                  <span className="aqi-value" style={{ color: currentCityData.aqiCategory?.color || '#0284C7', fontSize: '4rem' }}>
                    {currentCityData.aqi ?? '—'}
                  </span>
                  <span className="aqi-unit" style={{ fontSize: '1.25rem' }}>AQI</span>
                </div>
                {currentCityData.formattedTime && (
                  <div className="aqi-timestamp" style={{ marginTop: '8px', color: '#94A3B8' }}>
                    <span>Updated: {currentCityData.formattedTime}</span>
                    {currentCityData.isModeled && (
                      <span className="data-source-badge">ⓘ Modeled forecast</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="featured-city-pollutants">
              {currentCityData.pm25 !== null && (
                <div className="pollutant-detail">
                  <div className="pollutant-detail-header">
                    <span className="pollutant-label">PM2.5</span>
                    <span className="pollutant-value">{currentCityData.pm25} µg/m³</span>
                  </div>
                  <div className="pollutant-bar">
                    <div 
                      className="pollutant-bar-fill" 
                      style={{ 
                        width: `${Math.min(currentCityData.pm25 / 150 * 100, 100)}%`,
                        backgroundColor: currentCityData.pm25 <= 15 ? '#00E400' : 
                                       currentCityData.pm25 <= 35 ? '#FFFF00' :
                                       currentCityData.pm25 <= 55 ? '#FF7E00' :
                                       currentCityData.pm25 <= 150 ? '#FF0000' : '#8F3F97'
                      }} 
                    />
                  </div>
                </div>
              )}
              {currentCityData.pm10 !== null && (
                <div className="pollutant-detail">
                  <div className="pollutant-detail-header">
                    <span className="pollutant-label">PM10</span>
                    <span className="pollutant-value">{currentCityData.pm10} µg/m³</span>
                  </div>
                  <div className="pollutant-bar">
                    <div 
                      className="pollutant-bar-fill" 
                      style={{ 
                        width: `${Math.min(currentCityData.pm10 / 250 * 100, 100)}%`,
                        backgroundColor: currentCityData.pm10 <= 50 ? '#00E400' : 
                                       currentCityData.pm10 <= 100 ? '#FFFF00' :
                                       currentCityData.pm10 <= 250 ? '#FF7E00' :
                                       currentCityData.pm10 <= 350 ? '#FF0000' : '#8F3F97'
                      }} 
                    />
                  </div>
                </div>
              )}
              {currentCityData.co !== null && (
                <div className="pollutant-detail">
                  <div className="pollutant-detail-header">
                    <span className="pollutant-label">CO</span>
                    <span className="pollutant-value">{currentCityData.co} µg/m³</span>
                  </div>
                </div>
              )}
              {currentCityData.no2 !== null && (
                <div className="pollutant-detail">
                  <div className="pollutant-detail-header">
                    <span className="pollutant-label">NO₂</span>
                    <span className="pollutant-value">{currentCityData.no2} µg/m³</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {currentCityError && !currentCityData && (
        <section className="featured-city-section">
          <AQICard 
            cityKey={selectedCity}
            data={null}
            error={currentCityError}
            loading={loading}
            onRefresh={handleRefresh}
          />
        </section>
      )}

      {/* 4 Metric Cards Row - Updates with selected city (like original) */}
      {derivedMetrics && (
        <section className="metrics-grid metrics-grid-4" aria-labelledby="city-metrics-heading">
          <h2 id="city-metrics-heading" className="visually-hidden">{selectedCityInfo?.name} Environmental Metrics</h2>
          
          <AQICard
            key="aqi-metric"
            cityKey="aqi-metric"
            data={currentCityData}
            error={currentCityError}
            loading={loading}
            onRefresh={handleRefresh}
            isMetricCard={true}
            metricLabel="Air Quality Index"
            metricIcon={<LeafIcon size={22} stroke="var(--sky-blue)" aria-hidden="true" />}
            metricBg="aqi-bg"
          />
          
          <AQICard
            key="vehicle-metric"
            cityKey="vehicle-metric"
            data={{ 
              aqi: null, 
              customValue: derivedMetrics.activeVehicles + 'M',
              customUnit: 'Daily Active',
              aqiCategory: { label: 'Active', color: '#38D399', class: 'badge-info' }
            }}
            error={null}
            loading={false}
            onRefresh={handleRefresh}
            isMetricCard={true}
            metricLabel="Est. Active Vehicles"
            metricIcon={<CarIcon size={22} stroke="#38D399" aria-hidden="true" />}
            metricBg="vehicle-bg"
          />
          
          <AQICard
            key="oxygen-metric"
            cityKey="oxygen-metric"
            data={{ 
              aqi: null, 
              customValue: derivedMetrics.oxygenDeficit.toLocaleString(),
              customUnit: 'Tons O₂/Day',
              aqiCategory: { label: 'High Deficit', color: '#DC2626', class: 'badge-danger' }
            }}
            error={null}
            loading={false}
            onRefresh={handleRefresh}
            isMetricCard={true}
            metricLabel="Daily Oxygen Gap"
            metricIcon={<OxygenIcon size={22} stroke="#DC2626" aria-hidden="true" />}
            metricBg="oxygen-bg"
          />
          
          <AQICard
            key="tree-metric"
            cityKey="tree-metric"
            data={{ 
              aqi: null, 
              customValue: derivedMetrics.treeCount + 'M',
              customUnit: 'Trees',
              aqiCategory: { label: derivedMetrics.treeCoverage + '% Coverage', color: '#0284C7', class: 'badge-info' }
            }}
            error={null}
            loading={false}
            onRefresh={handleRefresh}
            isMetricCard={true}
            metricLabel="Green Canopy"
            metricIcon={<TreeIcon size={22} stroke="#0284C7" aria-hidden="true" />}
            metricBg="tree-bg"
          />
        </section>
      )}

      {/* All Cities Comparison Grid */}
      <section className="comparison-section" aria-labelledby="comparison-heading">
        <h2 id="comparison-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>All Cities Comparison</h2>
        <CityComparison cityData={cityData} />
      </section>

      {/* Dashboard Dual Grid - Chart + Insights */}
      <section className="dashboard-dual-grid" aria-labelledby="dashboard-heading">
        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-card-header">
            <div>
              <h2>24-Hour AQI Trend</h2>
              <p className="sub-text">Modeled forecast data for {selectedCityInfo?.name}</p>
            </div>
            <div className="live-indicator" aria-live="polite">
              <span className="dot" aria-hidden="true"></span>
              {histLoading ? 'Loading...' : histError ? 'Error' : 'Live Data'}
            </div>
          </div>

          {historicalData ? (
            <AQIChart 
              key={selectedCity}
              data={historicalData} 
              cityName={selectedCityInfo?.name} 
            />
          ) : histLoading ? (
            <div className="chart-placeholder" style={{ height: '300px' }}>
              <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
          ) : (
            <div className="chart-placeholder" style={{ height: '300px' }}>
              <div className="chart-empty-state">
                <AlertIcon size={48} aria-hidden="true" style={{ color: '#94A3B8', marginBottom: '16px' }} />
                <h4 style={{ color: '#64748B', marginBottom: '8px', fontWeight: 600 }}>Historical Data Unavailable</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '16px', maxWidth: '300px' }}>
                  The API doesn't provide historical data for {selectedCityInfo?.name}. Showing current reading only.
                </p>
                <button
                  className="btn-secondary"
                  onClick={handleRefresh}
                  type="button"
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  <RefreshIcon size={16} aria-hidden="true" />
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="insights-card">
          <h3>City Insights Summary</h3>
          <ul className="insights-list">
            <li>
              <div className="insight-icon">
                <AlertIcon size={18} aria-hidden="true" />
              </div>
              <div>
                <strong>Peak Pollution Hours</strong>
                <p>8:00 AM - 11:00 AM due to office commutes.</p>
              </div>
            </li>
            <li>
              <div className="insight-icon">
                <CheckIcon size={18} aria-hidden="true" />
              </div>
              <div>
                <strong>Primary Pollutant</strong>
                <p>Vehicular exhaust accounts for ~60% of emissions.</p>
              </div>
            </li>
            <li>
              <div className="insight-icon">
                <LeafIcon size={18} aria-hidden="true" />
              </div>
              <div>
                <strong>Action Needed</strong>
                <p>Urban afforestation and public transport investment critical.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Last Updated Footer - Center Aligned Refresh */}
      {lastUpdated && (
        <div className="footer-update-bar">
          <div className="footer-update-main">
            <div className="update-time">
              <RefreshIcon size={16} aria-hidden="true" />
              <span>Last updated: {new Date(lastUpdated).toLocaleTimeString('en-PK', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: 'Asia/Karachi',
              })}</span>
            </div>
            <button
              className="btn-refresh-main"
              onClick={handleRefresh}
              disabled={isRefreshing}
              type="button"
              aria-label="Refresh all city data"
            >
              <RefreshIcon size={16} aria-hidden="true" style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh All Cities'}</span>
            </button>
          </div>
          <p className="footer-update-source">
            Data source: Open-Meteo CAMS Global Atmospheric Composition Forecast (45km resolution, modeled data)
          </p>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </main>
  );
}