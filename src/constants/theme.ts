/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  secondary: "#E9E1D0",
  background: "#110B13",
  text: "#E9E1D0",
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
