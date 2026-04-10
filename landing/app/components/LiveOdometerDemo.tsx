"use client";

import { useEffect, useMemo, useState } from "react";

const GLOBAL_EPOCH_MS = Date.UTC(2026, 0, 1, 0, 0, 0);
const GLOBAL_BASE_METERS = 142_800;

// Monotonic synthetic model:
// f(t) = base + minRate*t + a1*Integral(sin^2(t/w1)) + a2*Integral(sin^2(t/w2))
// Derivative is always positive, so refreshes never move the counter backward.
const MIN_RATE_MPS = 6.1;
const BURST_AMP_1 = 3.2;
const BURST_AMP_2 = 1.4;
const BURST_WINDOW_1 = 780;
const BURST_WINDOW_2 = 245;

function syntheticGlobalMeters(nowMs: number) {
  const t = Math.max(0, (nowMs - GLOBAL_EPOCH_MS) / 1000);

  const burst1 =
    BURST_AMP_1 *
    (t / 2 - (Math.sin((2 * t) / BURST_WINDOW_1) * BURST_WINDOW_1) / 4);

  const burst2 =
    BURST_AMP_2 *
    (t / 2 - (Math.sin((2 * t) / BURST_WINDOW_2) * BURST_WINDOW_2) / 4);

  return GLOBAL_BASE_METERS + MIN_RATE_MPS * t + burst1 + burst2;
}

function formatDistance(meters: number) {
  if (meters >= 1000) {
    return `${(meters / 1000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} km`;
  }

  return `${meters.toFixed(1)} m`;
}

type LiveOdometerDemoProps = {
  checkoutUrl: string;
  compact?: boolean;
};

export default function LiveOdometerDemo({ checkoutUrl, compact = false }: LiveOdometerDemoProps) {
  const [globalMeters, setGlobalMeters] = useState(() => syntheticGlobalMeters(Date.now()));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setGlobalMeters(syntheticGlobalMeters(Date.now()));
    }, 300);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const subLabel = useMemo(() => {
    return `Estimated live global mileage`; 
  }, []);

  if (compact) {
    return (
      <div className="mt-10 rounded-xl2 border border-line bg-white/80 p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">global visitor meter</p>
            <p className="mt-1 text-sm font-semibold text-black/60">Cursor miles ticking upward worldwide.</p>
            <p className="mt-1 text-xs text-black/45">{subLabel}</p>
          </div>

          <a
            href={checkoutUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90"
          >
            Get Odo
          </a>
        </div>

        <div className="mt-4 rounded-xl border border-line bg-white p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-black/45">all visitors</p>
          <p className="display-font mt-1 text-3xl font-black text-ink">{formatDistance(globalMeters)}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container-shell pb-24">
      <div className="rounded-[2rem] border border-line bg-white/80 p-6 shadow-soft md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">global visitor meter</p>
            <h2 className="display-font mt-2 max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">
              A shared odometer for everyone on Odo.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-black/55 md:text-base">
              This counter is a smooth global simulation designed to feel live and continuously moving.
            </p>
          </div>

          <a
            href={checkoutUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90"
          >
            Get Odo
          </a>
        </div>

        <div className="mt-6 rounded-xl2 border border-line bg-white p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-black/45">all visitors</p>
          <p className="display-font mt-2 text-4xl font-black text-ink md:text-5xl">{formatDistance(globalMeters)}</p>
          <p className="mt-2 text-sm text-black/50">{subLabel}</p>
        </div>
      </div>
    </section>
  );
}
