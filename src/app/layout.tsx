import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { NightAtmosphere } from "@/components/ui/night-atmosphere";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miqaat",
  description: "Your premium Islamic daily companion",
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
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NightAtmosphere className="fixed text-foreground opacity-30 z-0 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 flex-1 flex flex-col">
          <ThemeProvider>{children}</ThemeProvider>
        </div>
      </body>
    </html>
  );
}
