import { ThemeProvider } from "./lib/useTheme.jsx";
import { PaletteProvider } from "./lib/usePalette.jsx";
import { Frame } from "./components/Frame.jsx";
import { ContactSection } from "./components/Contact.jsx";
import { Hero } from "./components/Hero.jsx";
import { About } from "./components/About.jsx";
import { Projects } from "./components/Projects.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <PaletteProvider>
        <Frame>
          <Hero />
          <About />
          <Projects />
          <section id="skills" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-20">
            <h2 className="font-mono text-xl">$ stack</h2>
            <p className="mt-4 text-ink-dim">Stack placeholder — Task 12.</p>
          </section>
          <section id="experience" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-20">
            <h2 className="font-mono text-xl">$ git log --experience</h2>
            <p className="mt-4 text-ink-dim">Experience placeholder — Task 13.</p>
          </section>
          <ContactSection />
        </Frame>
      </PaletteProvider>
    </ThemeProvider>
  );
}
