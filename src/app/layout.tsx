import type { Metadata } from "next";
import { Inter, Lora, Plus_Jakarta_Sans, Geist_Mono, Noto_Naskh_Arabic } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { NightAtmosphere } from "@/components/ui/night-atmosphere";
import { WeatherFetcher } from "@/components/weather/weather-fetcher";
import { FloatingNav } from "@/components/layout/floating-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { RouteFocusManager } from "@/components/layout/route-focus-manager";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-brand",
  subsets: ["latin"],
});

// MKT-018: define --font-geist-mono so font-mono utility works correctly
// (was referenced in globals.css but never defined).
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// MKT-005: define --font-arabic for Quranic verse display and the brand
// tooltip wordmark (was referenced via font-arabic class but never defined,
// causing Arabic text to fall back to Inter which has poor Arabic glyphs).
const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  // PSP-018: previously pointed to miqaat-beta.vercel.app which is a
  // dead deployment (returns 404). All OG/Twitter card URLs resolved to
  // a dead URL, breaking social shares. Now points to the live
  // deployment via SITE.siteUrl (single source of truth).
  metadataBase: new URL("https://miqaat-two.vercel.app"),
  title: {
    default: "Miqaat - Islamic Daily Companion",
    template: "%s | Miqaat",
  },
  description: "Your premium Islamic daily companion. Software that moves with the sky.",
  keywords: ["Islamic", "Prayer Times", "Hijri", "Adhan", "Qibla"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Miqaat - Islamic Daily Companion",
    description: "Your premium Islamic daily companion. Software that moves with the sky.",
    url: "https://miqaat-two.vercel.app",
    siteName: "Miqaat",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miqaat - Islamic Daily Companion",
    description: "Your premium Islamic daily companion. Software that moves with the sky.",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050B14" }
  ],
};

// PSP-021: JSON-LD structured data for WebApplication. Helps search
// engines understand the app is a LifestyleApplication and can appear
// in app-discovery surfaces.
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Miqaat",
  description: "Islamic daily companion — prayer times, Hijri calendar, Qibla compass, and daily reflections.",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any (web browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: "https://miqaat-two.vercel.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable} ${plusJakartaSans.variable} ${geistMono.variable} ${notoNaskhArabic.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var hour = new Date().getHours();
                  var theme = 'night';
                  if (hour >= 4 && hour < 7) theme = 'dawn';
                  else if (hour >= 7 && hour < 17) theme = 'day';
                  else if (hour >= 17 && hour < 20) theme = 'golden';
                  document.documentElement.setAttribute('data-time-of-day', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans pb-32 sm:pb-40">
        {/* PSP-021: JSON-LD WebApplication structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        {/*
          Skip-to-content link (audit A11Y-003, WCAG 2.4.1 Level A).
          Visually hidden until focused, then appears top-left. Lets
          keyboard users bypass the FloatingNav + per-page headers and
          jump straight to page content.
        */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-primary focus:outline-none"
        >
          Skip to content
        </a>
        <noscript>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm p-6 text-center">
            <div className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg">
              <h2 className="font-heading text-2xl font-bold text-foreground">JavaScript Required</h2>
              <p className="text-muted-foreground text-sm">
                Miqaat relies on real-time browser calculations and location services to accurately determine prayer times. Please enable JavaScript in your browser settings to use this app.
              </p>
            </div>
          </div>
        </noscript>
        <NightAtmosphere className="fixed text-foreground opacity-0 z-0 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 flex-1 flex flex-col">
          <ThemeProvider>
            <WeatherFetcher />
            {/*
              RouteFocusManager moves focus to the page content wrapper
              on every route change and announces the new page's <h1>
              to assistive tech (audit P2-1). It wraps {children} so
              every route inherits this behavior without per-page
              opt-in.
            */}
            <RouteFocusManager>
              {children}
            </RouteFocusManager>
            {/*
              SiteFooter is mounted here (not per-page) so every route
              gets the demoted About / Contact / Source links without
              having to opt in. Same reasoning as FloatingNav below.
            */}
            <SiteFooter />
          </ThemeProvider>
        </div>
        {/*
          Persistent bottom navigation dock. Mounted once here (not per-page)
          so that:
            - it is `position: fixed` to the viewport (always visible),
            - the same React instance survives route changes, which lets
              framer-motion's `layoutId` smoothly slide the active
              "spotlight" from one tab to the next,
            - it renders on every route without each page having to opt in.
          The `pb-32 sm:pb-40` on <body> above reserves space so the dock
          never overlaps the bottom of long page content.
        */}
        <FloatingNav />
        {/*
          PSP-023: register the service worker for offline PWA support.
          Renders null — just runs the registration effect.
        */}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
