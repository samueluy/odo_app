import LiveOdometerDemo from "./components/LiveOdometerDemo";

const features = [
  {
    title: "Total + Today Dashboard",
    text: "Keep it simple: lifetime mileage and today's distance, side by side.",
    icon: "gauge"
  },
  {
    title: "Live Menu Bar Odometer",
    text: "Real-time readouts while you work. Zero fuel surcharge.",
    icon: "gauge"
  },
  {
    title: "7-Day Trip Report",
    text: "Spot your best mileage days with a trend chart tuned for one-glance clarity.",
    icon: "chart"
  },
  {
    title: "Mileage Badges",
    text: "From first kilometer to long-haul legend, every milestone feels earned.",
    icon: "badge"
  },
  {
    title: "Distance Multipliers",
    text: "From 10-meter steps to marathon scale, see exactly how many loops your cursor has done.",
    icon: "chart"
  }
];

const checkoutUrl =
  process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "https://lemonsqueezy.com";

const productHuntUrl =
  process.env.NEXT_PUBLIC_PRODUCTHUNT_URL || "https://www.producthunt.com";

function Icon({ kind }: { kind: string }) {
  const common = "h-5 w-5 text-accent";

  if (kind === "target") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "flame") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M12 3C9 7 15 9 11 13C8 16 9.5 21 13 21C16.5 21 19 18.5 19 15C19 10.5 15.5 8 12 3Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "gauge") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M4 15C4 10.58 7.58 7 12 7C16.42 7 20 10.58 20 15" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 12L15.8 9.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "chart") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M4 19H20" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 16V11" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 16V7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M17 16V9" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "badge") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 14L8 20L12 18L16 20L15 14" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "bolt") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M13 2L6 13H11L10 22L18 10H13L13 2Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "palette") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M12 4C7.6 4 4 7.13 4 11C4 14.87 7.13 18 11 18H12C13 18 14 19 14 20C14 20.55 14.45 21 15 21C18.87 21 22 17.87 22 14C22 8.48 17.52 4 12 4Z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="8" cy="10" r="1" fill="currentColor" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
        <circle cx="16" cy="10" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "lock") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 10V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V10" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
      <path d="M12 4V7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="14" r="7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="grid-bg bg-surface">
      <header className="container-shell flex items-center justify-between py-8">
        <a href="#top" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <img src="/odo_logo.png" alt="Odo" className="h-10 w-10 rounded-xl" />
          <span className="display-font text-2xl font-black tracking-tight text-ink">odo</span>
        </a>

        <p className="hidden text-xs font-semibold text-black/50 lg:block">track mileage without paying for fuel</p>

        <a
          href={checkoutUrl}
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90"
          target="_blank"
          rel="noreferrer"
        >
          Start your engine
        </a>
      </header>

      <section id="top" className="container-shell pb-20 pt-8 text-center md:pb-28 md:pt-16">
        <div className="mx-auto mb-6 h-24 w-24 animate-float rounded-[1.6rem] bg-white/70 p-1 shadow-card backdrop-blur">
          <img src="/odo_logo.png" alt="Odo logo" className="h-full w-full rounded-[1.35rem] object-cover" />
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-black/40">cursor distance tracker for macOS</p>

        <h1 className="display-font mx-auto max-w-3xl text-balance text-5xl font-extrabold leading-[0.95] tracking-tight text-ink md:text-7xl">
          Gas is expensive.
          <br className="hidden md:block" />
          Your cursor isn't.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg text-black/55">
          While oil headlines and pump prices keep climbing, Odo lets you scratch the road-trip itch on your desk. Track cursor distance, compare loops, and rack up miles for pennies.
        </p>

        <LiveOdometerDemo checkoutUrl={checkoutUrl} compact />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={checkoutUrl}
            className="rounded-full bg-black px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90"
            target="_blank"
            rel="noreferrer"
          >
            Download Odo (Pay What You Want)
          </a>

          <a
            href={productHuntUrl}
            className="rounded-full border border-black/15 bg-white px-8 py-4 text-base font-semibold text-ink transition hover:-translate-y-0.5 hover:border-black/35"
            target="_blank"
            rel="noreferrer"
          >
            Upvote on Product Hunt
          </a>
        </div>

        <p className="mt-4 text-sm text-black/50">
          Launch pricing: <span className="font-bold text-ink">pay what you want</span> (default <span className="font-semibold">$2.99</span>, yes even <span className="font-semibold">$0</span>).
        </p>
        <p className="mt-2 text-xs text-black/45">No subscription. No pressure. Tip if you want to support the build.</p>
      </section>

      <section className="container-shell pb-24">
        <div className="rounded-[2rem] border border-line bg-white/70 p-4 shadow-soft backdrop-blur md:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Actual App Preview</p>
            <p className="text-xs text-black/45">What the real macOS app looks like</p>
          </div>

          <div className="mx-auto w-full max-w-4xl rounded-[1rem] border border-black/10 bg-white p-2.5 shadow-card">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <p className="ml-2 text-xs font-semibold text-black/55">Odo</p>
            </div>

            <div className="space-y-2 rounded-xl border border-black/10 bg-white p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/odo_logo.png" alt="Odo" className="h-7 w-7 rounded-md" />
                  <div>
                    <p className="display-font text-xl font-black leading-none tracking-[0.08em] text-ink">ODO</p>
                    <p className="text-sm font-semibold text-black/45">Gas is expensive. Your cursor isn't.</p>
                  </div>
                </div>
                <p className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-semibold text-black/50">TRACKING</p>
              </div>

              <div className="rounded-lg border border-black/10 bg-white p-2.5">
                <p className="text-xs text-black/65">Track cursor distance with total and today readouts.</p>
                <p className="text-xs text-black/65">Use comparisons to see your mileage stack up from 10 m to marathon scale.</p>
                <p className="text-xs text-black/65">Still a stretch as productivity analytics, but at least gas is not involved.</p>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-lg border border-[#8eb9ef] bg-white p-2.5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40">Total</p>
                  <p className="mt-1 text-4xl font-black leading-none text-[#20252b]">42.532 <span className="text-xl font-bold text-black/45">km</span></p>
                  <p className="mt-1 text-xs text-black/45">26.429 mi</p>
                </div>
                <div className="rounded-lg border border-[#f2c9a5] bg-white p-2.5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40">Today</p>
                  <p className="mt-1 text-4xl font-black leading-none text-[#20252b]">503.43 <span className="text-xl font-bold text-black/45">m</span></p>
                  <p className="mt-1 text-xs text-black/45">0.3128 mi</p>
                </div>
              </div>

              <div className="rounded-lg border border-[#9ec1ea] bg-white p-2.5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40">7-Day Trip Report</p>
                <div className="mt-3 grid grid-cols-7 items-end gap-3 text-center text-xs font-semibold text-black/40">
                  <div><div className="mx-auto mb-1 h-2 w-4 rounded bg-black/20" />Sat</div>
                  <div><div className="mx-auto mb-1 h-2 w-4 rounded bg-black/20" />Sun</div>
                  <div><div className="mx-auto mb-1 h-2 w-4 rounded bg-black/20" />Mon</div>
                  <div><div className="mx-auto mb-1 h-2 w-4 rounded bg-black/20" />Tue</div>
                  <div><div className="mx-auto mb-1 h-2 w-4 rounded bg-black/20" />Wed</div>
                  <div><div className="mx-auto mb-1 h-20 w-4 rounded bg-black/30" />Thu</div>
                  <div><div className="mx-auto mb-1 h-6 w-4 rounded bg-[#0f7be8]" />Fri</div>
                </div>
                <p className="mt-2 text-xs text-black/45">7-day total: 43.56 km</p>
              </div>

              <div className="rounded-lg border border-black/10 bg-white p-2.5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40">Distance Comparison</p>
                <p className="mt-1.5 text-sm text-black/70">You cursored a marathon!</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="font-semibold text-black/65">Units</span>
                <span className="rounded-md bg-[#0f7be8] px-2.5 py-1 font-bold text-white">km</span>
                <span className="rounded-md bg-black/5 px-2.5 py-1 font-semibold text-black/65">miles</span>
                <span className="ml-2 rounded-md bg-black/5 px-2.5 py-1 font-semibold text-black/65">Pause</span>
                <span className="ml-auto rounded-md bg-black/5 px-2.5 py-1 font-semibold text-black/65">Reset</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-xl2 border border-line bg-white/75 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">for builders</p>
            <h3 className="display-font mt-2 text-2xl font-bold tracking-tight">Measure real effort</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/55">
              End the day with actual mileage, not guesswork. Total and Today keep things clean.
            </p>
          </article>

          <article className="rounded-xl2 border border-line bg-white/75 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">for teams</p>
            <h3 className="display-font mt-2 text-2xl font-bold tracking-tight">Tiny morale boost</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/55">
              The comparison feed is a playful way to keep momentum without another expensive SaaS seat.
            </p>
          </article>

          <article className="rounded-xl2 border border-line bg-white/75 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">for launch week</p>
            <h3 className="display-font mt-2 text-2xl font-bold tracking-tight">Free if needed</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/55">
              Pay what you want with a $2.99 default. If budget is tight, set it to $0 and keep shipping.
            </p>
          </article>
        </div>
      </section>

      <section className="container-shell pb-20">
        <div className="grid gap-4 md:grid-cols-6">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`reveal rounded-xl2 border border-line bg-white/65 p-5 shadow-soft md:col-span-2 ${
                index === 3 ? "md:col-start-2" : ""
              } ${index === 4 ? "md:col-start-4" : ""}`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accentSoft">
                <Icon kind={feature.icon} />
              </div>
              <h3 className="display-font text-xl font-bold tracking-tight">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/55">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell pb-24">
        <div className="flex flex-col gap-8 rounded-[2rem] border border-line bg-white/65 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="display-font max-w-2xl text-5xl font-extrabold tracking-tight md:text-6xl">
              Skip the pump.
              <br className="hidden md:block" />
              Drive your cursor instead.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-black/55">
              Odo is free to try and pay-what-you-want to keep. Default is $2.99, but you can set it to $0 if that helps.
            </p>
          </div>

          <div className="min-w-[260px] space-y-4 text-center">
            <a
              href={checkoutUrl}
              className="block rounded-full bg-black px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90"
              target="_blank"
              rel="noreferrer"
            >
              Get Odo (PWYW)
            </a>
            <p className="text-sm text-black/45">Requires macOS 13+. One-time license.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="container-shell flex flex-wrap items-center justify-between gap-4 text-sm text-black/45">
          <p className="flex items-center gap-2">
            <img src="/odo_logo.png" alt="Odo" className="h-6 w-6 rounded-md" />
            <span>Odo by Samuel Uy</span>
          </p>

          <div className="flex items-center gap-6">
            <a href="mailto:hello@odo.app" className="transition hover:text-ink">Support</a>
            <a href="#" className="transition hover:text-ink">Privacy</a>
            <a href={productHuntUrl} target="_blank" rel="noreferrer" className="transition hover:text-ink">
              Product Hunt
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
