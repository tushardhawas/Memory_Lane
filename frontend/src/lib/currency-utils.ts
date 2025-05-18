/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale (default: 'en-US')
 * @returns The formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number as currency without the currency symbol
 * @param amount - The amount to format
 * @param locale - The locale (default: 'en-US')
 * @returns The formatted number string
 */
export function formatNumber(
  amount: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate the percentage change between two numbers
 * @param oldValue - The old value
 * @param newValue - The new value
 * @returns The percentage change
 */
export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/**
 * Format a percentage
 * @param value - The percentage value
 * @param locale - The locale (default: 'en-US')
 * @returns The formatted percentage string
 */
export function formatPercentage(
  value: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

/**
 * Get the currency symbol for a currency code
 * @param currencyCode - The currency code
 * @param locale - The locale (default: 'en-US')
 * @returns The currency symbol
 */
export function getCurrencySymbol(
  currencyCode: string,
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  const parts = formatter.formatToParts(0);
  const currencySymbol = parts.find(part => part.type === 'currency')?.value || currencyCode;
  
  return currencySymbol;
}

/**
 * Parse a currency string to a number
 * @param currencyString - The currency string to parse
 * @returns The parsed number
 */
export function parseCurrencyString(currencyString: string): number {
  // Remove currency symbols, commas, and other non-numeric characters except decimal point
  const numericString = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(numericString);
}
