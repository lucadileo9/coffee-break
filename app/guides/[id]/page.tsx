'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import CategoryBadge from '@/components/atoms/CategoryBadge';
import DateBadge from '@/components/atoms/DateBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="h-8 animate-pulse rounded bg-muted"></div>
                <div className="flex gap-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded bg-muted"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
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

  // Formatta la data
  const formattedDate = new Date(guide.created_at).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  console.log('Category:', guide.category);
  console.log('Guide:', guide);
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

        <div className="space-y-6">CIAO</div>
        {/* Guide Content */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <div className="space-y-4">
              {/* Title */}
              <h1 className="text-3xl font-bold leading-tight">
                {guide.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <DateBadge date={guide.created_at} />
                </div>

                {guide.categories && (
                  <CategoryBadge name={guide.categories.name} variant="default" />
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div
                className="whitespace-pre-wrap leading-relaxed"
                // dangerouslySetInnerHTML={{ __html: guide.content.replace(/\n/g, '<br>') }}
              />
              {guide.content}
            </div>
          </CardContent>
        </Card>

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
