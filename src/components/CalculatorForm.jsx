// Calculator Form Component - Attractive Modern UI
import { useState } from 'react';
import { 
  CarIcon, ElectricIcon, WasteIcon, ArrowRightIcon, InfoIcon, LeafIcon, 
  ZapIcon, RecycleIcon, PlaneIcon, CheckIcon 
} from './Icons';
import {
  VEHICLE_TYPES,
  CAR_FUEL_TYPES,
  BUS_TYPES,
  TRAIN_TYPES,
  FLIGHT_TYPES,
} from '../utils/constants';

export function CalculatorForm({
  inputs,
  errors,
  touched,
  onTransportChange,
  onElectricityChange,
  onWasteChange,
  onFlightChange,
  onCalculate,
  calculating,
}) {
  const [showFlights, setShowFlights] = useState(false);
  const [showTransport, setShowTransport] = useState(true);
  const [showElectricity, setShowElectricity] = useState(true);
  const [showWaste, setShowWaste] = useState(true);
  const [showHelp, setShowHelp] = useState({});

  const getFuelOptions = (vehicleType) => {
    switch (vehicleType) {
      case 'car': return CAR_FUEL_TYPES;
      case 'bus': return BUS_TYPES;
      case 'train': return TRAIN_TYPES;
      default: return [{ value: '', label: 'N/A' }];
    }
  };

  const fuelOptions = getFuelOptions(inputs.transport.vehicleType);
  const showFuelType = ['car', 'bus', 'train'].includes(inputs.transport.vehicleType);

  const hasError = (section, field) => {
    const key = `${section}.${field}`;
    return touched[key] && (errors[section] || errors[key]);
  };

  const getError = (section, field) => {
    const key = `${section}.${field}`;
    return errors[section] || errors[key];
  };

  const SectionCard = ({ 
    isOpen, 
    title, 
    icon, 
    iconColor, 
    description, 
    optional,
    children, 
    onToggle,
    referenceCard 
  }) => (
    <div className="section-card-wrapper">
      <button
        type="button"
        className={`section-toggle ${isOpen ? 'expanded' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="section-toggle-icon" style={{ background: iconColor + '15', borderColor: iconColor + '40' }}>
          <icon size={20} stroke={iconColor} aria-hidden="true" />
        </div>
        <div className="section-toggle-content">
          <span className="section-toggle-title">
            {title}
            {optional && <span className="section-toggle-optional">(Optional)</span>}
          </span>
          <span className="section-toggle-desc">{description}</span>
        </div>
        <span className="section-toggle-chevron" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="section-content" style={{ animation: 'slideDown 0.3s ease' }}>
          <div className="section-inner" style={{paddingLeft : '0'}}>
            {children}
            {referenceCard}
          </div>
        </div>
      )}
    </div>
  );

  const InputField = ({ 
    label, 
    icon: Icon, 
    iconColor, 
    children, 
    error, 
    errorMsg, 
    hint, 
    helpText,
    type = 'text',
    ...props 
  }) => (
    <div className="input-wrapper">
      <div className="input-label-row">
        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {Icon && <Icon size={18} stroke={iconColor} aria-hidden="true" />}
          <span>{label}</span>
        </label>
        {helpText && (
          <button
            type="button"
            className="help-trigger"
            onClick={(e) => {
              e.preventDefault();
              alert(helpText);
            }}
            aria-label={`Help for ${label}`}
          >
            <InfoIcon size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="input-field-container">
        {children}
        {error && (
          <div className="input-error" role="alert">
            <span className="error-icon" aria-hidden="true">!</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {hint && !error && (
          <small className="input-hint">{hint}</small>
        )}
      </div>
    </div>
  );

  const SelectField = ({ label, icon: Icon, iconColor, options, value, onChange, error, errorMsg, hint, helpText, ...props }) => (
    <InputField
      label={label}
      icon={Icon}
      iconColor={iconColor}
      error={error}
      errorMsg={errorMsg}
      hint={hint}
      helpText={helpText}
    >
      <select
        value={value}
        onChange={onChange}
        className={`custom-select ${error ? 'error' : ''}`}
        aria-invalid={error}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </InputField>
  );

  const NumberField = ({ label, icon: Icon, iconColor, value, onChange, error, errorMsg, hint, helpText, min, max, step, placeholder, ...props }) => (
    <InputField
      label={label}
      icon={Icon}
      iconColor={iconColor}
      error={error}
      errorMsg={errorMsg}
      hint={hint}
      helpText={helpText}
    >
      <input
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={`custom-input ${error ? 'error' : ''}`}
        aria-invalid={error}
        {...props}
      />
    </InputField>
  );

  const CheckboxField = ({ label, checked, onChange, helpText, subText }) => (
    <div className="checkbox-wrapper">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="checkbox-input"
        />
        <span className="checkbox-custom" aria-hidden="true">
          <CheckIcon size={14} stroke="white" aria-hidden="true" />
        </span>
        <span className="checkbox-text">{label}</span>
      </label>
      {helpText && <span className="checkbox-help">{helpText}</span>}
      {subText && <small className="checkbox-subtext">{subText}</small>}
    </div>
  );

  return (
    <div style={{width:'100%', margin:'0 auto'}}>

    <form className="calculator-form" style={{paddingLeft: '0' , margin : '0 auto', padding:'5%'}} onSubmit={onCalculate} noValidate>
      {/* Progress Indicator */}
      <div className="form-progress" role="progressbar" aria-valuenow={calculateProgress()} aria-valuemin={0} aria-valuemax={100} aria-label="Form completion">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${calculateProgress()}%` }} />
        </div>
        <div className="progress-labels">
          <span className={showTransport ? 'active' : ''}>Transport</span>
          <span className={showElectricity ? 'active' : ''}>Energy</span>
          <span className={showWaste ? 'active' : ''}>Waste</span>
          <span className={showFlights ? 'active' : ''}>Flights</span>
        </div>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="form-general-error" role="alert">
          <span className="error-icon" aria-hidden="true">!</span>
          <span>{errors.general}</span>
        </div>
      )}

      {/* Transportation Section */}
      <SectionCard
        isOpen={showTransport}
        title="Transportation"
        icon={CarIcon}
        iconColor="#0284C7"
        description="Your daily commute — usually the biggest part of personal emissions"
        onToggle={() => setShowTransport(!showTransport)}
        referenceCard={
          <div className="reference-card transport-reference">
            <div className="reference-icon" style={{ background: '#0284C715', borderColor: '#0284C740' }}>
              <CarIcon size={20} stroke="#0284C7" aria-hidden="true" />
            </div>
            <div className="reference-content">
              <strong>Tip:</strong> Switching from petrol car to electric can reduce transport emissions by ~60%. Carpooling or public transport cuts it even further.
            </div>
          </div>
        }
      >
        <div className="form-grid">
          <NumberField
            label="Daily Travel Distance (km)"
            icon={CarIcon}
            iconColor="#0284C7"
            value={inputs.transport.distanceKm}
            onChange={(e) => onTransportChange('distanceKm', e.target.value)}
            error={hasError('transport', 'distanceKm')}
            errorMsg={getError('transport', 'distanceKm')}
            hint="Two-way distance to work/school"
            helpText="Enter your Two-way commute distance. We'll calculate round-trip emissions for your travel days."
            min="0"
            max="200"
            step="0.5"
            placeholder="e.g. 25"
          />

          <SelectField
            label="Vehicle Type"
            icon={CarIcon}
            iconColor="#0284C7"
            options={VEHICLE_TYPES}
            value={inputs.transport.vehicleType}
            onChange={(e) => onTransportChange('vehicleType', e.target.value)}
            error={hasError('transport', 'vehicleType')}
            errorMsg={getError('transport', 'vehicleType')}
            hint="Select your primary commute vehicle"
            helpText="Different vehicles have very different emission factors. Cars vary by fuel type."
          />

          {showFuelType && (
            <SelectField
              label="Fuel / Service Type"
              icon={CarIcon}
              iconColor="#0284C7"
              options={fuelOptions}
              value={inputs.transport.fuelType}
              onChange={(e) => onTransportChange('fuelType', e.target.value)}
              error={hasError('transport', 'fuelType')}
              errorMsg={getError('transport', 'fuelType')}
              hint="Fuel type significantly affects emissions"
              helpText="Electric vehicles use grid electricity. Hybrid combines petrol + electric. Diesel is more efficient than petrol per km."
            />
          )}

          <NumberField
            label="Travel Days per Week"
            icon={CarIcon}
            iconColor="#0284C7"
            value={inputs.transport.daysPerWeek}
            onChange={(e) => onTransportChange('daysPerWeek', parseInt(e.target.value) || 0)}
            error={hasError('transport', 'daysPerWeek')}
            errorMsg={getError('transport', 'daysPerWeek')}
            hint="How many days you commute weekly"
            helpText="Typical work week is 5 days. Include any regular trips you make."
            min="0"
            max="7"
            step="1"
            placeholder="5"
          />
        </div>
      </SectionCard>

      {/* Electricity Section */}
      <SectionCard
        isOpen={showElectricity}
        title="Electricity & Energy"
        icon={ElectricIcon}
        iconColor="#DC2626"
        description="Home electricity use — includes AC, appliances, lighting, everything"
        onToggle={() => setShowElectricity(!showElectricity)}
        referenceCard={
          <div className="reference-card electricity-reference">
            <div className="reference-icon" style={{ background: '#DC262615', borderColor: '#DC262640' }}>
              <ZapIcon size={20} stroke="#DC2626" aria-hidden="true" />
            </div>
            <div className="reference-content">
              <strong>Pakistan Grid Factor:</strong> 0.456 kg CO₂e/kWh (IEA/NEPRA 2023)
              <br />
              <small>Includes transmission losses. Solar/net-metering users: enter net grid consumption only.</small>
            </div>
          </div>
        }
      >
        <div className="form-grid">
          <NumberField
            label="Monthly Electricity Usage (kWh)"
            icon={ElectricIcon}
            iconColor="#DC2626"
            value={inputs.electricity.monthlyKwh}
            onChange={(e) => onElectricityChange('monthlyKwh', e.target.value)}
            error={hasError('electricity', 'monthlyKwh')}
            errorMsg={getError('electricity', 'monthlyKwh')}
            hint="From your electricity bill (units consumed)"
            helpText="Check your latest bill for 'units consumed' or 'kWh'. Pakistan grid average: 0.456 kg CO₂e/kWh."
            min="0"
            max="5000"
            step="1"
            placeholder="e.g. 300"
          />
        </div>
      </SectionCard>

      {/* Waste Section */}
      <SectionCard
        isOpen={showWaste}
        title="Waste & Lifestyle"
        icon={WasteIcon}
        iconColor="#F59E0B"
        description="Weekly waste habits — small changes here add up over a year"
        onToggle={() => setShowWaste(!showWaste)}
        referenceCard={
          <div className="reference-card waste-reference">
            <div className="reference-icon" style={{ background: '#F59E0B15', borderColor: '#F59E0B40' }}>
              <RecycleIcon size={20} stroke="#F59E0B" aria-hidden="true" />
            </div>
            <div className="reference-content">
              <strong>Impact Tip:</strong> Reducing 1 waste bin/week saves ~130 kg CO₂e/year. Composting food waste (≈40% of bin weight) cuts methane emissions dramatically.
            </div>
          </div>
        }
      >
        <div className="form-grid">
          <NumberField
            label="Plastic Bags per Week"
            icon={WasteIcon}
            iconColor="#F59E0B"
            value={inputs.waste.plasticBags}
            onChange={(e) => onWasteChange('plasticBags', parseInt(e.target.value) || 0)}
            error={hasError('waste', 'plasticBags')}
            errorMsg={getError('waste', 'plasticBags')}
            hint="Single-use shopping bags"
            helpText="Production + disposal emissions. Reusable bags eliminate this entirely."
            min="0"
            max="50"
            step="1"
            placeholder="0"
          />

          <NumberField
            label="Waste Bins per Week"
            icon={WasteIcon}
            iconColor="#F59E0B"
            value={inputs.waste.wasteBins}
            onChange={(e) => onWasteChange('wasteBins', parseInt(e.target.value) || 0)}
            error={hasError('waste', 'wasteBins')}
            errorMsg={getError('waste', 'wasteBins')}
            hint="Standard kitchen bins (≈10kg mixed waste)"
            helpText="Mixed waste to landfill produces methane. Composting food waste cuts this significantly."
            min="0"
            max="20"
            step="1"
            placeholder="0"
          />

          <NumberField
            label="Recycling Bins per Week"
            icon={RecycleIcon}
            iconColor="#38D399"
            value={inputs.waste.recyclingBins}
            onChange={(e) => onWasteChange('recyclingBins', parseInt(e.target.value) || 0)}
            error={hasError('waste', 'recyclingBins')}
            errorMsg={getError('waste', 'recyclingBins')}
            hint="Paper, plastic, metal, glass recycling"
            helpText="Recycling has lower emissions than landfill but still requires collection & processing energy."
            min="0"
            max="20"
            step="1"
            placeholder="0"
          />
        </div>
      </SectionCard>

      {/* Flights Section */}
      <SectionCard
        isOpen={showFlights}
        title="Flight Emissions"
        icon={PlaneIcon}
        iconColor="#6366F1"
        description="Air travel — often the single largest emission source for frequent flyers"
        optional
        onToggle={() => setShowFlights(!showFlights)}
        referenceCard={
          <div className="reference-card flight-reference">
            <div className="reference-icon" style={{ background: '#6366F115', borderColor: '#6366F140' }}>
              <PlaneIcon size={20} stroke="#6366F1" aria-hidden="true" />
            </div>
            <div className="reference-content">
              <strong>Why RF Matters:</strong> Aviation's non-CO₂ effects (contrails, cirrus clouds, NOx) roughly double the warming impact. A Karachi→London return flight: ~1.8 tonnes CO₂e without RF, ~3.4 tonnes with RF.
            </div>
          </div>
        }
      >
        <div className="form-grid">
          <NumberField
            label="Flight Distance (km)"
            icon={PlaneIcon}
            iconColor="#6366F1"
            value={inputs.flights.distanceKm}
            onChange={(e) => onFlightChange('distanceKm', e.target.value)}
            error={hasError('flights', 'distanceKm')}
            errorMsg={getError('flights', 'distanceKm')}
            hint="Two-way distance (we calculate round-trip)"
            helpText="Use great-circle distance between airports. e.g., Karachi→Dubai ≈ 1,200 km, Karachi→London ≈ 6,300 km."
            min="0"
            max="20000"
            step="10"
            placeholder="e.g. 1200"
          />

          <SelectField
            label="Flight Type"
            icon={PlaneIcon}
            iconColor="#6366F1"
            options={FLIGHT_TYPES}
            value={inputs.flights.flightType}
            onChange={(e) => onFlightChange('flightType', e.target.value)}
            hint="Affects emission factor per km"
            helpText="Short-haul: higher emissions per km due to takeoff/landing. Long-haul: more efficient cruise but RF multiplier applies."
          />

          <NumberField
            label="Passengers"
            icon={PlaneIcon}
            iconColor="#6366F1"
            value={inputs.flights.passengers}
            onChange={(e) => onFlightChange('passengers', parseInt(e.target.value) || 1)}
            error={hasError('flights', 'passengers')}
            errorMsg={getError('flights', 'passengers')}
            hint="Number of people this flight is for"
            helpText="Emissions are per passenger. Business/first class = 2-3× economy (not modeled here)."
            min="1"
            max="10"
            step="1"
            placeholder="1"
          />

          <CheckboxField
            label="Include Radiative Forcing (×1.9 multiplier)"
            checked={inputs.flights.includeRF}
            onChange={(e) => onFlightChange('includeRF', e.target.checked)}
            helpText="Recommended for accuracy"
            subText="Accounts for non-CO₂ warming: contrails, NOx, water vapor at altitude. Per ICAO guidelines."
          />
        </div>
      </SectionCard>

      {/* Submit Button */}
      <div className="form-submit">
        <button
          type="submit"
          className="btn-primary btn-large btn-submit"
          disabled={calculating}
          aria-busy={calculating}
          >
          {calculating ? (
            <>
              <span className="btn-spinner" aria-hidden="true" />
              Calculating Your Footprint…
            </>
          ) : (
            <>
              <span>Calculate My Carbon Footprint</span>
              <ArrowRightIcon size={20} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="submit-hint">
          Results include annual total, category breakdown, interactive chart, and personalized reduction tips.
        </p>
      </div>
    </form>
          </div>
  );

  function calculateProgress() {
    let filled = 0;
    let total = 0;
    
    // Transport
    total += 4;
    if (inputs.transport.distanceKm) filled++;
    if (inputs.transport.vehicleType) filled++;
    if (inputs.transport.fuelType) filled++;
    if (inputs.transport.daysPerWeek) filled++;
    
    // Electricity
    total += 1;
    if (inputs.electricity.monthlyKwh) filled++;
    
    // Waste
    total += 3;
    if (inputs.waste.plasticBags !== undefined) filled++;
    if (inputs.waste.wasteBins !== undefined) filled++;
    if (inputs.waste.recyclingBins !== undefined) filled++;
    
    // Flights
    if (showFlights) {
      total += 4;
      if (inputs.flights.distanceKm) filled++;
      if (inputs.flights.flightType) filled++;
      if (inputs.flights.passengers) filled++;
      if (inputs.flights.includeRF !== undefined) filled++;
    }
    
    return Math.round((filled / total) * 100);
  }
}