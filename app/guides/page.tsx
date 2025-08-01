'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import CategoryFilter from '@/components/molecules/CategoryFilter';
import GuideList from '@/components/organisms/GuideList';
import { useCategories } from '@/lib/hooks/useCategories';
import { useGuides } from '@/lib/hooks/useGuides';


export default function GuidesPage() {
  // ==================== STATE MANAGEMENT ====================
  
  /**
   * Stato per tracciare la categoria selezionata nel filtro
   * Stringa vuota significa "tutte le categorie"
   */
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  /**
   * Router per la navigazione programmatica verso le pagine di dettaglio
   */
  const router = useRouter();

  // ==================== DATA FETCHING ====================
  
  /**
   * Hook personalizzato per il caricamento delle guide
   * - Se selectedCategory è vuoto, carica tutte le guide
   * - Se selectedCategory è valorizzato, filtra per quella categoria
   */
  const {
    guides,
    loading: guidesLoading,
    error: guidesError,
  } = useGuides({
    categoryId: selectedCategory || undefined,
  });

  /**
   * Hook personalizzato per il caricamento delle categorie
   * Necessario per popolare il filtro delle categorie
   */
  const { categories, loading: categoriesLoading } = useCategories();

  // ==================== COMPUTED VALUES ====================
  
  /**
   * Guide filtrate in base alla categoria selezionata
   * NOTA: Questo filtro è ridondante perché useGuides già filtra lato server
   * TODO: Rimuovere questo filtro client-side in futuro
   */
  const filteredGuides = selectedCategory
    ? guides.filter(guide => guide.category_id === selectedCategory)
    : guides;

  /**
   * Messaggio da mostrare quando non ci sono guide
   * Cambia in base al fatto che ci sia un filtro attivo o meno
   */
  const emptyMessage = selectedCategory
    ? 'Nessuna guida trovata per questa categoria.'
    : 'Nessuna guida disponibile.';

  // ==================== ERROR HANDLING ====================
  
  /**
   * Gestione degli errori nel caricamento delle guide
   * Mostra un messaggio di errore styled con Tailwind
   */
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

  // ==================== RENDER ====================
  
  /**
   * Struttura della pagina:
   * 1. Container principale con padding e max-width
   * 2. Titolo della pagina
   * 3. Filtro per categoria (componente CategoryFilter)
   * 4. Lista delle guide (componente GuideList)
   */
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        {/* Titolo principale della pagina */}
        <h1 className="mb-8 text-3xl font-bold">Guide</h1>

        {/* Sezione filtro categorie */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            loading={categoriesLoading}
          />
        </div>

        {/* Lista delle guide filtrate */}
        <GuideList
          guides={filteredGuides}
          loading={guidesLoading}
          onGuideClick={(id) => router.push(`/guides/${id}`)}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
}
