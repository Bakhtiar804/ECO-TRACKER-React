// How It Works Component
import { LeafIcon, CarIcon, TreeIcon, CheckIcon } from './Icons';

const steps = [
  {
    number: '01',
    title: 'Select Your City',
    description: 'Choose from Karachi, Lahore, Islamabad, or Peshawar to instantly fetch live AQI levels and modeled air quality data.',
    icon: <LeafIcon size={28} stroke="#0284C7" aria-hidden="true" />,
  },
  {
    number: '02',
    title: 'Input Daily Habits',
    description: 'Fill in your daily travel distance, vehicle type, electricity usage, and waste generation details.',
    icon: <CarIcon size={28} stroke="#38D399" aria-hidden="true" />,
  },
  {
    number: '03',
    title: 'Get Smart Recommendations',
    description: 'Receive personalized eco-tips based on your largest emission sources to lower your footprint effectively.',
    icon: <CheckIcon size={28} stroke="#38D399" aria-hidden="true" />,
  },
];

export function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works" aria-labelledby="how-it-works-heading">
      <div className="section-header">
        <h2 id="how-it-works-heading">How EcoTracker Works</h2>
        <p>Combining real-time modeled air quality data with individual contribution tracking.</p>
      </div>

      <div className="steps-grid">
        {steps.map((step, index) => (
          <article key={index} className="step-card">
            <div className="step-number">{step.number}</div>
            <div style={{ marginBottom: '16px', color: '#0284C7' }} aria-hidden="true">
              {step.icon}
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>

      {/* Additional info */}
      <div style={{ marginTop: '40px', padding: '24px', background: 'var(--card-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-gray)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Data Sources & Transparency</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: '#0284C7' }}>Air Quality Data</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
              <strong>Primary:</strong> Open-Meteo Air Quality API (CAMS Global Atmospheric Composition Forecast)<br />
              <strong>Resolution:</strong> ~45km, hourly updates<br />
              <strong>Type:</strong> Modeled forecast data (not ground station measurements)<br />
              <strong>Coverage:</strong> Global, including all Pakistani cities
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: '#38D399' }}>Emission Factors</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
              <strong>Transport:</strong> UK DEFRA 2023 Conversion Factors<br />
              <strong>Electricity:</strong> IEA/NEPRA Pakistan Grid Average (2023)<br />
              <strong>Waste:</strong> EPA WARM Model / IPCC 2006 Guidelines<br />
              <strong>Flights:</strong> UK DEFRA 2023 with Radiative Forcing (×1.9)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}