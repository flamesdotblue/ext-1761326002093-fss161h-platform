import React from 'react';
import { Leaf, Calculator as CalcIcon, Wind, MapPin } from 'lucide-react';
import Hero from './components/Hero';
import Calculator from './components/Calculator';
import AQIMonitor from './components/AQIMonitor';
import IndiaEmissionsMap from './components/IndiaEmissionsMap';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 grid place-items-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-400/30">
              <Leaf className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold tracking-tight">EcoTrack</p>
              <p className="text-xs text-white/60">Carbon Footprint & Air Quality</p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#calculator" className="hover:text-emerald-300 flex items-center gap-1"><CalcIcon className="h-4 w-4"/>Calculator</a>
            <a href="#aqi" className="hover:text-emerald-300 flex items-center gap-1"><Wind className="h-4 w-4"/>Air Quality</a>
            <a href="#map" className="hover:text-emerald-300 flex items-center gap-1"><MapPin className="h-4 w-4"/>India Map</a>
          </nav>
        </div>
      </header>

      <main>
        <Hero />

        <section id="calculator" className="py-16 sm:py-24 bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Carbon Footprint Calculator</h2>
              <p className="text-white/70 mt-2">Estimate your annual emissions across transportation, home energy, diet, and waste. Compare with the global average and get tailored tips.</p>
            </div>
            <Calculator />
          </div>
        </section>

        <section id="aqi" className="py-16 sm:py-24 bg-neutral-900/60 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Live Air Quality Monitor</h2>
              <p className="text-white/70 mt-2">Get real-time AQI at your location with health guidance and pollutant breakdown.</p>
            </div>
            <AQIMonitor />
          </div>
        </section>

        <section id="map" className="py-16 sm:py-24 bg-neutral-900 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">India Emissions Map</h2>
              <p className="text-white/70 mt-2">Explore city-wise total and per-capita emissions across India with an interactive map.</p>
            </div>
            <IndiaEmissionsMap />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-sm text-white/60 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
          <p>EcoTrack • Empowering sustainable choices</p>
          <p>Global average target: 4.7 t CO₂e/year • Paris goal: 2.0 t</p>
        </div>
      </footer>
    </div>
  );
}
