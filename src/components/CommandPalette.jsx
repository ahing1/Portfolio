import { useCallback, useEffect, useMemo, useRef } from "react";
import { commands } from "../data/commands.js";
import { usePalette } from "../lib/usePalette.jsx";
import { useTheme } from "../lib/useTheme.jsx";
import { showToast } from "../lib/toast.js";

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
  }, [open, filtered, activeIndex, setOpen, setActiveIndex, runCommand]);

  const runCommand = useCallback(
    (cmd) => {
      if (!cmd) return;
      cmd.run({ toggleTheme, showToast });
      setOpen(false);
    },
    [toggleTheme, setOpen],
  );

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
