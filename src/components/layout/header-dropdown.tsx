'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

import { StreetLamp } from '@/components/ui/street-lamp';
import { NAV_LINKS } from '@/components/layout/nav-links';

export function HeaderDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Pulled from the shared `NAV_LINKS` so this surface and `FloatingNav`
  // can never drift out of sync. See `./nav-links.ts` for rationale.
  const links = NAV_LINKS;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex p-2.5 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
          isOpen && "bg-muted"
        )}
        aria-label="Navigation Menu"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-6 h-6 text-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg rounded-2xl overflow-hidden z-50 origin-top-right"
          >
            <div className="flex flex-col py-2">
              {links.map((link) => {
                // Match FloatingNav's active-state logic (exact for "/",
                // startsWith for everything else) so the two surfaces
                // agree on what's "current".
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "relative flex items-center justify-center text-center px-4 py-4 text-sm font-medium transition-colors hover:bg-muted/50",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {isActive && <StreetLamp className="absolute -top-3" />}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
