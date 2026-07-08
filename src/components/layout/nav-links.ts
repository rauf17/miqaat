import type { ComponentType, SVGProps } from 'react';
import { Home, Compass, CloudSun, Settings } from 'lucide-react';

/**
 * Single source of truth for primary navigation links.
 *
 * Consumed by both `FloatingNav` (bottom dock) and `HeaderDropdown`
 * (top-right menu) so the two surfaces can never drift out of sync.
 *
 * Design rationale (see `download/miqaat-nav-ia-audit.md`):
 *  - Only real product features live here. Home (prayers), Qibla, and
 *    Weather are all high-frequency daily destinations and earn dock
 *    real estate. Settings is the conventional last item.
 *  - Marketing (Welcome), Contact, and the external GitHub link are
 *    intentionally NOT here — they are demoted to `SiteFooter`.
 *  - The Compass icon is reserved for Qibla (universal Islamic-app
 *    convention); LayoutDashboard was replaced with Home because the
 *    home screen is a prayer-times view, not an analytics dashboard.
 */
export interface NavLink {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Prayers', icon: Home },
  { href: '/qibla', label: 'Qibla', icon: Compass },
  { href: '/weather', label: 'Weather', icon: CloudSun },
  { href: '/settings', label: 'Settings', icon: Settings },
];
