import { NavRail } from "./NavRail.jsx";
import { StatusBar } from "./StatusBar.jsx";
import { sections } from "../data/sections.js";
import { useActiveSection } from "../lib/useActiveSection.js";
import { usePalette } from "../lib/usePalette.jsx";

const LeftGutter = () => {
  const active = useActiveSection(sections.map((s) => s.id));
  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 font-mono text-[11px] lg:flex"
    >
      {sections.map((s) => (
        <span
          key={s.id}
          className={active === s.id ? "text-accent" : "text-ink-dim"}
        >
          {s.number}
        </span>
      ))}
    </aside>
  );
};

const HeaderInner = () => {
  const { openPalette } = usePalette();
  return (
    <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
      <a href="#home" className="font-mono text-sm font-bold tracking-tight">
        <span className="text-accent">~/</span>andrew
      </a>
      <NavRail />
      <button
        type="button"
        onClick={openPalette}
        className="font-mono text-sm md:hidden"
        aria-label="open menu"
      >
        [≡]
      </button>
      <div className="hidden items-center gap-1.5 md:flex" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-rule" />
        <span className="h-2.5 w-2.5 rounded-full bg-rule" />
        <span className="h-2.5 w-2.5 rounded-full bg-rule" />
      </div>
    </div>
  );
};

export const Frame = ({ children }) => (
  <div className="min-h-screen bg-bg text-ink">
    <header
      className="sticky top-0 z-40 border-b border-rule bg-bg/95 backdrop-blur"
      style={{ height: "var(--header-h)" }}
    >
      <HeaderInner />
    </header>
    <LeftGutter />
    <main className="pb-[var(--status-h)]">{children}</main>
    <StatusBar />
  </div>
);
