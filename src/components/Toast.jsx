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
