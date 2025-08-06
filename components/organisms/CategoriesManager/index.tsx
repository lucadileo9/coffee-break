'use client';
import React, { useState } from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import MyButton from '@/components/atoms/MyButton';
import CategoryItem from '@/components/molecules/CategoryItem';
import CategoryForm from '@/components/organisms/CategoryForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCategories } from '@/lib/hooks/useCategories';
import { useCategoriesAPI } from '@/lib/hooks/useCategoriesAPI';
import { Category } from '@/types/category';

/**
 * CategoriesManager - Componente per gestire le categorie (CRUD)
 * 
 * Features:
 * - Lista categorie esistenti
 * - Creazione nuove categorie
 * - Modifica categorie esistenti
 * - Eliminazione categorie (con controllo guide associate)
 */
export default function CategoriesManager() {
  const { categories, loading: categoriesLoading, error: categoriesError, refetch } = useCategories();
  const { 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    loading: apiLoading, 
    error: apiError 
  } = useCategoriesAPI();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreateCategory = async (name: string) => {
    // Qui dovrebbe esserci la chiamata (fetch) per creare la categoria, ma l'abbiamo implementata nel hook useCategoriesAPI
    // e non qui per separare le responsabilità. Stessa cosa per update e delete.
    const newCategory = await createCategory({ name });
    if (newCategory) {
      setShowCreateDialog(false);
      refetch(); // Aggiorna la lista
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    const updatedCategory = await updateCategory(id, { name });
    if (updatedCategory) {
      setEditingCategory(null);
      refetch(); // Aggiorna la lista
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Sei sicuro di voler eliminare la categoria "${name}"?\n\nATTENZIONE: Se ci sono guide associate, l'eliminazione fallirà.`
    );
    if (!confirmed) return;

    const result = await deleteCategory(id);
    if (result.success) {
      refetch(); // Aggiorna la lista
    } else if (result.guidesCount) {
      // Mostra messaggio specifico per guide associate
      alert(
        `Impossibile eliminare la categoria "${name}".\n` +
        `Ci sono ${result.guidesCount} guide associate.\n\n` +
        `Elimina prima le guide o assegna loro una categoria diversa.`
      );
    }
  };

  if (categoriesLoading) {
    return <LoadingSkeleton variant="card" />;
  }

  return (
    <div className="space-y-6">
      {/* Header con azioni */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Categorie: {categories?.length || 0}</CardTitle>
              <CardDescription>
                Gestisci le categorie per organizzare le guide
              </CardDescription>
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <MyButton icon="lightbulb" variant="default">
                  Nuova Categoria
                </MyButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crea Nuova Categoria</DialogTitle>
                  <DialogDescription>
                    Inserisci il nome della nuova categoria
                  </DialogDescription>
                </DialogHeader>
                <CategoryForm
                  onSubmit={handleCreateCategory}
                  loading={apiLoading}
                  error={apiError}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* Errori */}
          {(categoriesError || apiError) && (
            <ErrorMessage
              message={categoriesError || apiError || 'Errore sconosciuto'}
              variant="error"
              className="mb-4"
            />
          )}

          {/* Lista categorie */}
          {!categories || categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nessuna categoria trovata. Crea la prima categoria!
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map(category => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onEdit={setEditingCategory}
                  onDelete={() => handleDeleteCategory(category.id, category.name)}
                  loading={apiLoading}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog modifica */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Categoria</DialogTitle>
            <DialogDescription>
              Aggiorna il nome della categoria selezionata
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              initialValue={editingCategory.name}
              onSubmit={(name) => handleUpdateCategory(editingCategory.id, name)}
              loading={apiLoading}
              error={apiError}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
