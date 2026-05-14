import { experience } from "../data/experience.js";
import { LogEntry } from "./LogEntry.jsx";

export const ExperienceLog = () => (
  <section id="experience" className="mx-auto max-w-3xl px-4 py-24 scroll-mt-20">
    <h2 className="mb-8 font-mono text-sm text-ink-dim">
      <span className="text-accent">$</span> git log --experience
    </h2>
    <div className="space-y-10">
      {experience.map((e, i) => (
        <LogEntry key={i} entry={e} />
      ))}
    </div>
  </section>
);
