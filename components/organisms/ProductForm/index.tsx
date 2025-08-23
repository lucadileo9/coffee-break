import React, { useState } from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import MyButton from '@/components/atoms/MyButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateProductData } from '@/types/products';

import ProductFormProps from './index.types';

/**
 * Internal form state - ensures category_id is always string for UI components
 */
interface FormState {
  name: string;
  description: string;
  price: string; // Keep as string for input, convert to number on submit
  category_id: string; // Always string in the form
}

/**
 * ProductForm - Form per creare/modificare prodotti
 *
 * Features:
 * - Validazione campi
 * - Supporto editing esistente
 * - Gestione prezzo con formattazione
 * - Loading states
 * - Gestione errori
 */
export default function ProductForm({
  categories,
  initialData,
  onSubmit,
  loading,
  error,
}: ProductFormProps) {
  const [formData, setFormData] = useState<FormState>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price ? (initialData.price / 100).toFixed(2) : '', // Convert from cents to euros
    category_id: initialData?.category_id
      ? String(initialData.category_id)
      : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert form data to API format (CreateProductData)
    const priceInCents = Math.round(parseFloat(formData.price || '0') * 100);

    const apiData: CreateProductData = {
      name: formData.name,
      description: formData.description.trim(), // Always include description, even if empty
      price: priceInCents, // Convert to cents
      category_id: formData.category_id,
    };

    onSubmit(apiData);
  };

  const handleInputChange = (field: keyof FormState, value: string) => {
    console.warn(`🔄 Updating ${field} to:`, value, `(type: ${typeof value})`);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePriceChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return; // Don't update if more than one decimal point
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return; // Don't update if more than 2 decimal places
    }

    handleInputChange('price', cleanValue);
  };

  const isValid =
    formData.name.trim() &&
    formData.category_id &&
    formData.price &&
    !isNaN(parseFloat(formData.price)) &&
    parseFloat(formData.price) > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome Prodotto *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Es: Espresso Blend Premium"
          disabled={loading}
          required
        />
      </div>

      {/* Descrizione */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrizione</Label>
        <textarea
          id="description"
          className="resize-vertical min-h-[120px] w-full rounded-md border border-input p-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Descrivi le caratteristiche del prodotto... (opzionale)"
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          La descrizione è opzionale
        </p>
      </div>

      {/* Prezzo */}
      <div className="space-y-2">
        <Label htmlFor="price">Prezzo (€) *</Label>
        <div className="relative">
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder="15.50"
            disabled={loading}
            required
            type="text"
            inputMode="decimal"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground">
            €
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Inserisci il prezzo in euro (es: 15.50)
        </p>
      </div>

      {/* Categoria */}
      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Select
          value={formData.category_id ? String(formData.category_id) : ''} // Ensure it's always a string
          onValueChange={(value) => handleInputChange('category_id', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona una categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(
              (category: { id: string | number; name: string }) => {
                const categoryId = String(category.id); // Always convert to string
                return (
                  <SelectItem key={categoryId} value={categoryId}>
                    {category.name}
                  </SelectItem>
                );
              }
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Errore */}
      {error && (
        <ErrorMessage message={error} variant="error" showIcon={true} />
      )}

      {/* Azioni */}
      <div className="flex justify-end space-x-3">
        <MyButton
          type="submit"
          loading={loading}
          disabled={!isValid}
          icon="check-circle"
        >
          {initialData ? 'Aggiorna Prodotto' : 'Crea Prodotto'}
        </MyButton>
      </div>
    </form>
  );
}
