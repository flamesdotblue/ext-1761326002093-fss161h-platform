import React, { useEffect, useMemo, useState } from 'react';

function classifyAQI(aqi) {
  if (aqi <= 50) return { label: 'Good', color: 'bg-green-500', ring: 'ring-green-400', desc: 'Air quality is satisfactory and poses little or no risk.' };
  if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-500', ring: 'ring-yellow-400', desc: 'Acceptable; some pollutants may pose a moderate health concern for a very small number of people.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', ring: 'ring-orange-400', desc: 'Members of sensitive groups may experience health effects.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500', ring: 'ring-red-400', desc: 'Everyone may begin to experience health effects.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-600', ring: 'ring-purple-400', desc: 'Health warnings of emergency conditions.' };
  return { label: 'Hazardous', color: 'bg-rose-700', ring: 'ring-rose-500', desc: 'Serious health effects; avoid outdoor activity.' };
}

export default function AQIMonitor() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
      },
      (err) => {
        setError(err.message || 'Unable to obtain location.');
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    async function fetchAQI(lat, lon) {
      try {
        const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
        url.searchParams.set('latitude', lat);
        url.searchParams.set('longitude', lon);
        url.searchParams.set('hourly', 'pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi');
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to fetch air quality');
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    }
    if (coords) fetchAQI(coords.latitude, coords.longitude);
  }, [coords]);

  const latest = useMemo(() => {
    if (!data?.hourly) return null;
    const h = data.hourly;
    const idx = h.time.length - 1;
    return {
      aqi: h.us_aqi?.[idx] ?? null,
      pm25: h.pm2_5?.[idx] ?? null,
      pm10: h.pm10?.[idx] ?? null,
      o3: h.ozone?.[idx] ?? null,
      no2: h.nitrogen_dioxide?.[idx] ?? null,
      co: h.carbon_monoxide?.[idx] ?? null,
      so2: h.sulphur_dioxide?.[idx] ?? null,
      time: h.time?.[idx] ?? null,
    };
  }, [data]);

  const aqiInfo = latest?.aqi != null ? classifyAQI(latest.aqi) : null;

  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 sm:p-6">
      {loading && <p className="text-white/70">Fetching your location and air quality…</p>}
      {error && <p className="text-rose-400">{error}</p>}
      {!loading && !error && latest && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className={`rounded-xl p-5 ring-1 ${aqiInfo?.ring} bg-neutral-900/70`}>
              <p className="text-sm text-white/70">Current AQI</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-semibold">{Math.round(latest.aqi)}</span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-white/10 ring-1 ring-white/10">US AQI</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${aqiInfo?.color}`}></span>
                <span className="font-medium">{aqiInfo?.label}</span>
              </div>
              <p className="mt-2 text-sm text-white/70">{aqiInfo?.desc}</p>
              {coords && (
                <p className="mt-3 text-xs text-white/60">Lat {coords.latitude.toFixed(3)}, Lon {coords.longitude.toFixed(3)}</p>
              )}
            </div>
          </div>
          <div className="col-span-2 grid sm:grid-cols-2 gap-4">
            <Metric label="PM2.5" value={latest.pm25} unit="µg/m³"/>
            <Metric label="PM10" value={latest.pm10} unit="µg/m³"/>
            <Metric label="O₃" value={latest.o3} unit="µg/m³"/>
            <Metric label="NO₂" value={latest.no2} unit="µg/m³"/>
            <Metric label="CO" value={latest.co} unit="µg/m³"/>
            <Metric label="SO₂" value={latest.so2} unit="µg/m³"/>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, unit }) {
  return (
    <div className="rounded-lg bg-neutral-900/70 ring-1 ring-white/10 p-4">
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value != null ? Math.round(value) : '-'} <span className="text-xs font-normal text-white/60">{unit}</span></p>
    </div>
  );
}
