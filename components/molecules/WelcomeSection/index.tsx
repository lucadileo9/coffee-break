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
  title = "Benvenuto in Coffee Break",
  subtitle = "La tua pausa caffè digitale",
  description = "Scopri le nostre guide, utilizza la calcolatrice del resto e goditi una pausa rilassante con i nostri strumenti utili.",
  showCTA = true,
  CTAlist,
  className
}: WelcomeSectionProps) {
  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="container mx-auto max-w-4xl text-center">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-12">
            
            {/* Titolo principale */}
            <div className="mb-8">
              <SimpleTitle 
                level="h1" 
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              >
                {title}
              </SimpleTitle>
              
              {/* Sottotitolo */}
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                {subtitle}
              </p>
            </div>

            {/* Descrizione */}
            <div className="mb-10">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {description}
              </p>
            </div>

            {/* Call-to-Action */}
            {showCTA && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                {Array.isArray(CTAlist) && CTAlist.map(({ text, link, icon }, idx) => (
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
  <span className="text-transparent animate-bounce rounded-full bg-primary">•</span>
  <span className="text-transparent animate-bounce delay-100 rounded-full bg-primary/70">•</span>
  <span className="text-transparent animate-bounce delay-200 rounded-full bg-primary/40">•</span>
</div>            
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
