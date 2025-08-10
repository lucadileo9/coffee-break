import { Metadata } from 'next';

import WelcomeSection from '@/components/molecules/WelcomeSection';
import { CTA } from '@/types/cta';

export const metadata: Metadata = {
  title: 'Coffee Break - La tua pausa caffè digitale',
  description:
    'Benvenuto in Coffee Break: guide utili, calcolatrice del resto e strumenti per la tua pausa caffè perfetta.',
};

export default function Home() {
  const CTAlist: CTA[] = [
    { text: 'Resto', link: '/calculator', icon: 'calculator' },
    { text: 'Guide', link: '/guides', icon: 'book' },
    { text: 'Contattaci', link: '/contact', icon: 'mail' },
  ];

  return (
    <>
      <WelcomeSection
        title="Benvenuto in Coffee Break"
        subtitle="La tua pausa caffè digitale"
        description="Scopri le nostre guide utili, utilizza la calcolatrice del resto e goditi una pausa rilassante con i nostri strumenti pensati per te."
        CTAlist={CTAlist}
      />
    </>
  );
}
