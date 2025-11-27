import { useState, useEffect } from "react";

export function useLang(defaultLang = "vi") {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as string) || defaultLang;
    }
    return defaultLang;
  });
  useEffect(() => {
    localStorage.setItem("lang", lang);
    const handler = () => setLang(localStorage.getItem("lang") || defaultLang);
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [lang, defaultLang]);
  return [lang, setLang] as const;
}
