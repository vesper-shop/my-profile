import { createContext, useCallback, useContext, useState } from "react";
import type { Locale } from "./types";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./types";

const STORAGE_KEY = "locale";

function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  const storedLocale = SUPPORTED_LOCALES.find((locale) => locale === stored);
  if (storedLocale) return storedLocale;

  const browser = navigator.language.toLowerCase();
  if (browser.startsWith("zh")) return "zh";
  if (browser.startsWith("ja")) return "ja";
  return DEFAULT_LOCALE;
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
