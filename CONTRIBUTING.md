# Contributing to Miqaat

## Architectural Rules

1. **No Direct LocalStorage Access**: Components must not read from or write to `localStorage` directly. All state persistence must go through the Zustand stores in `src/lib/store/`.
2. **No Direct Date Math**: Components must not perform date math directly (e.g., adding days, calculating offsets). All date math and prayer time calculations must go through the utility functions in `src/lib/prayer/` and `src/lib/hijri/`.
3. **Feature-First Structure**: Features should be contained within their respective domains where possible, keeping the Next.js `src/app/` router thin.
