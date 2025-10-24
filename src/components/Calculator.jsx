import React, { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const GLOBAL_AVG = 4.7; // tonnes CO2e/year

const DIETS = [
  { key: 'vegan', label: 'Vegan', value: 1.5 },
  { key: 'vegetarian', label: 'Vegetarian', value: 2.0 },
  { key: 'light', label: 'Light Meat', value: 3.0 },
  { key: 'medium', label: 'Medium Meat', value: 4.0 },
  { key: 'heavy', label: 'Heavy Meat', value: 5.0 },
];

const COLORS = ['#34d399', '#60a5fa', '#f59e0b', '#f43f5e'];

export default function Calculator() {
  const [inputs, setInputs] = useState({
    carKmPerYear: 8000,
    airHoursPerYear: 10,
    electricityKwhPerMonth: 120,
    diet: 'medium',
    wasteKgPerMonth: 25,
  });

  // Emission factors
  const factors = {
    carTonnesPerKm: 0.0002, // t/km
    airTonnesPerHour: 0.09, // t/hour
    electricityTonnesPerKwh: 0.0007, // t/kWh
    wasteTonnesPerKg: 0.0012, // t/kg
  };

  const dietTonnes = useMemo(() => DIETS.find(d => d.key === inputs.diet)?.value ?? 4.0, [inputs.diet]);

  const breakdown = useMemo(() => {
    const transport = inputs.carKmPerYear * factors.carTonnesPerKm + inputs.airHoursPerYear * factors.airTonnesPerHour;
    const energy = inputs.electricityKwhPerMonth * 12 * factors.electricityTonnesPerKwh;
    const diet = dietTonnes;
    const waste = inputs.wasteKgPerMonth * 12 * factors.wasteTonnesPerKg;
    return { transport, energy, diet, waste };
  }, [inputs, dietTonnes]);

  const total = useMemo(() => Object.values(breakdown).reduce((a, b) => a + b, 0), [breakdown]);

  const chartData = useMemo(() => [
    { name: 'Transportation', value: +breakdown.transport.toFixed(3) },
    { name: 'Energy', value: +breakdown.energy.toFixed(3) },
    { name: 'Diet', value: +breakdown.diet.toFixed(3) },
    { name: 'Waste', value: +breakdown.waste.toFixed(3) },
  ], [breakdown]);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: name === 'diet' ? value : Number(value) }));
  }

  function saveCalculation() {
    const entry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      inputs,
      breakdown,
      total,
    };
    const history = JSON.parse(localStorage.getItem('ecotrack_history') || '[]');
    history.unshift(entry);
    localStorage.setItem('ecotrack_history', JSON.stringify(history.slice(0, 50)));
  }

  const topCategory = useMemo(() => {
    const entries = Object.entries(breakdown);
    entries.sort((a,b)=>b[1]-a[1]);
    return entries[0]?.[0] ?? 'diet';
  }, [breakdown]);

  const tips = useMemo(() => {
    const list = [];
    if (breakdown.transport > 1.5) list.push('Reduce car trips, carpool, or switch to public transport. Consider EVs for lower g/km.');
    if (breakdown.energy > 1.2) list.push('Improve home efficiency: LED lighting, efficient ACs, and solar where possible.');
    if (inputs.diet !== 'vegan') list.push('Shift meals towards plant-forward options to cut diet emissions.');
    if (breakdown.waste > 0.5) list.push('Increase recycling/composting and cut single-use packaging.');
    if (!list.length) list.push('Great job! Maintain your habits and share what works with friends.');
    return list.slice(0, 3);
  }, [breakdown, inputs.diet]);

  useEffect(() => {
    // First render can pre-populate one entry for demo
    const hasHistory = localStorage.getItem('ecotrack_history');
    if (!hasHistory) saveCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 sm:p-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-white/70">Car travel (km/year)</label>
            <input type="number" name="carKmPerYear" value={inputs.carKmPerYear} onChange={handleChange}
              className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" min={0} />
          </div>
          <div>
            <label className="block text-sm text-white/70">Air travel (hours/year)</label>
            <input type="number" name="airHoursPerYear" value={inputs.airHoursPerYear} onChange={handleChange}
              className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" min={0} />
          </div>
          <div>
            <label className="block text-sm text-white/70">Electricity (kWh/month)</label>
            <input type="number" name="electricityKwhPerMonth" value={inputs.electricityKwhPerMonth} onChange={handleChange}
              className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" min={0} />
          </div>
          <div>
            <label className="block text-sm text-white/70">Diet</label>
            <select name="diet" value={inputs.diet} onChange={handleChange}
              className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400">
              {DIETS.map(d => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/70">Waste (kg/month)</label>
            <input type="number" name="wasteKgPerMonth" value={inputs.wasteKgPerMonth} onChange={handleChange}
              className="mt-1 w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" min={0} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button onClick={saveCalculation}
            className="rounded-lg bg-emerald-500 text-neutral-900 px-4 py-2.5 text-sm font-medium hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300">
            Save calculation
          </button>
          <div className="text-sm text-white/70">
            Your total: <span className="font-semibold text-white">{total.toFixed(2)}</span> t CO₂e/year
          </div>
          <div className="text-sm text-white/60">
            vs global average {GLOBAL_AVG} t → <span className={total > GLOBAL_AVG ? 'text-rose-400' : 'text-emerald-400'}>
              {total > GLOBAL_AVG ? '+' : '-'}{Math.abs(total - GLOBAL_AVG).toFixed(2)} t
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 sm:p-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {chartData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v} t`} contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="space-y-2 text-sm">
              <p>Transportation: <span className="font-medium">{breakdown.transport.toFixed(2)} t</span></p>
              <p>Energy: <span className="font-medium">{breakdown.energy.toFixed(2)} t</span></p>
              <p>Diet: <span className="font-medium">{breakdown.diet.toFixed(2)} t</span></p>
              <p>Waste: <span className="font-medium">{breakdown.waste.toFixed(2)} t</span></p>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-neutral-900/70 ring-1 ring-white/10">
              <p className="text-sm text-white/70">Focus area:</p>
              <p className="text-base font-medium mt-1 capitalize">{topCategory}</p>
              <ul className="mt-3 text-sm list-disc list-inside space-y-1 text-white/80">
                {tips.map((t, i) => (<li key={i}>{t}</li>))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
