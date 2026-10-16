/**
 * Utility functions for Indian Rupee (INR) currency formatting
 */
export function formatRupees(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

export function formatRupeesExact(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '₹0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
