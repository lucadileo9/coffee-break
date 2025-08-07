import { Metadata } from 'next';

import MyTitle from '@/components/molecules/MyTitle';
import ChangeCalculator from '@/components/organisms/ChangeCalculator';

export const metadata: Metadata = {
  title: 'Calcolatrice Resto - Coffee Break',
  description: 'Calcolatore di resto rapido e preciso per baristi e commercianti. Ottimizza le tue transazioni con il nostro strumento gratuito.',
};

export default function CalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <MyTitle 
        title="Calcolatrice Resto" 
        subtitle="Calcola il resto in modo rapido e preciso" 
      />
      
      <div className="mt-8">
        <ChangeCalculator />
      </div>
    </main>
  );
}
