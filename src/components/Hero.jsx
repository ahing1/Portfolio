import { Typer } from "./Typer.jsx";

export const Hero = () => (
  <section id="home" className="mx-auto max-w-6xl px-4 pt-12 pb-24 scroll-mt-20">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-12">
      <div className="md:col-span-3">
        <h1
          className="font-mono font-bold uppercase tracking-tight text-ink"
          style={{ fontSize: "clamp(56px, 9vw, 112px)", lineHeight: 0.92 }}
        >
          Andrew<br />Hing
        </h1>
        <p className="mt-8 font-mono text-sm text-ink-dim md:text-base">
          <span className="text-accent">&gt;</span>{" "}
          <Typer
            text="software engineer · agentic systems · open to full-time roles_"
            storageKey="hero_typed"
          />
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="border border-accent px-4 py-2 font-mono text-sm text-ink transition-colors duration-150 hover:bg-accent hover:text-bg"
          >
            $ ./contact.sh
          </a>
          <a
            href="/Andrew_Hing_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="border border-rule px-4 py-2 font-mono text-sm text-ink transition-colors duration-150 hover:border-accent hover:text-accent"
          >
            $ open resume.pdf
          </a>
        </div>
      </div>

      <aside className="md:col-span-2 border border-rule bg-bg-elev p-5 font-mono text-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-ink-dim">// id-card</span>
          <img
            src="/profile2.jpg"
            alt="Andrew Hing"
            className="h-16 w-16 border border-rule object-cover"
          />
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          <dt className="text-ink-dim">name</dt>
          <dd>andrew hing</dd>
          <dt className="text-ink-dim">status</dt>
          <dd>available · 2026 grad</dd>
          <dt className="text-ink-dim">location</dt>
          <dd>hoboken, nj</dd>
          <dt className="text-ink-dim">focus</dt>
          <dd>agents · backend · ml</dd>
          <dt className="text-ink-dim">signal</dt>
          <dd>
            <kbd className="border border-rule px-1.5 py-0.5 text-xs">⌘K</kbd>{" "}
            open palette
          </dd>
        </dl>
      </aside>
    </div>
  </section>
);
