import { NextFontWithVariable } from 'next/dist/compiled/@next/font';

import { MenuItemConfig } from '@/components/organisms/Header/index.types';
import { fonts } from '@/lib/fonts';

const font_variables = Object.values(fonts).map(
  (font: NextFontWithVariable) => {
    return font.variable;
  }
);

export const websiteConfig = {
  logo_img: '/images/logo_jemore.png',
  menuItems: [
    { text: 'Home', href: '/' },
    { text: 'Guide', href: '/guides', requiresAuth: true },
    { text: 'Calcolatrice Resto', href: '/calculator' },
  ] as MenuItemConfig[],
  title: 'Coffee Break',
  description:
    'template di base per siti web JEMORE, con configurazione di base, header, footer e navigazione.',
  font_variables: font_variables,
  color_themes: ['system', 'jemore-theme-light', 'jemore-theme-dark'],
};
