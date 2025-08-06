'use client';
import React, { useState } from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import MyButton from '@/components/atoms/MyButton';
import GuideItem from '@/components/molecules/GuideItem';
import GuideForm from '@/components/organisms/GuideForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/lib/hooks/useCategories';
import { useGuides } from '@/lib/hooks/useGuides';
import { useGuidesAPI } from '@/lib/hooks/useGuidesAPI';
import { CreateGuideData, Guide } from '@/types/guides';

/**
 * GuidesManager - Componente per gestire le guide (CRUD)
 * 
 * Features:
 * - Lista guide esistenti
 * - Creazione nuove guide
 * - Modifica guide esistenti
 * - Eliminazione guide
 * - Filtri per categoria
 */
export default function GuidesManager() {
  const { guides, loading: guidesLoading, error: guidesError, refetch } = useGuides();
  const { categories } = useCategories();
  const { createGuide, updateGuide, deleteGuide, loading: apiLoading, error: apiError } = useGuidesAPI();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtra guide per categoria
  const filteredGuides = guides?.filter(guide => 
    selectedCategory === 'all' || guide.category_id === selectedCategory
  ) || [];

  const handleCreateGuide = async (guideData: CreateGuideData) => {
    const newGuide = await createGuide(guideData);
    if (newGuide) {
      setShowCreateDialog(false);
      refetch(); // Aggiorna la lista
    }
  };

  const handleUpdateGuide = async (id: string, guideData: CreateGuideData) => {
    const updatedGuide = await updateGuide(id, guideData);
    if (updatedGuide) {
      setEditingGuide(null);
      refetch(); // Aggiorna la lista
    }
  };

  const handleDeleteGuide = async (id: string, title: string) => {
    const confirmed = window.confirm(`Sei sicuro di voler eliminare la guida "${title}"?`);
    if (!confirmed) return;

    const success = await deleteGuide(id);
    if (success) {
      refetch(); // Aggiorna la lista
    }
  };

  if (guidesLoading) {
    return <LoadingSkeleton variant="card" />;
  }

  return (
    <div className="space-y-6">
      {/* Header con azioni */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Guide ({filteredGuides.length})</CardTitle>
              <CardDescription>
                Gestisci le guide del Coffee Break
              </CardDescription>
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <MyButton icon="plus" variant="default">
                  Nuova Guida
                </MyButton>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crea Nuova Guida</DialogTitle>
                  <DialogDescription>
                    Compila i campi per creare una nuova guida
                  </DialogDescription>
                </DialogHeader>
                <GuideForm
                  categories={categories || []}
                  onSubmit={handleCreateGuide}
                  loading={apiLoading}
                  error={apiError}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtro categorie */}
          <div className="flex items-center space-x-4 mb-4">
            <Label htmlFor="category-filter">Filtra per categoria:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le categorie</SelectItem>
                {categories?.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Errori */}
          {(guidesError || apiError) && (
            <ErrorMessage
              message={guidesError || apiError || 'Errore sconosciuto'}
              variant="error"
              className="mb-4"
            />
          )}

          {/* Lista guide */}
          {filteredGuides.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {selectedCategory === 'all' ? (
                'Nessuna guida trovata. Crea la prima guida!'
              ) : (
                'Nessuna guida in questa categoria.'
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGuides.map(guide => (
                <GuideItem
                  key={guide.id}
                  guide={guide}
                  onEdit={setEditingGuide}
                  onDelete={() => handleDeleteGuide(guide.id, guide.title)}
                  loading={apiLoading}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog modifica */}
      <Dialog open={!!editingGuide} onOpenChange={(open) => !open && setEditingGuide(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifica Guida</DialogTitle>
            <DialogDescription>
              Aggiorna i dati della guida selezionata
            </DialogDescription>
          </DialogHeader>
          {editingGuide && (
            <GuideForm
              categories={categories || []}
              initialData={editingGuide}
              onSubmit={(data) => handleUpdateGuide(editingGuide.id, data)}
              loading={apiLoading}
              error={apiError}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
