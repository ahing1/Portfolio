import { projects } from "../data/projects.js";
import { ProjectCard } from "./ProjectCard.jsx";
import { useEnterOnView } from "../lib/useEnterOnView.js";

export const Projects = () => {
  const [headerRef, headerVisible] = useEnterOnView();
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-24 scroll-mt-20">
      <h2 ref={headerRef} className={`mb-8 font-mono text-sm text-ink-dim ${headerVisible ? "section-enter" : "opacity-0"}`}>
        <span className="text-accent">~/</span>projects
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.filename} project={p} />
        ))}
      </div>
    </section>
  );
};
