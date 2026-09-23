import { useLayoutEffect, useRef } from "react";

// The ship photo lives in client/public/journey-ship.jpg. Replace that file (or change this path) to use a different image.
const SHIP_IMAGE = "/journey-ship.jpg";

const steps = [
  {
    label: "01 — THE JOURNEY",
    title: "From campus to the open sea",
    body: "Regional Maritime University prepares the next generation of maritime professionals, leaders, and innovators.",
  },
  {
    label: "02 — ACROSS THE REGION",
    title: "A truly regional community",
    body: "Students from Ghana, The Gambia, Sierra Leone, Liberia, Nigeria and beyond come together under one roof.",
  },
  {
    label: "03 — INTO INDUSTRY",
    title: "Connected to the maritime world",
    body: "Our students engage with the shipping, ports, and logistics industries that drive global trade.",
  },
];

// Scroll progress (0–1) at which each step's text starts and finishes fading in.
const REVEAL = [
  [0.06, 0.24],
  [0.35, 0.53],
  [0.62, 0.8],
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);
// Ship speed: gentle start, quicker middle, gentle finish.
const shipEase = (p) => 0.5 * p + 0.5 * smooth(p);

// Soft edges so the photo melts into the blue background (sides + top; the bottom sits on the screen edge).
const SHIP_MASK =
  "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 12%)";

export default function JourneySection() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const shipRef = useRef(null);
  const barRef = useRef(null);
  const stepRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const ship = shipRef.current;
    const bar = barRef.current;
    if (!section || !stage || !ship || !bar) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Applies scroll progress p (0–1) to the ship, the text and the progress bar.
    const render = (p, showAllText = false) => {
      const stageW = stage.clientWidth;
      const shipW = ship.offsetWidth;
      // Track the ship's centre: starts just off the left edge, ends just past the right edge.
      const centre = stageW * (-0.022 + 1.052 * shipEase(p));
      const x = centre - shipW / 2;
      ship.style.transform = `translate3d(${x}px,0,0) scale(${1 + 0.07 * p})`;
      bar.style.transform = `scaleX(${p})`;

      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const [a, b] = REVEAL[i];
        const t = showAllText ? 1 : smooth(clamp01((p - a) / (b - a)));
        el.style.opacity = String(t);
        el.style.transform = `translate3d(0,${(t - 1) * 28}px,0)`; // drops in from above
      });
    };

    if (reduceMotion) {
      const onResize = () => render(0.5, true);
      onResize();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - stage.offsetHeight;
      return total > 0 ? clamp01(-rect.top / total) : 0;
    };

    let target = readProgress();
    let current = target;
    let raf = 0;
    render(current);

    // Glide toward the scroll position so the ship moves smoothly, not in jerks.
    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.0004) current = target;
      render(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      target = readProgress();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // capture: true also catches scrolling inside a container (e.g. a preview pane), not just the page
    window.addEventListener("scroll", kick, { passive: true, capture: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick, { capture: true });
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // Tall section = scroll distance. The stage inside stays pinned while you scroll through it.
    <section ref={sectionRef} className="relative h-[420vh] motion-reduce:h-screen" aria-label="The journey">
      <div
        ref={stageRef}
        className="sticky top-0 h-screen overflow-hidden text-white"
        style={{ background: "linear-gradient(to bottom, #0d1f40 0%, #113660 54%, #00529b 100%)" }}
      >
        {/* faint water lines */}
        <div className="absolute inset-x-0 top-[74%] h-px bg-white/[0.07]" />
        <div className="absolute inset-x-0 top-[82%] h-px bg-white/[0.07]" />

        {/* ship: sails left -> right as you scroll, sitting behind the text */}
        <div
          ref={shipRef}
          className="absolute bottom-0 left-0 z-0 w-[max(52.5vw,20rem)] will-change-transform"
          style={{
            transform: "translate3d(-100%,0,0)",
            transformOrigin: "50% 100%",
            WebkitMaskImage: SHIP_MASK,
            maskImage: SHIP_MASK,
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        >
          <img src={SHIP_IMAGE} alt="Container ship at sea" className="block h-auto w-full" decoding="async" />
        </div>

        {/* text: fades in and drops down from above as the ship sails on */}
        <div
          className="absolute inset-x-0 z-10 flex flex-col items-center px-6 text-center"
          style={{ top: "max(6.5rem, 15vh)", gap: "clamp(1rem, 6.5vh, 3.75rem)" }}
        >
          {steps.map((s, i) => (
            <div
              key={s.label}
              ref={(el) => (stepRefs.current[i] = el)}
              className="will-change-transform [text-shadow:0_2px_14px_rgba(5,20,50,0.45)]"
              style={{ opacity: 0 }}
            >
              <p
                className="mb-3 tracking-[0.2em] text-white/50"
                style={{ fontSize: "clamp(0.65rem, min(1.7vh, 2.8vw), 0.875rem)" }}
              >
                {s.label}
              </p>
              <h3
                className="mb-3 font-serif leading-tight"
                style={{ fontSize: "clamp(1.35rem, min(5.2vh, 5.6vw), 2.75rem)" }}
              >
                {s.title}
              </h3>
              <p
                className="mx-auto max-w-2xl leading-relaxed text-white/70"
                style={{ fontSize: "clamp(0.8rem, min(2.2vh, 3.4vw), 1.125rem)" }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* scroll progress */}
        <div className="absolute bottom-10 left-1/2 z-10 h-1 w-60 -translate-x-1/2 overflow-hidden rounded-full bg-white/20 motion-reduce:hidden">
          <div ref={barRef} className="h-full w-full origin-left bg-white" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
