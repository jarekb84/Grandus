import { create } from 'zustand';
import { CurrencyState } from '@/features/shared/stores/Currency.types';

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  cash: 0,
  
  addCash: (amount: number) => {
    set(state => ({
      ...state,
      cash: state.cash + amount
    }));
  },
  
  getCash: () => {
    return get().cash;
  },
  
  resetCash: () => {
    set(state => ({
      ...state,
      cash: 0
    }));
  }
})); 