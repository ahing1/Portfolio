import { Fragment } from "react";
import { experience } from "../data/experience.js";
import { LogEntry, EntryContent } from "./LogEntry.jsx";
import { useEnterOnView } from "../lib/useEnterOnView.js";
import { sortChronological, TYPE_DOT } from "../lib/dateRange.js";

export const ExperienceLog = () => {
  const [headerRef, headerVisible] = useEnterOnView();
  const entries = sortChronological(experience);

  return (
    <section id="experience" className="mx-auto max-w-5xl px-4 py-24 scroll-mt-20">
      <h2 ref={headerRef} className={`mb-8 font-mono text-sm text-ink-dim ${headerVisible ? "section-enter" : "opacity-0"}`}>
        <span className="text-accent">$</span> git log --experience
      </h2>

      {/* mobile: single spine, no room for a two-sided layout */}
      <div className="md:hidden">
        {entries.map((entry, i) => (
          <LogEntry key={entry.role} entry={entry} isLast={i === entries.length - 1} />
        ))}
      </div>

      {/* desktop: one shared spine, education on the left / employment on the right */}
      <div className="hidden md:block">
        <div className="mb-6 grid grid-cols-[1fr_auto_1fr] gap-x-10">
          <p className="text-right font-mono text-xs uppercase tracking-wide text-ink-dim">education</p>
          <div className="w-2.5" />
          <p className="text-left font-mono text-xs uppercase tracking-wide text-ink-dim">employment</p>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-10">
          {entries.map((entry, i) => {
            const isLast = i === entries.length - 1;
            const isEducation = entry.type === "education";
            return (
              <Fragment key={entry.role}>
                <div className={isLast ? "" : "pb-10"}>{isEducation && <EntryContent entry={entry} align="right" />}</div>
                <div className="flex flex-col items-center">
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_DOT[entry.type] ?? TYPE_DOT.employment}`} />
                  {!isLast && <span className="w-0 flex-1 border-l-2 border-rule" />}
                </div>
                <div className={isLast ? "" : "pb-10"}>{!isEducation && <EntryContent entry={entry} align="left" />}</div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};
