export interface CurrencyState {
  cash: number;

  addCash: (amount: number) => void;
  getCash: () => number;
  resetCash: () => void;
}
