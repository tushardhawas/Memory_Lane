/**
 * Format a date string to a human-readable format
 * @param dateString - The date string to format
 * @param format - The format to use (default: 'full')
 * @returns The formatted date string
 */
export function formatDate(
  dateString: string, 
  format: 'full' | 'short' | 'month' | 'year' = 'full'
): string {
  const date = new Date(dateString);
  
  switch (format) {
    case 'full':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    case 'short':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    
    case 'month':
      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    
    case 'year':
      return date.getFullYear().toString();
    
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Get the current date in ISO format (YYYY-MM-DD)
 * @returns The current date in ISO format
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate the difference between two dates in days
 * @param date1 - The first date
 * @param date2 - The second date (default: current date)
 * @returns The difference in days
 */
export function getDaysDifference(date1: string | Date, date2: string | Date = new Date()): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Convert to days
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Check if a date is in the past
 * @param date - The date to check
 * @returns True if the date is in the past
 */
export function isDateInPast(date: string | Date): boolean {
  const checkDate = new Date(date);
  const today = new Date();
  
  // Set time to midnight for comparison
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate < today;
}

/**
 * Get the first day of the month
 * @param date - The date (default: current date)
 * @returns The first day of the month in ISO format
 */
export function getFirstDayOfMonth(date: Date = new Date()): string {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return firstDay.toISOString().split('T')[0];
}

/**
 * Get the last day of the month
 * @param date - The date (default: current date)
 * @returns The last day of the month in ISO format
 */
export function getLastDayOfMonth(date: Date = new Date()): string {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDay.toISOString().split('T')[0];
}

/**
 * Get the month name from a date
 * @param date - The date
 * @returns The month name
 */
export function getMonthName(date: string | Date): string {
  return new Date(date).toLocaleString('default', { month: 'long' });
}

/**
 * Get the short month name from a date
 * @param date - The date
 * @returns The short month name
 */
export function getShortMonthName(date: string | Date): string {
  return new Date(date).toLocaleString('default', { month: 'short' });
}
