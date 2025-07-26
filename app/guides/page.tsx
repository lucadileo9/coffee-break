'use client';

import { useState } from 'react';

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
  const { 
    categories, 
    loading: categoriesLoading 
  } = useCategories();

  if (guidesLoading && guides.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Guide</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skeleton loading */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (guidesError) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Errore</h2>
            <p>{guidesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Guide</h1>
        
        {/* Filtro per categoria */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Filtra per categoria:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-card rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                {guide.category && (
                  <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full mb-2">
                    {guide.category.name}
                  </span>
                )}
                <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                {/* {guide.excerpt && (
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {guide.excerpt}
                  </p>
                )} */}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {new Date(guide.created_at).toLocaleDateString('it-IT')}
                </span>
                <a 
                  href={`/guides/${guide.id}`}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Leggi →
                </a>
              </div>
            </div>
          ))}
        </div>


        {/* Messaggio nessuna guida */}
        {guides.length === 0 && !guidesLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedCategory 
                ? 'Nessuna guida trovata per questa categoria.' 
                : 'Nessuna guida disponibile.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}