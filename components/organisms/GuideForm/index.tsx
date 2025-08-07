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
import { CreateGuideData } from '@/types/guides';

import GuideFormProps from './index.types';

/**
 * GuideForm - Form per creare/modificare guide
 *
 * Features:
 * - Validazione campi
 * - Supporto editing esistente
 * - Textarea per contenuto Markdown
 * - Loading states
 * - Gestione errori
 */
export default function GuideForm({
  categories,
  initialData,
  onSubmit,
  loading,
  error,
}: GuideFormProps) {
  const [formData, setFormData] = useState<CreateGuideData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category_id: initialData?.category_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof CreateGuideData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValid =
    formData.title.trim() && formData.content.trim() && formData.category_id;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Titolo */}
      <div className="space-y-2">
        <Label htmlFor="title">Titolo *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Es: Come preparare un espresso perfetto"
          disabled={loading}
          required
        />
      </div>

      {/* Categoria */}
      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => handleInputChange('category_id', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona una categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category: { id: string; name: string }) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contenuto */}
      <div className="space-y-2">
        <Label htmlFor="content">Contenuto *</Label>
        <textarea
          id="content"
          className="resize-vertical min-h-[200px] w-full rounded-md border border-input p-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Scrivi il contenuto della guida... (Markdown supportato)"
          disabled={loading}
          required
        />
        <p className="text-xs text-muted-foreground">
          Puoi utilizzare Markdown per formattare il testo
        </p>
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
          {initialData ? 'Aggiorna Guida' : 'Crea Guida'}
        </MyButton>
      </div>
    </form>
  );
}
