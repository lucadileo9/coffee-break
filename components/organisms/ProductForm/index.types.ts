import { CreateProductData, Product } from '@/types/products';

/**
 * ProductForm - Form per creare/modificare prodotti
 */
export default interface ProductFormProps {
  categories: Array<{ id: string | number; name: string }>; // Accept both string and number IDs
  initialData?: Product;
  onSubmit: (data: CreateProductData) => void;
  loading: boolean;
  error: string | null;
}
