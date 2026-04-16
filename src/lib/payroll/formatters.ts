/**
 * lib/payroll/formatters.ts
 * ─────────────────────────────────────────────────────────────
 * Currency and number formatting utilities.
 *
 * FUTURE: Accept a currency config from user settings (USD, SGD, etc.)
 */

export const DEFAULT_CURRENCY = "PHP";
export const DEFAULT_LOCALE   = "en-PH";

export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string   = DEFAULT_LOCALE
): string {
  return new Intl.NumberFormat(locale, {
    style:                 "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Shorthand for PHP (used throughout the app)
export const formatPHP = (amount: number) => formatCurrency(amount);
