import { ProductWithCategory } from '@/types/products';

/**
 * ProductsList - Lista di prodotti con filtri e ricerca
 */
export default interface ProductsListProps {
  products: ProductWithCategory[];
  loading: boolean;
  error: string | null;
  onProductClick: (id: string) => void;
  emptyMessage?: string;
}
