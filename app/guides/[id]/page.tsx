'use client';

import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGuide } from '@/lib/hooks/useGuide';

export default function GuidePage() {
  const params = useParams();
  const id = params.id as string;
  
  const { guide, loading, error } = useGuide(id);
  console.log('Guide data:', guide);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button skeleton */}
          <div className="mb-8">
            <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
          </div>
          
          {/* Content skeleton */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
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
        <div className="max-w-4xl mx-auto">
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
              <h1 className="text-2xl font-bold text-destructive mb-4">
                Errore
              </h1>
              <p className="text-muted-foreground mb-6">
                {error}
              </p>
              <Link href="/guides">
                <Button>
                  Torna alle Guide
                </Button>
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
    day: 'numeric'
  });

  return (
console.log('GUIDA:', guide),
console.log('Title:', guide?.title),
console.log('Created At:', guide?.created_at),
console.log('Category:', guide?.category),
console.log('Content:', guide?.content),
  <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/guides">
            <Button variant="outline" className="gap-2 transition-transform hover:scale-105">
              <ArrowLeft className="h-4 w-4" />
              Torna alle Guide
            </Button>
          </Link>
        </div>

<div className="space-y-6">
    CIAO
    </div>
        {/* Guide Content */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <div className="space-y-4">
              {/* Title */}
              <h1 className="text-3xl font-bold leading-tight">
                {guide.title}
              </h1>
              
              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {/* <span>{formattedDate}</span> */}
                  <span>{guide.created_at}</span>
                </div>
                
                {guide.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                      {guide.category.name}
                    </span>
                  </div>
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