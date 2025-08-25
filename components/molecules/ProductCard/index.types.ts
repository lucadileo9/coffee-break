import { ProductWithCategory } from '@/types/products';

/**
 * ProductCard - Card per visualizzare un prodotto
 */
export default interface ProductCardProps {
  product: ProductWithCategory;
  onClick?: (product: ProductWithCategory) => void;
}
