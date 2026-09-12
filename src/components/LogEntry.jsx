import { TYPE_DOT } from "../lib/dateRange.js";

export const EntryContent = ({ entry, align = "left" }) => (
  <div className={align === "right" ? "text-right" : "text-left"}>
    <h3 className="font-sans text-base font-semibold text-ink">{entry.role}</h3>
    <p className="mt-1.5 font-mono text-xs text-ink-dim">
      {entry.startLabel} → {entry.endLabel}
      <span className="text-ink-dim/70"> · {entry.durationLabel} · {entry.location}</span>
    </p>
    {entry.description && (
      <p className="mt-3 font-sans text-sm leading-relaxed text-ink-dim">{entry.description}</p>
    )}
  </div>
);

export const LogEntry = ({ entry, isLast }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_DOT[entry.type] ?? TYPE_DOT.employment}`} />
      {!isLast && <span className="w-0 flex-1 border-l-2 border-rule" />}
    </div>
    <div className={isLast ? "flex-1" : "flex-1 pb-10"}>
      <EntryContent entry={entry} />
    </div>
  </div>
);
