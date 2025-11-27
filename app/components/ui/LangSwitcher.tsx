import React from "react";
import { useLang } from "../../hooks/useLang";

export default function LangSwitcher({ className = "" }: { className?: string }) {
  const [lang, setLang] = useLang("vi");
  return (
    <button
      onClick={() => setLang(lang === "vi" ? "en" : "vi")}
      className={`px-3 py-1 border rounded-lg font-bold text-sm hover:bg-gray-100 transition ${className}`}
    >
      {lang === "vi" ? "VI" : "EN"}
    </button>
  );
}
