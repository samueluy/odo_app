"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const GLOBAL_EPOCH_MS = Date.UTC(2026, 0, 1, 0, 0, 0);
const GLOBAL_BASE_METERS = 371_000;
const PERSONAL_TOTAL_KEY = "odo.web.totalMeters";
const DEMO_METERS_PER_PIXEL = 0.000264583;
const SLOT_MS = 30 * 60 * 1000;
const SLOT_INCREMENT_MIN = 100;
const SLOT_INCREMENT_MAX = 3000;

function hash32(value: number) {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x45d9f3b);
  x ^= x >>> 16;
  x = Math.imul(x, 0x45d9f3b);
  x ^= x >>> 16;
  return x >>> 0;
}

function slotIncrement(slotIndex: number) {
  const seeded = hash32(slotIndex + 0x9e3779b9);
  const range = SLOT_INCREMENT_MAX - SLOT_INCREMENT_MIN + 1;
  return SLOT_INCREMENT_MIN + (seeded % range);
}

function syntheticGlobalState(nowMs: number) {
  const elapsed = Math.max(0, nowMs - GLOBAL_EPOCH_MS);
  const completedSlots = Math.floor(elapsed / SLOT_MS);

  let totalMeters = GLOBAL_BASE_METERS;
  for (let i = 0; i < completedSlots; i += 1) {
    totalMeters += slotIncrement(i);
  }

  const nextUpdateAt = GLOBAL_EPOCH_MS + (completedSlots + 1) * SLOT_MS;
  const lastIncrement = completedSlots > 0 ? slotIncrement(completedSlots - 1) : 0;

  return {
    totalMeters,
    nextUpdateAt,
    lastIncrement
  };
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
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const localTotalRef = useRef(0);
  const lastPaintRef = useRef(0);

  const [state, setState] = useState(() => syntheticGlobalState(Date.now()));
  const [personalMeters, setPersonalMeters] = useState(0);

  useEffect(() => {
    const savedTotal = Number(window.localStorage.getItem(PERSONAL_TOTAL_KEY) ?? 0);
    if (Number.isFinite(savedTotal) && savedTotal > 0) {
      localTotalRef.current = savedTotal;
      setPersonalMeters(savedTotal);
    }
  }, []);

  useEffect(() => {
    function onPointerMove(event: MouseEvent) {
      const current = { x: event.clientX, y: event.clientY };
      const previous = lastPointRef.current;
      lastPointRef.current = current;

      if (!previous) {
        return;
      }

      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const pixelDistance = Math.hypot(dx, dy);

      if (pixelDistance < 0.5) {
        return;
      }

      localTotalRef.current += pixelDistance * DEMO_METERS_PER_PIXEL;
      window.localStorage.setItem(PERSONAL_TOTAL_KEY, localTotalRef.current.toFixed(4));

      const now = performance.now();
      if (now - lastPaintRef.current > 120) {
        lastPaintRef.current = now;
        setPersonalMeters(localTotalRef.current);
      }
    }

    function onPointerLeaveWindow(event: MouseEvent) {
      if (event.relatedTarget) {
        return;
      }
      lastPointRef.current = null;
    }

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mouseout", onPointerLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseout", onPointerLeaveWindow);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setState(syntheticGlobalState(Date.now()));
    }, 10_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const minutesToNext = useMemo(() => {
    const remainingMs = Math.max(0, state.nextUpdateAt - Date.now());
    return Math.ceil(remainingMs / 60000);
  }, [state]);

  const subLabel = useMemo(() => {
    if (state.lastIncrement <= 0) {
      return `Starts jumping every 30 minutes (+100 to +3000 m each update)`;
    }

    return `Last jump: +${state.lastIncrement.toLocaleString()} m. Next jump in ~${minutesToNext} min.`;
  }, [state.lastIncrement, minutesToNext]);

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

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-black/45">your odo</p>
            <p className="display-font mt-1 text-3xl font-black text-ink">{formatDistance(personalMeters)}</p>
            <p className="mt-1 text-xs text-black/45">browser cached total</p>
          </div>

          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-black/45">all visitors</p>
            <p className="display-font mt-1 text-3xl font-black text-ink">{formatDistance(state.totalMeters)}</p>
            <p className="mt-1 text-xs text-black/45">global meter</p>
          </div>
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

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl2 border border-line bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">your odo</p>
            <p className="display-font mt-2 text-4xl font-black text-ink md:text-5xl">{formatDistance(personalMeters)}</p>
            <p className="mt-2 text-sm text-black/50">Browser cached personal total</p>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">all visitors</p>
            <p className="display-font mt-2 text-4xl font-black text-ink md:text-5xl">{formatDistance(state.totalMeters)}</p>
            <p className="mt-2 text-sm text-black/50">{subLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
