import { create } from 'zustand';
import { CurrencyState } from '@/features/shared/stores/Currency.types';

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  cash: 0,
  
  addCash: (amount: number): void => {
    set(state => ({
      ...state,
      cash: state.cash + amount
    }));
  },
  
  getCash: (): number => {
    return get().cash;
  },
  
  resetCash: (): void => {
    set(state => ({
      ...state,
      cash: 0
    }));
  }
})); 