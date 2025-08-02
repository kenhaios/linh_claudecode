import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Placeholder consultation slice - will be implemented in later phases
interface ConsultationState {
  consultations: any[];
  currentConsultation: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ConsultationState = {
  consultations: [],
  currentConsultation: null,
  isLoading: false,
  error: null,
};

const consultationSlice = createSlice({
  name: 'consultation',
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

export const { setLoading, setError } = consultationSlice.actions;
export default consultationSlice.reducer;