const InlineCode = ({ children }) => (
  <code className="bg-bg-elev px-1.5 py-0.5 font-mono text-[0.92em]">{children}</code>
);

export const About = () => (
  <section id="about" className="mx-auto max-w-3xl px-4 py-24 scroll-mt-20">
    <h2 className="mb-8 font-mono text-sm text-ink-dim">
      <span className="text-accent">$</span> cat about.md
    </h2>
    <div className="prose-block space-y-6 leading-relaxed">
      <p>
        I first started in tech when I was kid where I would make and code robots out of legos.
        This sparked my interest in programming and problem-solving, leading me to pursue a career in software development.
        I am currently a Masters student at Stevens Institute of Technology, where I am skilled in AI Agents and Full Stack Development.
        I am looking for full-time opportunities in Software Engineering or Machine Learning where I can apply my skills and continue to grow as a developer.
        The technologies I am most experienced with are{" "}
        <InlineCode>Python</InlineCode>, <InlineCode>JavaScript</InlineCode>,{" "}
        <InlineCode>TypeScript</InlineCode>, <InlineCode>React</InlineCode>,{" "}
        <InlineCode>Next.js</InlineCode>, <InlineCode>Node.js</InlineCode>,{" "}
        <InlineCode>FastAPI</InlineCode>, <InlineCode>LangGraph</InlineCode>,{" "}
        <InlineCode>DSPy</InlineCode>, <InlineCode>PostgreSQL</InlineCode>, and{" "}
        <InlineCode>AWS</InlineCode>.
      </p>
      <div className="flex items-center gap-3 font-mono text-xs text-ink-dim">
        <span className="h-px flex-1 bg-rule" />
        <span>// outside the editor</span>
        <span className="h-px flex-1 bg-rule" />
      </div>
      <p>
        Outside of coding, I love to workout and stay active. I like to do calisthenics where my goal is to unlock as many skills as possible.
        I love to eat and try new foods and I am always looking for new restaurants to try. I cook occasionally and enjoy experimenting with new recipes.
        I also really enjoy exploring new places and going on adventures. I was recently in Boston and had a great time exploring the city.
        Whenever I travel to somewhere new, I make it my mission to maximize my experience by trying local foods, visiting popular attractions, and immersing myself in the culture.
        Currently one of my interests is reading about Neuroscience. I find the brain to be fascinating and I love learning about how it works. This goes along with my love for learning where I try to be a little bit better every day or learn something new.
      </p>
    </div>
  </section>
);
