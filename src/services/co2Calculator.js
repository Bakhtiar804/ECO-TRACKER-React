// CO2 Calculator Service - Emission calculations with documented sources

/**
 * Emission Factors (kg CO2e per unit)
 * Sources documented per category
 */

// Transportation Emission Factors (kg CO2e per km)
// Source: UK DEFRA 2023 Conversion Factors, EPA, IPCC Guidelines
export const TRANSPORT_FACTORS = {
  car: {
    petrol: 0.170,   // kg CO2e/km - average petrol car
    diesel: 0.160,   // kg CO2e/km - average diesel car
    hybrid: 0.095,   // kg CO2e/km - hybrid car
    electric: 0.055, // kg CO2e/km - electric car (grid average)
  },
  motorcycle: {
    petrol: 0.103, // kg CO2e/km - average motorcycle
  },
  bus: {
    local: 0.089,     // kg CO2e/km - local bus
    coach: 0.028,     // kg CO2e/km - coach/intercity
  },
  train: {
    electric: 0.035,  // kg CO2e/km - electric train
    diesel: 0.045,    // kg CO2e/km - diesel train
  },
  // For "other" or unspecified
  other: 0.150, // kg CO2e/km - conservative average
};

// Electricity Emission Factor (kg CO2e per kWh)
// Source: Pakistan NEPRA / IEA 2023 - Pakistan grid average
export const ELECTRICITY_FACTOR_PK = 0.456; // kg CO2e/kWh (Pakistan grid average)

// Waste Emission Factors (kg CO2e per bag/bin)
// Source: EPA WARM Model, IPCC Waste Guidelines
// Assumes typical household waste bag ~10kg, mixed waste to landfill
export const WASTE_FACTORS = {
  plasticBag: 0.5,   // kg CO2e per plastic bag (production + disposal)
  wasteBin: 2.5,     // kg CO2e per standard bin bag (10kg mixed waste to landfill)
  recyclingBin: 0.3, // kg CO2e per bin of recycling (collection + processing)
};

// Flight Emission Factors (kg CO2e per passenger-km)
// Source: UK DEFRA 2023, ICAO Carbon Calculator
export const FLIGHT_FACTORS = {
  domestic: 0.133,      // kg CO2e/pkm - domestic flight
  shortHaul: 0.081,     // kg CO2e/pkm - short haul international (<3700km)
  longHaul: 0.102,      // kg CO2e/pkm - long haul international (>3700km)
  // With radiative forcing multiplier (×1.9 for aviation)
  domesticRF: 0.253,
  shortHaulRF: 0.154,
  longHaulRF: 0.194,
};

/**
 * Calculate transportation emissions
 * @param {Object} params
 * @param {number} params.distanceKm - Daily distance in km
 * @param {string} params.vehicleType - 'car' | 'motorcycle' | 'bus' | 'train' | 'other'
 * @param {string} [params.fuelType] - 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'local' | 'coach' | 'electric' | 'diesel'
 * @param {number} params.daysPerWeek - Travel days per week (1-7)
 * @returns {Object} Daily, weekly, monthly, annual emissions in kg CO2e
 */
export function calculateTransportEmissions({ distanceKm, vehicleType, fuelType, daysPerWeek }) {
  if (!distanceKm || distanceKm < 0) return { daily: 0, weekly: 0, monthly: 0, annual: 0, factor: 0 };
  if (!daysPerWeek || daysPerWeek < 0 || daysPerWeek > 7) return { daily: 0, weekly: 0, monthly: 0, annual: 0, factor: 0 };

  let factor = 0;

  switch (vehicleType) {
    case 'car':
      factor = TRANSPORT_FACTORS.car[fuelType] ?? TRANSPORT_FACTORS.car.petrol;
      break;
    case 'motorcycle':
      factor = TRANSPORT_FACTORS.motorcycle[fuelType] ?? TRANSPORT_FACTORS.motorcycle.petrol;
      break;
    case 'bus':
      factor = TRANSPORT_FACTORS.bus[fuelType] ?? TRANSPORT_FACTORS.bus.local;
      break;
    case 'train':
      factor = TRANSPORT_FACTORS.train[fuelType] ?? TRANSPORT_FACTORS.train.electric;
      break;
    default:
      factor = TRANSPORT_FACTORS.other;
  }

  const daily = distanceKm * factor;
  const weekly = daily * daysPerWeek;
  const monthly = weekly * 4.33; // Average weeks per month
  const annual = weekly * 52;

  return { daily, weekly, monthly, annual, factor };
}

/**
 * Calculate electricity emissions
 * @param {Object} params
 * @param {number} params.monthlyKwh - Monthly electricity consumption in kWh
 * @returns {Object} Daily, weekly, monthly, annual emissions in kg CO2e
 */
export function calculateElectricityEmissions({ monthlyKwh }) {
  if (!monthlyKwh || monthlyKwh < 0) return { daily: 0, weekly: 0, monthly: 0, annual: 0, factor: ELECTRICITY_FACTOR_PK };

  const monthly = monthlyKwh * ELECTRICITY_FACTOR_PK;
  const annual = monthly * 12;
  const weekly = monthly / 4.33;
  const daily = weekly / 7;

  return { daily, weekly, monthly, annual, factor: ELECTRICITY_FACTOR_PK };
}

/**
 * Calculate waste emissions
 * @param {Object} params
 * @param {number} params.plasticBags - Plastic bags per week
 * @param {number} params.wasteBins - Waste bins per week
 * @param {number} params.recyclingBins - Recycling bins per week
 * @returns {Object} Daily, weekly, monthly, annual emissions in kg CO2e
 */
export function calculateWasteEmissions({ plasticBags = 0, wasteBins = 0, recyclingBins = 0 }) {
  const weekly = (plasticBags * WASTE_FACTORS.plasticBag) +
                 (wasteBins * WASTE_FACTORS.wasteBin) +
                 (recyclingBins * WASTE_FACTORS.recyclingBin);

  const annual = weekly * 52;
  const monthly = weekly * 4.33;
  const daily = weekly / 7;

  return { daily, weekly, monthly, annual };
}

/**
 * Calculate flight emissions
 * @param {Object} params
 * @param {number} params.distanceKm - Flight distance in km
 * @param {string} params.flightType - 'domestic' | 'shortHaul' | 'longHaul'
 * @param {boolean} params.includeRF - Include radiative forcing (default true)
 * @param {number} params.passengers - Number of passengers (default 1)
 * @returns {Object} Emissions per trip in kg CO2e
 */
export function calculateFlightEmissions({ distanceKm, flightType, includeRF = true, passengers = 1 }) {
  if (!distanceKm || distanceKm < 0) return { perTrip: 0, factor: 0 };

  const factorKey = includeRF ? `${flightType}RF` : flightType;
  const factor = FLIGHT_FACTORS[factorKey] ?? FLIGHT_FACTORS[flightType];

  const perTrip = distanceKm * factor * passengers;

  return { perTrip, factor };
}

/**
 * Calculate total footprint from all categories
 * @param {Object} inputs - All user inputs
 * @returns {Object} Complete breakdown with totals
 */
export function calculateTotalFootprint(inputs) {
  const transport = calculateTransportEmissions(inputs.transport);
  const electricity = calculateElectricityEmissions(inputs.electricity);
  const waste = calculateWasteEmissions(inputs.waste);
  const flights = inputs.flights ? calculateFlightEmissions(inputs.flights) : { perTrip: 0, annual: 0 };

  // Convert all to annual for total
  const totalAnnualKg = transport.annual + electricity.annual + waste.annual + (flights.perTrip || 0);
  const totalAnnualTonnes = totalAnnualKg / 1000;

  // Daily average
  const totalDailyKg = transport.daily + electricity.daily + waste.daily;

  return {
    transport,
    electricity,
    waste,
    flights,
    totals: {
      dailyKg: totalDailyKg,
      annualKg: totalAnnualKg,
      annualTonnes: totalAnnualTonnes,
    },
    breakdown: {
      transportKg: transport.annual,
      electricityKg: electricity.annual,
      wasteKg: waste.annual,
      flightsKg: flights.perTrip || 0,
    },
    percentages: {
      transport: totalAnnualKg > 0 ? (transport.annual / totalAnnualKg) * 100 : 0,
      electricity: totalAnnualKg > 0 ? (electricity.annual / totalAnnualKg) * 100 : 0,
      waste: totalAnnualKg > 0 ? (waste.annual / totalAnnualKg) * 100 : 0,
      flights: totalAnnualKg > 0 ? ((flights.perTrip || 0) / totalAnnualKg) * 100 : 0,
    },
  };
}

/**
 * Get reduction suggestions based on largest emission sources
 */
export function getReductionSuggestions(breakdown) {
  const suggestions = [];
  const sorted = Object.entries(breakdown)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) return suggestions;

  const largest = sorted[0][0];

  const suggestionMap = {
    transport: [
      'Consider carpooling or public transport for daily commute',
      'Switch to a hybrid or electric vehicle for lower emissions',
      'Combine trips to reduce total distance traveled',
      'Work from home when possible to eliminate commute emissions',
    ],
    electricity: [
      'Switch to energy-efficient appliances (LED lights, inverter AC)',
      'Use solar panels or green energy tariffs if available',
      'Set AC to 24-26°C and use fans for air circulation',
      'Unplug devices when not in use to avoid phantom load',
    ],
    waste: [
      'Reduce single-use plastics - bring reusable bags and containers',
      'Compost organic waste to avoid landfill methane',
      'Recycle paper, cardboard, glass, and metals properly',
      'Buy in bulk to reduce packaging waste',
    ],
    flights: [
      'Choose direct flights - takeoff/landing use most fuel',
      'Fly economy class - higher density = lower per-passenger emissions',
      'Consider video calls instead of short business trips',
      'Offset unavoidable flights through verified carbon programs',
    ],
  };

  if (suggestionMap[largest]) {
    suggestions.push(...suggestionMap[largest].slice(0, 3));
  }

  // Add general suggestions
  if (sorted.length > 1) {
    const second = sorted[1][0];
    if (suggestionMap[second]) {
      suggestions.push(suggestionMap[second][0]);
    }
  }

  return suggestions.slice(0, 4);
}

/**
 * Emission factor sources for transparency
 */
export const EMISSION_SOURCES = {
  transport: {
    car: 'UK DEFRA 2023 Conversion Factors (average petrol/diesel car)',
    motorcycle: 'UK DEFRA 2023 Conversion Factors (average motorcycle)',
    bus: 'UK DEFRA 2023 Conversion Factors (local bus/coach)',
    train: 'UK DEFRA 2023 Conversion Factors (electric/diesel rail)',
  },
  electricity: 'IEA 2023 / NEPRA Pakistan Grid Average Emission Factor: 0.456 kg CO2e/kWh',
  waste: 'EPA WARM Model v15 / IPCC 2006 Guidelines for Waste Sector',
  flights: 'UK DEFRA 2023 Conversion Factors with Radiative Forcing (×1.9) per ICAO',
};

export default {
  calculateTransportEmissions,
  calculateElectricityEmissions,
  calculateWasteEmissions,
  calculateFlightEmissions,
  calculateTotalFootprint,
  getReductionSuggestions,
  EMISSION_SOURCES,
};