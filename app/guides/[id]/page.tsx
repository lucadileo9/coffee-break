'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import GuideCard from '@/components/molecules/GuideCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGuide } from '@/lib/hooks/useGuide';

export default function GuidePage() {
  const params = useParams();
  const id = params.id as string;

  const { guide, loading, error } = useGuide(id);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          {/* Back button skeleton */}
          <div className="mb-8">
            <div className="h-10 w-32 animate-pulse rounded bg-muted"></div>
          </div>

          {/* Content skeleton */}
          <LoadingSkeleton lines={5} className="mb-8" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/guides">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Torna alle Guide
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="mb-4 text-2xl font-bold text-destructive">
                Errore
              </h1>
              <p className="mb-6 text-muted-foreground">{error}</p>
              <Link href="/guides">
                <Button>Torna alle Guide</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!guide) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/guides">
            <Button
              variant="outline"
              className="gap-2 transition-transform hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              Torna alle Guide
            </Button>
          </Link>
        </div>

        {/* Guide Content */}
        <GuideCard guide={guide} />

        {/* Navigation Footer */}
        <div className="mt-8 text-center">
          <Link href="/guides">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Torna alle Guide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
