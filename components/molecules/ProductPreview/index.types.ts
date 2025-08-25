import { ProductWithCategory } from '@/types/products';

/**
 * ProductPreview - Singolo elemento nella lista prodotti
 */
export default interface ProductPreviewProps {
  product: ProductWithCategory;
  onClick: (product: ProductWithCategory) => void;
}
