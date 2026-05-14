import { experience } from "../data/experience.js";
import { LogEntry } from "./LogEntry.jsx";
import { useEnterOnView } from "../lib/useEnterOnView.js";

export const ExperienceLog = () => {
  const [headerRef, headerVisible] = useEnterOnView();
  return (
    <section id="experience" className="mx-auto max-w-3xl px-4 py-24 scroll-mt-20">
      <h2 ref={headerRef} className={`mb-8 font-mono text-sm text-ink-dim ${headerVisible ? "section-enter" : "opacity-0"}`}>
        <span className="text-accent">$</span> git log --experience
      </h2>
      <div className="space-y-10">
        {experience.map((e, i) => (
          <LogEntry key={i} entry={e} />
        ))}
      </div>
    </section>
  );
};
