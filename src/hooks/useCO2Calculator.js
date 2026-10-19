// Custom hook for CO2 calculator state and calculations
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  calculateTotalFootprint,
  getReductionSuggestions,
  calculateTransportEmissions,
  calculateElectricityEmissions,
  calculateWasteEmissions,
  calculateFlightEmissions,
  EMISSION_SOURCES,
} from '../services/co2Calculator';
import { STORAGE_KEYS } from '../utils/constants';

// Default calculator inputs
const DEFAULT_INPUTS = {
  transport: {
    distanceKm: '',
    vehicleType: 'car',
    fuelType: 'petrol',
    daysPerWeek: 5,
  },
  electricity: {
    monthlyKwh: '',
  },
  waste: {
    plasticBags: 0,
    wasteBins: 0,
    recyclingBins: 0,
  },
  flights: {
    distanceKm: '',
    flightType: 'domestic',
    includeRF: true,
    passengers: 1,
  },
};

export function useCO2Calculator() {
  const [inputs, setInputs] = useState(() => {
    // Load from localStorage on init
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CALCULATOR_INPUTS);
      if (stored) {
        return { ...DEFAULT_INPUTS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load calculator inputs:', e);
    }
    return DEFAULT_INPUTS;
  });

  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Save to localStorage when inputs change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CALCULATOR_INPUTS, JSON.stringify(inputs));
    } catch (e) {
      console.warn('Failed to save calculator inputs:', e);
    }
  }, [inputs]);

  // Validate inputs
  const validateInputs = useCallback(() => {
    const newErrors = {};
    let hasAnyInput = false;

    // Transport validation
    const distance = parseFloat(inputs.transport.distanceKm);
    if (inputs.transport.distanceKm !== '' && (isNaN(distance) || distance < 0)) {
      newErrors.transport = 'Please enter a valid distance';
    }
    if (inputs.transport.daysPerWeek < 0 || inputs.transport.daysPerWeek > 7) {
      newErrors.transportDays = 'Days per week must be 0-7';
    }
    if (inputs.transport.distanceKm !== '' && !isNaN(distance) && distance > 0) hasAnyInput = true;

    // Electricity validation
    const kwh = parseFloat(inputs.electricity.monthlyKwh);
    if (inputs.electricity.monthlyKwh !== '' && (isNaN(kwh) || kwh < 0)) {
      newErrors.electricity = 'Please enter a valid kWh value';
    }
    if (inputs.electricity.monthlyKwh !== '' && !isNaN(kwh) && kwh > 0) hasAnyInput = true;

    // Waste validation
    if (inputs.waste.plasticBags < 0) newErrors.plasticBags = 'Cannot be negative';
    if (inputs.waste.wasteBins < 0) newErrors.wasteBins = 'Cannot be negative';
    if (inputs.waste.recyclingBins < 0) newErrors.recyclingBins = 'Cannot be negative';
    if (inputs.waste.plasticBags > 0 || inputs.waste.wasteBins > 0 || inputs.waste.recyclingBins > 0) hasAnyInput = true;

    // Flights validation
    const flightDist = parseFloat(inputs.flights.distanceKm);
    if (inputs.flights.distanceKm !== '' && (isNaN(flightDist) || flightDist < 0)) {
      newErrors.flights = 'Please enter a valid distance';
    }
    if (inputs.flights.passengers < 1) newErrors.flightPassengers = 'Must be at least 1';
    if (inputs.flights.distanceKm !== '' && !isNaN(flightDist) && flightDist > 0) hasAnyInput = true;

    // Require at least one input
    if (!hasAnyInput) {
      newErrors.general = 'Please fill in at least one field to calculate your footprint';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [inputs]);

  // Calculate footprint
  const calculate = useCallback(() => {
    if (!validateInputs()) return null;

    // Prepare inputs for calculation (convert strings to numbers)
    const calcInputs = {
      transport: {
        distanceKm: parseFloat(inputs.transport.distanceKm) || 0,
        vehicleType: inputs.transport.vehicleType,
        fuelType: inputs.transport.fuelType,
        daysPerWeek: inputs.transport.daysPerWeek,
      },
      electricity: {
        monthlyKwh: parseFloat(inputs.electricity.monthlyKwh) || 0,
      },
      waste: {
        plasticBags: inputs.waste.plasticBags,
        wasteBins: inputs.waste.wasteBins,
        recyclingBins: inputs.waste.recyclingBins,
      },
      flights: inputs.flights.distanceKm ? {
        distanceKm: parseFloat(inputs.flights.distanceKm),
        flightType: inputs.flights.flightType,
        includeRF: inputs.flights.includeRF,
        passengers: inputs.flights.passengers,
      } : null,
    };

    const footprint = calculateTotalFootprint(calcInputs);
    const suggestions = getReductionSuggestions(footprint.breakdown);

    const result = {
      ...footprint,
      suggestions,
      timestamp: new Date().toISOString(),
    };

    setResults(result);
    setShowResults(true);
    return result;
  }, [inputs, validateInputs]);

  // Handle input changes
  const handleInputChange = useCallback((section, field, value) => {
    setInputs(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setTouched(prev => ({ ...prev, [`${section}.${field}`]: true }));
  }, []);

  const handleTransportChange = useCallback((field, value) => {
    handleInputChange('transport', field, value);
  }, [handleInputChange]);

  const handleElectricityChange = useCallback((field, value) => {
    handleInputChange('electricity', field, value);
  }, [handleInputChange]);

  const handleWasteChange = useCallback((field, value) => {
    handleInputChange('waste', field, value);
  }, [handleInputChange]);

  const handleFlightChange = useCallback((field, value) => {
    handleInputChange('flights', field, value);
  }, [handleInputChange]);

  // Reset calculator
  const reset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setResults(null);
    setShowResults(false);
    setErrors({});
    setTouched({});
    localStorage.removeItem(STORAGE_KEYS.CALCULATOR_INPUTS);
  }, []);

  // Recalculate when inputs change (optional - can be manual only)
  const [autoCalculate, setAutoCalculate] = useState(false);

  useEffect(() => {
    if (autoCalculate && showResults) {
      calculate();
    }
  }, [inputs, autoCalculate, showResults, calculate]);

  // Computed values for display
  const transportEmissions = useMemo(() => {
    const distance = parseFloat(inputs.transport.distanceKm) || 0;
    return calculateTransportEmissions({
      distanceKm: distance,
      vehicleType: inputs.transport.vehicleType,
      fuelType: inputs.transport.fuelType,
      daysPerWeek: inputs.transport.daysPerWeek,
    });
  }, [inputs.transport]);

  const electricityEmissions = useMemo(() => {
    const kwh = parseFloat(inputs.electricity.monthlyKwh) || 0;
    return calculateElectricityEmissions({ monthlyKwh: kwh });
  }, [inputs.electricity]);

  const wasteEmissions = useMemo(() => {
    return calculateWasteEmissions(inputs.waste);
  }, [inputs.waste]);

  const flightEmissions = useMemo(() => {
    if (!inputs.flights.distanceKm) return { perTrip: 0 };
    const distance = parseFloat(inputs.flights.distanceKm);
    return calculateFlightEmissions({
      distanceKm: distance,
      flightType: inputs.flights.flightType,
      includeRF: inputs.flights.includeRF,
      passengers: inputs.flights.passengers,
    });
  }, [inputs.flights]);

  return {
    inputs,
    results,
    showResults,
    errors,
    touched,
    calculate,
    reset,
    setShowResults,
    setAutoCalculate,
    autoCalculate,
    // Individual emission calculations for live preview
    transportEmissions,
    electricityEmissions,
    wasteEmissions,
    flightEmissions,
    // Handlers
    handleTransportChange,
    handleElectricityChange,
    handleWasteChange,
    handleFlightChange,
    // Sources for transparency
    emissionSources: EMISSION_SOURCES,
  };
}