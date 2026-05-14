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
