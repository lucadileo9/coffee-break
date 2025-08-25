import { Product } from '@/types/products';

export default interface ProductItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: () => void;
  loading: boolean;
}
