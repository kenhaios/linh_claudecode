import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Placeholder chart slice - will be implemented in later phases
interface ChartState {
  charts: any[];
  currentChart: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChartState = {
  charts: [],
  currentChart: null,
  isLoading: false,
  error: null,
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    // Placeholder reducers
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError } = chartSlice.actions;
export default chartSlice.reducer;