import React from 'react';
import Spline from '@splinetool/react-spline';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[78vh] sm:h-[86vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/M2rj0DQ6tP7dSzSz/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/70 to-neutral-950 pointer-events-none" />

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
            Track. Reduce. Thrive.
          </h1>
          <p className="mt-4 text-white/70 text-base sm:text-lg">
            EcoTrack unifies carbon footprint analytics, AI-assisted insights, live air quality, and regional emissions data to help you act for a cleaner future.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Start calculating
            </a>
            <a
              href="#map"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 ring-1 ring-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              Explore emissions
            </a>
          </div>
          <div className="mt-10 hidden sm:flex items-center gap-2 text-white/70 text-sm">
            <ArrowDown className="h-4 w-4" /> Scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}
