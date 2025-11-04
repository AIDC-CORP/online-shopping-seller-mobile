/**
 * Seller Hub Theme - Tailwind-inspired colors
 * Using emerald as primary brand color
 */

import { Platform } from 'react-native';

// Brand Colors
const emerald = {
  50: '#ecfdf5',
  100: '#d1fae5',
  200: '#a7f3d0',
  300: '#6ee7b7',
  400: '#34d399',
  500: '#10b981', // Primary
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
};

const gray = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
};

const tintColorLight = emerald[500]; // #10b981
const tintColorDark = emerald[400];

export const Colors = {
  light: {
    text: gray[900],
    background: '#ffffff',
    tint: tintColorLight,
    icon: gray[500],
    tabIconDefault: gray[500],
    tabIconSelected: tintColorLight,
    primary: emerald[500],
    secondary: gray[600],
    accent: emerald[600],
    surface: gray[50],
    border: gray[200],
    error: '#ef4444',
    success: emerald[500],
    warning: '#f59e0b',
  },
  dark: {
    text: gray[50],
    background: gray[900],
    tint: tintColorDark,
    icon: gray[400],
    tabIconDefault: gray[400],
    tabIconSelected: tintColorDark,
    primary: emerald[400],
    secondary: gray[300],
    accent: emerald[500],
    surface: gray[800],
    border: gray[700],
    error: '#f87171',
    success: emerald[400],
    warning: '#fbbf24',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
