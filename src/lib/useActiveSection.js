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
