import { Category } from './category';

export interface Guide {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category_id: string; // Foreign key - ID della categoria
  // published?: boolean;
  categories?: Category; // ← Nome del campo come restituito da Supabase (plurale)
}

// Per form di creazione (se servisse)
export interface CreateGuideData {
  title: string;
  content: string;
  category_id: string | number; // Accetta sia string che number per compatibilità database
  published?: boolean;
}
