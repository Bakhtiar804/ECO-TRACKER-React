// Chart Component - Wrapper for Chart.js with proper cleanup
import { useRef, useEffect, useMemo, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chart.js/auto';
import { RefreshIcon, AlertIcon } from './Icons';

// Register Chart.js components
Chart.register(...registerables);

export function AQIChart({ data, cityName, type = 'line', height = 300 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);

  // Memoize chart config to prevent unnecessary re-renders
  const config = useMemo(() => {
    if (!data || !data.labels || !data.aqi || data.labels.length === 0 || data.aqi.length === 0) return null;

    // Create gradient for area fill
    let gradient = null;
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(2, 132, 199, 0.25)');
        gradient.addColorStop(0.5, 'rgba(2, 132, 199, 0.1)');
        gradient.addColorStop(1, 'rgba(2, 132, 199, 0)');
      }
    }

    return {
      type,
      data: {
        labels: data.labels,
        datasets: [
          {
            label: `${cityName} 24-Hour AQI Trend`,
            data: data.aqi,
            borderColor: '#0284C7',
            backgroundColor: gradient || 'rgba(2, 132, 199, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: '#0284C7',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHitRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleFont: { size: 14, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" },
            bodyFont: { size: 13, family: "'Plus Jakarta Sans', sans-serif" },
            padding: 14,
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
              title: (items) => `${cityName} - ${items[0].label}`,
              label: (context) => `AQI: ${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
              color: '#94A3B8',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
              padding: 8,
            },
            border: { display: false },
          },
          y: {
            beginAtZero: false,
            grid: { 
              color: 'rgba(0, 0, 0, 0.03)',
              drawBorder: false,
            },
            ticks: {
              font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
              color: '#94A3B8',
              padding: 12,
              callback: (value) => value >= 1000 ? (value/1000).toFixed(1)+'k' : value,
            },
            title: {
              display: true,
              text: 'AQI',
              font: { size: 11, weight: '600', family: "'Plus Jakarta Sans', sans-serif", style: 'normal' },
              color: '#94A3B8',
              padding: { bottom: 12 },
            },
            border: { display: false },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart',
        },
        layout: {
          padding: { top: 8, right: 16, bottom: 8, left: 8 },
        },
      },
    };
  }, [data, cityName, type]);

  // Initialize or update chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart
    chartRef.current = new Chart(ctx, config);

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [config, retryCount]);

  // Update chart data when data changes (without destroying)
  useEffect(() => {
    if (chartRef.current && config) {
      chartRef.current.data = config.data;
      chartRef.current.update('none');
    }
  }, [config?.data]);

  if (!config) {
    return (
      <div className="chart-container" style={{ height: `${height}px` }} role="img" aria-label="Chart unavailable">
        <div className="chart-empty-state">
          <AlertIcon size={48} aria-hidden="true" style={{ color: '#94A3B8', marginBottom: '16px' }} />
          <h4 style={{ color: '#64748B', marginBottom: '8px', fontWeight: 600 }}>No Chart Data Available</h4>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '16px', maxWidth: '300px' }}>
            Historical AQI data could not be loaded for {cityName}. This may be due to API limitations.
          </p>
          <button
            className="btn-secondary"
            onClick={() => setRetryCount(c => c + 1)}
            type="button"
            style={{ padding: '10px 20px', fontSize: '0.85rem' }}
          >
            <RefreshIcon size={16} aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container" style={{ height: `${height}px` }} role="img" aria-label={`${cityName} 24-hour AQI trend chart`}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

// Comparison chart for multiple cities
export function ComparisonChart({ cityData, height = 300 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const config = useMemo(() => {
    if (!cityData || Object.keys(cityData).length === 0) return null;

    const validCities = Object.values(cityData).filter(d => d?.data);
    if (validCities.length === 0) return null;

    // For comparison, we'd need historical data for each city
    // This is a simplified version showing current AQI as bars
    const labels = validCities.map(d => d.data.city);
    const aqiValues = validCities.map(d => d.data.aqi ?? 0);
    const categories = validCities.map(d => d.data.aqiCategory?.color || '#0284C7');

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Current AQI',
          data: aqiValues,
          backgroundColor: categories,
          borderColor: categories.map(c => c.replace(')', ', 1)').replace('rgba', 'rgba')),
          borderWidth: 2,
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            titleFont: { size: 14, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" },
            bodyFont: { size: 13, family: "'Plus Jakarta Sans', sans-serif" },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => `AQI: ${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 12, weight: '600', family: "'Plus Jakarta Sans', sans-serif" },
              color: '#0F172A',
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: {
              font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
              color: '#64748B',
            },
            title: {
              display: true,
              text: 'AQI',
              font: { size: 12, weight: '600', family: "'Plus Jakarta Sans', sans-serif" },
              color: '#64748B',
            },
          },
        },
        animation: {
          duration: 750,
          easing: 'easeOutQuart',
        },
      },
    };
  }, [cityData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [config]);

  useEffect(() => {
    if (chartRef.current && config) {
      chartRef.current.data = config.data;
      chartRef.current.update('none');
    }
  }, [config?.data]);

  return (
    <div className="chart-container" style={{ height: `${height}px` }} role="img" aria-label="City AQI comparison chart">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

// CO2 Breakdown Chart (doughnut/pie)
export function CO2BreakdownChart({ breakdown, height = 200 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const config = useMemo(() => {
    if (!breakdown) return null;

    const labels = [];
    const data = [];
    const colors = [];

    if (breakdown.transportKg > 0) {
      labels.push('Transport');
      data.push(breakdown.transportKg);
      colors.push('#0284C7');
    }
    if (breakdown.electricityKg > 0) {
      labels.push('Electricity');
      data.push(breakdown.electricityKg);
      colors.push('#DC2626');
    }
    if (breakdown.wasteKg > 0) {
      labels.push('Waste');
      data.push(breakdown.wasteKg);
      colors.push('#F59E0B');
    }
    if (breakdown.flightsKg > 0) {
      labels.push('Flights');
      data.push(breakdown.flightsKg);
      colors.push('#6366F1');
    }

    if (data.length === 0) return null;

    return {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0,
          borderRadius: 8,
          spacing: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
              color: '#0F172A',
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleFont: { size: 14, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" },
            bodyFont: { size: 13, family: "'Plus Jakarta Sans', sans-serif" },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const pct = ((context.raw / total) * 100).toFixed(1);
                return `${context.label}: ${context.raw.toFixed(1)} kg CO₂e (${pct}%)`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeOutQuart',
        },
      },
    };
  }, [breakdown]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [config]);

  return (
    <div className="chart-container" style={{ height: `${height}px` }} role="img" aria-label="CO2 emissions breakdown by category">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}