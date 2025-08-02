import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

interface UIState {
  // Theme and display
  isDarkMode: boolean;
  language: 'vi' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  
  // Layout state
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  
  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Notifications
  notifications: NotificationData[];
  
  // Modals and drawers
  activeModal: string | null;
  activeDrawer: string | null;
  
  // Vietnamese-specific UI state
  lunarCalendarVisible: boolean;
  traditionalColorsEnabled: boolean;
  astrologyTooltipsEnabled: boolean;
  
  // Chart display preferences
  chartViewMode: 'traditional' | 'modern';
  chartZoomLevel: number;
  showStarNames: boolean;
  showHouseNames: boolean;
  
  // Chat interface state
  chatPanelExpanded: boolean;
  typingIndicator: boolean;
  
  // Connection status
  isOnline: boolean;
  websocketConnected: boolean;
  
  // Error tracking
  lastError: string | null;
  errorCount: number;
}

const initialState: UIState = {
  // Theme and display
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  language: (localStorage.getItem('language') as 'vi' | 'en') || 'vi',
  fontSize: (localStorage.getItem('fontSize') as 'small' | 'medium' | 'large') || 'medium',
  
  // Layout state
  sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  mobileMenuOpen: false,
  
  // Loading states
  globalLoading: false,
  loadingStates: {},
  
  // Notifications
  notifications: [],
  
  // Modals and drawers
  activeModal: null,
  activeDrawer: null,
  
  // Vietnamese-specific UI state
  lunarCalendarVisible: localStorage.getItem('lunarCalendarVisible') !== 'false',
  traditionalColorsEnabled: localStorage.getItem('traditionalColorsEnabled') !== 'false',
  astrologyTooltipsEnabled: localStorage.getItem('astrologyTooltipsEnabled') !== 'false',
  
  // Chart display preferences
  chartViewMode: (localStorage.getItem('chartViewMode') as 'traditional' | 'modern') || 'traditional',
  chartZoomLevel: parseInt(localStorage.getItem('chartZoomLevel') || '100', 10),
  showStarNames: localStorage.getItem('showStarNames') !== 'false',
  showHouseNames: localStorage.getItem('showHouseNames') !== 'false',
  
  // Chat interface state
  chatPanelExpanded: localStorage.getItem('chatPanelExpanded') === 'true',
  typingIndicator: false,
  
  // Connection status
  isOnline: navigator.onLine,
  websocketConnected: false,
  
  // Error tracking
  lastError: null,
  errorCount: 0,
};

// Helper function to generate notification ID
const generateNotificationId = (): string => {
  return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme and display
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', state.isDarkMode.toString());
    },
    
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      localStorage.setItem('darkMode', action.payload.toString());
    },
    
    setLanguage: (state, action: PayloadAction<'vi' | 'en'>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    
    setFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.fontSize = action.payload;
      localStorage.setItem('fontSize', action.payload);
    },
    
    // Layout state
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed.toString());
    },
    
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('sidebarCollapsed', action.payload.toString());
    },
    
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    
    // Loading states
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    
    setLoadingState: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      const { key, loading } = action.payload;
      if (loading) {
        state.loadingStates[key] = true;
      } else {
        delete state.loadingStates[key];
      }
    },
    
    // Notifications
    addNotification: (state, action: PayloadAction<Omit<NotificationData, 'id' | 'timestamp'>>) => {
      const notification: NotificationData = {
        ...action.payload,
        id: generateNotificationId(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
      
      // Limit to 10 notifications
      if (state.notifications.length > 10) {
        state.notifications.shift();
      }
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Modals and drawers
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    
    closeModal: (state) => {
      state.activeModal = null;
    },
    
    openDrawer: (state, action: PayloadAction<string>) => {
      state.activeDrawer = action.payload;
    },
    
    closeDrawer: (state) => {
      state.activeDrawer = null;
    },
    
    // Vietnamese-specific UI state
    toggleLunarCalendar: (state) => {
      state.lunarCalendarVisible = !state.lunarCalendarVisible;
      localStorage.setItem('lunarCalendarVisible', state.lunarCalendarVisible.toString());
    },
    
    setLunarCalendarVisible: (state, action: PayloadAction<boolean>) => {
      state.lunarCalendarVisible = action.payload;
      localStorage.setItem('lunarCalendarVisible', action.payload.toString());
    },
    
    toggleTraditionalColors: (state) => {
      state.traditionalColorsEnabled = !state.traditionalColorsEnabled;
      localStorage.setItem('traditionalColorsEnabled', state.traditionalColorsEnabled.toString());
    },
    
    setTraditionalColorsEnabled: (state, action: PayloadAction<boolean>) => {
      state.traditionalColorsEnabled = action.payload;
      localStorage.setItem('traditionalColorsEnabled', action.payload.toString());
    },
    
    toggleAstrologyTooltips: (state) => {
      state.astrologyTooltipsEnabled = !state.astrologyTooltipsEnabled;
      localStorage.setItem('astrologyTooltipsEnabled', state.astrologyTooltipsEnabled.toString());
    },
    
    setAstrologyTooltipsEnabled: (state, action: PayloadAction<boolean>) => {
      state.astrologyTooltipsEnabled = action.payload;
      localStorage.setItem('astrologyTooltipsEnabled', action.payload.toString());
    },
    
    // Chart display preferences
    setChartViewMode: (state, action: PayloadAction<'traditional' | 'modern'>) => {
      state.chartViewMode = action.payload;
      localStorage.setItem('chartViewMode', action.payload);
    },
    
    setChartZoomLevel: (state, action: PayloadAction<number>) => {
      state.chartZoomLevel = Math.max(50, Math.min(200, action.payload));
      localStorage.setItem('chartZoomLevel', state.chartZoomLevel.toString());
    },
    
    toggleShowStarNames: (state) => {
      state.showStarNames = !state.showStarNames;
      localStorage.setItem('showStarNames', state.showStarNames.toString());
    },
    
    toggleShowHouseNames: (state) => {
      state.showHouseNames = !state.showHouseNames;
      localStorage.setItem('showHouseNames', state.showHouseNames.toString());
    },
    
    // Chat interface state
    toggleChatPanel: (state) => {
      state.chatPanelExpanded = !state.chatPanelExpanded;
      localStorage.setItem('chatPanelExpanded', state.chatPanelExpanded.toString());
    },
    
    setChatPanelExpanded: (state, action: PayloadAction<boolean>) => {
      state.chatPanelExpanded = action.payload;
      localStorage.setItem('chatPanelExpanded', action.payload.toString());
    },
    
    setTypingIndicator: (state, action: PayloadAction<boolean>) => {
      state.typingIndicator = action.payload;
    },
    
    // Connection status
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
      
      if (!action.payload) {
        // Add offline notification
        const notification: NotificationData = {
          id: generateNotificationId(),
          type: 'warning',
          title: 'Mất kết nối',
          message: 'Bạn đang ngoại tuyến. Một số tính năng có thể không khả dụng.',
          timestamp: Date.now(),
        };
        state.notifications.push(notification);
      }
    },
    
    setWebsocketConnected: (state, action: PayloadAction<boolean>) => {
      state.websocketConnected = action.payload;
      
      if (!action.payload) {
        // Add connection lost notification
        const notification: NotificationData = {
          id: generateNotificationId(),
          type: 'warning',
          title: 'Mất kết nối thời gian thực',
          message: 'Đang thử kết nối lại...',
          timestamp: Date.now(),
        };
        state.notifications.push(notification);
      }
    },
    
    // Error tracking
    setLastError: (state, action: PayloadAction<string | null>) => {
      state.lastError = action.payload;
      if (action.payload) {
        state.errorCount += 1;
      }
    },
    
    clearError: (state) => {
      state.lastError = null;
    },
    
    resetErrorCount: (state) => {
      state.errorCount = 0;
    },
    
    // Quick action for Vietnamese success messages
    showSuccessMessage: (state, action: PayloadAction<string>) => {
      const notification: NotificationData = {
        id: generateNotificationId(),
        type: 'success',
        title: 'Thành công',
        message: action.payload,
        duration: 3000,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    
    // Quick action for Vietnamese error messages
    showErrorMessage: (state, action: PayloadAction<string>) => {
      const notification: NotificationData = {
        id: generateNotificationId(),
        type: 'error',
        title: 'Lỗi',
        message: action.payload,
        duration: 5000,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
      state.lastError = action.payload;
      state.errorCount += 1;
    },
    
    // Quick action for Vietnamese warning messages
    showWarningMessage: (state, action: PayloadAction<string>) => {
      const notification: NotificationData = {
        id: generateNotificationId(),
        type: 'warning',
        title: 'Cảnh báo',
        message: action.payload,
        duration: 4000,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    
    // Quick action for Vietnamese info messages
    showInfoMessage: (state, action: PayloadAction<string>) => {
      const notification: NotificationData = {
        id: generateNotificationId(),
        type: 'info',
        title: 'Thông tin',
        message: action.payload,
        duration: 3000,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
  },
});

// Export actions
export const {
  // Theme and display
  toggleDarkMode,
  setDarkMode,
  setLanguage,
  setFontSize,
  
  // Layout state
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
  
  // Loading states
  setGlobalLoading,
  setLoadingState,
  
  // Notifications
  addNotification,
  removeNotification,
  clearAllNotifications,
  
  // Modals and drawers
  openModal,
  closeModal,
  openDrawer,
  closeDrawer,
  
  // Vietnamese-specific UI state
  toggleLunarCalendar,
  setLunarCalendarVisible,
  toggleTraditionalColors,
  setTraditionalColorsEnabled,
  toggleAstrologyTooltips,
  setAstrologyTooltipsEnabled,
  
  // Chart display preferences
  setChartViewMode,
  setChartZoomLevel,
  toggleShowStarNames,
  toggleShowHouseNames,
  
  // Chat interface state
  toggleChatPanel,
  setChatPanelExpanded,
  setTypingIndicator,
  
  // Connection status
  setOnlineStatus,
  setWebsocketConnected,
  
  // Error tracking
  setLastError,
  clearError,
  resetErrorCount,
  
  // Quick messages
  showSuccessMessage,
  showErrorMessage,
  showWarningMessage,
  showInfoMessage,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;