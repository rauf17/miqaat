'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMark } from '@/components/brand/logo-mark';
import { Code2 } from 'lucide-react';
import { StreetLamp } from '@/components/ui/street-lamp';
import { cn } from '@/lib/utils';

export function SiteFooter() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/welcome', label: 'Welcome' },
    { href: '/settings', label: 'Settings' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="relative py-12 md:py-16 px-6 border-t border-border/30 w-full mt-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-3">
            <LogoMark className="w-8 h-8 text-foreground/60" />
            <span className="font-brand font-semibold text-foreground/60 tracking-widest uppercase text-sm">
              Miqaat
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 text-center md:text-left mt-2">
            Made with purpose. Open source &amp; privacy-first.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-sm font-medium">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "relative flex flex-col items-center justify-center px-4 py-2 transition-colors hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {isActive && <StreetLamp className="absolute -top-3" />}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
          <a
            href="https://github.com/rauf17/miqaat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Code2 className="w-4 h-4" />
            Source
          </a>
        </nav>
      </div>
    </footer>
  );
}
