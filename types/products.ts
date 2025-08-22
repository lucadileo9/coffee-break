import { Category } from './category';

export interface Product {
  id: string;
  created_at: string;
  name: string;
  description?: string; // Descrizione opzionale
  price: number; // Prezzo in centesimi (es: 1500 = 15.00€)
  category_id: string; // Foreign key - ID della categoria
  categories?: Category; // JOIN con la tabella categorie
}

// Per form di creazione/aggiornamento
export interface CreateProductData {
  name: string;
  description?: string; // Descrizione opzionale
  price: number;
  category_id: string | number; // Accetta sia string che number per compatibilità database
}

// Prodotto con informazioni categoria (per le API responses)
export interface ProductWithCategory extends Omit<Product, 'categories'> {
  categories: Category;
}
