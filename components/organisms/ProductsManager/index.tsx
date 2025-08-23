'use client';

import { useState } from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import MyButton from '@/components/atoms/MyButton';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import ProductItem from '@/components/molecules/ProductItem';
import ProductForm from '@/components/organisms/ProductForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCategories } from '@/lib/hooks/useCategories';
import { useProducts } from '@/lib/hooks/useProducts';
import { useProductsAPI } from '@/lib/hooks/useProductsAPI';
import { CreateProductData, Product } from '@/types/products';


/**
 * ProductsManager - Componente per gestire prodotti nell'admin
 *
 * Features:
 * - Lista prodotti esistenti
 * - Creazione nuovi prodotti
 * - Modifica prodotti esistenti
 * - Eliminazione prodotti
 * - Dialog per form
 * - Stati loading e errori
 */
export default function ProductsManager() {
  // Hooks per dati
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch,
  } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const {
    createProduct,
    updateProduct,
    deleteProduct,
    loading: apiLoading,
    error: apiError,
  } = useProductsAPI();

    // State per UI
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Filtra prodotti per categoria
  const filteredProducts =
    products?.filter(
      (product) =>
        selectedCategory === 'all' || product.category_id === selectedCategory
    ) || [];

  // Handlers
  const handleCreateProduct = async (productData: CreateProductData) => {
    const newProduct = await createProduct(productData);
    if (newProduct) {
      setShowCreateDialog(false);
      refetch(); // Aggiorna la lista
    }
  };

  const handleUpdateProduct = async (id: string, productData: CreateProductData) => {
    const updatedProduct = await updateProduct(id, productData);
    if (updatedProduct) {
      setEditingProduct(null);
      refetch(); // Aggiorna la lista
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Sei sicuro di voler eliminare il prodotto "${title}"?`
    );
    if (!confirmed) return;

    const success = await deleteProduct(id);
    if (success) {
      refetch(); // Aggiorna la lista
    }
  };


  const isLoading = productsLoading || categoriesLoading;

  if (isLoading) {
    return <LoadingSkeleton variant="card" lines={5} />;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Prodotti: {filteredProducts.length}</CardTitle>
              <CardDescription>
                Gestisci i prodotti del Coffee Break
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
                  <DialogTitle>Crea Nuovo Prodotto</DialogTitle>
                  <DialogDescription>
                    Compila i campi per creare un nuovo prodotto
                  </DialogDescription>
                </DialogHeader>
                <ProductForm
                  categories={categories || []}
                  onSubmit={handleCreateProduct}
                  loading={apiLoading}
                  error={apiError}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

                <CardContent className="text-primary">
          {/* Filtro categorie */}
          <CategoryFilter
            categories={categories || []}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            loading={productsLoading}
          />

          {/* Errori */}
          {(productsError || apiError) && (
            <ErrorMessage
              message={productsError || apiError || 'Errore sconosciuto'}
              variant="error"
              className="mb-4"
            />
          )}

          {filteredProducts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {selectedCategory === 'all'
                ? 'Nessun prodotto trovato. Crea il primo prodotto!'
                : 'Nessun prodotto in questa categoria.'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onEdit={setEditingProduct}
                  onDelete={() => handleDeleteProduct(product.id, product.name)}
                  loading={apiLoading}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

            {/* Dialog modifica */}
            <Dialog
              open={!!editingProduct}
              onOpenChange={(open) => !open && setEditingProduct(null)}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Modifica Prodotto</DialogTitle>
                  <DialogDescription>
                    Aggiorna i dati del prodotto selezionato
                  </DialogDescription>
                </DialogHeader>
                {editingProduct && (
                  <ProductForm
                    categories={categories || []}
                    initialData={editingProduct}
                    onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
                    loading={apiLoading}
                    error={apiError}
                  />
                )}
              </DialogContent>
            </Dialog>
      

        </div>


  );
}
