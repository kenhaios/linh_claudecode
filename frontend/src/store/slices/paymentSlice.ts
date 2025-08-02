import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Placeholder payment slice - will be implemented in later phases
interface PaymentState {
  payments: any[];
  tokenBalance: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  tokenBalance: 0,
  isLoading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Placeholder reducers
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateTokenBalance: (state, action: PayloadAction<number>) => {
      state.tokenBalance = action.payload;
    },
  },
});

export const { setLoading, setError, updateTokenBalance } = paymentSlice.actions;
export default paymentSlice.reducer;