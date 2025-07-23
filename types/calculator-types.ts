export interface ChangeBreakdown {
  denomination: number;
  count: number;
  type: 'bill' | 'coin';
}

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
