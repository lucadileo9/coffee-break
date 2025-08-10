import { Category } from '@/types/category';

export default interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: () => void;
  loading: boolean;
}
