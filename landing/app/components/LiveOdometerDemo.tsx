"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEMO_METERS_PER_PIXEL = 0.000264583;
const API_ENDPOINT = "/api/visitor-odometer";
const LOCAL_TOTAL_KEY = "odo.web.totalMeters";
const LOCAL_SESSION_KEY = "odo.web.sessionMeters";

function formatDistance(meters: number) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${meters.toFixed(1)} m`;
}

type LiveOdometerDemoProps = {
  checkoutUrl: string;
  compact?: boolean;
};

export default function LiveOdometerDemo({ checkoutUrl, compact = false }: LiveOdometerDemoProps) {
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const pendingMetersRef = useRef(0);
  const localTotalRef = useRef(0);
  const localSessionRef = useRef(0);
  const lastUiPaintRef = useRef(0);

  const [sessionMeters, setSessionMeters] = useState(0);
  const [personalMeters, setPersonalMeters] = useState(0);
  const [totalMeters, setTotalMeters] = useState(0);
  const [kvConfigured, setKvConfigured] = useState(true);
  const [statusText, setStatusText] = useState("Move anywhere on this page to rack up mileage.");

  const flushPendingMeters = useCallback(async () => {
    const pending = pendingMetersRef.current;
    if (pending < 0.5) {
      return;
    }

    pendingMetersRef.current = 0;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ deltaMeters: pending })
      });

      if (!response.ok) {
        pendingMetersRef.current += pending;
        return;
      }

      const payload = (await response.json()) as { totalMeters?: number; configured?: boolean };
      setKvConfigured(payload.configured ?? true);
      if (typeof payload.totalMeters === "number") {
        setTotalMeters(Math.max(0, payload.totalMeters));
      }
    } catch {
      pendingMetersRef.current += pending;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const savedTotal = Number(window.localStorage.getItem(LOCAL_TOTAL_KEY) ?? 0);
    const savedSession = Number(window.localStorage.getItem(LOCAL_SESSION_KEY) ?? 0);
    if (Number.isFinite(savedTotal) && savedTotal > 0) {
      localTotalRef.current = savedTotal;
      setPersonalMeters(savedTotal);
    }
    if (Number.isFinite(savedSession) && savedSession > 0) {
      localSessionRef.current = savedSession;
      setSessionMeters(savedSession);
    }

    async function fetchTotal() {
      try {
        const response = await fetch(API_ENDPOINT, { cache: "no-store" });
        if (!response.ok || !mounted) {
          return;
        }

        const payload = (await response.json()) as { totalMeters?: number; configured?: boolean };
        setKvConfigured(payload.configured ?? true);
        setTotalMeters(Math.max(0, Number(payload.totalMeters ?? 0)));
      } catch {
        if (mounted) {
          setKvConfigured(false);
        }
      }
    }

    fetchTotal();
    const interval = window.setInterval(fetchTotal, 15000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void flushPendingMeters();
    }, 1800);

    return () => {
      window.clearInterval(interval);
      void flushPendingMeters();
    };
  }, [flushPendingMeters]);

  useEffect(() => {
    function onPointerMove(event: MouseEvent) {
      const x = event.clientX;
      const y = event.clientY;

      const previous = lastPointRef.current;
      lastPointRef.current = { x, y };

      if (!previous) {
        setStatusText("Tracking live. Your cursor is now on a road trip.");
        return;
      }

      const dx = x - previous.x;
      const dy = y - previous.y;
      const pixelDistance = Math.hypot(dx, dy);

      if (pixelDistance < 0.5) {
        return;
      }

      const deltaMeters = pixelDistance * DEMO_METERS_PER_PIXEL;

      pendingMetersRef.current += deltaMeters;
      localSessionRef.current += deltaMeters;
      localTotalRef.current += deltaMeters;

      window.localStorage.setItem(LOCAL_TOTAL_KEY, localTotalRef.current.toFixed(4));
      window.localStorage.setItem(LOCAL_SESSION_KEY, localSessionRef.current.toFixed(4));

      const now = performance.now();
      if (now - lastUiPaintRef.current > 80) {
        lastUiPaintRef.current = now;
        setSessionMeters(localSessionRef.current);
        setPersonalMeters(localTotalRef.current);
      }
    }

    function onPointerLeaveWindow(event: MouseEvent) {
      if (event.relatedTarget) {
        return;
      }
      lastPointRef.current = null;
      setStatusText("Cruise paused. Bring your cursor back on page.");
    }

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mouseout", onPointerLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseout", onPointerLeaveWindow);
    };
  }, []);

  const onResetLap = useCallback(() => {
    localSessionRef.current = 0;
    setSessionMeters(0);
    window.localStorage.setItem(LOCAL_SESSION_KEY, "0");
    lastPointRef.current = null;
    setStatusText("Lap reset. Start a fresh run.");
  }, []);

  const globalLabel = useMemo(() => {
    if (!kvConfigured) {
      return "Connect Vercel KV to activate global visitor odometer.";
    }
    return `${formatDistance(totalMeters)} driven by all visitors`;
  }, [kvConfigured, totalMeters]);

  if (compact) {
    return (
      <div className="mt-10 grid gap-4 md:grid-cols-[1.3fr_1fr] md:items-stretch">
        <div className="rounded-xl2 border border-line bg-white/80 p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">live odo</p>
          <p className="mt-2 text-base font-semibold text-black/65">Tracking this whole page in real time.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-black/45">this run</p>
              <p className="display-font mt-1 text-xl font-black text-ink">{formatDistance(sessionMeters)}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-black/45">your odo</p>
              <p className="display-font mt-1 text-xl font-black text-ink">{formatDistance(personalMeters)}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-black/45">all visitors</p>
              <p className="display-font mt-1 text-xl font-black text-ink">{formatDistance(totalMeters)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl2 border border-line bg-black p-5 text-white shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-white/55">live meter</p>
          <p className="display-font mt-1 text-3xl font-black">{formatDistance(sessionMeters)}</p>
          <p className="mt-1 text-xs text-white/65">{statusText}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onResetLap}
              className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white transition hover:border-white/45"
            >
              Reset lap
            </button>
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-black transition hover:bg-[#ff8f40]"
            >
              Install Odo
            </a>
          </div>
          <p className="mt-3 text-[11px] text-white/50">{globalLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container-shell pb-24">
      <div className="rounded-[2rem] border border-line bg-white/80 p-6 shadow-soft md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">whole-page live odometer</p>
            <h2 className="display-font mt-2 max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">
              This entire page is your test track.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-black/55 md:text-base">
              Move your cursor anywhere on this site. We convert pointer travel into real-time distance, store your personal odometer in this browser, and add your mileage to the global visitor total.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-black px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">this run</p>
            <p className="display-font mt-1 text-3xl font-black">{formatDistance(sessionMeters)}</p>
            <p className="mt-1 text-xs text-white/65">real-time page tracking</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl2 border border-line bg-gradient-to-br from-[#fff7ef] via-white to-[#fff2e5] p-5 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">road status</p>
            <p className="mt-2 text-base font-semibold text-black/65 md:text-lg">{statusText}</p>
            <p className="mt-2 text-sm text-black/50">Tip: scroll, hover, zig-zag, and explore sections to increase mileage.</p>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">your odo total</p>
            <p className="display-font mt-2 text-3xl font-black text-ink">{formatDistance(personalMeters)}</p>
            <p className="mt-2 text-xs text-black/45">saved in this browser</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-semibold text-black/65">{globalLabel}</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onResetLap}
              className="rounded-full border border-black/15 bg-white px-5 py-2 text-sm font-semibold text-ink transition hover:border-black/35"
            >
              Reset my lap
            </button>

            <button
              type="button"
              onClick={() => {
                localTotalRef.current = 0;
                localSessionRef.current = 0;
                setPersonalMeters(0);
                setSessionMeters(0);
                window.localStorage.setItem(LOCAL_TOTAL_KEY, "0");
                window.localStorage.setItem(LOCAL_SESSION_KEY, "0");
                setStatusText("Personal odometer reset. New road starts now.");
              }}
              className="rounded-full border border-black/15 bg-white px-5 py-2 text-sm font-semibold text-ink transition hover:border-black/35"
            >
              Reset my odo
            </button>

            <a
              href={checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90"
            >
              Get Odo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
