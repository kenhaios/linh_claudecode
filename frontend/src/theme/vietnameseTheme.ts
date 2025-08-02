import { ThemeConfig } from 'antd';
import { red, gold, green, blue } from '@ant-design/colors';

// Vietnamese cultural colors
export const vietnameseColors = {
  // Traditional Vietnamese red (lucky color)
  primary: '#d4380d', // Deeper red for better accessibility
  primaryLight: '#ff7875',
  primaryDark: '#a8071a',
  
  // Gold (prosperity and wealth)
  gold: '#faad14',
  goldLight: '#ffd666',
  goldDark: '#d48806',
  
  // Success green (harmony and growth)
  success: '#52c41a',
  successLight: '#95de64',
  successDark: '#389e0d',
  
  // Warning orange (balance)
  warning: '#fa8c16',
  warningLight: '#ffc069',
  warningDark: '#d46b08',
  
  // Error red (conflicts)
  error: '#ff4d4f',
  errorLight: '#ff7875',
  errorDark: '#cf1322',
  
  // Info blue (wisdom and knowledge)
  info: '#1890ff',
  infoLight: '#69c0ff',
  infoDark: '#096dd9',
  
  // Background colors with Vietnamese aesthetics
  background: {
    default: '#ffffff',
    paper: '#fafafa',
    section: '#f5f5f5',
    sidebar: '#001529', // Dark blue for sidebar
    header: '#ffffff',
  },
  
  // Text colors optimized for Vietnamese content
  text: {
    primary: '#262626',
    secondary: '#595959',
    disabled: '#bfbfbf',
    inverse: '#ffffff',
    accent: '#d4380d',
  },
  
  // Border colors
  border: {
    light: '#f0f0f0',
    default: '#d9d9d9',
    dark: '#bfbfbf',
  },
};

export const vietnameseTheme: ThemeConfig = {
  token: {
    // Primary colors
    colorPrimary: vietnameseColors.primary,
    colorSuccess: vietnameseColors.success,
    colorWarning: vietnameseColors.warning,
    colorError: vietnameseColors.error,
    colorInfo: vietnameseColors.info,
    
    // Background colors
    colorBgContainer: vietnameseColors.background.paper,
    colorBgElevated: vietnameseColors.background.paper,
    colorBgLayout: vietnameseColors.background.section,
    
    // Text colors
    colorText: vietnameseColors.text.primary,
    colorTextSecondary: vietnameseColors.text.secondary,
    colorTextDisabled: vietnameseColors.text.disabled,
    
    // Border
    colorBorder: vietnameseColors.border.default,
    colorBorderSecondary: vietnameseColors.border.light,
    
    // Font settings optimized for Vietnamese
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Line height for Vietnamese text readability
    lineHeight: 1.5,
    lineHeightHeading1: 1.2,
    lineHeightHeading2: 1.3,
    lineHeightHeading3: 1.3,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    
    // Border radius for modern Vietnamese UI
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    borderRadiusXS: 2,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
    
    // Control heights for better touch targets on mobile
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    controlHeightXS: 24,
    
    // Box shadow for Vietnamese design aesthetic
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 1px 4px rgba(0, 0, 0, 0.04)',
    
    // Motion settings
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
  },
  
  components: {
    // Layout components
    Layout: {
      headerBg: vietnameseColors.background.header,
      headerHeight: 64,
      headerPadding: '0 24px',
      siderBg: vietnameseColors.background.sidebar,
      bodyBg: vietnameseColors.background.default,
    },
    
    // Button styling for Vietnamese aesthetic
    Button: {
      colorPrimary: vietnameseColors.primary,
      colorPrimaryHover: vietnameseColors.primaryLight,
      borderRadius: 8,
      fontWeight: 500,
      paddingInline: 24,
    },
    
    // Card styling for astrology charts
    Card: {
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      headerBg: vietnameseColors.background.paper,
      paddingLG: 24,
    },
    
    // Form components optimized for Vietnamese input
    Form: {
      labelFontSize: 14,
      labelHeight: 32,
      labelRequiredMarkColor: vietnameseColors.error,
      itemMarginBottom: 24,
    },
    
    Input: {
      borderRadius: 8,
      paddingInline: 16,
      fontSize: 14,
      colorText: vietnameseColors.text.primary,
      colorTextPlaceholder: vietnameseColors.text.secondary,
    },
    
    // Date picker for Vietnamese lunar calendar
    DatePicker: {
      borderRadius: 8,
      paddingInline: 16,
    },
    
    // Select components for Vietnamese options
    Select: {
      borderRadius: 8,
      optionSelectedBg: `${vietnameseColors.primary}10`,
      optionActiveBg: `${vietnameseColors.primary}05`,
    },
    
    // Table for consultation history
    Table: {
      borderRadius: 8,
      headerBg: vietnameseColors.background.section,
      headerColor: vietnameseColors.text.primary,
      rowSelectedBg: `${vietnameseColors.primary}08`,
      rowSelectedHoverBg: `${vietnameseColors.primary}12`,
    },
    
    // Menu for navigation
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: `${vietnameseColors.primary}15`,
      itemSelectedColor: vietnameseColors.primary,
      itemHoverBg: `${vietnameseColors.primary}08`,
      itemHoverColor: vietnameseColors.primary,
      subMenuItemBg: 'transparent',
      darkItemBg: vietnameseColors.background.sidebar,
      darkItemSelectedBg: vietnameseColors.primary,
      darkItemHoverBg: `${vietnameseColors.primary}80`,
    },
    
    // Modal for important actions
    Modal: {
      borderRadius: 12,
      headerBg: vietnameseColors.background.paper,
      contentBg: vietnameseColors.background.paper,
      paddingLG: 24,
    },
    
    // Notification for Vietnamese messages
    Notification: {
      borderRadius: 8,
      paddingLG: 16,
    },
    
    // Steps for multi-step processes
    Steps: {
      colorPrimary: vietnameseColors.primary,
      colorText: vietnameseColors.text.primary,
      colorTextSecondary: vietnameseColors.text.secondary,
    },
    
    // Tags for Vietnamese categories
    Tag: {
      borderRadius: 6,
      paddingInline: 8,
      fontSizeSM: 12,
    },
    
    // Badge for token counts
    Badge: {
      colorError: vietnameseColors.error,
      colorSuccess: vietnameseColors.success,
      fontSizeSM: 12,
    },
    
    // Progress for consultation progress
    Progress: {
      colorText: vietnameseColors.text.primary,
      remainingColor: vietnameseColors.background.section,
    },
    
    // Avatar for user profiles
    Avatar: {
      borderRadius: 8,
      colorTextLightSolid: vietnameseColors.text.inverse,
    },
    
    // Drawer for mobile navigation
    Drawer: {
      paddingLG: 24,
      borderRadius: 0,
    },
    
    // Typography for Vietnamese content
    Typography: {
      fontFamilyCode: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
      fontSizeHeading1: 32,
      fontSizeHeading2: 24,
      fontSizeHeading3: 20,
      fontSizeHeading4: 16,
      fontSizeHeading5: 14,
      fontWeightStrong: 600,
      titleMarginBottom: 16,
      titleMarginTop: 16,
    },
    
    // Spin for loading states
    Spin: {
      colorPrimary: vietnameseColors.primary,
    },
    
    // Tooltip styling
    Tooltip: {
      borderRadius: 6,
      paddingSM: 8,
      fontSize: 12,
    },
    
    // Alert for important messages
    Alert: {
      borderRadius: 8,
      paddingLG: 16,
      fontSizeLG: 14,
    },
  },
};

// Dark theme variant for night mode
export const vietnameseDarkTheme: ThemeConfig = {
  ...vietnameseTheme,
  token: {
    ...vietnameseTheme.token,
    
    // Dark theme colors
    colorBgContainer: '#1f1f1f',
    colorBgElevated: '#262626',
    colorBgLayout: '#141414',
    
    colorText: '#ffffff',
    colorTextSecondary: '#bfbfbf',
    colorTextDisabled: '#595959',
    
    colorBorder: '#303030',
    colorBorderSecondary: '#424242',
    
    // Maintain Vietnamese red as primary in dark mode
    colorPrimary: '#ff4d4f',
  },
};

export default vietnameseTheme;