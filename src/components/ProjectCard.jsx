export const ProjectCard = ({ project }) => (
  <article className="group flex flex-col border border-rule bg-bg-elev p-5 transition-colors duration-150 hover:border-accent">
    <header className="mb-3 flex items-baseline justify-between gap-3 font-mono text-sm">
      <span className="flex items-center gap-1 text-ink">
        {project.filename}
        <span className="invisible text-accent group-hover:visible">▍</span>
      </span>
      <span className="text-xs text-ink-dim">
        {project.size} · modified {project.modified}
      </span>
    </header>
    <h3 className="mb-2 font-mono text-base font-bold text-ink">{project.title}</h3>
    {project.pinned && (
      <span className="mb-3 inline-block w-fit font-mono text-xs text-warn">★ pinned</span>
    )}
    <p className="mb-4 text-sm leading-relaxed text-ink-dim">{project.description}</p>
    <div className="mt-auto flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs">
      {project.tags.map((t) => (
        <span key={t}>
          <span className="text-ink-dim">[</span>
          <span className="text-ink">{t.toLowerCase()}</span>
          <span className="text-ink-dim">]</span>
        </span>
      ))}
    </div>
  </article>
);
