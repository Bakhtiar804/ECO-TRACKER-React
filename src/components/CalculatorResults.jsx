// Calculator Results Component - Attractive Modern UI
import { useEffect, useRef } from 'react';
import { 
  CheckIcon, ArrowRightIcon, LeafIcon, CarIcon, ElectricIcon, WasteIcon, 
  ArrowRightIcon as FlightIcon, CheckCircleIcon, TrendingDownIcon, ShareIcon, DownloadIcon
} from './Icons';
import { CO2BreakdownChart } from './Charts';

export function CalculatorResults({ results, onRecalculate, onReset, emissionSources }) {
  if (!results) return null;

  const { totals, breakdown, percentages, suggestions } = results;
  const chartRef = useRef(null);

  // Always show all categories, even if 0
  const allCategories = [
    { 
      key: 'transportKg', 
      label: 'Transport', 
      icon: <CarIcon size={20} stroke="#0284C7" aria-hidden="true" />, 
      color: '#0284C7', 
      bg: '#0284C715',
      border: '#0284C740',
      value: breakdown.transportKg ?? 0, 
      pct: percentages.transport ?? 0,
      unit: 'kg CO₂e/yr'
    },
    { 
      key: 'electricityKg', 
      label: 'Electricity', 
      icon: <ElectricIcon size={20} stroke="#DC2626" aria-hidden="true" />, 
      color: '#DC2626', 
      bg: '#DC262615',
      border: '#DC262640',
      value: breakdown.electricityKg ?? 0, 
      pct: percentages.electricity ?? 0,
      unit: 'kg CO₂e/yr'
    },
    { 
      key: 'wasteKg', 
      label: 'Waste', 
      icon: <WasteIcon size={20} stroke="#F59E0B" aria-hidden="true" />, 
      color: '#F59E0B', 
      bg: '#F59E0B15',
      border: '#F59E0B40',
      value: breakdown.wasteKg ?? 0, 
      pct: percentages.waste ?? 0,
      unit: 'kg CO₂e/yr'
    },
    { 
      key: 'flightsKg', 
      label: 'Flights', 
      icon: <FlightIcon size={20} stroke="#6366F1" aria-hidden="true" />, 
      color: '#6366F1', 
      bg: '#6366F115',
      border: '#6366F140',
      value: breakdown.flightsKg ?? 0, 
      pct: percentages.flights ?? 0,
      unit: 'kg CO₂e/yr'
    },
  ];

  const categories = allCategories.filter(c => c.value > 0);
  const primaryCategory = categories.length > 0 ? categories.reduce((a, b) => a.value > b.value ? a : b) : null;
  const totalTonnes = totals.annualTonnes;
  const dailyKg = totals.dailyKg;

  // Animate numbers on mount
  useEffect(() => {
    const animateValue = (element, start, end, duration) => {
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = (start + (end - start) * eased).toFixed(end % 1 !== 0 ? 2 : 1);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    const totalEl = document.querySelector('[data-animate="total"]');
    const dailyEl = document.querySelector('[data-animate="daily"]');
    if (totalEl) animateValue(totalEl, 0, totalTonnes, 1200);
    if (dailyEl) animateValue(dailyEl, 0, dailyKg, 1000);
  }, [totalTonnes, dailyKg]);

  return (
    <section className="results-panel" aria-labelledby="results-heading" role="region">
      {/* Header with Total */}
      <header className="results-header">
        <div className="results-header-left">
          <div className="results-badge">
            <LeafIcon size={18} stroke="#38D399" aria-hidden="true" />
            <span>Your Carbon Footprint</span>
          </div>
          <h3 id="results-heading">Annual Emissions Estimate</h3>
          <p className="results-subtext">Based on your inputs · Calculated just now</p>
        </div>
        <div className="results-total-card">
          <div className="total-main">
            <span className="total-label">Total Annual</span>
            <div className="total-value-row">
              <span className="total-value" data-animate="total">{totalTonnes.toFixed(2)}</span>
              <span className="total-unit">tonnes CO₂e/year</span>
            </div>
          </div>
          <div className="total-daily" data-animate="daily">
            <span className="daily-value">{dailyKg.toFixed(2)}</span>
            <span className="daily-unit">kg CO₂e/day</span>
          </div>
          {primaryCategory && (
            <div className="primary-source" style={{ borderColor: primaryCategory.color }}>
              <span className="primary-label">Largest Source</span>
              <span className="primary-name" style={{ color: primaryCategory.color }}>
                {primaryCategory.label} ({primaryCategory.pct.toFixed(0)}%)
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Quick Comparison Context */}
      <div className="results-context">
        <div className="context-item">
          <span className="context-icon" style={{ background: '#38D39915', color: '#38D399' }}>
            <TrendingDownIcon size={16} aria-hidden="true" />
          </span>
          <div>
            <span className="context-value">{getComparisonText(totalTonnes)}</span>
            <span className="context-label">vs. Pakistan average (~1.5 t/yr)</span>
          </div>
        </div>
        <div className="context-divider" aria-hidden="true"></div>
        <div className="context-item">
          <span className="context-icon" style={{ background: '#0284C715', color: '#0284C7' }}>
            <LeafIcon size={16} aria-hidden="true" />
          </span>
          <div>
            <span className="context-value">{getTreeEquivalent(totalTonnes)}</span>
            <span className="context-label">trees needed to offset annually</span>
          </div>
        </div>
      </div>

      {/* Chart + Breakdown */}
      <div className="results-grid">
        {/* Chart */}
        <div className="results-chart-wrapper">
          <div className="chart-header">
            <h4>Emissions Breakdown</h4>
            <div className="chart-actions">
              <button className="chart-action-btn" aria-label="Download chart" title="Download chart">
                <DownloadIcon size={16} aria-hidden="true" />
              </button>
              <button className="chart-action-btn" aria-label="Share results" title="Share results">
                <ShareIcon size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="chart-container" ref={chartRef} style={{ height: '300px' }}>
            <CO2BreakdownChart breakdown={breakdown} height={300} />
          </div>
          {/* Legend */}
          <div className="chart-legend">
            {allCategories.map(cat => (
              <div key={cat.key} className="legend-item" style={{ opacity: cat.value > 0 ? 1 : 0.5 }}>
                <span className="legend-color" style={{ background: cat.color }} />
                <span className="legend-label">{cat.label}</span>
                <span className="legend-value">{cat.value.toFixed(1)} kg ({cat.pct.toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Cards */}
        <div className="results-breakdown" role="list" aria-label="Emissions by category">
          {allCategories.map((cat, index) => (
            <article 
              key={cat.key} 
              role="listitem" 
              className="breakdown-card"
              style={{ 
                borderLeftColor: cat.color,
                background: cat.bg,
                borderColor: cat.border,
                animationDelay: `${index * 100}ms`,
                opacity: cat.value > 0 ? 1 : 0.6
              }}
            >
              <div className="breakdown-header">
                <div className="breakdown-icon" style={{ background: cat.bg, borderColor: cat.border }}>
                  {cat.icon}
                </div>
                <div className="breakdown-info">
                  <h5>{cat.label}</h5>
                  <span className="breakdown-pct">{cat.pct.toFixed(1)}% of total</span>
                </div>
              </div>
              <div className="breakdown-value-row">
                <span className="breakdown-value" style={{ color: cat.color }}>
                  {cat.value.toFixed(1)}
                </span>
                <span className="breakdown-unit">{cat.unit}</span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-bar-fill" 
                  style={{ 
                    background: cat.color,
                    width: cat.value > 0 ? `${cat.pct}%` : '0%'
                  }}
                />
              </div>
              {cat.value === 0 && (
                <p className="breakdown-empty">No data entered for this category</p>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <section className="results-suggestions" aria-labelledby="suggestions-heading">
          <header className="suggestions-header">
            <div className="suggestions-icon">
              <CheckCircleIcon size={20} stroke="#38D399" aria-hidden="true" />
            </div>
            <div>
              <h4 id="suggestions-heading">Personalized Recommendations</h4>
              <p>Based on your largest emission sources — start with the biggest impact</p>
            </div>
          </header>
          <ul className="suggestions-grid" role="list">
            {suggestions.map((suggestion, index) => (
              <li key={index} role="listitem" className="suggestion-card" style={{ animationDelay: `${index * 80}ms` }}>
                <div className="suggestion-number" style={{ background: primaryCategory?.color || '#38D399' }}>
                  {index + 1}
                </div>
                <div className="suggestion-content">
                  <p>{suggestion}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Actions */}
      <div className="results-actions">
        <button
          type="button"
          className="btn-primary btn-large"
          onClick={onRecalculate}
          aria-label="Recalculate with new inputs"
        >
          <ArrowRightIcon size={18} aria-hidden="true" />
          Recalculate
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onReset}
          aria-label="Reset calculator to defaults"
        >
          <LeafIcon size={18} aria-hidden="true" />
          Start Over
        </button>
        {/* <button
          type="button"
          className="btn-ghost"
          onClick={() => window.print()}
          aria-label="Print or save as PDF"
        >
          <DownloadIcon size={18} aria-hidden="true" />
          Save as PDF
        </button> */}
      </div>
    </section>
  );
}

function getComparisonText(tonnes) {
  const pakAvg = 1.5;
  if (tonnes < pakAvg * 0.5) return 'Well below average';
  if (tonnes < pakAvg * 0.8) return 'Below average';
  if (tonnes < pakAvg * 1.2) return 'Around average';
  if (tonnes < pakAvg * 2) return 'Above average';
  return 'Well above average';
}

function getTreeEquivalent(tonnes) {
  // ~21 kg CO₂/year per mature tree
  return Math.round(tonnes * 1000 / 21);
}