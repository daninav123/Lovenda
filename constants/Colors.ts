/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Pastel color palette
const pastelColors = {
  yellow: '#FFF9C4',
  pink: '#FFCDD2',
  mint: '#C8E6C9',
  lavender: '#D1C4E9',
  peach: '#FFCCBC',
  blue: '#B3E5FC',
  text: '#5D4037',
  textLight: '#8D6E63',
  white: '#FFFFFF'
};

export const Colors = {
  light: {
    text: pastelColors.text,
    textLight: pastelColors.textLight,
    background: pastelColors.yellow,
    backgroundCard: pastelColors.white,
    tint: pastelColors.lavender,
    icon: pastelColors.textLight,
    tabIconDefault: pastelColors.textLight,
    tabIconSelected: pastelColors.lavender,
    card: pastelColors.white,
    primary: pastelColors.lavender,
    secondary: pastelColors.mint,
    accent: pastelColors.peach
  },
  dark: {
    text: pastelColors.white,
    textLight: '#D7CCC8',
    background: '#424242',
    backgroundCard: '#616161',
    tint: pastelColors.lavender,
    icon: '#D7CCC8',
    tabIconDefault: '#D7CCC8',
    tabIconSelected: pastelColors.lavender,
    card: '#757575',
    primary: pastelColors.lavender,
    secondary: pastelColors.mint,
    accent: pastelColors.peach
  },
};
