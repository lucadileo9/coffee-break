import { Metadata } from 'next';

import ChangeCalculator from '@/components/organisms/ChangeCalculator';
export const metadata: Metadata = {
  title: 'JEMORE ti vuole bene',
  description: 'anche se non ti paga',
};

export default function Home() {
  return  <ChangeCalculator />;
}
