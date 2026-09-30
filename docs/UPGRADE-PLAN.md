# Upgrade Plan

## Current state

Score: 5/10 (was 2/10) — working color picker/converter with WCAG contrast and
tested color math, honest CI; no persistence, Explore tab is still a placeholder.

## Backlog

- P1: Replace the placeholder Explore tab (e.g. recent-color history) or remove it.
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

## Done in this pass (pass 2)

Score: 6/10 (was 5/10) — colors can be saved and the last color is remembered across restarts.

- Saved colors: Save/Unsave toggle and a "Saved colors" row (normalized, de-duplicated, capped at 24) plus the last selected color persist with AsyncStorage (`@react-native-async-storage/async-storage` 2.1.2) via `lib/usePersistentState.ts`; helpers and guards in `lib/saved.ts` (tested). Kept on the Picker tab so no cross-tab store is needed.
- Accessibility: save toggle exposes state and names the color; saved dots labelled; profile links get link roles.
- Advisories: `overrides.postcss ^8.5.28` clears the high-severity PostCSS advisory in Expo metro-config (minor bump). Remaining `image-size` (metro, bundler-only), `uuid` (via `xcode`) and `decode-uri-component` (via `query-string@7`) need an Expo SDK major upgrade; deliberately not auto-fixed.
- Verified: typecheck, lint, 19 vitest tests, Android `expo export` bundle.
