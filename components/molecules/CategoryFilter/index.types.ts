import { Category } from "@/types/category";

export default interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
    loading?: boolean;

 }