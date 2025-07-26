import { Category } from "./category";

export interface Guide {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category_id: string;
  // published?: boolean;
  category?: Category; // Relazione con categoria
}

// Per form di creazione (se servisse)
export interface CreateGuideData {
  title: string;
  content: string;
  category_id: string;
  published?: boolean;
}