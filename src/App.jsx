import { ThemeProvider } from "./lib/useTheme.jsx";
import { PaletteProvider } from "./lib/usePalette.jsx";
import { Frame } from "./components/Frame.jsx";
import { ContactSection } from "./components/Contact.jsx";
import { Hero } from "./components/Hero.jsx";
import { About } from "./components/About.jsx";
import { Projects } from "./components/Projects.jsx";
import { Stack } from "./components/Stack.jsx";
import { ExperienceLog } from "./components/ExperienceLog.jsx";
import { Footer } from "./components/Footer.jsx";
import { CommandPalette } from "./components/CommandPalette.jsx";
import { Toast } from "./components/Toast.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <PaletteProvider>
        <Frame>
          <Hero />
          <About />
          <Projects />
          <Stack />
          <ExperienceLog />
          <ContactSection />
          <Footer />
        </Frame>
        <CommandPalette />
        <Toast />
      </PaletteProvider>
    </ThemeProvider>
  );
}
