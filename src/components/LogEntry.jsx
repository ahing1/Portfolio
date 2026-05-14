export const LogEntry = ({ entry }) => (
  <div className="border-l border-rule pl-6 font-mono text-sm">
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
      <dt className="text-ink-dim">commit</dt>
      <dd className="text-ink">{entry.period}</dd>
      <dt className="text-ink-dim">role</dt>
      <dd className="text-ink">{entry.role}</dd>
      <dt className="text-ink-dim">loc</dt>
      <dd className="text-ink">{entry.location}</dd>
    </dl>
    <div className="my-3 h-px bg-rule" />
    <p className="font-sans text-sm leading-relaxed text-ink-dim">{entry.description}</p>
  </div>
);
