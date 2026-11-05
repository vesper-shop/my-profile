export { LocaleProvider, useLocale } from "./context";
export { SUPPORTED_LOCALES, DEFAULT_LOCALE, getLocaleLabel } from "./types";
export type { Locale } from "./types";

/**
 * Replace `{key}` placeholders in a translation string with React nodes.
 *
 * @example
 *   <T text="Hello {name}" vars={{ name: <strong>World</strong> }} />
 */
export function T({ text, vars }: { text: string; vars: Record<string, React.ReactNode> }) {
  const parts = text.split(/\{(\w+)\}/).map((part, index) => {
    if (index % 2 === 0) return part;
    if (!(part in vars)) throw new Error(`Missing translation variable "${part}" in "${text}"`);
    return vars[part];
  });
  return <>{parts}</>;
}
