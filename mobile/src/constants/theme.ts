import { Platform } from "react-native"

export const Colors = {
  light: {
    text: "#6b6375",
    textHeading: "#08060d",
    background: "#FAFAFA",
    backgroundElement: "#F3F4F6",
    backgroundSelected: "#E5E7EB",
    textSecondary: "#6B7280",
    primary: "#0A0A0A",
    accent: "#C9A84C",
    accentLight: "rgba(201, 168, 76, 0.1)",
    primaryLight: "rgba(10, 10, 10, 0.05)",
    danger: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    border: "#E5E7EB",
    card: "#ffffff",
  },
  dark: {
    text: "#9CA3AF",
    textHeading: "#F3F4F6",
    background: "#16171d",
    backgroundElement: "#1F2937",
    backgroundSelected: "#374151",
    textSecondary: "#9CA3AF",
    primary: "#F3F4F6",
    accent: "#C9A84C",
    accentLight: "rgba(201, 168, 76, 0.15)",
    primaryLight: "rgba(243, 244, 246, 0.1)",
    danger: "#F87171",
    success: "#34D399",
    warning: "#FBBF24",
    border: "#2E303A",
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
  seven: 40,
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
  "2xl": 28,
  "3xl": 32,
  full: 9999,
} as const

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0
export const MaxContentWidth = 800
