import { NextFontWithVariable } from 'next/dist/compiled/@next/font';

import { AdminNavigationItem } from '@/components/organisms/AdminSidebar/index.types';
import { MenuItemConfig } from '@/components/organisms/Header/index.types';
import { fonts } from '@/lib/fonts';

const font_variables = Object.values(fonts).map(
  (font: NextFontWithVariable) => {
    return font.variable;
  }
);

/**
 * Configurazione delle voci di navigazione per l'admin sidebar
 */
export const adminNavigationItems: AdminNavigationItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: 'home',
    description: 'Panoramica generale',
  },
  {
    href: '/admin/guides',
    label: 'Guide',
    icon: 'book',
    description: 'Gestisci le guide',
  },
  {
    href: '/admin/categories',
    label: 'Categorie',
    icon: 'file-text',
    description: 'Organizza le categorie',
  },
  // DA ABILITARE IN FUTURO
  // {
  //   href: '/admin/users',
  //   label: 'Utenti',
  //   icon: 'users',
  //   description: 'Gestisci gli utenti',
  // },
  // {
  //   href: '/admin/analytics',
  //   label: 'Statistiche',
  //   icon: 'trending-up',
  //   description: 'Analisi e metriche',
  // },
  {
    href: '/admin/settings',
    label: 'Impostazioni',
    icon: 'cog',
    description: 'Configurazioni sistema',
  },
];

export const websiteConfig = {
  logo_img: '/images/logo_jemore.png',
  menuItems: [
    { text: 'Home', href: '/' },
    { text: 'Guide', href: '/guides', requiresAuth: true },
    { text: 'Prodotti', href: '/products' },
    { text: 'Calcolatrice Resto', href: '/calculator' },
  ] as MenuItemConfig[],
  title: 'Coffee Break',
  description:
    'template di base per siti web JEMORE, con configurazione di base, header, footer e navigazione.',
  font_variables: font_variables,
  color_themes: ['system', 'jemore-theme-light', 'jemore-theme-dark'],
  admin: {
    navigationItems: adminNavigationItems,
    title: 'Coffee Break',
    subtitle: 'Pannello Admin',
  },
};
