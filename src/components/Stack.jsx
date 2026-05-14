import { stack } from "../data/stack.js";
import { useEnterOnView } from "../lib/useEnterOnView.js";

const Block = ({ label, items }) => (
  <div className="space-y-3">
    <h3 className="font-mono text-xs text-ink-dim">// {label}</h3>
    <p className="font-mono text-sm leading-relaxed text-ink">
      {items.map((it, i) => (
        <span key={it}>
          {it}
          {i < items.length - 1 && <span className="text-ink-dim"> · </span>}
        </span>
      ))}
    </p>
  </div>
);

export const Stack = () => {
  const [headerRef, headerVisible] = useEnterOnView();
  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-24 scroll-mt-20">
      <h2 ref={headerRef} className={`mb-8 font-mono text-sm text-ink-dim ${headerVisible ? "section-enter" : "opacity-0"}`}>
        <span className="text-accent">$</span> stack
      </h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <Block label="languages" items={stack.languages} />
        <Block label="frameworks" items={stack.frameworks} />
        <Block label="focus" items={stack.focus} />
      </div>
    </section>
  );
};
