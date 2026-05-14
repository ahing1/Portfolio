import { useEffect, useState } from "react";
import { sections } from "../data/sections.js";
import { useActiveSection } from "../lib/useActiveSection.js";
import { usePalette } from "../lib/usePalette.jsx";

const fmtTime = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const StatusBar = () => {
  const active = useActiveSection(sections.map((s) => s.id));
  const { openPalette } = usePalette();
  const [time, setTime] = useState(fmtTime);
  const [scrollPct, setScrollPct] = useState(0);
  const [pulsing, setPulsing] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.sessionStorage.getItem("chip_pulsed");
  });

  useEffect(() => {
    const tick = setInterval(() => setTime(fmtTime()), 60000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      setScrollPct(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!pulsing) return;
    const t = setTimeout(() => {
      setPulsing(false);
      window.sessionStorage.setItem("chip_pulsed", "1");
    }, 8000);
    return () => clearTimeout(t);
  }, [pulsing]);

  const activeLabel = sections.find((s) => s.id === active)?.label ?? "home";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-rule bg-bg-elev px-4 font-mono text-[11px] text-ink-dim"
      style={{ height: "var(--status-h)" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-accent">NORMAL</span>
        <span>·</span>
        <span>~/{activeLabel}</span>
        <span>·</span>
        <span>{scrollPct}%</span>
        <span>·</span>
        <span>main★</span>
        <span>·</span>
        <span>{time}</span>
      </div>
      <button
        type="button"
        onClick={openPalette}
        className={`border border-rule px-2 py-0.5 hover:border-accent hover:text-accent ${
          pulsing ? "chip-pulse" : ""
        }`}
      >
        [⌘K]
      </button>
    </div>
  );
};
