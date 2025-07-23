/**
 * Represents the breakdown of change for a specific denomination.
 *
 * @property denomination - The value of the bill or coin.
 * @property count - The number of bills or coins of this denomination.
 * @property type - Specifies whether the denomination is a 'bill' or a 'coin'.
 */
export interface ChangeBreakdown {
  denomination: number;
  count: number;
  type: 'bill' | 'coin';
}

/**
 * Represents the state of the calculator, including the bill total, cash received,
 * calculated change due, breakdown of change, and any error messages.
 *
 * @property billTotal - The total amount of the bill as a string, it would be formatted
 * @property cashReceived - The amount of cash received as a string, it would be formatted
 * @property changeDue - The amount of change due to the customer.
 * @property breakdown - An array detailing the breakdown of change denominations.
 * @property error - An error message if any issues occur during calculation.
 */
export interface CalculatorState {
  billTotal: string;
  cashReceived: string;
  changeDue: number;
  breakdown: ChangeBreakdown[];
  error: string;
}

export interface ChangeCalculatorProps {
  className?: string;
}
