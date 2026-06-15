import { Platform } from "react-native"

export const Colors = {
  light: {
    text: "#111827",
    background: "#ffffff",
    backgroundElement: "#F3F4F6",
    backgroundSelected: "#E5E7EB",
    textSecondary: "#6B7280",
    primary: "#2563EB",
    primaryLight: "#DBEAFE",
    danger: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    border: "#E5E7EB",
    card: "#ffffff",
  },
  dark: {
    text: "#F9FAFB",
    background: "#111827",
    backgroundElement: "#1F2937",
    backgroundSelected: "#374151",
    textSecondary: "#9CA3AF",
    primary: "#3B82F6",
    primaryLight: "#1E3A5F",
    danger: "#F87171",
    success: "#34D399",
    warning: "#FBBF24",
    border: "#374151",
    card: "#1F2937",
  },
} as const

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  eight: 48,
} as const

export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
} as const

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0
export const MaxContentWidth = 800
