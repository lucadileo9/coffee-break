import React, { FC } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import CategoryFilterProps from './index.types';

const CategoryFilter: FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  loading,
}) => {
  return (
    <div className="mb-8">
      <label className="mb-2 block text-sm font-medium">
        Filtra per categoria:
      </label>
      <Select
        value={selectedCategory}
        onValueChange={onCategoryChange}
        disabled={loading}
      >
        <SelectTrigger className="w-64 rounded-lg border bg-background p-2">
          <SelectValue placeholder="Tutte le categorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tutte le categorie</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;
