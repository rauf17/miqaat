# Miqaat

Miqaat is a premium Islamic daily companion designed around a simple philosophy: **Software that moves with the sky.**

Instead of static, utilitarian tables for prayer times, Miqaat uses a reactive, time-adaptive theme engine that continuously evolves throughout the day. It offers four distinct visual states (Dawn, Day, Golden, Night) that automatically shift based on the real-world time, creating a beautiful, ambient experience.

![Miqaat Preview](public/preview.png)

## Features
- **Living Theme Engine**: CSS variables driven by a time-adaptive React hook to shift colors, glows, and backgrounds.
- **Accurate Calculations**: Powered by `adhan.js` using strictly offline mathematical algorithms.
- **Premium Typography**: High-contrast, beautifully kerned type pairing Inter (sans) and Lora (serif).
- **Hijri Date Native**: Zero-dependency Hijri date conversions using the native JavaScript `Intl` API (`islamic-umalqura`).
- **Complete Offline Privacy**: All settings and locations are saved entirely in your local browser storage using `zustand`.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS Variables
- **Components**: Radix / shadcn/ui
- **State**: Zustand
- **Animations**: Framer Motion

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rauf17/miqaat.git
   cd miqaat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Copy `.env.example` to `.env.local` and add your geocoding API key if you wish to use automatic reverse-geocoding.
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Miqaat is optimized for Vercel. 
Simply connect your GitHub repository and add your `GEOCODING_API_KEY` to the Vercel Environment Variables panel.

```bash
npx vercel
```
