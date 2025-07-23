import { Metadata } from 'next';

import MyTitle from '@/components/molecules/MyTitle';
import ChangeCalculator from '@/components/organisms/ChangeCalculator';
export const metadata: Metadata = {
  title: 'Coffee Break',
  description: 'Calcolatore di Resto',
};

export default function Home() {
  return (
    <>
      <MyTitle title="Coffee Break" subtitle="Calcolatore di Resto" />
      <ChangeCalculator />;
    </>
  );
}
