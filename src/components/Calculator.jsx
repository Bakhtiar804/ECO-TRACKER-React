// Calculator Page Component
import { useCallback, useMemo } from 'react';
import { LeafIcon, ClockIcon, CheckCircleIcon, GlobeIcon, BookIcon, LinkIcon, CarIcon, ElectricIcon, WasteIcon } from './Icons';
import { CalculatorForm } from './CalculatorForm';
import { CalculatorResults } from './CalculatorResults';
import { useCO2Calculator } from '../hooks/useCO2Calculator';

const DATA_SOURCES = [
  {
    category: 'Transport',
    source: 'UK DEFRA 2023 Conversion Factors',
    description: 'Average vehicle efficiency by fuel type (petrol, diesel, hybrid, electric)',
    url: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting',
    icon: CarIcon,
    color: '#0284C7',
  },
  {
    category: 'Electricity',
    source: 'IEA / NEPRA Pakistan 2023',
    description: 'Pakistan national grid average emission factor',
    value: '0.456 kg CO₂e/kWh',
    url: 'https://www.iea.org/',
    icon: ElectricIcon,
    color: '#DC2626',
  },
  {
    category: 'Waste',
    source: 'EPA WARM Model v15 / IPCC 2006',
    description: 'Landfill disposal emissions for mixed municipal waste',
    url: 'https://www.epa.gov/warm',
    icon: WasteIcon,
    color: '#F59E0B',
  },
  {
    category: 'Flights',
    source: 'UK DEFRA 2023 + ICAO Radiative Forcing',
    description: 'Aviation emissions with ×1.9 multiplier for non-CO₂ effects',
    url: 'https://www.icao.int/',
    icon: GlobeIcon,
    color: '#6366F1',
  },
];

export function Calculator() {
  const {
    inputs,
    results,
    showResults,
    errors,
    touched,
    calculating,
    calculate,
    reset,
    setShowResults,
    handleTransportChange,
    handleElectricityChange,
    handleWasteChange,
    handleFlightChange,
    emissionSources,
  } = useCO2Calculator();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    calculate();
  }, [calculate]);

  const handleRecalculate = useCallback(() => {
    setShowResults(false);
    const form = document.getElementById('footprintForm');
    if (form) form.scrollIntoView({ behavior: 'smooth' });
  }, [setShowResults]);

  // Live preview calculations for immediate feedback
  const livePreview = useMemo(() => {
    const transport = inputs.transport.distanceKm ? parseFloat(inputs.transport.distanceKm) : 0;
    const electricity = inputs.electricity.monthlyKwh ? parseFloat(inputs.electricity.monthlyKwh) : 0;
    const waste = inputs.waste.plasticBags + inputs.waste.wasteBins + inputs.waste.recyclingBins;
    const flights = inputs.flights.distanceKm ? parseFloat(inputs.flights.distanceKm) : 0;

    const hasAnyInput = transport > 0 || electricity > 0 || waste > 0 || flights > 0;
    return { hasAnyInput, transport, electricity, waste, flights };
  }, [inputs]);

  return (
    <section className="calculator-section" id="calculator" aria-labelledby="calculator-heading">
      {/* Hero Header */}
      <div className="calculator-hero">
        <div className="calculator-hero-content">
          <div className="calculator-hero-badge">
            <LeafIcon size={16} aria-hidden="true" />
            <span>Personal Carbon Footprint Calculator</span>
          </div>
          <h2 id="calculator-heading">Calculate Your Personal Carbon Impact</h2>
          <p>Enter your daily activities to see your estimated annual CO₂e emissions with a detailed breakdown and personalized reduction tips.</p>

          {/* Live Preview Bar */}
          {livePreview.hasAnyInput && !showResults && (
            <div className="live-preview-bar">
              <span className="live-preview-label">Live Preview:</span>
              <span className="live-preview-value">~{estimateAnnualCO2(livePreview).toFixed(1)} tonnes CO₂e/year</span>
              <span className="live-preview-hint">Updates as you type — click Calculate for detailed results</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="calculator-quick-stats" aria-label="Quick reference values">
          <div className="quick-stat">
            <span className="quick-stat-value">0.456</span>
            <span className="quick-stat-label">kg CO₂e/kWh (PK Grid)</span>
          </div>
          <div className="quick-stat-divider" aria-hidden="true"></div>
          <div className="quick-stat">
            <span className="quick-stat-value">×1.9</span>
            <span className="quick-stat-label">Flight RF Multiplier</span>
          </div>
          <div className="quick-stat-divider" aria-hidden="true"></div>
          <div className="quick-stat">
            <span className="quick-stat-value">DEFRA 2023</span>
            <span className="quick-stat-label">Emission Factors</span>
          </div>
        </div>
      </div>

      {/* Main Calculator Card */}
      <div className="calculator-main-card">
        {!showResults ? (
          <CalculatorForm
            id="footprintForm"
            inputs={inputs}
            errors={errors}
            touched={touched}
            onTransportChange={handleTransportChange}
            onElectricityChange={handleElectricityChange}
            onWasteChange={handleWasteChange}
            onFlightChange={handleFlightChange}
            onCalculate={handleSubmit}
            calculating={calculating}
          />
        ) : (
          <CalculatorResults
            results={results}
            onRecalculate={handleRecalculate}
            onReset={reset}
            emissionSources={emissionSources}
          />
        )}
      </div>

      {/* Data Sources & Transparency - Attractive Section */}
      <section className="transparency-section" aria-labelledby="transparency-heading">
        <header className="transparency-header">
          <div className="transparency-icon">
            <BookIcon size={24} stroke="var(--sky-blue)" aria-hidden="true" />
          </div>
          <div>
            <h3 id="transparency-heading">Data Sources & Transparency</h3>
            <p>Every calculation is backed by internationally recognized emission factors. Here's exactly what we use and why.</p>
          </div>
        </header>

        <div className="transparency-grid">
          {DATA_SOURCES.map((source, index) => (
            <article key={index} className="source-card">
              <div className="source-icon" style={{ background: source.color + '15', borderColor: source.color + '40' }}>
                <source.icon size={20} stroke={source.color} aria-hidden="true" />
              </div>
              <div className="source-content">
                <div className="source-category" style={{ color: source.color }}>
                  {source.category}
                </div>
                <h4 className="source-title">{source.source}</h4>

                <p className="source-description">{source.description}</p>

                <div  style={{display: 'flex' , flexDirection : 'column'}} >

                  {source.value && (
                    <span className="source-value">{source.value}</span>
                  )}
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                    aria-label={`View ${source.source} documentation`}
                  >
                    <LinkIcon size={14} aria-hidden="true" />
                    View Source
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Methodology & Assumptions */}
        <details className="methodology-details">
          <summary>
            <div className="methodology-summary">
              <CheckCircleIcon size={20} stroke="#38D399" aria-hidden="true" />
              <span>Methodology, Assumptions & Limitations</span>
            </div>
            <span className="details-chevron" aria-hidden="true">▼</span>
          </summary>
          <div className="methodology-content">
            <div className="methodology-section">
              <h5>Calculation Approach</h5>
              <ul>
                <li><strong>Activity-based:</strong> Emissions = Activity Data × Emission Factor</li>
                <li><strong>Annualized:</strong> Daily/weekly/monthly inputs converted to annual tonnes CO₂e</li>
                <li><strong>Scope 1 & 2:</strong> Direct fuel combustion + purchased electricity</li>
                <li><strong>Scope 3 (partial):</strong> Waste disposal + air travel (optional)</li>
              </ul>
            </div>
            <div className="methodology-section">
              <h5>Key Assumptions</h5>
              <ul>
                <li>Vehicle factors based on average fleet efficiency — actual varies by model, age, maintenance, driving style</li>
                <li>Pakistan electricity factor (0.456 kg CO₂e/kWh) is national annual average — regional/seasonal mix may differ</li>
                <li>Waste assumes mixed municipal waste to sanitary landfill without gas capture — composting/recycling reduces impact significantly</li>
                <li>Flight radiative forcing (×1.9) accounts for contrails, NOx, water vapor at altitude per ICAO</li>
                <li>All values are <strong>estimates for awareness</strong> — not for regulatory compliance or carbon trading</li>
              </ul>
            </div>
            <div className="methodology-section">
              <h5>What's Not Included</h5>
              <ul>
                <li>Food/diet emissions, goods/services consumption, water usage</li>
                <li>Indirect emissions from manufacturing, infrastructure, land use change</li>
                <li>Carbon sequestration from personal tree planting or green investments</li>
              </ul>
            </div>
            <div className="methodology-disclaimer">
              <p><strong>Transparency Promise:</strong> We show our work. Every factor, source, and assumption is documented above. If you find an error or have better data, please let us know.</p>
            </div>
          </div>
        </details>
      </section>
    </section>
  );
}

// Simple estimation for live preview
function estimateAnnualCO2({ transport, electricity, waste, flights }) {
  let total = 0;
  // Transport: rough average 0.15 kg/km * distance * 5 days * 52 weeks
  total += transport * 0.15 * 5 * 52 / 1000;
  // Electricity: 0.456 kg/kWh * monthly * 12
  total += electricity * 0.456 * 12 / 1000;
  // Waste: rough 2 kg/week * 52
  total += waste * 2 * 52 / 1000;
  // Flights: rough 0.15 kg/km * distance
  total += flights * 0.15 / 1000;
  return total;
}