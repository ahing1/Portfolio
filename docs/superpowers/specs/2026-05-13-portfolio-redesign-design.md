# Portfolio Redesign — Design Spec

**Date:** 2026-05-13
**Owner:** Andrew Hing
**Scope:** Full redesign of the React portfolio at [src/App.jsx](../../../src/App.jsx) plus a code cleanup pass on the existing files. No new content; all existing copy, projects, experience entries, resume link, and contact wiring are preserved.

---

## Goal

Replace the current "modern SaaS template" aesthetic (indigo→fuchsia gradient hero, zinc cards, soft shadows, centered timeline) with a distinctive **hybrid terminal / workstation** aesthetic that signals "serious systems engineer who lives in code" — while keeping the site fully scrollable and accessible to non-power users. Add a `⌘K` command palette as the signature interaction.

The cleanup pass splits the 358-line [src/App.jsx](../../../src/App.jsx) monolith into purpose-scoped files, moves hardcoded data into `src/data/`, extracts hooks, and removes Vite-default boilerplate.

## Non-Goals

- Not migrating to TypeScript.
- Not adding automated tests (none exist today; introducing a test runner is out of scope).
- Not changing the build (Vite + Tailwind v4 stay).
- Not changing site content — all existing copy, projects, experience entries, and assets in [public/](../../../public) are preserved verbatim.
- Not adding new pages, routes, or sections.

---

## Concept

**Name:** `~/andrew` — a personal workstation. The site is dressed in the chrome of a thoughtful engineer's terminal, but underneath it is a normal scrollable page that any visitor can use without learning a CLI.

**Aesthetic guardrails:**
- Sharp corners only (`border-radius: 0` everywhere — no soft pills or rounded cards).
- No soft shadows, no gradients in text, no `shadow-md`.
- One accent color used sparingly (active state, prompt `$`, hover) — overuse kills it.
- Restraint over performance: animation is mechanical and intentional, never bouncy or spring-physics-y.

---

## Visual System

### Palette (CSS custom properties, mode-swappable)

| Token | Light (paper) | Dark (midnight) | Use |
|---|---|---|---|
| `--bg` | `#F5EFE4` cream paper | `#0A0A0F` near-black | page background |
| `--bg-elev` | `#EFE7D6` | `#15151D` | cards / chrome |
| `--ink` | `#1A1814` | `#E8C77A` warm amber | primary text |
| `--ink-dim` | `#6B6457` | `#9A8E7A` | secondary text |
| `--rule` | `#D9CFBC` | `#2A2730` | dividers, hairlines |
| `--accent` | `#C44A1E` rust | `#FF8A4C` signal orange | active, prompt, hover |
| `--link` | `#4B6584` muted blue | `#6FD1E6` cyan | links |
| `--ok` | `#5C7A3F` olive | `#7FD17F` | success / "OK" |
| `--warn` | `#B57A1F` ochre | `#F5C770` | pinned / warnings |

Tokens are declared in `:root` and overridden under `.dark`. Tailwind v4 references them via `@theme` block in [src/index.css](../../../src/index.css) so utilities like `bg-bg` / `text-ink` work.

### Typography

- **Display / chrome / labels / code:** `JetBrains Mono` (400, 500, 700). Self-hosted via `@fontsource/jetbrains-mono`.
- **Body:** `Inter Tight` variable. Self-hosted via `@fontsource-variable/inter-tight`.
- Body 16px, line-height 1.6. Hero name uses `clamp(56px, 9vw, 112px)`.
- Both fonts use `font-display: swap`. The two weights used in the hero are preloaded via `<link rel="preload">` in [index.html](../../../index.html).

### Recurring Chrome Elements

- **Box-drawing frames** around major regions, drawn with CSS borders + corner pseudo-elements (not literal `┌─┐` glyphs — crispness matters).
- **Three window dots** (`● ● ●`) top-right of the outer frame, muted in light mode.
- **Section headers** prefixed with mono `$` or `~/`: `$ whoami`, `$ cat about.md`, `~/projects`, `$ stack`, `$ git log --experience`, `$ ./contact.sh`.
- **Section anchor IDs** are preserved from the existing site so external links to `/#about`, `/#projects`, `/#skills`, `/#experience`, `/#contact` continue to work. Only the visible labels change.
- **Nav rail labels** (top bar): `01 about · 02 projects · 03 stack · 04 log · 05 contact` — number-prefixed, lowercase, mono, separated by middots. The active item shows an `--accent` underline.
- **Status bar** docked to viewport bottom: `NORMAL · ~/{active} · {scroll%} · main★ · {HH:MM}` plus a right-aligned `[⌘K]` chip.
- **Left gutter line numbers** (`01`, `02`, ...) running down the side of each major section — a vim-gutter feel.

---

## Layout & Sections

Outer chrome wraps everything: sticky top bar (title + nav rail + window dots) and sticky status bar (bottom). Sections live in between.

### 01 — `$ whoami` (hero)

Replaces the current home section. Asymmetric two-column grid:
- **Left (60%):** Name in JetBrains Mono 700, `clamp(56px, 9vw, 112px)`, all caps, tight tracking. Below, a one-line typed tagline: `> software engineer · agentic systems · open to full-time roles_` (typed only on first session visit; see Motion).
- **Right (40%):** Mono key/value `id-card`:
  ```
  name      andrew hing
  status    available · 2026 grads
  location  hoboken, nj
  focus     agents · backend · ml
  signal    [⌘K] open palette
  ```
- **CTAs:** `$ ./contact.sh` and `$ open resume.pdf` — flat rectangular buttons, mono, accent-bordered.
- **Profile photo:** small (`h-16`), top-right of id-card. Existing `/profile2.jpg` retained.

### 02 — `$ cat about.md`

Single column, max-width 64ch. Inter Tight body. Two prose blocks separated by a horizontal rule labeled `// outside the editor`. Inline mono code-style spans wrap tech mentions (`Python`, `LangGraph`, etc.) — tight padding, `--bg-elev` background, no border. All existing About copy preserved verbatim.

### 03 — `~/projects`

Two-column on desktop (`md:grid-cols-2`), single column on mobile. Each project is a **file-card**:
- Header line: `complianceai.md` followed by right-aligned faux file metadata: `8.4kb · modified 2025-10`.
- Body: existing description preserved.
- Tags rendered as bracketed mono chips: `[langgraph]`, `[fastapi]`, etc. — bracket chars in `--ink-dim`, label in `--ink`.
- Hover: card border shifts to `--accent` and a static `▍` cursor appears at the end of the filename.
- ComplianceAI gets a `★ pinned` `--warn` tag.

All 4 existing projects preserved (ComplianceAI, NOC Agent, Prospra, Fraud Detector) with descriptions and tag lists intact.

### 04 — `$ stack` (renamed from Skills; anchor `#skills` preserved)

Three labeled blocks side-by-side on desktop, stacked on mobile. Block labels change from the old "Languages / Frameworks & Tools / Focus Areas" headings to mono `// languages`, `// frameworks`, `// focus`. The **items inside each list are preserved verbatim** from [src/App.jsx:319-337](../../../src/App.jsx#L319-L337):
- languages: `Python, Java, JavaScript, TypeScript, SQL, HTML, CSS`
- frameworks: `Spring Boot, React, Next.js, Node.js, Express, FastAPI, LangGraph, DSPy, Celery, Docker, PostgreSQL, MongoDB, Redis, AWS, GitHub Actions`
- focus: `AI Agents & Multi-Agent Systems, Backend Engineering, Full-Stack Development`

Each block: mono header, then items separated by ` · ` middots in mono — not pill chips, no rounded `<Badge>` spans.

### 05 — `$ git log --experience` (renamed from Experience; anchor `#experience` preserved)

**Structural change:** the existing centered two-side timeline at [src/App.jsx:45-145](../../../src/App.jsx#L45-L145) is replaced with a single-column commit log. Each entry:
```
commit  2025-09 → 2026-05
role    Stevens Institute · M.S. Student
loc     Hoboken, NJ
─────────────────────────────────────────
{description}
```
Newest at top. Thin left rule ties entries together. All 7 existing entries preserved with content unchanged.

### 06 — `$ ./contact.sh`

Existing [src/components/Contact.jsx](../../../src/components/Contact.jsx) restyled, not rewritten. The `sendEmail` handler, `emailjs.sendForm` call, env-var wiring (`VITE_SERVICE_ID`, `VITE_TEMPLATE_ID`, `VITE_PUBLIC_KEY`), honeypot `subject` input, and status-state machine are preserved verbatim.

Form rendered as a shell prompt sequence:
- Labels: `> name:`, `> email:`, `> message:`.
- Inputs are borderless with a 1px bottom hairline; on focus, hairline thickens to 2px in `--accent` and a `▍` caret blinks.
- Submit button: `$ send →`. Loading state: `$ sending…`. Success state: `✓ sent` in `--ok`.
- Right side block: `// elsewhere` — GitHub, LinkedIn, Email as `[link] →` rows.

### Footer

Single mono line: `// EOF · © {year} andrew hing · built with react + tailwind · [view source ↗]`. Year stays dynamic via `new Date().getFullYear()`.

---

## ⌘K Command Palette (Signature Interaction)

### Trigger

- `⌘K` (mac) / `Ctrl+K` (win/linux) opens from anywhere. `Esc` closes. Backdrop click closes.
- Clicking the `[⌘K]` chip in the status bar opens it.
- The chip pulses with a 2s sine-wave opacity for the first 8 seconds of the session.

### Visual

- Centered overlay, ~560px × ~480px max. Backdrop: page dimmed to 40% opacity (not blurred).
- Workstation frame chrome: `┌─ palette ─ esc to close ─┐` top, frame bottom. Window dots top-right.
- Input row: mono `>` prompt + borderless text input with a 1Hz blinking `▍` caret in `--accent`. Placeholder: `search or type a command…`.
- Result rows: glyph (`→` goto, `↗` external, `↓` download, `◐` toggle) + label + right-aligned key hint.
- Active row: `--bg-elev` background, 3px accent left-border. No rounded selection.
- Footer hairline: `↑↓ navigate · ↵ select · esc close`.

### Commands

| Command | Hint | Action |
|---|---|---|
| `goto about` | `g a` | smooth-scroll to `#about` |
| `goto projects` | `g p` | scroll to `#projects` |
| `goto stack` | `g s` | scroll to `#skills` |
| `goto log` | `g l` | scroll to `#experience` |
| `goto contact` | `g c` | scroll to `#contact` |
| `open resume` | `⇧ r` | open `/Andrew_Hing_Resume.pdf` in new tab |
| `open github` | — | external link |
| `open linkedin` | — | external link |
| `copy email` | `⇧ e` | clipboard write + toast `✓ copied` |
| `toggle theme` | `⇧ t` | flip light ↔ dark |
| `view source` | — | github repo link |

### Behavior

- Plain case-insensitive substring match on label. No fuzzy library.
- Arrow keys move selection (wraps at top/bottom). Enter fires.
- Vim-style `g a` / `g p` shortcuts work **only inside the palette** (not as global hotkeys).
- Opening while an input is focused: blurs the input first, then opens.
- Smooth-scroll respects `prefers-reduced-motion` (falls back to instant `scrollTo`).
- `toggle theme` persists to `localStorage.theme`. Initial value resolves system preference if no stored value.
- Toast for `copy email` auto-dismisses after 1.5s.

### Implementation

- Single `<CommandPalette />` mounted at App root, controlled by `usePalette()` hook owning `open` / `query` / `activeIndex`.
- Document-level keyboard listener via `useEffect` (returns cleanup). Respects `e.target` so `⌘K` from inside the palette input doesn't toggle.
- No external libraries (`cmdk` would work but is unnecessary for 11 items).
- ~80 lines JSX, ~40 lines state.

---

## Motion & Interaction

### Global principles

- Timing: `cubic-bezier(0.2, 0, 0, 1)` (sharp ease-out, no overshoot). No springs.
- Durations: `180ms` hover/state, `280ms` entrance, `1200ms` for the hero typer only.
- `prefers-reduced-motion: reduce` → entrance animations instant, typer renders final string immediately, `[⌘K]` chip pulse stops, all caret blinks stop.

### Hero (first visit per session only)

Sessionstorage flag `hero_typed` set after the first run. On subsequent loads, typer renders the final string immediately.

1. Frame chrome fades in at `t=0`, 200ms.
2. Name renders immediately.
3. Tagline types at ~35ms/char (~50 chars, ~1.7s total). Blinking `▍` persists at the end.
4. ID-card fades + 4px slide-up, 280ms, delayed 600ms.
5. CTAs fade in after typer completes.

### Scroll entrances (sections 02–06)

Section headers fade + 6px slide-up over 280ms when 30% in view (once). Body content fades only at 200ms — no stagger. No parallax. No scroll-tied transforms.

### Component motion

- **Nav rail:** active link's underline animates left/right between items in 220ms (single shared underline element).
- **Project cards:** hover → border `--rule` → `--accent` (180ms) + filename `▍` appears. No scale/transform.
- **Buttons:** hover → background fills with `--accent`, text inverts to `--bg`. 180ms. Active: 1px inset border, no scale.
- **Inputs:** focus → bottom hairline → 2px `--accent` + `▍` blinks at 1Hz.
- **Status bar clock:** updates every minute (not every second).
- **`[⌘K]` chip:** 8s sine pulse on first load. Static thereafter.

### Palette open/close

- Open: backdrop fades 120ms; palette fades + 4px slide-down 180ms.
- Close: instant. No exit animation.
- Selected row change: instant background shift, no transition.

### Theme toggle

- 240ms crossfade of `--bg`, `--ink`, `--rule` via root-level CSS transition. Nothing else animates during swap.

### Caret/cursor accents

Three places use a 1Hz blinking `▍`: hero typer terminus, focused contact input, palette input. All share one `@keyframes blink` rule. Project card filenames get a static (non-blinking) `▍` on hover.

### Explicit non-goals

No framer-motion `whileInView` everywhere, no magnetic cursor, no custom cursor, no scroll progress bar, no marquee, no rotating word swap, no Lottie. `framer-motion` stays as a dep but is used only for hero typer, section header entrance, and palette open transitions.

---

## Code Cleanup

### Current issues being fixed

1. **Monolithic [src/App.jsx](../../../src/App.jsx) (358 lines)** doing nav, scroll-spy, hero, projects, skills, timeline, contact slot, footer. Split into purpose-scoped files.
2. **Inline hardcoded data** (projects, experience, skills) — moved to `src/data/`.
3. **Scroll-spy `useEffect`** at [src/App.jsx:153-176](../../../src/App.jsx#L153-L176) extracted to `useActiveSection(ids)`.
4. **`cx` helper** at [src/App.jsx:147](../../../src/App.jsx#L147) → `src/lib/cx.js`.
5. **Inline 200-char radial gradient** at [src/App.jsx:215](../../../src/App.jsx#L215) — deleted (replaced by terminal aesthetic).
6. **Magic `HEADER_OFFSET = 96`** → CSS variable `--header-h` so it stays in sync with actual chrome height.
7. **`!text-white` specificity escape hatch** at [src/App.jsx:228](../../../src/App.jsx#L228) — sidestepped by CSS-variable token system.
8. **Vite default boilerplate in [src/App.css](../../../src/App.css)** (`.logo`, `.card`, `.read-the-docs`, `#root { max-width: 1280px; padding: 2rem; text-align: center }`) — deleted. The `#root` rule was silently constraining the page.
9. **Global `button:not(.btn-reset)` rule** in [src/index.css](../../../src/index.css) (rounded-12px + hover translateY) — deleted. Fights the new aesthetic.
10. **`system-ui` default font** in [src/index.css:4](../../../src/index.css#L4) — replaced by Inter Tight / JetBrains Mono.

### Target file structure

```
src/
  App.jsx                       # composition + theme provider (~60 lines)
  main.jsx                      # untouched
  index.css                     # tokens, @theme block, base type, keyframes
  data/
    sections.js                 # nav config
    projects.js                 # project list
    experience.js               # experience entries
    stack.js                    # languages / frameworks / focus
    commands.js                 # ⌘K command definitions
  lib/
    cx.js
    useActiveSection.js
    useTheme.js
    usePalette.js
  components/
    Frame.jsx                   # outer workstation chrome (top bar + status bar + gutters)
    NavRail.jsx
    StatusBar.jsx
    Hero.jsx
    About.jsx
    Projects.jsx + ProjectCard.jsx
    Stack.jsx
    ExperienceLog.jsx + LogEntry.jsx
    Contact.jsx                 # restyled, submit logic preserved verbatim
    Footer.jsx
    CommandPalette.jsx
    Toast.jsx
    Typer.jsx
```

~22 new files (5 in `data/`, 4 in `lib/`, ~13 in `components/`), most under 80 lines. Three existing files modified: [src/App.jsx](../../../src/App.jsx), [src/index.css](../../../src/index.css), [src/components/Contact.jsx](../../../src/components/Contact.jsx). One existing file deleted: [src/App.css](../../../src/App.css) (Vite boilerplate). Split is by purpose, not by component/data/hook artificially mixed.

### Cleanup discipline

- No backwards-compat shims. Old patterns (indigo gradient, `<Badge>` pills, zinc colors) get deleted, not re-exported.
- No `// removed` comments.
- Tailwind classes that map to design tokens replaced with token classes; one-off magic values extracted.
- [src/App.css](../../../src/App.css) deleted entirely after confirming nothing imports from it that isn't boilerplate.
- [src/main.jsx](../../../src/main.jsx) untouched unless an import target moves.
- [public/](../../../public) assets (`profile2.jpg`, `Andrew_Hing_Resume.pdf`) unchanged.

### Dependencies

- **Add:** `@fontsource/jetbrains-mono`, `@fontsource-variable/inter-tight`.
- **Keep:** `framer-motion` (used sparingly), `lucide-react` (for palette glyphs), `@emailjs/browser`.
- **Remove:** Any unused imports surfaced during the cleanup.

### Tailwind v4 specifics

- Tokens declared in `:root` and `.dark`, then registered to Tailwind via `@theme` block in [src/index.css](../../../src/index.css) so utilities like `bg-bg` / `text-ink` resolve correctly.
- Dark mode strategy: class-based, controlled by `<html class="dark">`. Tailwind v4 needs a `@custom-variant dark (&:where(.dark, .dark *))` declaration in CSS.

---

## Architecture: Data Flow & State

```
App
├── ThemeProvider           (useTheme: light|dark, persists to localStorage)
├── PaletteProvider         (usePalette: open, query, activeIndex)
├── Frame                   (top bar, status bar, line-number gutters)
│   ├── NavRail             (consumes useActiveSection())
│   └── StatusBar           (consumes active section, scroll%, time)
├── <main>
│   ├── Hero
│   ├── About
│   ├── Projects            (consumes data/projects.js)
│   ├── Stack               (consumes data/stack.js)
│   ├── ExperienceLog       (consumes data/experience.js)
│   ├── Contact             (preserved submit logic)
│   └── Footer
├── CommandPalette          (consumes data/commands.js + ThemeProvider + PaletteProvider)
└── Toast                   (mounted at root for clipboard feedback)
```

Two thin contexts (`Theme`, `Palette`) plus three hooks (`useActiveSection`, `useTheme`, `usePalette`). No state management library. Data flows from `src/data/` exports into pure presentational components.

---

## Verification

### Automated

- `npm run build` exits 0.
- `npm run lint` exits 0.
- `npm run dev` starts clean — no console errors, no missing-module warnings.

### Manual (with dev server up, before claiming done)

**Hero / first impression**
- Hero renders, typer runs once. `sessionStorage.hero_typed` set; reload skips the typer.
- Profile photo loads. CTAs reachable via Tab.
- `prefers-reduced-motion: reduce` → typer renders final string instantly.

**Navigation**
- Each nav item click → smooth-scroll lands with section header just under top bar (respects `--header-h`).
- Scroll-spy active state updates on scroll. Bottom of page → contact stays active (preserves edge case at [src/App.jsx:163-164](../../../src/App.jsx#L163-L164)).
- Status bar scroll% updates; clock ticks every minute.

**Command palette**
- `⌘K` / `Ctrl+K` opens from anywhere, including when an input is focused (blurs input first).
- `Esc` closes. Backdrop click closes.
- Type "proj" → "goto projects" surfaces. Enter scrolls + closes.
- "copy email" → clipboard contains the address; toast appears + auto-dismisses.
- "toggle theme" → light↔dark flips, persists across reload.
- "open resume" / "open github" / "open linkedin" → new tab opens to right URL.
- Arrow keys move selection; wraps at top/bottom.
- `[⌘K]` chip pulses for 8s on first load, then static.

**Theme**
- System preference picked up on first load (no stored value).
- Manual toggle persists to `localStorage.theme`.
- Section backgrounds, rules, text colors swap cleanly — no mid-transition flashes.
- Paper-mode and midnight-mode both pass contrast: body text ≥4.5:1, large chrome text ≥3:1.

**Responsive**
- 375px: nav rail collapses to `[≡]` icon that opens the palette.
- 768px: hero stacks to one column. Projects grid → single column.
- ≥1024px: full layout.
- No horizontal scroll between 320px and 1920px.

**Content correctness**
- All 7 existing experience entries preserved (2× Stevens, 2× Anote, Granite, Course Assistant, current student).
- All 4 projects preserved with descriptions and tag lists.
- Skills lists preserved (Languages, Frameworks & Tools, Focus Areas).
- Resume download link works (`/Andrew_Hing_Resume.pdf`).
- Contact form: `@emailjs/browser` wiring works (smoke test by sending a real message in dev).
- About-section copy preserved verbatim.
- Footer year dynamic.

**Browser sanity**
- Chrome + Safari smoke-test, especially `color-scheme` transitions and `prefers-reduced-motion`.

### Non-goals for verification

- No automated test runner being added.
- No Lighthouse/perf budget pass.
- No formal accessibility audit beyond contrast + reduced-motion checks.

---

## Risks & Mitigations

1. **Custom font load (~120KB).**
   *Mitigation:* `font-display: swap`, preload only the two weights used above the fold (Inter Tight 500, JetBrains Mono 700), defer the rest.

2. **Tailwind v4 + CSS variables + class-based dark mode.**
   v4's @theme block + `@custom-variant dark` is well-supported but a path I haven't verified on this exact project.
   *Mitigation:* Set up the token system + dark-mode variant as the first implementation task, smoke-test before building any components on top.

3. **Contact form regression.**
   The submit logic depends on env vars that may only be set in the deployment environment.
   *Mitigation:* Don't touch `sendEmail`, `useRef`, or env var references in [Contact.jsx](../../../src/components/Contact.jsx) — restyle only.

4. **Hero typer feels gimmicky on repeat visits.**
   *Mitigation:* `sessionStorage.hero_typed` flag confirmed in design — skipped on subsequent loads within same session.

5. **Centered timeline removal is a meaningful structural change.**
   Some viewers might prefer the visual timeline. The git-log reframe is more on-brand and faster to scan, which justifies the change.

---

## Out-of-Scope Follow-Ups (Captured, Not Built)

- TypeScript migration.
- Automated test suite.
- Project case-study sub-pages (one per project) — currently project cards have no link target beyond the card itself.
- A blog / writing section.
- Analytics.

---

## Open Questions

None at spec time. All branch points were resolved during brainstorming:
- Aesthetic: hybrid terminal frame.
- Palette: dual mode (paper + midnight).
- Type: mono headings + Inter Tight body.
- Signature: ⌘K command palette.
- Vim shortcuts: inside palette only.
- Typer: first session visit only.
- File-split granularity: full split (~17 files).
