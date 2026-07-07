'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code2, LayoutDashboard, Compass, Settings, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';
import { useSettingsStore } from '@/lib/store/settingsStore';

/**
 * Persistent bottom navigation dock.
 *
 * Why this lives in the root layout (and not inside SiteFooter):
 *
 *  1. `position: fixed` keeps it pinned to the bottom of the *viewport*
 *     rather than the bottom of the page, so it is always visible
 *     regardless of scroll position.
 *  2. Because the same React instance persists across route changes,
 *     framer-motion's `layoutId` can smoothly slide the active
 *     "spotlight" / top-light / bottom-line from one tab to the next.
 *     When the nav was previously remounted per-page (inside SiteFooter),
 *     the layout animation could not run and the indicator snapped.
 *  3. Mounting it once in the root layout guarantees it is rendered on
 *     every single route (home, settings, qibla, weather, contact,
 *     welcome, etc.) without each page having to opt in.
 */
export function FloatingNav() {
  const pathname = usePathname();
  const { timeOfDay } = useTimeOfDay();
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);

  const links = [
    { href: '/', label: 'HOME', icon: LayoutDashboard },
    { href: '/welcome', label: 'WELCOME', icon: Compass },
    { href: '/settings', label: 'SETTINGS', icon: Settings },
    { href: '/contact', label: 'CONTACT', icon: Mail },
  ];

  const themeColors = {
    dawn: {
      border: 'border-blue-400/30',
      gradient: 'linear-gradient(to bottom, rgba(96, 165, 250, 0.25) 0%, transparent 100%)',
      topGlow: 'bg-blue-100 shadow-[0_0_12px_rgba(96,165,250,0.8)]',
      bottomLine: 'bg-blue-300/40 shadow-[0_0_8px_rgba(96,165,250,0.6)]',
    },
    day: {
      border: 'border-sky-400/30',
      gradient: 'linear-gradient(to bottom, rgba(56, 189, 248, 0.25) 0%, transparent 100%)',
      topGlow: 'bg-sky-100 shadow-[0_0_12px_rgba(56,189,248,0.8)]',
      bottomLine: 'bg-sky-300/40 shadow-[0_0_8px_rgba(56,189,248,0.6)]',
    },
    golden: {
      border: 'border-amber-500/30',
      gradient: 'linear-gradient(to bottom, rgba(245, 158, 11, 0.25) 0%, transparent 100%)',
      topGlow: 'bg-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.8)]',
      bottomLine: 'bg-amber-300/40 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    },
    night: {
      border: 'border-indigo-500/30',
      gradient: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.25) 0%, transparent 100%)',
      topGlow: 'bg-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.8)]',
      bottomLine: 'bg-indigo-300/40 shadow-[0_0_8px_rgba(99,102,241,0.6)]',
    },
  };

  const colors = themeColors[timeOfDay] || themeColors.golden;

  // When reduceMotion is on, disable the spring layout animation so the
  // indicator moves instantly (accessibility preference).
  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 380, damping: 30 };

  return (
    <div
      aria-label="Primary navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-3 pb-3 sm:pb-5 pointer-events-none"
    >
      <nav
        className={cn(
          'pointer-events-auto relative flex items-center justify-center px-3 sm:px-4 py-3 rounded-[2.5rem]',
          'bg-[#1a1a1a]/95 backdrop-blur-md border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]',
          'w-full max-w-[600px] overflow-x-auto no-scrollbar transition-colors duration-1000',
          colors.border,
        )}
      >
        <div className="flex items-center justify-between w-full min-w-[max-content] gap-2 sm:gap-4 px-2 relative z-10">
          {links.map((link) => {
            // Treat "/" specially so that sub-paths of "/" don't all light up.
            const isActive =
              link.href === '/' ? pathname === '/' : pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center justify-center w-20 sm:w-24 h-20 rounded-2xl transition-colors duration-300',
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground/60 hover:text-muted-foreground',
                )}
              >
                {/* Spotlight Background */}
                {isActive && (
                  <motion.div
                    layoutId="footer-spotlight"
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-[120%] pointer-events-none z-0"
                    style={{
                      width: '120px',
                      background: colors.gradient,
                      clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)',
                    }}
                    initial={false}
                    transition={layoutTransition}
                  />
                )}

                {/* Top glowing bar */}
                {isActive && (
                  <motion.div
                    layoutId="footer-top-light"
                    className={cn(
                      'absolute top-[-12px] left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-b-md z-20 transition-all duration-1000',
                      colors.topGlow,
                    )}
                    initial={false}
                    transition={layoutTransition}
                  />
                )}

                {/* Icon & Label */}
                <div className="relative z-10 flex flex-col items-center gap-2 mt-2">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                  <span
                    className={cn(
                      'text-[10px] sm:text-xs font-medium tracking-widest',
                      isActive ? 'text-white font-bold' : '',
                    )}
                  >
                    {link.label}
                  </span>
                </div>

                {/* Bottom underline glow */}
                {isActive && (
                  <motion.div
                    layoutId="footer-bottom-line"
                    className={cn(
                      'absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-[1px] z-20 transition-all duration-1000',
                      colors.bottomLine,
                    )}
                    initial={false}
                    transition={layoutTransition}
                  />
                )}
              </Link>
            );
          })}

          <a
            href="https://github.com/rauf17/miqaat"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex flex-col items-center justify-center w-20 sm:w-24 h-20 rounded-2xl transition-colors duration-300 text-muted-foreground/60 hover:text-muted-foreground"
          >
            <div className="relative z-10 flex flex-col items-center gap-2 mt-2">
              <Code2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
              <span className="text-[10px] sm:text-xs font-medium tracking-widest">
                SOURCE
              </span>
            </div>
          </a>
        </div>
      </nav>
    </div>
  );
}
