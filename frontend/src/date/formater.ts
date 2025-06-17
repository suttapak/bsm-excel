import { DateFormatter } from "@internationalized/date";

/**
 * Format an ISO date string using short date and time format.
 * @param dateString - An ISO 8601 date string.
 * @param locale - Optional locale (default is the browser's locale).
 * @returns Formatted date string.
 */
export function formatShortDateFromString(dateString: string, locale: string = navigator.language): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const formatter = new DateFormatter(locale, {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(date);
}

export function formatShortDateOnly(dateString: string, locale: string = navigator.language): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  const formatter = new Intl.DateTimeFormat(locale, {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  });

  return formatter.format(date);
}

export function formatShortTimeOnly(dateString: string, locale: string = navigator.language): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  const formatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(date);
}
