// AQI Card Component - Displays air quality data for a city
import { ClockIcon, AlertIcon, InfoIcon, CheckIcon, AQIIcon } from './Icons';
import { getAQICategory } from '../services/aqiService';

export function AQICard({ 
  cityKey, 
  data, 
  error, 
  loading, 
  onRefresh, 
  compact = false,
  isMetricCard = false,
  metricLabel,
  metricIcon,
  metricBg,
  customValue,
  customUnit,
}) {
  if (loading) {
    return <AQICardSkeleton compact={compact} />;
  }

  if (error) {
    return <AQICardError error={error} onRetry={onRefresh} compact={compact} />;
  }

  if (!data) {
    return <AQICardEmpty compact={compact} />;
  }

  const category = data.aqiCategory || getAQICategory(data.aqi);
  const aqiValue = data.customValue ?? data.aqi ?? '—';
  const pm25 = data.pm25 ?? null;
  const pm10 = data.pm10 ?? null;
  const co = data.co ?? null;
  const no2 = data.no2 ?? null;
  const so2 = data.so2 ?? null;
  const o3 = data.o3 ?? null;

  const cardClass = compact ? 'aqi-card-compact' : '';
  const bgColor = category?.color || '#64748B';
  const iconBgClass = metricBg || 'aqi-bg';
  const displayIcon = metricIcon || <AQIIcon size={22} stroke={bgColor} />;
  const displayLabel = metricLabel || 'Air Quality Index (AQI)';
  const displayUnit = customUnit || 'AQI';

  return (
    <article 
      className={`metric-card aqi-card ${cardClass} ${isMetricCard ? 'metric-display-card' : ''}`} 
      aria-labelledby={`aqi-title-${cityKey}`}
      style={{ 
        borderLeft: `4px solid ${bgColor}`,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}
    >
      {/* Subtle background accent */}
      <div 
        className="aqi-card-accent" 
        aria-hidden="true"
        style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          width: '80px', 
          height: '80px', 
          background: `radial-gradient(circle, ${bgColor}20 0%, transparent 70%)`,
          borderRadius: '50%',
          transform: 'translate(30px, -30px)',
          pointerEvents: 'none'
        }} 
      />

      <div className="card-header">
        <div className={`card-icon ${iconBgClass}`} aria-hidden="true">
          {displayIcon}
        </div>
        <span
          id={`aqi-badge-${cityKey}`}
          className={`status-badge ${category?.class || 'badge-warning'} ${isMetricCard ? 'featured-badge' : ''}`}
          aria-live="polite"
          style={{ 
            backgroundColor: category?.color + '20', 
            color: category?.color,
            border: `1px solid ${category?.color}40`
          }}
        >
          {category?.label || 'Unknown'}
        </span>
      </div>

      <div className="card-body">
        <span className="card-title" id={`aqi-title-${cityKey}`}>{displayLabel}</span>

        <div className="aqi-card-content">
          <div className="aqi-main-value">
            <span
              className="aqi-value"
              style={{ color: bgColor }}
              aria-label={`Value: ${aqiValue}`}
            >
              {aqiValue}
            </span>
            <span className="aqi-unit">{displayUnit}</span>
          </div>

          {!isMetricCard && category && (
            <div
              className="aqi-category"
              style={{ 
                backgroundColor: category.color + '15', 
                color: category.color,
                border: `1px solid ${category.color}30`
              }}
              role="status"
              aria-label={`Air quality: ${category.label}`}
            >
              <CheckIcon size={14} stroke={category.color} aria-hidden="true" />
              {category.label}
            </div>
          )}

          {!isMetricCard && (
            <div className="aqi-pollutants" role="list" aria-label="Pollutant concentrations">
              {pm25 !== null && (
                <div className="pollutant-item" role="listitem">
                  <span className="pollutant-label">PM2.5</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'center' }}>
                    <span className="pollutant-value">{pm25}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>µg/m³</span>
                  </div>
                  <div className="pollutant-bar">
                    <div 
                      className="pollutant-bar-fill" 
                      style={{ 
                        width: `${Math.min(pm25 / 150 * 100, 100)}%`,
                        backgroundColor: getPollutantColor('pm25', pm25)
                      }} 
                    />
                  </div>
                </div>
              )}
              {pm10 !== null && (
                <div className="pollutant-item" role="listitem">
                  <span className="pollutant-label">PM10</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'center' }}>
                    <span className="pollutant-value">{pm10}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>µg/m³</span>
                  </div>
                  <div className="pollutant-bar">
                    <div 
                      className="pollutant-bar-fill" 
                      style={{ 
                        width: `${Math.min(pm10 / 250 * 100, 100)}%`,
                        backgroundColor: getPollutantColor('pm10', pm10)
                      }} 
                    />
                  </div>
                </div>
              )}
              {co !== null && (
                <div className="pollutant-item" role="listitem">
                  <span className="pollutant-label">CO</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'center' }}>
                    <span className="pollutant-value">{co}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>µg/m³</span>
                  </div>
                </div>
              )}
              {no2 !== null && (
                <div className="pollutant-item" role="listitem">
                  <span className="pollutant-label">NO₂</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'center' }}>
                    <span className="pollutant-value">{no2}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>µg/m³</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {data.formattedTime && !isMetricCard && (
            <div className="aqi-timestamp" aria-label={`Last updated: ${data.formattedTime}`} style={{ justifyContent: 'center' }}>
              <ClockIcon size={12} aria-hidden="true" style={{ color: '#94A3B8' }} />
              <span>Updated: {data.formattedTime}</span>
              {data.isModeled && (
                <span 
                  className="data-source-badge" 
                  aria-label="Modeled forecast data"
                  style={{ 
                    fontSize: '0.65rem', 
                    padding: '2px 8px', 
                    background: '#F1F5F9', 
                    borderRadius: 'var(--radius-pill)',
                    color: '#64748B',
                    border: '1px solid var(--border-gray)'
                  }}
                >
                  ⓘ Modeled forecast
                </span>
              )}
            </div>
          )}

          {!isMetricCard && (
            <div className="aqi-source" style={{ 
              marginTop: '12px', 
              paddingTop: '12px', 
              borderTop: '1px solid var(--border-gray)',
              fontSize: '0.7rem',
              color: '#94A3B8'
            }}>
              Source: {data.dataSource || 'Open-Meteo CAMS Global'}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function getPollutantColor(type, value) {
  if (type === 'pm25') {
    if (value <= 15) return '#00E400';
    if (value <= 35) return '#FFFF00';
    if (value <= 55) return '#FF7E00';
    if (value <= 150) return '#FF0000';
    return '#8F3F97';
  }
  if (type === 'pm10') {
    if (value <= 50) return '#00E400';
    if (value <= 100) return '#FFFF00';
    if (value <= 250) return '#FF7E00';
    if (value <= 350) return '#FF0000';
    return '#8F3F97';
  }
  return '#0284C7';
}

// Skeleton loading state
function AQICardSkeleton({ compact }) {
  return (
    <article className={`metric-card ${compact ? 'aqi-card-compact' : ''}`} aria-hidden="true" style={{ borderLeft: '4px solid var(--border-gray)', textAlign: 'center' }}>
      <div className="card-header">
        <div className="card-icon aqi-bg skeleton" style={{ width: 44, height: 44, margin: '0 auto' }} />
        <div className="skeleton skeleton-badge" style={{ margin: '0 auto' }} />
      </div>
      <div className="card-body">
        <div className="skeleton skeleton-text" style={{ width: '60%', margin: '0 auto' }} />
        <div className="skeleton skeleton-value" style={{ width: '40%', height: '3.5rem', margin: '8px auto 0' }} />
        <div className="skeleton skeleton-badge" style={{ width: '100px', margin: '12px auto 0' }} />
        <div className="skeleton skeleton-text" style={{ width: '80%', margin: '16px auto 0', height: '0.75rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%', margin: '8px auto 0', height: '0.75rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%', margin: '8px auto 0', height: '0.75rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '40%', margin: '16px auto 0', height: '0.65rem' }} />
      </div>
    </article>
  );
}

// Error state
function AQICardError({ error, onRetry, compact }) {
  return (
    <article className={`metric-card ${compact ? 'aqi-card-compact' : ''}`} style={{ borderLeft: '4px solid #DC2626', textAlign: 'center' }}>
      <div className="error-state" role="alert">
        <AlertIcon size={32} aria-hidden="true" />
        <p>Failed to load AQI data</p>
        <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>{error}</p>
        <button
          className="btn-secondary"
          onClick={onRetry}
          type="button"
          style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.85rem' }}
        >
          Try Again
        </button>
      </div>
    </article>
  );
}

// Empty state
function AQICardEmpty({ compact }) {
  return (
    <article className={`metric-card ${compact ? 'aqi-card-compact' : ''}`} style={{ borderLeft: '4px solid var(--border-gray)', textAlign: 'center' }}>
      <div className="error-state" style={{ color: '#94A3B8' }}>
        <InfoIcon size={32} aria-hidden="true" />
        <p>No data available</p>
        <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Click refresh to retry</p>
      </div>
    </article>
  );
}