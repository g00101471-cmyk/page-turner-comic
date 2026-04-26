import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const TOTAL_PAGES = 54;
const pad = (n: number) => n.toString().padStart(2, "0");
const pageSrc = (n: number) => `/comic/page-${pad(n)}.jpg`;

// Story moments: who is "speaking" / featured on each page (lightweight & dynamic).
// active: which character pulses in the header. mood: a tiny caption.
type Active = "shweta" | "wafa" | "both" | "none";
const beats: { active: Active; mood: string }[] = [
  { active: "both", mood: "Cover" },                       // 1
  { active: "shweta", mood: "Registration day" },          // 2
  { active: "shweta", mood: "Name won't fit" },            // 3
  { active: "both", mood: "Cut off too?" },                // 4
  { active: "wafa", mood: "Autocorrected to 'Waffle'" },   // 5
  { active: "shweta", mood: "Eleven characters" },         // 6
  { active: "shweta", mood: "Something always goes wrong" },// 7
  { active: "both", mood: "Introductions" },               // 8
  { active: "both", mood: "Two weeks later — Café" },      // 9
  { active: "shweta", mood: "Search results" },            // 10
  { active: "shweta", mood: "Page one. Every time." },     // 11
  { active: "both", mood: "Wiredu is on page two" },       // 12
  { active: "shweta", mood: "Inherited, not malicious" },  // 13
  { active: "shweta", mood: "The exact language" },        // 14
  { active: "shweta", mood: "Which questions you ask" },   // 15
  { active: "wafa", mood: "Two categories" },              // 16
  { active: "wafa", mood: "Tap, tap" },                    // 17
  { active: "both", mood: "The pipeline" },                // 18
  { active: "shweta", mood: "Automated hierarchy" },       // 19
  { active: "wafa", mood: "Can I show you?" },             // 20
  { active: "wafa", mood: "Just a book" },                 // 21
  { active: "wafa", mood: "One defining part" },           // 22
  { active: "wafa", mood: "47 vs 4,892" },                 // 23
  { active: "both", mood: "Lugones" },                     // 24
  { active: "both", mood: "Constructed" },                 // 25
  { active: "shweta", mood: "Foundation matches" },        // 26
  { active: "both", mood: "Not even close" },              // 27
  { active: "both", mood: "If we leave..." },              // 28
  { active: "both", mood: "Project due in 3 days" },       // 29
  { active: "shweta", mood: "Travelling to her world" },   // 30
  { active: "shweta", mood: "You looked at it" },          // 31
  { active: "wafa", mood: "World-travelling" },            // 32
  { active: "wafa", mood: "Try it on me" },                // 33
  { active: "both", mood: "Just see" },                    // 34
  { active: "shweta", mood: "Reframe the conclusion" },    // 35
  { active: "both", mood: "Walls can be moved" },          // 36
  { active: "wafa", mood: "Yes. That's it." },             // 37
  { active: "both", mood: "Found each other" },            // 38
  { active: "wafa", mood: "Do you fix it?" },              // 39
  { active: "shweta", mood: "Sometimes I leave it" },      // 40
  { active: "shweta", mood: "Not just guilt" },            // 41
  { active: "wafa", mood: "Beauty filter, off" },          // 42
  { active: "both", mood: "Submission day" },              // 43
  { active: "both", mood: "Student name:" },               // 44
  { active: "shweta", mood: "S-H-W-E-T-A-M-B-A-R-I" },     // 45
  { active: "shweta", mood: "Exceeds limit" },             // 46
  { active: "both", mood: "Extend the limit" },            // 47
  { active: "wafa", mood: "A few days later" },            // 48
  { active: "wafa", mood: "Let it be confused" },          // 49
  { active: "shweta", mood: "Three months later" },        // 50
  { active: "both", mood: "Epilogue" },                    // 51
  { active: "both", mood: "Epilogue" },                    // 52
  { active: "both", mood: "Epilogue" },                    // 53
  { active: "both", mood: "The full thing" },              // 54
];

const safeBeat = (n: number) => beats[n - 1] ?? { active: "both" as Active, mood: "" };

export default function ComicReader() {
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [imgLoaded, setImgLoaded] = useState(false);

  const go = useCallback(
    (delta: number) => {
      setPage((p) => {
        const next = Math.min(TOTAL_PAGES, Math.max(1, p + delta));
        if (next !== p) {
          setDirection(delta > 0 ? 1 : -1);
          setImgLoaded(false);
        }
        return next;
      });
    },
    [],
  );

  // Preload neighbours
  useEffect(() => {
    [page - 1, page + 1].forEach((n) => {
      if (n >= 1 && n <= TOTAL_PAGES) {
        const img = new Image();
        img.src = pageSrc(n);
      }
    });
  }, [page]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const beat = safeBeat(page);
  const progress = (page / TOTAL_PAGES) * 100;

  const fullscreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div className="min-h-screen bg-comic-yellow text-comic-ink relative overflow-hidden">
      {/* halftone background texture */}
      <div className="halftone pointer-events-none absolute inset-0 opacity-60" />
      {/* red side bars echoing the comic */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-3 md:w-6 bg-comic-red" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-3 md:w-6 bg-comic-red" />

      <header className="relative z-10 px-6 md:px-12 pt-4 md:pt-8 flex flex-wrap items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-5 order-2 md:order-1">
          <CharacterChip
            name="Shweta"
            src="/comic/shweta.png"
            active={beat.active === "shweta" || beat.active === "both"}
            tilt={-4}
          />
          <CharacterChip
            name="Wafa"
            src="/comic/wafa.png"
            active={beat.active === "wafa" || beat.active === "both"}
            tilt={4}
          />
        </div>

        <h1 className="font-display text-2xl md:text-5xl text-stroke text-comic-cream drop-shadow-[3px_3px_0_hsl(var(--comic-ink))] select-none order-1 md:order-2 w-full md:w-auto text-center">
          THE FULL THING
        </h1>

        <button
          onClick={fullscreen}
          aria-label="Fullscreen"
          className="comic-border comic-shadow bg-comic-cream hover:bg-white transition-transform hover:-translate-y-0.5 active:translate-y-0 rounded-md p-2 md:p-3 order-3"
        >
          <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </header>

      {/* Mood / page caption */}
      <div className="relative z-10 px-6 md:px-12 mt-3 md:mt-4 flex items-center justify-between gap-4 text-comic-ink/80">
        <span className="font-hand text-sm md:text-base">
          Page <span className="font-display text-base md:text-lg">{page}</span>
          <span className="opacity-60"> / {TOTAL_PAGES}</span>
        </span>
        <span
          key={page + "-mood"}
          className="anim-pop font-hand text-sm md:text-lg italic max-w-[60%] text-center truncate"
        >
          “{beat.mood}”
        </span>
        <span className="font-hand text-xs md:text-sm opacity-70 hidden sm:inline">
          ← / → to flip
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mx-6 md:mx-12 mt-2 h-2 comic-border bg-comic-cream rounded-full overflow-hidden">
        <div
          className="h-full bg-comic-red transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage */}
      <main className="relative z-10 px-3 md:px-12 py-6 md:py-8">
        <div className="relative mx-auto max-w-6xl">
          {/* Page card */}
          <div className="relative comic-border comic-shadow-lg bg-comic-cream rounded-xl overflow-hidden">
            <div className="relative aspect-[2200/1238] w-full bg-comic-cream min-h-[200px]">
              {!imgLoaded && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="font-display text-2xl md:text-4xl text-stroke text-comic-yellow">
                    LOADING…
                  </div>
                </div>
              )}
              <img
                key={page}
                src={pageSrc(page)}
                alt={`Page ${page} of The Full Thing`}
                onLoad={() => setImgLoaded(true)}
                className={`absolute inset-0 w-full h-full object-contain ${
                  direction === 1 ? "anim-page-fwd" : "anim-page-back"
                }`}
                draggable={false}
              />
              {/* Invisible click zones over the drawn Prev / Next buttons in the comic art.
                  Positioned in the bottom-left and bottom-right corners where every page's
                  buttons live, so the artwork stays visually unchanged. */}
              {page > 1 && (
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() => go(-1)}
                  className="absolute left-0 bottom-0 w-[22%] h-[22%] cursor-pointer bg-transparent border-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-comic-ink rounded-md"
                />
              )}
              {page < TOTAL_PAGES && (
                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => go(1)}
                  className="absolute right-0 bottom-0 w-[22%] h-[22%] cursor-pointer bg-transparent border-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-comic-ink rounded-md"
                />
              )}
            </div>
          </div>

          {/* Floating prev/next */}
          <NavButton
            side="left"
            disabled={page === 1}
            onClick={() => go(-1)}
            label="Prev"
          />
          <NavButton
            side="right"
            disabled={page === TOTAL_PAGES}
            onClick={() => go(1)}
            label="Next"
          />
        </div>

        {/* Big bottom controls (mobile + accessibility) */}
        <div className="mx-auto max-w-6xl mt-6 flex items-center justify-between gap-4">
          <BigButton
            disabled={page === 1}
            onClick={() => go(-1)}
            icon={<ChevronLeft className="w-5 h-5" />}
            label="Prev"
          />
          <p className="font-hand text-xs md:text-sm text-comic-ink/70 text-center max-w-md">
            By Shweta &amp; Wafa — a story about names, algorithms, and two people
            who found each other anyway.
          </p>
          <BigButton
            disabled={page === TOTAL_PAGES}
            onClick={() => go(1)}
            icon={<ChevronRight className="w-5 h-5" />}
            label="Next"
            iconRight
          />
        </div>
      </main>
    </div>
  );
}

function CharacterChip({
  name,
  src,
  active,
  tilt,
}: {
  name: string;
  src: string;
  active: boolean;
  tilt: number;
}) {
  return (
    <div
      className={`flex flex-col items-center transition-all duration-300 ${
        active ? "scale-100 opacity-100" : "scale-90 opacity-50 grayscale"
      }`}
      style={{ ["--tilt" as string]: `${tilt}deg` }}
    >
      <div
        className={`relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden comic-border bg-comic-cream ${
          active ? "anim-float comic-shadow" : ""
        }`}
        style={{ ["--tilt" as string]: `${tilt}deg`, transform: `rotate(${tilt}deg)` }}
      >
        <img src={src} alt={name} className="w-full h-full object-cover" draggable={false} />
        {active && (
          <span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-comic-red comic-border" />
        )}
      </div>
      <span
        className={`mt-1 font-hand text-xs md:text-sm ${
          active ? "text-comic-ink" : "text-comic-ink/50"
        }`}
      >
        {name}
      </span>
    </div>
  );
}

function NavButton({
  side,
  disabled,
  onClick,
  label,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`hidden md:flex absolute top-1/2 -translate-y-1/2 ${
        side === "left" ? "-left-6" : "-right-6"
      } items-center justify-center w-14 h-14 rounded-full comic-border comic-shadow bg-comic-cream hover:bg-white transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-20`}
    >
      {side === "left" ? (
        <ChevronLeft className="w-7 h-7" />
      ) : (
        <ChevronRight className="w-7 h-7" />
      )}
    </button>
  );
}

function BigButton({
  disabled,
  onClick,
  icon,
  label,
  iconRight,
}: {
  disabled: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  iconRight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-display tracking-wide comic-border comic-shadow bg-comic-cream hover:bg-white px-4 md:px-6 py-2 md:py-3 rounded-md inline-flex items-center gap-2 text-base md:text-xl transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      {!iconRight && icon}
      {label}
      {iconRight && icon}
    </button>
  );
}