# EcoTracker — React Conversion & Feature Upgrade

A modern, responsive React application for tracking air quality in major Pakistani cities and calculating personal carbon footprints.

## Features Implemented

### 1. AQI Dashboard (Live Air Quality)
- **Real-time AQI data** for Karachi, Lahore, Islamabad, Peshawar
- **Primary API**: Open-Meteo Air Quality API (free, no key required)
- **Fallback API**: WAQI (World Air Quality Index) with token support
- **Data displayed**: US AQI, PM2.5, PM10, CO, NO2, SO2, O3, European AQI
- **24-hour historical charts** using Chart.js
- **City comparison** view across all four cities
- **Auto-refresh** every 10 minutes + manual refresh button
- **Loading skeletons**, error states, retry functionality
- **Clear labeling** that data is modeled forecast (CAMS Global, 45km resolution)

### 2. Carbon Footprint Calculator
Interactive calculator with documented emission factors:

**Transportation**
- Daily distance (km)
- Vehicle type: Car, Motorcycle, Bus, Train, Other
- Fuel type: Petrol, Diesel, Hybrid, Electric (car); Local/Coach (bus); Electric/Diesel (train)
- Days per week

**Electricity & Energy**
- Monthly consumption (kWh)
- Pakistan grid factor: 0.456 kg CO₂e/kWh (IEA/NEPRA 2023)

**Waste & Lifestyle**
- Plastic bags/week
- Waste bins/week
- Recycling bins/week

**Flights (Optional)**
- Distance, flight type (domestic/short-haul/long-haul)
- Radiative forcing multiplier (×1.9) per ICAO

**Results**
- Breakdown by category (kg CO₂e/year)
- Total annual footprint (tonnes CO₂e)
- Interactive doughnut chart
- Personalized reduction suggestions
- Full methodology disclosure

### 3. Technical Implementation
- **React 18** with Vite
- **Functional components + hooks** (useState, useEffect, useCallback, useMemo, useRef)
- **Custom hooks**: `useAQIData`, `useHistoricalAQI`, `useCO2Calculator`
- **Services**: `aqiService.js`, `co2Calculator.js`
- **Chart.js** for visualizations
- **CSS Variables** for theming (preserved from original design)
- **Full responsiveness**: 320px - 1920px+
- **Accessibility**: Semantic HTML, ARIA labels, focus management, keyboard navigation

## Project Structure

```
src/
├── components/
│   ├── Icons.jsx              # Reusable SVG icons
│   ├── Navbar.jsx             # Navigation with mobile menu
│   ├── AQICard.jsx            # AQI display card with states
│   ├── CityComparison.jsx     # Multi-city comparison grid
│   ├── Charts.jsx             # Chart.js wrappers (AQI, Comparison, CO2)
│   ├── CalculatorForm.jsx     # Calculator input form
│   ├── CalculatorResults.jsx  # Results panel with chart
│   ├── Dashboard.jsx          # Main dashboard page
│   ├── Calculator.jsx         # Calculator page
│   ├── HowItWorks.jsx         # Info section
│   └── Footer.jsx
├── hooks/
│   ├── useAQIData.js          # AQI fetching with caching/refresh
│   └── useCO2Calculator.js    # Calculator state & calculations
├── services/
│   ├── aqiService.js          # Open-Meteo + WAQI API integration
│   └── co2Calculator.js       # Emission factor calculations
├── utils/
│   └── constants.js           # City data, vehicle types, emission factors
├── styles/
│   ├── variables.css          # CSS custom properties
│   └── main.css               # All component styles
├── App.jsx                    # Root component
└── main.jsx                   # Entry point
```

## Setup & Run

```bash
cd eco-tracker-react
npm install
npm run dev      # Development server at http://localhost:5173
npm run build    # Production build in dist/
npm run preview  # Preview production build
```

## Environment Variables

Create `.env` from `.env.example`:

```env
# WAQI API Token (optional - for fallback to ground station data)
# Get from: https://aqicn.org/data-platform/token/
# WARNING: Exposed in frontend bundle. For production, use a backend proxy.
VITE_WAQI_TOKEN=your_token_here

# API Provider (open-meteo | waqi)
VITE_API_PROVIDER=open-meteo
```

## API Selection & Limitations

### Open-Meteo Air Quality API (Primary)
- **Pros**: Free, no API key, global coverage, hourly data, 5-day forecast + historical
- **Cons**: Modeled forecast data (CAMS Global, ~45km resolution), not ground measurements
- **Coverage**: All Pakistani cities via coordinates
- **Data**: US AQI, European AQI, PM2.5, PM10, CO, NO2, SO2, O3

### WAQI API (Fallback)
- **Pros**: Ground station observations, real monitoring data
- **Cons**: Requires token, rate limited, stations may be offline
- **Coverage**: 4 Pakistani cities (Karachi, Lahore, Islamabad, Peshawar)

**Important**: Open-Meteo provides modeled estimates. The UI clearly labels this as "Modeled forecast data" with source attribution to CAMS/ECMWF.

## CO2 Calculation Formulas & Sources

| Category | Formula | Source |
|----------|---------|--------|
| Car (Petrol) | distance × 0.170 kg/km | UK DEFRA 2023 |
| Car (Diesel) | distance × 0.160 kg/km | UK DEFRA 2023 |
| Car (Hybrid) | distance × 0.095 kg/km | UK DEFRA 2023 |
| Car (Electric) | distance × 0.055 kg/km | UK DEFRA 2023 (grid avg) |
| Motorcycle | distance × 0.103 kg/km | UK DEFRA 2023 |
| Bus (Local) | distance × 0.089 kg/km | UK DEFRA 2023 |
| Bus (Coach) | distance × 0.028 kg/km | UK DEFRA 2023 |
| Train (Electric) | distance × 0.035 kg/km | UK DEFRA 2023 |
| Train (Diesel) | distance × 0.045 kg/km | UK DEFRA 2023 |
| Electricity (PK) | kWh × 0.456 kg/kWh | IEA/NEPRA 2023 |
| Plastic Bag | count × 0.5 kg/bag | EPA WARM / IPCC |
| Waste Bin | count × 2.5 kg/bin | EPA WARM (10kg mixed) |
| Recycling Bin | count × 0.3 kg/bin | EPA WARM |
| Flights | distance × factor × passengers | UK DEFRA 2023 × RF 1.9 |

All calculations convert to annual kg CO₂e and tonnes CO₂e.

## Responsive Breakpoints

- Mobile: ≤ 640px
- Tablet: 641px - 900px
- Laptop: 901px - 1200px
- Desktop: > 1200px

## Accessibility Features

- Semantic HTML5 elements (main, section, article, nav, footer)
- ARIA labels and live regions for dynamic content
- Focus visible styles
- Keyboard navigation support
- Reduced motion media query
- Color + text indicators for AQI severity (not color alone)
- Sufficient contrast ratios

## Known Limitations / Future Improvements

1. **Open-Meteo is modeled data** — not real-time ground station readings. For production, consider adding a backend proxy to WAQI or other ground station APIs.

2. **WAQI token exposed in frontend** — the `.env` token is bundled. For production, implement a serverless function/backend proxy.

3. **Historical data limited to 24h** — Open-Meteo free tier provides 1 day of past data. For longer trends, need historical API access.

4. **No user authentication** — Sign In button is UI only.

5. **No data persistence** — Calculator inputs saved to localStorage only.

6. **Charts on mobile** — Chart.js responsive but dense data may need horizontal scroll on very small screens.

## Credits

- **Design**: Original HTML/CSS/JS by user
- **Conversion**: React + Vite implementation
- **Air Quality Data**: Open-Meteo (CAMS/ECMWF), WAQI
- **Emission Factors**: UK DEFRA, IEA, EPA, IPCC
- **Icons**: Custom SVG (based on original design)
- **Fonts**: Plus Jakarta Sans (Google Fonts)
- **Charts**: Chart.js