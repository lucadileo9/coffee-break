import React, { useState } from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import MyButton from '@/components/atoms/MyButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import CategoryFormProps from './index.types';


/**
 * CategoryForm - Form per creare/modificare categorie
 * 
 * Features:
 * - Validazione campi
 * - Supporto editing esistente
 * - Loading states
 * - Gestione errori
 * - Auto-focus input
 */
export default function CategoryForm({ 
  initialValue = '', 
  onSubmit, 
  loading, 
  error 
}: CategoryFormProps) {
  const [name, setName] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome categoria */}
      <div className="space-y-2">
        <Label htmlFor="category-name">Nome Categoria *</Label>
        <Input
          id="category-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Es: Preparazione Caffè"
          disabled={loading}
          required
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Il nome deve essere univoco e descrittivo
        </p>
      </div>

      {/* Errore */}
      {error && (
        <ErrorMessage
          message={error}
          variant="error"
          showIcon={true}
        />
      )}

      {/* Azioni */}
      <div className="flex justify-end space-x-3">
        <MyButton
          type="submit"
          loading={loading}
          disabled={!isValid}
          icon="check-circle"
        >
          {initialValue ? 'Aggiorna Categoria' : 'Crea Categoria'}
        </MyButton>
      </div>
    </form>
  );
}
