import Link from 'next/link';
import React from 'react';

import MyButton from '@/components/atoms/MyButton';
import SimpleTitle from '@/components/atoms/SimpleTitle';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import WelcomeSectionProps from './index.types';

/**
 * Welcome - Sezione di benvenuto riutilizzabile
 *
 * Features:
 * - Titolo e sottotitolo personalizzabili
 * - Descrizione opzionale
 * - Call-to-Action configurabile
 * - Design responsive e accessibile
 * - Seguendo atomic design principles
 */
export default function WelcomeSection({
  title = 'Benvenuto in Coffee Break',
  subtitle = 'La tua pausa caffè digitale',
  description = 'Scopri le nostre guide, utilizza la calcolatrice del resto e goditi una pausa rilassante con i nostri strumenti utili.',
  showCTA = true,
  CTAlist,
  className,
}: WelcomeSectionProps) {
  return (
    <section className={cn('px-4 py-16', className)}>
      <div className="container mx-auto max-w-4xl text-center">
        <Card className="border-0 bg-gradient-to-br from-card to-muted/20 shadow-lg">
          <CardContent className="p-12">
            {/* Titolo principale */}
            <div className="mb-8">
              <SimpleTitle
                level="h1"
                className="mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
              >
                {title}
              </SimpleTitle>

              {/* Sottotitolo */}
              <p className="text-xl font-medium text-muted-foreground md:text-2xl">
                {subtitle}
              </p>
            </div>

            {/* Descrizione */}
            <div className="mb-10">
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>

            {/* Call-to-Action */}
            {showCTA && (
              <div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
                {Array.isArray(CTAlist) &&
                  CTAlist.map(({ text, link, icon }, idx) => (
                    <Link href={link} key={idx}>
                      <MyButton
                        size="lg"
                        className="px-8 py-3 text-lg font-semibold"
                        icon={icon}
                      >
                        {text}
                      </MyButton>
                    </Link>
                  ))}
              </div>
            )}

            <div className="mt-12 flex justify-center space-x-4">
              <span className="animate-bounce rounded-full bg-primary text-transparent">
                •
              </span>
              <span className="animate-bounce rounded-full bg-primary/70 text-transparent delay-100">
                •
              </span>
              <span className="animate-bounce rounded-full bg-primary/40 text-transparent delay-200">
                •
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
