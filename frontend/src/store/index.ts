import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import slice reducers
import authReducer from './slices/authSlice';
import chartReducer from './slices/chartSlice';
import consultationReducer from './slices/consultationSlice';
import paymentReducer from './slices/paymentSlice';
import uiReducer from './slices/uiSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    chart: chartReducer,
    consultation: consultationReducer,
    payment: paymentReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for socket.io compatibility
        ignoredActions: ['socket/connect', 'socket/disconnect'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['socket'],
        // Ignore these paths in the state
        ignoredPaths: ['socket'],
      },
    }),
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;