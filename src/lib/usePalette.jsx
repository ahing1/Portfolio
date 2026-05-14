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

// eslint-disable-next-line react-refresh/only-export-components
export const usePalette = () => useContext(PaletteContext);
