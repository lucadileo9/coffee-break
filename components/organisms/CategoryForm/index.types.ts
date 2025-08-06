/**
 * CategoryForm - Form per creare/modificare categorie
 */
export default interface CategoryFormProps {
  initialValue?: string;
  onSubmit: (name: string) => void;
  loading: boolean;
  error: string | null;
}
