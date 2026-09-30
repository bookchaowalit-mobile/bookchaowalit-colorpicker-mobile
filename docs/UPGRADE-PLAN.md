# Upgrade Plan

## Current state

Score: 5/10 (was 2/10) — working color picker/converter with WCAG contrast and
tested color math, honest CI; no persistence, Explore tab is still a placeholder.

## Backlog

- P1: Saved colors / history (AsyncStorage) listed on the Explore tab.
- P1: Copy value to clipboard (expo-clipboard) from the HEX/RGB/HSL rows.
- P1: Component tests for the picker screen (jest-expo + @testing-library/react-native).
- P2: Custom foreground/background pair in the contrast card (logic exists in `lib/color.ts`).
- P2: Pick a color from a photo (expo-image-picker) — needs native pixel sampling.
- P2: Link the EAS project (`eas init`) so the preview build job can run.

## Done in this pass

- Fixed the app not bundling: aligned `expo-router`/`react-native`/`expo-constants`
  with SDK 53 and added missing `expo-font`, `expo-asset`, `query-string` deps.
- Picker screen: hex/rgb()/hsl() input, presets, darker/lighter, value readout and
  WCAG contrast rating, backed by pure `lib/color.ts` with 10 vitest tests.
- CI runs `npm ci`, typecheck, lint, tests and an Android JS bundle without `|| true`;
  EAS job skips cleanly when `EXPO_TOKEN` is absent; added `eas.json`, ESLint config,
  lockfile. Header colour darkened for white-text contrast.
