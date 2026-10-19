// City Comparison Component - Compares AQI across all four cities
import { AQIIcon, ClockIcon } from './Icons';
import { getAQICategory } from '../services/aqiService';
import { CITIES } from '../utils/constants';

export function CityComparison({ cityData }) {
  // Filter cities with successful data
  const validCities = CITIES
    .map(city => cityData[city.key])
    .filter(Boolean);

  if (validCities.length === 0) {
    return (
      <section className="comparison-section" aria-labelledby="comparison-title">
        <div className="error-state" style={{ padding: '40px 20px' }}>
          <ClockIcon size={48} aria-hidden="true" />
          <p>No city data available for comparison</p>
        </div>
      </section>
    );
  }

  return (
    <section className="comparison-section" aria-labelledby="comparison-title">
      <h2 id="comparison-title" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>
        City Comparison
      </h2>

      <div className="comparison-grid" role="list" aria-label="City air quality comparison">
        {validCities.map(data => {
          const category = data.aqiCategory || getAQICategory(data.aqi);
          const cityInfo = CITIES.find(c => c.key === data.cityKey);

          return (
            <article
              key={data.cityKey}
              className="comparison-card"
              role="listitem"
              aria-label={`${cityInfo?.name}: AQI ${data.aqi}`}
            >
              <div className="comparison-card-header">
                <span className="comparison-city-name">{cityInfo?.name}</span>
                <span
                  className="comparison-aqi-value"
                  style={{ color: category?.color || 'var(--text-slate)' }}
                >
                  {data.aqi ?? '—'}
                </span>
              </div>

              <div className="comparison-pollutants">
                {data.pm25 !== undefined && data.pm25 !== null && (
                  <div className="comparison-pollutant">
                    <span style={{ fontWeight: 600 }}>PM2.5</span>
                    <span>{data.pm25} µg/m³</span>
                  </div>
                )}
                {data.pm10 !== undefined && data.pm10 !== null && (
                  <div className="comparison-pollutant">
                    <span style={{ fontWeight: 600 }}>PM10</span>
                    <span>{data.pm10} µg/m³</span>
                  </div>
                )}
              </div>

              {category && (
                <div
                  className="status-badge"
                  style={{
                    marginTop: '12px',
                    backgroundColor: category.color + '20',
                    color: category.color,
                    display: 'inline-block',
                    fontSize: '0.7rem',
                  }}
                >
                  {category.label}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {validCities.length < 4 && (
        <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#94A3B8', textAlign: 'center' }}>
          Showing {validCities.length} of 4 cities. Some data may be unavailable.
        </p>
      )}
    </section>
  );
}