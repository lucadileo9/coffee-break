import { ChangeBreakdown } from '@/types/calculator-types';

// Euro denominations in descending order (in cents to avoid floating point issues)

/**
 * An ordered array of Euro currency denominations, represented in cents.
 * Each denomination is an object containing its value in cents and its type ("bill" or "coin").
 * The array is sorted from highest to lowest value, starting with €50 bills down to €0.01 coins.
 *
 * @remarks
 * Useful for calculating change or representing available denominations in a cash register.
 *
 * @example
 * To get the value in euros:
 * const euros = DENOMINATIONS[0].value / 100; // 50
 *
 * @property value - The denomination value in cents (integer).
 * @property type - The type of denomination, either "bill" or "coin".
 */
const DENOMINATIONS = [
  { value: 5000, type: 'bill' as const }, // €50
  { value: 2000, type: 'bill' as const }, // €20
  { value: 1000, type: 'bill' as const }, // €10
  { value: 500, type: 'bill' as const }, // €5
  { value: 200, type: 'coin' as const }, // €2
  { value: 100, type: 'coin' as const }, // €1
  { value: 50, type: 'coin' as const }, // €0.50
  { value: 20, type: 'coin' as const }, // €0.20
  { value: 10, type: 'coin' as const }, // €0.10
  { value: 5, type: 'coin' as const }, // €0.05
  { value: 2, type: 'coin' as const }, // €0.02
  { value: 1, type: 'coin' as const }, // €0.01
];

export function calculateChange(
  billTotal: number,
  cashReceived: number
): ChangeBreakdown[] {
  // calculate the change due
  const changeDue = cashReceived - billTotal;

  // If change due is negative, return an empty array
  if (changeDue < 0) {
    return [];
  }

  // Convert to cents to avoid floating point issues
  let remainingCents = Math.round(changeDue * 100);
  const breakdown: ChangeBreakdown[] = [];

  // Iterate through each denomination and calculate how many of each are needed
  // Start from the highest denomination and work downwards
  for (const denomination of DENOMINATIONS) {
    if (remainingCents >= denomination.value) {
      // Check if the remaining change can be covered by this denomination
      // Calculate how many of this denomination can be used
      const count = Math.floor(remainingCents / denomination.value);
      remainingCents -= count * denomination.value; // Subtract the value of the used denominations from the remaining cents

      // Add to the breakdown
      breakdown.push({
        denomination: denomination.value / 100, // Convert back to euros
        count,
        type: denomination.type,
      });
    }
  }

  return breakdown;
}

/**
 * Formats a numeric amount as a currency string in Euro (EUR) using Italian locale conventions.
 *
 * @param amount - The numeric value to format as currency.
 * @returns A string representing the formatted currency value in Euro, with two decimal places.
 *
 * @example
 * ```typescript
 * formatCurrency(1234.5); // "€1.234,50"
 * ```
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
