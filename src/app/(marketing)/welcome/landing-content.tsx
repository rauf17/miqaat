'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { LogoMark } from '@/components/brand/logo-mark';
import {
  Moon, Heart, Shield, Smartphone,
  ArrowRight,
  Clock, CalendarDays, Compass, BookOpen,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FaqSection } from '@/components/layout/faq-section';
import { HeaderDropdown } from '@/components/layout/header-dropdown';

/* ─────────────────────── DATA ─────────────────────── */

const FEATURES = [
  {
    icon: Clock,
    title: 'Living Prayer Timeline',
    description:
      'Six prayer times calculated from the sun\u2019s true position at your coordinates. A glowing marker follows you through the day \u2014 past prayers dim, the current one pulses, and the next countdown ticks in real time.',
    screenshot: '/marketing/timeline.webp',
  },
  {
    icon: CalendarDays,
    title: 'Hijri Calendar',
    description:
      'Navigate the Islamic lunar calendar with full month grids, automatic event detection for sacred days like Ramadan and the two Eids, and a dual Gregorian date overlay so you always know where you are in both systems.',
    screenshot: '/marketing/calendar.webp',
  },
  {
    icon: Compass,
    title: 'Qibla Compass',
    description:
      'A precision bearing to the Kaaba calculated from your exact coordinates. On mobile, the compass rotates live with your device\u2019s orientation sensors. On desktop, a beautifully rendered static dial shows the way.',
    screenshot: '/marketing/qibla.webp',
  },
  {
    icon: BookOpen,
    title: 'Daily Reflection',
    description:
      'Each day surfaces a verified Quranic verse or Sahih Hadith from a curated dataset of 100 entries \u2014 never AI\u2011generated scripture. An optional AI reflection adds a warm, personal thought without inventing or paraphrasing sacred text.',
    screenshot: '/marketing/reflection.webp',
  },
];

const PHILOSOPHY = [
  {
    icon: Moon,
    title: 'Calm over Clutter',
    description:
      'One screen. No tabs, no sidebars, no notification badges competing for attention. Miqaat shows you what you need for this moment, nothing more.',
  },
  {
    icon: Heart,
    title: 'Presence over Productivity',
    description:
      'No gamification, no streaks, no social features. This is a companion, not a competition. Your spiritual practice is between you and God.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      'No accounts. No emails. No analytics tracking your habits. Your data stays in your browser \u2014 we literally cannot see it.',
  },
  {
    icon: Smartphone,
    title: 'Local First',
    description:
      'Prayer times, Hijri dates, and Qibla bearing are calculated entirely in your browser. No API calls needed. Works offline.',
  },
];


/* ────────────── ANIMATION PRESETS ────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 32 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-60px' } as const,
  transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const },
};

const stagger = (delay: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay },
});

/* ─────────────── SCREENSHOT IMAGE ─────────────── */

function FeatureImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <div className="relative w-full aspect-[9/16] max-h-[520px] rounded-2xl overflow-hidden border border-border/30 shadow-2xl bg-card/10 flex items-center justify-center">
        <span className="text-muted-foreground/40 text-sm font-medium px-4 text-center">
          Screenshot Placeholder
        </span>
      </div>
    );
  }
  return (
    <div className="relative w-full aspect-[9/16] max-h-[520px] rounded-2xl overflow-hidden border border-border/30 shadow-2xl bg-card/10">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, 50vw"
        onError={() => setHasError(true)}
      />
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   MAIN LANDING CONTENT
   ═══════════════════════════════════════════════════ */

export function LandingContent() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-background">
      {/* ───────── HEADER ───────── */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border/10">
        <div className="flex items-center gap-2">
          <LogoMark className="w-6 h-6 text-primary" />
          <span className="font-brand font-semibold text-foreground tracking-widest uppercase text-sm hidden sm:inline-block">
            Miqaat
          </span>
        </div>
        <HeaderDropdown />
      </header>

      {/* ───────── HERO ───────── */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* Decorative glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10"
        >
          <LogoMark
            animateIn
            className="w-20 h-20 mx-auto mb-8 text-primary"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-brand font-bold tracking-tight text-foreground"
        >
          Miqaat
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 mt-6 text-xl sm:text-2xl md:text-3xl font-heading text-foreground/80 max-w-2xl leading-snug"
        >
          Software that moves with the sky.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 mt-4 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed"
        >
          A premium Islamic daily companion. Prayer times, Hijri calendar,
          Qibla compass, and daily reflections &mdash; no account required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium text-lg shadow-[0_0_30px_var(--color-time-glow)] hover:shadow-[0_0_50px_var(--color-time-glow)] transition-all duration-300 hover:scale-[1.02]"
          >
            Open Miqaat
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com/rauf17/miqaat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all duration-300 font-medium"
          >
            <Code2 className="w-5 h-5" />
            View Source
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-2.5 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-20 md:mb-28">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
              Features
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground leading-tight">
              Everything you need.
              <br />
              <span className="text-primary">Nothing you don&rsquo;t.</span>
            </h2>
          </motion.div>

          <div className="flex flex-col gap-24 md:gap-36">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={feature.title}
                  {...stagger(0)}
                  className={cn(
                    'flex flex-col items-center gap-10 md:gap-16',
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}
                >
                  {/* Screenshot side */}
                  <motion.div
                    {...stagger(0.1)}
                    className="w-full md:w-5/12 flex-shrink-0"
                  >
                    <FeatureImage
                      src={feature.screenshot}
                      alt={`${feature.title} screenshot`}
                    />
                  </motion.div>

                  {/* Text side */}
                  <div className="flex-1 flex flex-col items-start">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── PHILOSOPHY ───────── */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16 md:mb-24">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
              Philosophy
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground leading-tight">
              Built with intention.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Miqaat is designed around four principles that shape every
              decision, from what we build to what we deliberately leave out.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {PHILOSOPHY.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  {...stagger(i * 0.1)}
                  className="group relative p-8 md:p-10 rounded-3xl bg-card/40 backdrop-blur-md border border-border/40 hover:border-primary/30 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── PRIVACY CALLOUT ───────── */}
      <section className="relative py-24 md:py-32 px-6">
        <motion.div
          {...fadeUp}
          className="max-w-4xl mx-auto text-center relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <Shield className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
              No login. No signup.
              <br />
              <span className="text-primary">No backend database.</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              Your coordinates, your prayer method preference, your cached
              reflections &mdash; all of it lives in your browser&rsquo;s local
              storage and never leaves your device. We built Miqaat this way on
              purpose. Your spiritual data is yours alone.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-muted-foreground">
              {[
                'No cookies',
                'No analytics',
                'No telemetry',
                'No third-party trackers',
              ].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full border border-border/50 bg-card/20 backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ───────── FAQ ───────── */}
      <FaqSection id="faq" />

      {/* ───────── BOTTOM CTA ───────── */}
      <section className="relative py-24 px-6 border-t border-border/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-8">
              Ready to find your focus?
            </h2>
            <Link
              href="/"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium text-lg shadow-[0_0_30px_var(--color-time-glow)] hover:shadow-[0_0_50px_var(--color-time-glow)] transition-all duration-300 hover:scale-[1.02]"
            >
              Open Miqaat
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      {/* SiteFooter is mounted in the root layout — no need to render it here. */}
    </div>
  );
}
