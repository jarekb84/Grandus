export interface CurrencyState {
  cash: number;
  
  // Actions
  addCash: (amount: number) => void;
  getCash: () => number;
} 