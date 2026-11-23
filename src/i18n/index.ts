import { en } from "./en";

const catalogs = {
  en,
} as const;

export type Locale = keyof typeof catalogs;

type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? `${K}.${NestedKeyOf<T[K]>}`
    : K;
}[keyof T & string];

export type TranslationKey = NestedKeyOf<typeof en>;

/**
 * Resolves a key from the centralized string catalog and interpolates `{token}` variables.
 */
export function t(
  key: TranslationKey,
  vars?: Record<string, string | number>,
  locale: Locale = "en",
): string {
  const catalog = catalogs[locale] ?? catalogs.en;
  const segments = key.split(".");

  let current: unknown = catalog;
  for (const segment of segments) {
    if (current && typeof current === "object" && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return key;
    }
  }

  if (typeof current !== "string") {
    return key;
  }

  if (!vars) {
    return current;
  }

  return current.replace(/\{(\w+)\}/g, (_, token: string) =>
    token in vars ? String(vars[token]) : `{${token}}`,
  );
}
