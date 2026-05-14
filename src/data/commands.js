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
