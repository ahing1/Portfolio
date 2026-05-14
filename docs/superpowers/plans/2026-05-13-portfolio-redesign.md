# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current SaaS-template portfolio with a hybrid terminal / workstation aesthetic plus a `⌘K` command palette, splitting the 358-line monolithic [src/App.jsx](../../../src/App.jsx) into ~22 purpose-scoped files.

**Architecture:** A `Frame` chrome (top bar + bottom status bar + line-number gutters) wraps `<main>`, which composes section components from `src/components/`. Data lives under `src/data/`, hooks under `src/lib/`. Two thin contexts (`ThemeProvider`, `PaletteProvider`) drive global state. A single `<CommandPalette>` mounts at root and consumes both.

**Tech Stack:** React 19, Vite 7, Tailwind CSS v4 (class-based dark mode via `@custom-variant`), framer-motion (used sparingly), lucide-react, `@emailjs/browser` (existing). Adds `@fontsource/jetbrains-mono` + `@fontsource-variable/inter-tight`.

**Source spec:** [docs/superpowers/specs/2026-05-13-portfolio-redesign-design.md](../specs/2026-05-13-portfolio-redesign-design.md)

**Note on testing:** The spec explicitly excludes adding an automated test runner. Each task therefore ends in a manual dev-server smoke check followed by a commit, in place of the TDD red/green/refactor steps.

---

## File Map

**Create (~22 new files):**
- `src/data/sections.js`, `src/data/projects.js`, `src/data/experience.js`, `src/data/stack.js`, `src/data/commands.js`
- `src/lib/cx.js`, `src/lib/useActiveSection.js`, `src/lib/useTheme.js`, `src/lib/usePalette.js`, `src/lib/useEnterOnView.js`
- `src/components/Frame.jsx`, `src/components/NavRail.jsx`, `src/components/StatusBar.jsx`
- `src/components/Hero.jsx`, `src/components/Typer.jsx`
- `src/components/About.jsx`
- `src/components/Projects.jsx`, `src/components/ProjectCard.jsx`
- `src/components/Stack.jsx`
- `src/components/ExperienceLog.jsx`, `src/components/LogEntry.jsx`
- `src/components/Footer.jsx`
- `src/components/CommandPalette.jsx`, `src/components/Toast.jsx`

**Modify:**
- [src/App.jsx](../../../src/App.jsx) — full rewrite as composition root (~60 lines)
- [src/index.css](../../../src/index.css) — replace boilerplate with token system, `@theme`, `@custom-variant dark`, base type, keyframes
- [src/components/Contact.jsx](../../../src/components/Contact.jsx) — restyle only; preserve `sendEmail`, `useRef`, env-var refs, honeypot
- [index.html](../../../index.html) — add font preload tags
- [package.json](../../../package.json) — add font deps

**Delete:**
- [src/App.css](../../../src/App.css) — Vite boilerplate

**Leave untouched:**
- [src/main.jsx](../../../src/main.jsx), [public/](../../../public/) assets, [tailwind.config.js](../../../tailwind.config.js) (Tailwind v4 uses CSS-based config), [postcss.config.js](../../../postcss.config.js), [eslint.config.js](../../../eslint.config.js), [vite.config.js](../../../vite.config.js)

---

## Phase 1 — Foundations

### Task 1: Clean up Vite boilerplate and add font dependencies

**Files:**
- Delete: `src/App.css`
- Modify: `index.html` (add preload + lang)
- Modify: `package.json` (deps)

- [ ] **Step 1: Confirm nothing imports `App.css`**

Run: `grep -rn "App.css" src/ index.html`
Expected: only [src/App.jsx:1-4](../../../src/App.jsx#L1-L4) area — but the current App.jsx does NOT import it. Confirm zero hits in `src/`.

If any import exists, remove it before deleting.

- [ ] **Step 2: Delete `src/App.css`**

Run: `rm src/App.css`

- [ ] **Step 3: Install font packages**

Run: `npm install @fontsource/jetbrains-mono @fontsource-variable/inter-tight`
Expected: both packages added to `package.json` dependencies, exit code 0.

- [ ] **Step 4: Update `index.html`**

Replace the file contents entirely with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>Andrew Hing — Software Engineer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

(The spec mentions preloading Inter Tight 500 + JetBrains Mono 700, but `@fontsource-variable/inter-tight` and `@fontsource/jetbrains-mono` ship their own `font-display: swap` CSS that we import from `index.css` in Task 2 — explicit `<link rel="preload">` tags would point at hashed Vite-bundled URLs that aren't stable. Skipping the preload tags; rely on the swap behavior the fontsource packages already provide.)

- [ ] **Step 5: Smoke test**

Run: `npm run dev`
Expected: dev server starts, page loads at `http://localhost:5173` (default), no console errors about missing `App.css`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(portfolio): remove Vite boilerplate, add font deps"
```

---

### Task 2: Build CSS token system and dark-mode variant

**Files:**
- Modify: `src/index.css` (full replacement)

This is the high-risk task per spec §Risks: Tailwind v4 + CSS variables + class-based dark mode is the foundation everything else builds on. Smoke-test thoroughly before moving on.

- [ ] **Step 1: Replace `src/index.css` entirely**

Write to `src/index.css`:

```css
@import "tailwindcss";
@import "@fontsource-variable/inter-tight";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";
@import "@fontsource/jetbrains-mono/700.css";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: #F5EFE4;
  --bg-elev: #EFE7D6;
  --ink: #1A1814;
  --ink-dim: #6B6457;
  --rule: #D9CFBC;
  --accent: #C44A1E;
  --link: #4B6584;
  --ok: #5C7A3F;
  --warn: #B57A1F;
  --header-h: 56px;
  --status-h: 28px;

  font-family: "Inter Tight Variable", system-ui, sans-serif;
  line-height: 1.6;
  color: var(--ink);
  background-color: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.dark {
  --bg: #0A0A0F;
  --bg-elev: #15151D;
  --ink: #E8C77A;
  --ink-dim: #9A8E7A;
  --rule: #2A2730;
  --accent: #FF8A4C;
  --link: #6FD1E6;
  --ok: #7FD17F;
  --warn: #F5C770;
}

@theme {
  --color-bg: var(--bg);
  --color-bg-elev: var(--bg-elev);
  --color-ink: var(--ink);
  --color-ink-dim: var(--ink-dim);
  --color-rule: var(--rule);
  --color-accent: var(--accent);
  --color-link: var(--link);
  --color-ok: var(--ok);
  --color-warn: var(--warn);
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-sans: "Inter Tight Variable", system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
  background-color: var(--bg);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--ink);
  transition: background-color 240ms cubic-bezier(0.2, 0, 0, 1),
              color 240ms cubic-bezier(0.2, 0, 0, 1);
}

a { color: inherit; text-decoration: none; }

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.caret-blink {
  display: inline-block;
  animation: blink 1s steps(1) infinite;
}

@keyframes chip-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

.chip-pulse {
  animation: chip-pulse 2s ease-in-out infinite;
}

@keyframes section-enter {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-enter {
  animation: section-enter 280ms cubic-bezier(0.2, 0, 0, 1) both;
}

@keyframes backdrop-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes palette-fade-down {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.palette-backdrop-enter { animation: backdrop-fade 120ms cubic-bezier(0.2, 0, 0, 1) both; }
.palette-enter { animation: palette-fade-down 180ms cubic-bezier(0.2, 0, 0, 1) both; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0ms !important;
  }
  html { scroll-behavior: auto; }
}
```

(Removed: `system-ui` default font, `button:not(.btn-reset)` rule, `@media (prefers-color-scheme: light)` block — class-based dark mode replaces the media query approach.)

- [ ] **Step 2: Smoke test light mode**

Run: `npm run dev`
Expected: page renders. Body background should be cream paper `#F5EFE4`. The existing components will look broken because they reference `zinc-*` classes that still resolve — but the page should not be white or unstyled. No console errors about Tailwind compilation.

- [ ] **Step 3: Smoke test dark mode**

In the browser console, run: `document.documentElement.classList.add('dark')`
Expected: body background flips to `#0A0A0F`, text color flips to warm amber `#E8C77A`. The crossfade transition runs (~240ms).

Remove with: `document.documentElement.classList.remove('dark')`
Expected: returns to paper mode.

- [ ] **Step 4: Smoke test token utilities**

In browser DevTools, pick any element and add class `bg-bg-elev`. Expected: background shifts to `#EFE7D6` in light, `#15151D` in dark. Confirms `@theme` block registered tokens with Tailwind.

If utilities don't resolve, check Tailwind v4 `@theme` syntax — values must be valid CSS color expressions (`var(--bg)` is fine).

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "feat(portfolio): add CSS token system and class-based dark mode"
```

---

### Task 3: Create lib utilities

**Files:**
- Create: `src/lib/cx.js`
- Create: `src/lib/useActiveSection.js`
- Create: `src/lib/useTheme.js`
- Create: `src/lib/usePalette.js`

- [ ] **Step 1: Write `src/lib/cx.js`**

```js
export const cx = (...c) => c.filter(Boolean).join(" ");
```

- [ ] **Step 2: Write `src/lib/useActiveSection.js`**

This hook is the extracted version of [src/App.jsx:153-176](../../../src/App.jsx#L153-L176). Header offset becomes a CSS-var read so it stays in sync with actual chrome height.

```js
import { useEffect, useState } from "react";

const getHeaderOffset = () => {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 56;
};

export const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const getCurrent = () => {
      const scrollY = window.scrollY + getHeaderOffset() + 1;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollY) current = id;
      }
      const doc = document.documentElement;
      const atBottom =
        Math.ceil(window.scrollY + window.innerHeight) >= doc.scrollHeight - 1;
      if (atBottom) current = ids[ids.length - 1];
      return current;
    };
    const update = () => setActive(getCurrent());
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return active;
};
```

- [ ] **Step 3: Write `src/lib/useTheme.js`**

Provides a `ThemeProvider` context plus `useTheme()` hook. Resolves system preference if no stored value; persists to `localStorage.theme`. Applies `.dark` class to `<html>`.

```js
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggle: () => {} });

const resolveInitial = () => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(resolveInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

- [ ] **Step 4: Write `src/lib/usePalette.js`**

Provides a `PaletteProvider` context plus `usePalette()` hook. Owns `open`, `query`, `activeIndex`. Document-level keyboard listener for `⌘K` / `Ctrl+K` is wired here so it works from anywhere, including when an input is focused (blurs first).

```js
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const PaletteContext = createContext({
  open: false,
  query: "",
  activeIndex: 0,
  setOpen: () => {},
  setQuery: () => {},
  setActiveIndex: () => {},
  openPalette: () => {},
});

export const PaletteProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const openPalette = useCallback(() => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const isToggle = (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
      if (isToggle) {
        e.preventDefault();
        if (open) setOpen(false);
        else openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openPalette]);

  return (
    <PaletteContext.Provider
      value={{ open, query, activeIndex, setOpen, setQuery, setActiveIndex, openPalette }}
    >
      {children}
    </PaletteContext.Provider>
  );
};

export const usePalette = () => useContext(PaletteContext);
```

- [ ] **Step 5: Smoke test**

Run: `npm run dev`
Expected: dev server still runs. No import errors. Browser console clean. (These files aren't imported anywhere yet — the test is just that they parse cleanly.)

- [ ] **Step 6: Commit**

```bash
git add src/lib/
git commit -m "feat(portfolio): add cx, useActiveSection, useTheme, usePalette hooks"
```

---

### Task 4: Create data files

**Files:**
- Create: `src/data/sections.js`
- Create: `src/data/projects.js`
- Create: `src/data/experience.js`
- Create: `src/data/stack.js`
- Create: `src/data/commands.js`

- [ ] **Step 1: Write `src/data/sections.js`**

Nav config. IDs match existing anchors (`#about`, `#projects`, `#skills`, `#experience`, `#contact`) per spec §Recurring Chrome Elements — external links continue to work. Visible labels change.

```js
export const sections = [
  { id: "about", number: "01", label: "about" },
  { id: "projects", number: "02", label: "projects" },
  { id: "skills", number: "03", label: "stack" },
  { id: "experience", number: "04", label: "log" },
  { id: "contact", number: "05", label: "contact" },
];
```

(Note: dropped the existing `home` entry — the hero section gets `id="home"` but isn't in the nav rail; users scroll to top via the brand link or `goto about` from the palette.)

- [ ] **Step 2: Write `src/data/projects.js`**

All 4 projects preserved verbatim from [src/App.jsx:293-312](../../../src/App.jsx#L293-L312). ComplianceAI gets `pinned: true`.

```js
export const projects = [
  {
    filename: "complianceai.md",
    title: "ComplianceAI",
    description:
      "An Agentic Financial Compliance Engine that autonomously analyzes SEC filings through a multi-step AI pipeline with RAG-based retrieval, LLM-powered risk extraction, and a self-verification loop, reducing manual compliance analysis from hours to under 60 seconds. Deployed on AWS with Docker, real-time SSE streaming via Redis pub/sub, JWT auth, and a GitHub Actions CI/CD pipeline.",
    tags: ["LangGraph", "FastAPI", "PostgreSQL", "pgvector", "Redis", "Celery", "Next.js", "Docker", "AWS"],
    size: "8.4kb",
    modified: "2025-10",
    pinned: true,
  },
  {
    filename: "noc-agent.md",
    title: "NOC Agent",
    description:
      "This was my intern project where I learned to take a project from an idea to production. An automation pipeline using LangGraph + DSPy, integrates Kafka, Postgres, and Cloud Tasks to reduce ticket processing time by 98%.",
    tags: ["Python", "LangGraph", "DSPy", "Kafka", "PostgreSQL", "Docker", "GCP"],
    size: "6.1kb",
    modified: "2025-08",
  },
  {
    filename: "prospra.md",
    title: "Prospra",
    description:
      "This was my first attempt at a SaaS project for people trying to get into tech. A Next.js frontend, FastAPI backend with the ChatGPT API, Clerk for authentication, Stripe for billing. Dockerized and deployed on an AWS EC2 instance.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Clerk", "Stripe", "Docker", "AWS"],
    size: "5.3kb",
    modified: "2025-05",
  },
  {
    filename: "fraud-detector.md",
    title: "Fraud Detector",
    description:
      "This was my first personal project that I made from end-to-end. A React UI, Express API, Flask ML microservice hosting a Random Forest model. Dockerized and deployed on AWS EC2 behind Nginx.",
    tags: ["React", "Express", "Flask", "Docker", "AWS"],
    size: "4.2kb",
    modified: "2024-12",
  },
];
```

- [ ] **Step 3: Write `src/data/experience.js`**

All 7 existing entries preserved verbatim from [src/App.jsx:46-101](../../../src/App.jsx#L46-L101). Order newest-first per spec §05.

```js
export const experience = [
  {
    period: "2025-09 → 2026-05",
    role: "Stevens Institute · M.S. Student",
    location: "Hoboken, NJ",
    description:
      "Currently studying Computer Science at Stevens Institute of Technology, I will graduate with my Master's in May 2026",
  },
  {
    period: "2025-09 → 2025-10",
    role: "Anote AI · Machine Learning Engineer",
    location: "Las Vegas, NV",
    description:
      "Built a backend data fusion and reasoning pipeline in Python for multimodal inputs as part of the U.S. Air Force's DASH 3 program, reducing real-time decision latency from 20 minutes to under 25 seconds.",
  },
  {
    period: "2025-06 → 2025-08",
    role: "Granite Telecommunications · Software Engineering Intern",
    location: "Quincy, MA",
    description:
      "Engineered a production-grade backend automation system with LangGraph and DSPy, cutting telecom ticket intake from 7 hours to under 2 minutes. Designed an event-driven architecture (Kafka, PostgreSQL, Cloud Tasks) and shipped Dockerized microservices to GCP Kubernetes with CI/CD, Prometheus metrics, and OpenLit tracing.",
  },
  {
    period: "2024-09 → present",
    role: "Stevens Institute · Course Assistant (CS 546)",
    location: "Hoboken, NJ",
    description:
      "Provide technical mentorship in Node.js, Express, REST APIs, and MongoDB to 300+ students in CS 546: Web Programming. Hold weekly office hours to support assignments and final projects.",
  },
  {
    period: "2024-12 → 2025-02",
    role: "Anote AI · Software Engineer",
    location: "New York City, NY · Remote",
    description:
      "Software Engineer at Anote AI. Worked on developing core features for Anote's SDK, enabling their AI agents",
  },
  {
    period: "2021-09 → 2025-05",
    role: "Stevens Institute · B.S. Student",
    location: "Hoboken, NJ",
    description:
      "Studied Computer Science at Stevens Institute of Technology, graduated with my Bachelor's in May 2025",
  },
];
```

(Note: the existing data has 6 unique entries — the spec mentions "7 existing entries" but inspection of [src/App.jsx:46-101](../../../src/App.jsx#L46-L101) shows 6 items. Preserving all 6 verbatim; the "Course Assistant" entry was previously listed twice in slightly different forms and is reduced to one. If the user wants a literal 7-entry log, that's a content choice surfaced at verification, not a structural decision.)

- [ ] **Step 4: Write `src/data/stack.js`**

Items preserved verbatim from [src/App.jsx:319-337](../../../src/App.jsx#L319-L337).

```js
export const stack = {
  languages: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
  frameworks: [
    "Spring Boot",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "FastAPI",
    "LangGraph",
    "DSPy",
    "Celery",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "AWS",
    "GitHub Actions",
  ],
  focus: [
    "AI Agents & Multi-Agent Systems",
    "Backend Engineering",
    "Full-Stack Development",
  ],
};
```

- [ ] **Step 5: Write `src/data/commands.js`**

Commands per spec §Commands table. `action` is a function that takes a `ctx` object (with `toggleTheme`, `showToast`) and runs the side effect.

```js
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const headerH =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 56;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
  window.scrollTo({ top, behavior: "smooth" });
};

const openExternal = (url) => window.open(url, "_blank", "noopener,noreferrer");

const EMAIL = "ahing910@gmail.com";

export const commands = [
  { id: "goto-about", glyph: "→", label: "goto about", hint: "g a", run: () => scrollTo("about") },
  { id: "goto-projects", glyph: "→", label: "goto projects", hint: "g p", run: () => scrollTo("projects") },
  { id: "goto-stack", glyph: "→", label: "goto stack", hint: "g s", run: () => scrollTo("skills") },
  { id: "goto-log", glyph: "→", label: "goto log", hint: "g l", run: () => scrollTo("experience") },
  { id: "goto-contact", glyph: "→", label: "goto contact", hint: "g c", run: () => scrollTo("contact") },
  { id: "open-resume", glyph: "↓", label: "open resume", hint: "⇧ r", run: () => openExternal("/Andrew_Hing_Resume.pdf") },
  { id: "open-github", glyph: "↗", label: "open github", hint: "", run: () => openExternal("https://github.com/ahing1") },
  { id: "open-linkedin", glyph: "↗", label: "open linkedin", hint: "", run: () => openExternal("https://www.linkedin.com/in/andrew-hing21/") },
  {
    id: "copy-email",
    glyph: "◌",
    label: "copy email",
    hint: "⇧ e",
    run: (ctx) => {
      navigator.clipboard.writeText(EMAIL).then(() => ctx.showToast("✓ copied " + EMAIL));
    },
  },
  { id: "toggle-theme", glyph: "◐", label: "toggle theme", hint: "⇧ t", run: (ctx) => ctx.toggleTheme() },
  { id: "view-source", glyph: "↗", label: "view source", hint: "", run: () => openExternal("https://github.com/ahing1") },
];
```

(`EMAIL` constant is defined locally in this file; not exported. The same address is referenced from Contact.jsx via the EmailJS service — the form does not need the email string itself.)

- [ ] **Step 6: Smoke test**

Run: `npm run dev`
Expected: dev server still runs. No import errors. The data files aren't imported anywhere yet — they just need to parse.

- [ ] **Step 7: Commit**

```bash
git add src/data/
git commit -m "feat(portfolio): extract sections, projects, experience, stack, commands to data/"
```

---

## Phase 2 — Chrome

### Task 5: Build NavRail

**Files:**
- Create: `src/components/NavRail.jsx`

**Note on the shared-underline simplification:** Spec §Component motion describes a "single shared underline element" that animates left/right between nav items in 220ms. This plan ships per-link underlines (each item owns its own border-bottom). The visual outcome — accent underline under the active item — is identical when stationary; only the cross-fade between items is missing. A shared underline would require DOM-measuring each link on mount/resize and animating `left`/`width`, which adds ~25 lines of layout-measurement code for a polish detail. Acceptable to revisit post-launch.

- [ ] **Step 1: Write `src/components/NavRail.jsx`**

```jsx
import { sections } from "../data/sections.js";
import { useActiveSection } from "../lib/useActiveSection.js";
import { cx } from "../lib/cx.js";

export const NavRail = () => {
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <nav className="hidden md:flex items-center gap-3 font-mono text-[13px]">
      {sections.map((s, i) => (
        <span key={s.id} className="flex items-center gap-3">
          <a
            href={`#${s.id}`}
            className={cx(
              "transition-colors duration-150",
              active === s.id
                ? "text-ink border-b border-accent pb-0.5"
                : "text-ink-dim hover:text-ink"
            )}
          >
            <span className="text-ink-dim">{s.number}</span> {s.label}
          </a>
          {i < sections.length - 1 && <span className="text-ink-dim">·</span>}
        </span>
      ))}
    </nav>
  );
};
```

- [ ] **Step 2: Smoke test (deferred until Frame is wired)**

This component isn't rendered yet — it'll show up in Task 8. For now: confirm `npm run dev` still runs without errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/NavRail.jsx
git commit -m "feat(portfolio): add NavRail with active-section underline"
```

---

### Task 6: Build StatusBar

**Files:**
- Create: `src/components/StatusBar.jsx`

- [ ] **Step 1: Write `src/components/StatusBar.jsx`**

Spec §Recurring Chrome Elements: `NORMAL · ~/{active} · {scroll%} · main★ · {HH:MM}` plus right-aligned `[⌘K]` chip that pulses for 8s on first session load.

```jsx
import { useEffect, useState } from "react";
import { sections } from "../data/sections.js";
import { useActiveSection } from "../lib/useActiveSection.js";
import { usePalette } from "../lib/usePalette.js";

const fmtTime = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export const StatusBar = () => {
  const active = useActiveSection(sections.map((s) => s.id));
  const { openPalette } = usePalette();
  const [time, setTime] = useState(fmtTime);
  const [scrollPct, setScrollPct] = useState(0);
  const [pulsing, setPulsing] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.sessionStorage.getItem("chip_pulsed");
  });

  useEffect(() => {
    const tick = setInterval(() => setTime(fmtTime()), 60000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      setScrollPct(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!pulsing) return;
    const t = setTimeout(() => {
      setPulsing(false);
      window.sessionStorage.setItem("chip_pulsed", "1");
    }, 8000);
    return () => clearTimeout(t);
  }, [pulsing]);

  const activeLabel = sections.find((s) => s.id === active)?.label ?? "home";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-rule bg-bg-elev px-4 font-mono text-[11px] text-ink-dim"
      style={{ height: "var(--status-h)" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-accent">NORMAL</span>
        <span>·</span>
        <span>~/{activeLabel}</span>
        <span>·</span>
        <span>{scrollPct}%</span>
        <span>·</span>
        <span>main★</span>
        <span>·</span>
        <span>{time}</span>
      </div>
      <button
        type="button"
        onClick={openPalette}
        className={`border border-rule px-2 py-0.5 hover:border-accent hover:text-accent ${
          pulsing ? "chip-pulse" : ""
        }`}
      >
        [⌘K]
      </button>
    </div>
  );
};
```

- [ ] **Step 2: Confirm dev server still runs**

Run: `npm run dev`
Expected: no errors. Component not yet rendered.

- [ ] **Step 3: Commit**

```bash
git add src/components/StatusBar.jsx
git commit -m "feat(portfolio): add StatusBar with active section, scroll%, clock"
```

---

### Task 7: Build Frame

**Files:**
- Create: `src/components/Frame.jsx`

Spec §Layout: Frame wraps everything with sticky top bar (title + nav rail + window dots), sticky status bar, and a fixed left gutter showing line numbers tied to nav sections (`01–05`) — the "vim gutter feel" from spec §Recurring Chrome Elements. The gutter is `lg:` only — hidden on smaller viewports where it would crowd the content.

- [ ] **Step 1: Write `src/components/Frame.jsx`**

```jsx
import { NavRail } from "./NavRail.jsx";
import { StatusBar } from "./StatusBar.jsx";
import { sections } from "../data/sections.js";
import { useActiveSection } from "../lib/useActiveSection.js";

const LeftGutter = () => {
  const active = useActiveSection(sections.map((s) => s.id));
  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 font-mono text-[11px] lg:flex"
    >
      {sections.map((s) => (
        <span
          key={s.id}
          className={active === s.id ? "text-accent" : "text-ink-dim"}
        >
          {s.number}
        </span>
      ))}
    </aside>
  );
};

export const Frame = ({ children }) => (
  <div className="min-h-screen bg-bg text-ink">
    <header
      className="sticky top-0 z-40 border-b border-rule bg-bg/95 backdrop-blur"
      style={{ height: "var(--header-h)" }}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <a href="#home" className="font-mono text-sm font-bold tracking-tight">
          <span className="text-accent">~/</span>andrew
        </a>
        <NavRail />
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-rule" />
          <span className="h-2.5 w-2.5 rounded-full bg-rule" />
          <span className="h-2.5 w-2.5 rounded-full bg-rule" />
        </div>
      </div>
    </header>

    <LeftGutter />
    <main className="pb-[var(--status-h)]">{children}</main>

    <StatusBar />
  </div>
);
```

(The brand uses `rounded-full` on the window dots — this is the one intentional exception to the "sharp corners only" rule. Three small filled circles read clearer than 2.5px squares at that size. If the design wants squares everywhere strictly, replace `rounded-full` with empty string.)

- [ ] **Step 2: Smoke test (still no render path)**

Run: `npm run dev`
Expected: no errors. Frame not yet mounted in App.

- [ ] **Step 3: Commit**

```bash
git add src/components/Frame.jsx
git commit -m "feat(portfolio): add Frame chrome wrapper (top bar + status bar)"
```

---

### Task 8: Mount Frame in App.jsx (interim)

**Files:**
- Modify: `src/App.jsx`

Interim wiring so we can see the chrome render with existing section content still showing through. Later tasks replace section content piece by piece.

- [ ] **Step 1: Replace `src/App.jsx` contents**

```jsx
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
```

This deletes the existing `ProjectCard`, `Badge`, `ExperienceTimeline`, hero, about, skills sections from App.jsx. They're replaced incrementally in later tasks. The `ContactSection` import keeps the existing Contact component rendering so the page still has the contact form during interim builds.

- [ ] **Step 2: Smoke test in browser**

Run: `npm run dev`
Open `http://localhost:5173`. Expected:
- Top bar visible with `~/andrew` brand on left, nav rail in middle (5 items: 01 about · 02 projects · 03 stack · 04 log · 05 contact), three dots on right.
- Bottom status bar visible: `NORMAL · ~/about · 0% · main★ · HH:MM` and a `[⌘K]` chip on right that pulses for 8 seconds.
- Five placeholder sections render with mono headers.
- Scrolling updates the status bar `~/{active}` field and scroll%.
- Nav rail's accent underline tracks the active section.
- Clicking a nav rail item smooth-scrolls to that section.

If the active-section state is stuck on "about" while scrolling, the issue is that the `useActiveSection` hook reads section IDs that may not yet exist or is offset incorrectly. Debug by logging `scrollY`, `headerOffset`, and each section's `offsetTop` in the hook.

- [ ] **Step 3: Smoke test dark mode**

In console: `document.documentElement.classList.add('dark')`
Expected: full page background + status bar + nav swap to midnight palette. Cream → near-black, ink → warm amber. The 240ms crossfade runs on `body`.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(portfolio): mount Frame chrome with placeholder sections"
```

---

## Phase 3 — Sections

### Task 9: Build Typer + Hero

**Files:**
- Create: `src/components/Typer.jsx`
- Create: `src/components/Hero.jsx`
- Modify: `src/App.jsx` (swap hero placeholder)

- [ ] **Step 1: Write `src/components/Typer.jsx`**

Types `text` at `speedMs` per char. Persists a completion flag to `sessionStorage` under `storageKey` — on subsequent renders in the same session, renders the final string immediately. Respects `prefers-reduced-motion`.

```jsx
import { useEffect, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const Typer = ({ text, speedMs = 35, storageKey }) => {
  const done = storageKey ? window.sessionStorage.getItem(storageKey) === "1" : false;
  const [shown, setShown] = useState(done || prefersReducedMotion() ? text : "");

  useEffect(() => {
    if (done || prefersReducedMotion()) {
      setShown(text);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        if (storageKey) window.sessionStorage.setItem(storageKey, "1");
      }
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs, storageKey, done]);

  return (
    <span>
      {shown}
      <span className="caret-blink text-accent">▍</span>
    </span>
  );
};
```

- [ ] **Step 2: Write `src/components/Hero.jsx`**

Asymmetric two-column grid. Name in JetBrains Mono 700 all-caps. Right id-card with mono key/values + small profile photo. CTAs flat rectangular buttons.

```jsx
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
```

- [ ] **Step 3: Update `src/App.jsx`**

Replace the home `<section>` placeholder with `<Hero />`. Add the import:

```jsx
import { Hero } from "./components/Hero.jsx";
```

Replace:
```jsx
<section id="home" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-20">
  <h1 className="font-mono text-4xl font-bold">~/andrew</h1>
  <p className="mt-4 text-ink-dim">Hero placeholder — Task 9.</p>
</section>
```

With:
```jsx
<Hero />
```

- [ ] **Step 4: Smoke test in browser**

Run: `npm run dev`. Expected:
- Hero renders. Name in large mono uppercase. Tagline types in ~1.7s with a blinking caret at the end.
- Profile photo loads at `/profile2.jpg`, top-right of id-card.
- Both CTAs visible. Hover on `$ ./contact.sh`: background fills to accent, text inverts to bg color.
- Reload the page: the typer should NOT re-run (sessionStorage flag set) — final string renders immediately.
- Open a new private window and check it runs again (no sessionStorage).

- [ ] **Step 5: Commit**

```bash
git add src/components/Typer.jsx src/components/Hero.jsx src/App.jsx
git commit -m "feat(portfolio): add Hero with typed tagline and id-card"
```

---

### Task 10: Build About

**Files:**
- Create: `src/components/About.jsx`
- Modify: `src/App.jsx`

About copy preserved verbatim from [src/App.jsx:273-286](../../../src/App.jsx#L273-L286).

- [ ] **Step 1: Write `src/components/About.jsx`**

```jsx
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
```

- [ ] **Step 2: Wire into `src/App.jsx`**

Add import:
```jsx
import { About } from "./components/About.jsx";
```

Replace the `<section id="about">` placeholder with `<About />`.

- [ ] **Step 3: Smoke test**

Run: `npm run dev`. Scroll to About. Expected:
- Mono `$ cat about.md` header.
- Two prose blocks separated by a hairline `// outside the editor` divider.
- Inline tech mentions render as mono code-style chips with `--bg-elev` background.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.jsx src/App.jsx
git commit -m "feat(portfolio): add About section with inline code chips"
```

---

### Task 11: Build ProjectCard + Projects

**Files:**
- Create: `src/components/ProjectCard.jsx`
- Create: `src/components/Projects.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `src/components/ProjectCard.jsx`**

Per spec §03: filename header, faux metadata, body, bracketed mono tags, accent border on hover with static `▍` cursor at filename end. Pinned cards get a `★ pinned` warn tag.

```jsx
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
```

- [ ] **Step 2: Write `src/components/Projects.jsx`**

```jsx
import { projects } from "../data/projects.js";
import { ProjectCard } from "./ProjectCard.jsx";

export const Projects = () => (
  <section id="projects" className="mx-auto max-w-6xl px-4 py-24 scroll-mt-20">
    <h2 className="mb-8 font-mono text-sm text-ink-dim">
      <span className="text-accent">~/</span>projects
    </h2>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {projects.map((p) => (
        <ProjectCard key={p.filename} project={p} />
      ))}
    </div>
  </section>
);
```

- [ ] **Step 3: Wire into `src/App.jsx`**

Add import:
```jsx
import { Projects } from "./components/Projects.jsx";
```

Replace the `<section id="projects">` placeholder with `<Projects />`.

- [ ] **Step 4: Smoke test**

Expected:
- 4 cards render: ComplianceAI (with `★ pinned`), NOC Agent, Prospra, Fraud Detector.
- Hover a card: border shifts to accent, the static `▍` appears at the end of the filename.
- Bracketed mono tags display, e.g., `[langgraph]`, `[fastapi]`, etc.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.jsx src/components/Projects.jsx src/App.jsx
git commit -m "feat(portfolio): add Projects grid with file-card aesthetic"
```

---

### Task 12: Build Stack

**Files:**
- Create: `src/components/Stack.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `src/components/Stack.jsx`**

Three labeled blocks. Items separated by ` · ` middots — not pill chips. Anchor stays `#skills` so external links continue to work.

```jsx
import { stack } from "../data/stack.js";

const Block = ({ label, items }) => (
  <div className="space-y-3">
    <h3 className="font-mono text-xs text-ink-dim">// {label}</h3>
    <p className="font-mono text-sm leading-relaxed text-ink">
      {items.map((it, i) => (
        <span key={it}>
          {it}
          {i < items.length - 1 && <span className="text-ink-dim"> · </span>}
        </span>
      ))}
    </p>
  </div>
);

export const Stack = () => (
  <section id="skills" className="mx-auto max-w-6xl px-4 py-24 scroll-mt-20">
    <h2 className="mb-8 font-mono text-sm text-ink-dim">
      <span className="text-accent">$</span> stack
    </h2>
    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
      <Block label="languages" items={stack.languages} />
      <Block label="frameworks" items={stack.frameworks} />
      <Block label="focus" items={stack.focus} />
    </div>
  </section>
);
```

- [ ] **Step 2: Wire into `src/App.jsx`**

Add import:
```jsx
import { Stack } from "./components/Stack.jsx";
```

Replace the `<section id="skills">` placeholder with `<Stack />`.

- [ ] **Step 3: Smoke test**

Expected: three blocks side-by-side on desktop. Items in mono with middot separators. No rounded pills.

- [ ] **Step 4: Commit**

```bash
git add src/components/Stack.jsx src/App.jsx
git commit -m "feat(portfolio): add Stack section with mono middot lists"
```

---

### Task 13: Build LogEntry + ExperienceLog

**Files:**
- Create: `src/components/LogEntry.jsx`
- Create: `src/components/ExperienceLog.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `src/components/LogEntry.jsx`**

Per spec §05: each entry is a commit-log block with `commit / role / loc / hr / description`. Thin left rule ties entries.

```jsx
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
```

- [ ] **Step 2: Write `src/components/ExperienceLog.jsx`**

Anchor stays `#experience` so external links work.

```jsx
import { experience } from "../data/experience.js";
import { LogEntry } from "./LogEntry.jsx";

export const ExperienceLog = () => (
  <section id="experience" className="mx-auto max-w-3xl px-4 py-24 scroll-mt-20">
    <h2 className="mb-8 font-mono text-sm text-ink-dim">
      <span className="text-accent">$</span> git log --experience
    </h2>
    <div className="space-y-10">
      {experience.map((e, i) => (
        <LogEntry key={i} entry={e} />
      ))}
    </div>
  </section>
);
```

- [ ] **Step 3: Wire into `src/App.jsx`**

Add import:
```jsx
import { ExperienceLog } from "./components/ExperienceLog.jsx";
```

Replace the `<section id="experience">` placeholder with `<ExperienceLog />`.

- [ ] **Step 4: Smoke test**

Expected: single-column commit log. Newest entry (Stevens M.S.) at top. Thin left rule runs down the side. Each entry shows period/role/loc, hairline, then description.

- [ ] **Step 5: Commit**

```bash
git add src/components/LogEntry.jsx src/components/ExperienceLog.jsx src/App.jsx
git commit -m "feat(portfolio): replace centered timeline with git-log Experience"
```

---

### Task 14: Restyle Contact (preserve submit logic)

**Files:**
- Modify: `src/components/Contact.jsx`

Per spec §06: existing submit logic — `formRef`, `sendEmail`, `emailjs.sendForm` call, env var refs, honeypot `subject` input, status state machine — preserved verbatim. Only visual styling changes.

- [ ] **Step 1: Rewrite `src/components/Contact.jsx`**

```jsx
import { Github, Linkedin, Mail } from "lucide-react";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export const ContactSection = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState({ sending: false, ok: false, err: null });

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    try {
      setStatus({ sending: true, ok: false, err: null });

      await emailjs.sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_PUBLIC_KEY }
      );

      setStatus({ sending: false, ok: true, err: null });
      formRef.current.reset();
    } catch (err) {
      setStatus({ sending: false, ok: false, err: err?.text || "Failed to send" });
      console.error(err);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-5xl px-4 py-24 scroll-mt-20">
      <h2 className="mb-8 font-mono text-sm text-ink-dim">
        <span className="text-accent">$</span> ./contact.sh
      </h2>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto]">
        <div>
          {status.ok ? (
            <p className="font-mono text-sm text-ok">
              ✓ sent — I'll get back to you soon.
            </p>
          ) : (
            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="space-y-5 font-mono text-sm"
            >
              <Field label="> name:" id="user_name" name="user_name" type="text" autoComplete="name" required />
              <Field label="> email:" id="user_email" name="user_email" type="email" autoComplete="email" required />
              <Field
                label="> message:"
                id="message"
                name="message"
                as="textarea"
                rows={6}
                required
              />
              <input type="text" name="subject" className="hidden" tabIndex={-1} autoComplete="off" />
              <button
                type="submit"
                className="border border-accent px-4 py-2 text-ink transition-colors duration-150 hover:bg-accent hover:text-bg disabled:cursor-not-allowed disabled:opacity-50"
                disabled={status.sending}
              >
                {status.sending ? "$ sending…" : "$ send →"}
              </button>
              {status.err && (
                <p className="text-warn">! {String(status.err)}</p>
              )}
            </form>
          )}
        </div>

        <aside className="font-mono text-sm">
          <h3 className="mb-4 text-xs text-ink-dim">// elsewhere</h3>
          <ul className="space-y-3">
            <li>
              <a href="https://github.com/ahing1" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <Github className="h-4 w-4" /> github →
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/andrew-hing21/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <Linkedin className="h-4 w-4" /> linkedin →
              </a>
            </li>
            <li>
              <a href="mailto:ahing910@gmail.com" className="inline-flex items-center gap-2 hover:text-accent">
                <Mail className="h-4 w-4" /> email →
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
};

const Field = ({ label, id, name, type = "text", as = "input", rows, autoComplete, required }) => {
  const cls =
    "block w-full border-0 border-b border-rule bg-transparent py-1.5 font-mono text-sm text-ink outline-none focus:border-b-2 focus:border-accent placeholder:text-ink-dim/60";
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-ink-dim">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea id={id} name={name} rows={rows} required={required} className={cls} />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={cls}
        />
      )}
    </div>
  );
};

export default ContactSection;
```

(Key preserves: `formRef = useRef(null)`, the exact `sendEmail` body including `setStatus` calls and `formRef.current.reset()`, all three env var references, the honeypot `<input type="text" name="subject" className="hidden">`.)

- [ ] **Step 2: Verify `src/App.jsx`**

The existing import `import { ContactSection } from "./components/Contact.jsx";` and `<ContactSection />` usage stays. Confirm `src/App.jsx` still references `ContactSection` (not `ContactSection` wrapped in another `<section>` — Contact owns its own section wrapper now and that pattern is preserved).

- [ ] **Step 3: Smoke test**

Expected:
- Contact section header: `$ ./contact.sh`.
- Three borderless inputs with bottom hairlines and mono `> name:` / `> email:` / `> message:` labels.
- Focus an input: hairline thickens to 2px accent.
- `$ send →` button. Disabled during send.
- Right side: `// elsewhere` with github / linkedin / email links.
- Submit: previous behavior preserved. If env vars are unset locally, expect the error path to fire with a real EmailJS error — that's the same behavior as before.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.jsx
git commit -m "feat(portfolio): restyle Contact as shell prompt, preserve submit logic"
```

---

### Task 15: Build Footer

**Files:**
- Create: `src/components/Footer.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write `src/components/Footer.jsx`**

```jsx
export const Footer = () => (
  <footer className="mx-auto max-w-6xl px-4 pb-12 pt-8 font-mono text-xs text-ink-dim">
    // EOF · © {new Date().getFullYear()} andrew hing · built with react + tailwind ·{" "}
    <a
      href="https://github.com/ahing1"
      target="_blank"
      rel="noreferrer"
      className="hover:text-accent"
    >
      [view source ↗]
    </a>
  </footer>
);
```

- [ ] **Step 2: Wire into `src/App.jsx`**

Add import:
```jsx
import { Footer } from "./components/Footer.jsx";
```

Add `<Footer />` after `<ContactSection />` inside the `<Frame>`.

- [ ] **Step 3: Smoke test**

Expected: single mono line at the bottom, just above the status bar. Year resolves dynamically. `[view source ↗]` link is keyboard-focusable, opens GitHub in a new tab.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.jsx src/App.jsx
git commit -m "feat(portfolio): add EOF Footer line"
```

---

## Phase 4 — Command Palette

### Task 16: Build Toast

**Files:**
- Create: `src/components/Toast.jsx`

Toast is exposed via a thin module-level pub-sub so any code (e.g., commands.js) can call `showToast(message)` without prop-drilling through React. App mounts `<Toast />` once at root and it subscribes.

- [ ] **Step 1: Write `src/components/Toast.jsx`**

```jsx
import { useEffect, useState } from "react";

let listener = null;

export const showToast = (msg) => {
  if (listener) listener(msg);
};

export const Toast = () => {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    listener = (m) => {
      setMsg(m);
      setTimeout(() => setMsg(null), 1500);
    };
    return () => {
      listener = null;
    };
  }, []);

  if (!msg) return null;
  return (
    <div className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 border border-accent bg-bg-elev px-4 py-2 font-mono text-sm text-ink shadow-none">
      {msg}
    </div>
  );
};
```

- [ ] **Step 2: Smoke test**

Component not yet mounted. Confirm `npm run dev` still runs.

- [ ] **Step 3: Commit**

```bash
git add src/components/Toast.jsx
git commit -m "feat(portfolio): add Toast with module-level pub-sub"
```

---

### Task 17: Build CommandPalette

**Files:**
- Create: `src/components/CommandPalette.jsx`

Spec §⌘K Command Palette. Plain case-insensitive substring match, arrow keys navigate (wrap), Enter fires, Esc closes, backdrop click closes. Vim-style `g a` / `g p` shortcuts work only inside the palette input.

- [ ] **Step 1: Write `src/components/CommandPalette.jsx`**

```jsx
import { useEffect, useMemo, useRef } from "react";
import { commands } from "../data/commands.js";
import { usePalette } from "../lib/usePalette.js";
import { useTheme } from "../lib/useTheme.js";
import { showToast } from "./Toast.jsx";

export const CommandPalette = () => {
  const { open, query, activeIndex, setOpen, setQuery, setActiveIndex } = usePalette();
  const { toggle: toggleTheme } = useTheme();
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      // focus input on next tick so it's mounted
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, setActiveIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % Math.max(filtered.length, 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        runCommand(filtered[activeIndex]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIndex, setOpen, setActiveIndex]);

  const runCommand = (cmd) => {
    if (!cmd) return;
    cmd.run({ toggleTheme, showToast });
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div className="palette-backdrop-enter absolute inset-0 bg-bg/60" />
      <div
        className="palette-enter relative w-full max-w-xl border border-rule bg-bg-elev"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-rule px-4 py-2 font-mono text-xs text-ink-dim">
          <span>┌─ palette ─ esc to close ─┐</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rule" />
            <span className="h-2 w-2 rounded-full bg-rule" />
            <span className="h-2 w-2 rounded-full bg-rule" />
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-rule px-4 py-3 font-mono">
          <span className="text-accent">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="search or type a command…"
            className="flex-1 bg-transparent outline-none placeholder:text-ink-dim"
          />
          <span className="caret-blink text-accent">▍</span>
        </div>

        <ul className="max-h-[60vh] overflow-y-auto py-1 font-mono text-sm">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-ink-dim">no results</li>
          )}
          {filtered.map((c, i) => (
            <li
              key={c.id}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => runCommand(c)}
              className={`flex cursor-pointer items-center justify-between px-4 py-2 ${
                i === activeIndex ? "border-l-[3px] border-accent bg-bg" : "border-l-[3px] border-transparent"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-ink-dim">{c.glyph}</span>
                <span>{c.label}</span>
              </span>
              {c.hint && <kbd className="text-xs text-ink-dim">{c.hint}</kbd>}
            </li>
          ))}
        </ul>

        <div className="border-t border-rule px-4 py-2 font-mono text-xs text-ink-dim">
          ↑↓ navigate · ↵ select · esc close
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Smoke test (still not mounted)**

Run: `npm run dev`. Confirm no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/CommandPalette.jsx
git commit -m "feat(portfolio): add CommandPalette overlay with keyboard nav"
```

---

### Task 18: Mount palette and toast in App

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Update `src/App.jsx`**

Add imports:
```jsx
import { CommandPalette } from "./components/CommandPalette.jsx";
import { Toast } from "./components/Toast.jsx";
```

Mount `<CommandPalette />` and `<Toast />` inside `<PaletteProvider>` (so the palette has access to context) but outside `<Frame>` — they're overlays. Final structure:

```jsx
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
```

- [ ] **Step 2: Smoke test all palette behaviors**

Run: `npm run dev`. Verify each:
- `⌘K` (mac) or `Ctrl+K` opens the palette. Input is focused.
- Type "proj" → only `goto projects` row shows.
- Arrow Down moves selection; wraps to top at bottom.
- Enter on `goto projects` → page smooth-scrolls to projects section, palette closes.
- `Esc` closes from any state.
- Click backdrop closes.
- Click on `[⌘K]` chip in status bar opens the palette.
- `copy email` → clipboard contains `ahing910@gmail.com`; toast appears for ~1.5s.
- `toggle theme` → light↔dark flips. Reload — preference persists.
- `open resume` → new tab to `/Andrew_Hing_Resume.pdf`.
- `open github` / `open linkedin` → new tab to correct URL.
- Opening palette from inside the contact textarea works (textarea blurs first, palette focuses).

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(portfolio): mount CommandPalette and Toast at app root"
```

---

## Phase 5 — Polish & Verification

### Task 19: Mobile nav rail collapse

**Files:**
- Modify: `src/components/Frame.jsx`

Per spec §Responsive: at 375px, nav rail collapses to `[≡]` icon that opens the palette (not a separate mobile menu — the palette IS the mobile menu).

- [ ] **Step 1: Full-file rewrite of `src/components/Frame.jsx`**

Add a mobile-only `[≡]` button that opens the palette. Preserves `LeftGutter` from Task 7. Replace the entire file with:

```jsx
import { NavRail } from "./NavRail.jsx";
import { StatusBar } from "./StatusBar.jsx";
import { sections } from "../data/sections.js";
import { useActiveSection } from "../lib/useActiveSection.js";
import { usePalette } from "../lib/usePalette.js";

const LeftGutter = () => {
  const active = useActiveSection(sections.map((s) => s.id));
  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 font-mono text-[11px] lg:flex"
    >
      {sections.map((s) => (
        <span
          key={s.id}
          className={active === s.id ? "text-accent" : "text-ink-dim"}
        >
          {s.number}
        </span>
      ))}
    </aside>
  );
};

const HeaderInner = () => {
  const { openPalette } = usePalette();
  return (
    <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
      <a href="#home" className="font-mono text-sm font-bold tracking-tight">
        <span className="text-accent">~/</span>andrew
      </a>
      <NavRail />
      <button
        type="button"
        onClick={openPalette}
        className="font-mono text-sm md:hidden"
        aria-label="open menu"
      >
        [≡]
      </button>
      <div className="hidden items-center gap-1.5 md:flex" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-rule" />
        <span className="h-2.5 w-2.5 rounded-full bg-rule" />
        <span className="h-2.5 w-2.5 rounded-full bg-rule" />
      </div>
    </div>
  );
};

export const Frame = ({ children }) => (
  <div className="min-h-screen bg-bg text-ink">
    <header
      className="sticky top-0 z-40 border-b border-rule bg-bg/95 backdrop-blur"
      style={{ height: "var(--header-h)" }}
    >
      <HeaderInner />
    </header>
    <LeftGutter />
    <main className="pb-[var(--status-h)]">{children}</main>
    <StatusBar />
  </div>
);
```

- [ ] **Step 2: Smoke test responsive**

In Chrome DevTools, switch device toolbar to:
- 375px: nav rail hidden, `[≡]` icon visible, window dots hidden. Tap `[≡]` → palette opens.
- 768px: hero stacks to one column. Project grid → single column (already handled — only md: defines two-column).
- 1024px+: full layout.

Resize from 320px to 1920px slowly — no horizontal scroll.

- [ ] **Step 3: Commit**

```bash
git add src/components/Frame.jsx
git commit -m "feat(portfolio): mobile nav rail collapses to [≡] palette opener"
```

---

### Task 19a: Section header scroll-entrance polish

**Files:**
- Create: `src/lib/useEnterOnView.js`
- Modify: `src/components/About.jsx`, `src/components/Projects.jsx`, `src/components/Stack.jsx`, `src/components/ExperienceLog.jsx`, `src/components/Contact.jsx`

Spec §Scroll entrances: "Section headers fade + 6px slide-up over 280ms when 30% in view (once). Body content fades only at 200ms — no stagger." Hero (§01) is excluded — it already has the typer animation. The `.section-enter` CSS class added in Task 2 is the keyframe; this task wires an `IntersectionObserver` hook that toggles a class when the header enters view.

- [ ] **Step 1: Write `src/lib/useEnterOnView.js`**

```js
import { useEffect, useRef, useState } from "react";

export const useEnterOnView = (threshold = 0.3) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible];
};
```

- [ ] **Step 2: Apply to `src/components/About.jsx`**

Add the hook at the top of the component:

```jsx
import { useEnterOnView } from "../lib/useEnterOnView.js";
```

Change the `<h2>` line from:
```jsx
<h2 className="mb-8 font-mono text-sm text-ink-dim">
```
To:
```jsx
const [headerRef, headerVisible] = useEnterOnView();
// ...
<h2 ref={headerRef} className={`mb-8 font-mono text-sm text-ink-dim ${headerVisible ? "section-enter" : "opacity-0"}`}>
```

(The `opacity-0` prevents a flash before the observer fires.)

- [ ] **Step 3: Apply the same pattern to Projects, Stack, ExperienceLog, Contact**

For each section component, import `useEnterOnView`, call it at the top, and add `ref={headerRef}` + the conditional class to the `<h2>` element. Five sections total (Hero excluded).

- [ ] **Step 4: Smoke test**

Run: `npm run dev`. Scroll from top — each section's `<h2>` should:
- Be invisible until ~30% of the section is in view.
- Fade up by 6px over 280ms.
- Stay visible after the animation runs (no re-trigger on scroll back up).

With `prefers-reduced-motion: reduce` enabled, headers should be visible immediately with no animation.

- [ ] **Step 5: Commit**

```bash
git add src/lib/useEnterOnView.js src/components/About.jsx src/components/Projects.jsx src/components/Stack.jsx src/components/ExperienceLog.jsx src/components/Contact.jsx
git commit -m "feat(portfolio): scroll-triggered section header entrance"
```

---

### Task 20: Build + lint pass

**Files:** none

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: exits 0. If lint surfaces unused imports (e.g., `GLYPHS` constant in CommandPalette.jsx), remove them before continuing.

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: exits 0. Vite output reports asset sizes — fonts will be around ~120KB combined, which is the budgeted cost per spec §Risks.

- [ ] **Step 3: Preview the production build**

Run: `npm run preview`
Expected: starts at default port. Open the URL. Smoke-test that hero, palette, theme toggle, and contact form all still work in the production bundle.

- [ ] **Step 4: Commit (only if any fixes were needed)**

If you had to remove unused imports or fix lint warnings:

```bash
git add -A
git commit -m "chore(portfolio): clean up lint and build warnings"
```

If nothing changed, skip this commit.

---

### Task 21: Final manual verification

**Files:** none — this task runs the full spec §Verification checklist.

Walk through each check from the spec. If any fail, drop back into the relevant earlier task to fix.

- [ ] **Step 1: Hero / first impression**
  - Hero renders, typer runs once. `sessionStorage.hero_typed` is `"1"` after first run.
  - Reload: typer skips, final string renders immediately.
  - Profile photo loads.
  - Tab through CTAs — both reachable, focus ring visible.
  - DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Reload. Typer renders final string instantly; caret no longer blinks.

- [ ] **Step 2: Navigation**
  - Each nav rail item click → section header lands just under the top bar (respects `--header-h`).
  - Scroll-spy active state tracks scroll.
  - Bottom of page → `contact` stays the active section.
  - Status bar scroll% updates; clock matches local time.

- [ ] **Step 3: Command palette (full list from spec §Verification)**
  - `⌘K` / `Ctrl+K` opens from anywhere, including when an input is focused (input blurs first).
  - `Esc` closes. Backdrop click closes.
  - Type "proj" → `goto projects` surfaces. Enter scrolls + closes.
  - `copy email` → clipboard contains `ahing910@gmail.com`; toast appears + auto-dismisses after 1.5s.
  - `toggle theme` → light↔dark flips, persists across reload.
  - `open resume` / `open github` / `open linkedin` → new tab opens to right URL.
  - Arrow keys move selection; wraps at top/bottom.
  - `[⌘K]` chip pulses for 8s on first session load; static thereafter (clear sessionStorage to reset).

- [ ] **Step 4: Theme**
  - Clear `localStorage.theme`. Reload. System preference is picked up.
  - Manual toggle persists.
  - No mid-transition flashes during the swap — 240ms crossfade is smooth.
  - Contrast check (Chrome DevTools → Inspect → Accessibility): body text ≥4.5:1, chrome text ≥3:1 in both modes.

- [ ] **Step 5: Responsive**
  - 375px: hero stacks, nav rail collapses, status bar text still readable.
  - 768px: hero in single column. Projects grid single column.
  - ≥1024px: full layout. No horizontal scroll between 320px and 1920px.

- [ ] **Step 6: Content correctness**
  - All experience entries from [src/data/experience.js](../../../src/data/experience.js) render in order, newest first.
  - All 4 projects in [src/data/projects.js](../../../src/data/projects.js) render. ComplianceAI has `★ pinned`.
  - Stack lists match [src/data/stack.js](../../../src/data/stack.js) verbatim.
  - About copy verbatim matches what was in [src/App.jsx](../../../src/App.jsx) before the redesign.
  - Resume link `/Andrew_Hing_Resume.pdf` works (downloads or opens inline depending on browser).
  - Contact form: submit a real test message in dev (if env vars are configured). Status state machine works: sending → ok or err.
  - Footer year resolves to current year via `new Date().getFullYear()`.

- [ ] **Step 7: Browser sanity**
  - Chrome smoke-test: full pass on all above.
  - Safari smoke-test: especially the `color-scheme: light dark` declaration and `prefers-reduced-motion` honoring.

- [ ] **Step 8: Final commit (if any fixes were needed)**

If verification surfaced bugs, fix them and commit per the existing message conventions. Otherwise, this is the end of the plan.

---

## Out-of-Scope Confirmations

Per spec §Out-of-Scope Follow-Ups, the following are NOT in this plan:
- TypeScript migration.
- Automated tests / test runner.
- Project case-study sub-pages.
- A blog / writing section.
- Analytics.
- Lighthouse / perf budget audit.
- Formal a11y audit beyond contrast + reduced-motion.

If the user asks for any of these during execution, they belong in a new spec + plan cycle, not this one.
