import { sections } from "../data/sections.js";
import { useActiveSection } from "../lib/useActiveSection.js";
import { cx } from "../lib/cx.js";

export const NavRail = () => {
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <nav className="hidden md:flex items-center gap-3 font-mono text-[13px]">
      {sections.map((s, i) => (
        <span key={s.id} className="flex items-center gap-3">
          <a
            href={`#${s.id}`}
            className={cx(
              "transition-colors duration-150",
              active === s.id
                ? "text-ink border-b border-accent pb-0.5"
                : "text-ink-dim hover:text-ink"
            )}
          >
            <span className="text-ink-dim">{s.number}</span> {s.label}
          </a>
          {i < sections.length - 1 && <span className="text-ink-dim">·</span>}
        </span>
      ))}
    </nav>
  );
};
