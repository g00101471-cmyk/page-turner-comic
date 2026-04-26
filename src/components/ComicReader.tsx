import { useCallback, useEffect, useState } from "react";

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

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      {/* Page only — sized so the full artwork always fits the viewport. */}
      <div
        className="relative mx-auto"
        style={{
          aspectRatio: "2200 / 1238",
          width: "min(100vw, calc(100svh * (2200 / 1238)))",
          maxHeight: "100svh",
        }}
      >
        <div className="relative w-full h-full">
              {!imgLoaded && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="font-display text-2xl md:text-4xl text-white/70">
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
                  className="absolute left-0 bottom-0 w-[22%] h-[22%] cursor-pointer bg-transparent border-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md"
                />
              )}
              {page < TOTAL_PAGES && (
                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => go(1)}
                  className="absolute right-0 bottom-0 w-[22%] h-[22%] cursor-pointer bg-transparent border-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md"
                />
              )}
            </div>
    </div>
  );
}
