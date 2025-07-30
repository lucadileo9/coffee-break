'use client';

import { useState } from 'react';

import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import { useCategories } from '@/lib/hooks/useCategories';
import { useGuides } from '@/lib/hooks/useGuides';

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

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
          <label className="mb-2 block text-sm font-medium">
            Filtra per categoria:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2"
            disabled={categoriesLoading}
          >
            <option value="">Tutte le categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lista guide */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="rounded-lg bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4">
                {guide.categories && (
                  <span className="mb-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                    {guide.categories.name}
                  </span>
                )}
                <h3 className="mb-2 text-lg font-semibold">{guide.title}</h3>
                {/* {guide.excerpt && (
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {guide.excerpt}
                  </p>
                )} */}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(guide.created_at).toLocaleDateString('it-IT')}
  
                </span>
                <a
                  href={`/guides/${guide.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Leggi →
                </a>
              </div>
            </div>
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
