export interface CurrencyState {
  cash: number;
  
  // Actions
  addCash: (amount: number) => void;
  getCash: () => number;
  resetCash: () => void; // Reset cash to 0
} 