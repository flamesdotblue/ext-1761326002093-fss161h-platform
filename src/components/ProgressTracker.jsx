import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function ProgressTracker() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const r = JSON.parse(localStorage.getItem('ecotrack_calculations') || '[]');
    // Sort by time
    r.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    setRows(r);
  }, []);

  const stats = useMemo(() => {
    if (rows.length < 1) return null;
    const first = rows[0];
    const last = rows[rows.length - 1];
    const changePct = ((last.total - first.total) / (first.total || 1)) * 100;
    return {
      first: first.total,
      current: last.total,
      changePct,
      progressToTarget: Math.min(100, Math.max(0, (2 / (last.total || 1)) * 100)),
    };
  }, [rows]);

  const chartData = useMemo(() => {
    return rows.map((r) => ({
      time: new Date(r.timestamp).toLocaleDateString(),
      total: Number(r.total?.toFixed(2)),
      transport: Number((r.breakdown.car + r.breakdown.air).toFixed(2)),
      energy: Number(r.breakdown.energy.toFixed(2)),
      diet: Number(r.breakdown.diet.toFixed(2)),
      waste: Number(r.breakdown.waste.toFixed(2)),
    }));
  }, [rows]);

  return (
    <div className="bg-slate-900/60 rounded-2xl ring-1 ring-white/10 p-6">
      <div className="flex items-center gap-2 text-emerald-300">
        <TrendingUp className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Progress Tracking</h2>
      </div>
      <p className="mt-1 text-sm text-slate-400">Monitor your footprint over time and progress toward 2.0 t CO₂e/year.</p>

      {rows.length < 2 ? (
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-800/50 p-6 text-sm text-slate-300">
          Add at least 2 calculations to see trends. Use the calculator above and click "Calculate & Save" after adjusting inputs at different times.
        </div>
      ) : (
        <div className="mt-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} dot={false} name="Total" />
                <Line type="monotone" dataKey="transport" stroke="#10b981" strokeWidth={1.6} dot={false} name="Transport" />
                <Line type="monotone" dataKey="energy" stroke="#eab308" strokeWidth={1.6} dot={false} name="Energy" />
                <Line type="monotone" dataKey="diet" stroke="#f97316" strokeWidth={1.6} dot={false} name="Diet" />
                <Line type="monotone" dataKey="waste" stroke="#ef4444" strokeWidth={1.6} dot={false} name="Waste" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {stats && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPI label="Total Change" value={`${stats.changePct >= 0 ? '+' : ''}${stats.changePct.toFixed(1)}%`} accent={stats.changePct <= 0 ? 'text-emerald-400' : 'text-rose-400'} />
              <KPI label="Current Footprint" value={`${stats.current.toFixed(2)} t`} />
              <KPI label="First Measurement" value={`${stats.first.toFixed(2)} t`} />
              <KPI label="Paris Goal Progress" value={`${stats.progressToTarget.toFixed(0)}%`} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, accent }) {
  return (
    <div className="rounded-lg bg-slate-800/60 p-4 border border-slate-700">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`text-xl font-semibold ${accent ?? 'text-white'}`}>{value}</div>
    </div>
  );
}
