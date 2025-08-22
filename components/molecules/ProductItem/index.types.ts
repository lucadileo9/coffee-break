import { ProductWithCategory } from '@/types/products';

/**
 * ProductItem - Singolo elemento nella lista prodotti
 */
export default interface ProductItemProps {
  product: ProductWithCategory;
  onClick: (product: ProductWithCategory) => void;
}
