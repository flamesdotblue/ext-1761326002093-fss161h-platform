import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CITIES = [
  // North
  { name: 'Delhi', lat: 28.6139, lon: 77.2090, emissions: 64000000, population: 16787941, sources: ['transport', 'industry', 'power'] },
  { name: 'Chandigarh', lat: 30.7333, lon: 76.7794, emissions: 3500000, population: 1055450, sources: ['transport', 'residential'] },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462, emissions: 12000000, population: 2815601, sources: ['transport', 'residential'] },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, emissions: 14000000, population: 3073350, sources: ['transport', 'industry'] },
  { name: 'Amritsar', lat: 31.6340, lon: 74.8723, emissions: 7000000, population: 1132383, sources: ['transport', 'residential'] },
  // South
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946, emissions: 26000000, population: 8443675, sources: ['transport', 'industry', 'power'] },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, emissions: 24000000, population: 7090000, sources: ['transport', 'industry'] },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, emissions: 22000000, population: 6809970, sources: ['transport', 'industry'] },
  { name: 'Kochi', lat: 9.9312, lon: 76.2673, emissions: 6000000, population: 677381, sources: ['transport', 'residential'] },
  { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, emissions: 8000000, population: 1600000, sources: ['industry', 'transport'] },
  { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185, emissions: 10000000, population: 2035922, sources: ['industry', 'port', 'power'] },
  // West
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, emissions: 36000000, population: 12442373, sources: ['transport', 'industry', 'residential'] },
  { name: 'Pune', lat: 18.5204, lon: 73.8567, emissions: 14000000, population: 3124458, sources: ['transport', 'industry'] },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, emissions: 18000000, population: 5570585, sources: ['industry', 'transport'] },
  { name: 'Surat', lat: 21.1702, lon: 72.8311, emissions: 16000000, population: 4462002, sources: ['industry', 'transport'] },
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882, emissions: 9000000, population: 2405665, sources: ['transport', 'power'] },
  // East
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, emissions: 30000000, population: 4496694, sources: ['transport', 'industry', 'power'] },
  { name: 'Patna', lat: 25.5941, lon: 85.1376, emissions: 9000000, population: 1683200, sources: ['transport', 'residential'] },
  { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, emissions: 7000000, population: 837737, sources: ['transport', 'industry'] },
  { name: 'Ranchi', lat: 23.3441, lon: 85.3096, emissions: 6000000, population: 1122000, sources: ['transport', 'residential'] },
  // Northeast
  { name: 'Guwahati', lat: 26.1445, lon: 91.7362, emissions: 6000000, population: 963429, sources: ['transport', 'residential'] },
  { name: 'Shillong', lat: 25.5788, lon: 91.8933, emissions: 2000000, population: 143229, sources: ['residential', 'transport'] },
  // Central
  { name: 'Indore', lat: 22.7196, lon: 75.8577, emissions: 9000000, population: 1960631, sources: ['transport', 'industry'] },
  { name: 'Bhopal', lat: 23.2599, lon: 77.4126, emissions: 8000000, population: 1798218, sources: ['transport', 'residential'] },
  { name: 'Raipur', lat: 21.2514, lon: 81.6296, emissions: 7000000, population: 1010087, sources: ['industry', 'power'] },
];

function Legend() {
  return (
    <div className="absolute right-3 top-3 z-[400] rounded-md bg-white px-3 py-2 text-xs text-neutral-900 shadow">
      <p className="font-semibold">Legend</p>
      <div className="mt-1 space-y-1">
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500"></span> Low</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-yellow-400"></span> Medium</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-500"></span> High</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500"></span> Very High</div>
      </div>
    </div>
  );
}

function FitIndia() {
  const map = useMap();
  React.useEffect(() => {
    map.setView([22.5, 79], 4.5);
  }, [map]);
  return null;
}

export default function IndiaEmissionsMap() {
  const enriched = useMemo(() => CITIES.map(c => ({
    ...c,
    perCapita: c.emissions / (c.population || 1),
  })), []);

  const totals = useMemo(() => {
    const totalEmissions = enriched.reduce((a, c) => a + c.emissions, 0);
    const totalPopulation = enriched.reduce((a, c) => a + c.population, 0);
    const avgPerCapita = totalEmissions / (totalPopulation || 1);
    const top10 = [...enriched].sort((a,b)=>b.emissions - a.emissions).slice(0,10);
    return { totalEmissions, avgPerCapita, top10 };
  }, [enriched]);

  function colorFor(value) {
    // value in tonnes; city emissions magnitude
    if (value < 6_000_000) return 'bg-green-500';
    if (value < 12_000_000) return 'bg-yellow-400';
    if (value < 24_000_000) return 'bg-orange-500';
    return 'bg-red-500';
  }

  function colorHex(value) {
    if (value < 6_000_000) return '#22c55e';
    if (value < 12_000_000) return '#facc15';
    if (value < 24_000_000) return '#f97316';
    return '#ef4444';
  }

  return (
    <div className="grid lg:grid-cols-[1fr,380px] gap-6 items-start">
      <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10">
        <MapContainer style={{ height: 520, width: '100%' }} zoom={5} center={[22.5, 79]} scrollWheelZoom={true} className="z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitIndia />
          {enriched.map((c, i) => {
            const radius = Math.max(6, Math.sqrt(c.emissions) / 200); // scale visually
            return (
              <CircleMarker key={i} center={[c.lat, c.lon]} radius={radius} pathOptions={{ color: colorHex(c.emissions), fillColor: colorHex(c.emissions), fillOpacity: 0.6 }}>
                <Popup>
                  <div className="min-w-[220px]">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm text-neutral-700">Annual CO₂: {(c.emissions/1_000_000).toFixed(1)} million t</p>
                    <p className="text-sm text-neutral-700">Population: {c.population.toLocaleString()}</p>
                    <p className="text-sm text-neutral-700">Per capita: {c.perCapita.toFixed(2)} t</p>
                    <p className="text-sm mt-1"><span className="text-neutral-600">Main sources:</span> {c.sources.join(', ')}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
        <Legend />
      </div>

      <aside className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 sm:p-6">
        <p className="text-sm text-white/60">Coverage</p>
        <p className="text-2xl font-semibold">{enriched.length} cities</p>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-neutral-900/70 ring-1 ring-white/10 p-4">
            <p className="text-xs text-white/60">Combined emissions</p>
            <p className="mt-1 text-lg font-semibold">{(totals.totalEmissions/1_000_000).toFixed(1)}M t</p>
          </div>
          <div className="rounded-lg bg-neutral-900/70 ring-1 ring-white/10 p-4">
            <p className="text-xs text-white/60">Avg per capita</p>
            <p className="mt-1 text-lg font-semibold">{totals.avgPerCapita.toFixed(2)} t</p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm text-white/60 mb-2">Top emitting cities</p>
          <ul className="space-y-2">
            {totals.top10.map((c, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${colorFor(c.emissions)}`}></span>
                  <span>{c.name}</span>
                </div>
                <span className="text-white/70">{(c.emissions/1_000_000).toFixed(1)}M t</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
