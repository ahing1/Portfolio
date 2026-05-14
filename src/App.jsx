import { ThemeProvider } from "./lib/useTheme.js";
import { PaletteProvider } from "./lib/usePalette.js";
import { Frame } from "./components/Frame.jsx";
import { ContactSection } from "./components/Contact.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <PaletteProvider>
        <Frame>
          <section id="home" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-20">
            <h1 className="font-mono text-4xl font-bold">~/andrew</h1>
            <p className="mt-4 text-ink-dim">Hero placeholder — Task 9.</p>
          </section>
          <section id="about" className="mx-auto max-w-4xl px-4 py-20 scroll-mt-20">
            <h2 className="font-mono text-xl">$ cat about.md</h2>
            <p className="mt-4 text-ink-dim">About placeholder — Task 10.</p>
          </section>
          <section id="projects" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-20">
            <h2 className="font-mono text-xl">~/projects</h2>
            <p className="mt-4 text-ink-dim">Projects placeholder — Task 11.</p>
          </section>
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
