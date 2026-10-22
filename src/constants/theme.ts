/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

const palette = {
  ink: "#110B13", // your background
  inkRaised: "#1B141E", // slightly lighter, for cards
  inkSelected: "#2A2130",
  cream: "#E9E1D0", // your text/secondary
  creamMuted: "#9D978B",
  accent: "#F2B134", // placeholder, replace with a real brand color
  danger: "#E5484D",
} as const;

export const Colors = {
  background: palette.ink,
  backgroundElement: palette.inkRaised,
  backgroundSelected: palette.inkSelected,
  text: palette.cream,
  textSecondary: palette.creamMuted,
  primary: palette.accent,
  onPrimary: palette.ink, // text/icons on top of a primary button
  border: "rgba(233, 225, 208, 0.12)",
  danger: palette.danger,
} as const;

export type ThemeColor = keyof typeof Colors;

// export const Fonts = Platform.select({
//   ios: {
//     // /** iOS `UIFontDescriptorSystemDesignDefault` */
//     // sans: "system-ui",
//     // /** iOS `UIFontDescriptorSystemDesignSerif` */
//     // serif: "ui-serif",
//     // /** iOS `UIFontDescriptorSystemDesignRounded` */
//     // rounded: "ui-rounded",
//     // /** iOS `UIFontDescriptorSystemDesignMonospaced` */
//     // mono: "ui-monospace",
//     regular: "Urbanist-Regular",
//     semibold: "Urbanist-SemiBold",
//     bold: "Urbanist-Bold",
//   },
//   default: {
//     // sans: "normal",
//     // serif: "serif",
//     // rounded: "normal",
//     // mono: "monospace",
//     regular: "Urbanist-Regular",
//     semibold: "Urbanist-SemiBold",
//     bold: "Urbanist-Bold",
//   },
//   web: {
//     sans: "var(--font-display)",
//     serif: "var(--font-serif)",
//     rounded: "var(--font-rounded)",
//     mono: "var(--font-mono)",
//   },
// });

export const Fonts = {
  regular: "Urbanist-Regular",
  semibold: "Urbanist-SemiBold",
  bold: "Urbanist-Bold",
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
