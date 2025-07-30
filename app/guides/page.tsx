'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import GuidePreview from '@/components/molecules/GuidePreview';
import { useCategories } from '@/lib/hooks/useCategories';
import { useGuides } from '@/lib/hooks/useGuides';

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const router = useRouter();

  // Hook per caricare le guide
  const {
    guides,
    loading: guidesLoading,
    error: guidesError,
  } = useGuides({
    categoryId: selectedCategory || undefined,
  });

  // Hook per caricare le categorie
  const { categories, loading: categoriesLoading } = useCategories();

  if (guidesLoading && guides.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold">Guide</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Skeleton loading */}
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} lines={5} className="mb-8" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (guidesError) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-destructive">
            <h2 className="mb-2 text-lg font-semibold">Errore</h2>
            <p>{guidesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Guide</h1>

        {/* Filtro per categoria */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            loading={categoriesLoading}
          />
        </div>

        {/* Lista guide */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <GuidePreview key={guide.id} guide={guide} onClick={() => router.push(`/guides/${guide.id}`)} />
          ))}
        </div>

        {/* Messaggio nessuna guida */}
        {guides.length === 0 && !guidesLoading && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {selectedCategory
                ? 'Nessuna guida trovata per questa categoria.'
                : 'Nessuna guida disponibile.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
