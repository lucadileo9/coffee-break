import { CreateGuideData, Guide } from '@/types/guides';

/**
 * GuideForm - Form per creare/modificare guide
 */
export default interface GuideFormProps {
  categories: Array<{ id: string | number; name: string }>; // Accept both string and number IDs
  initialData?: Guide;
  onSubmit: (data: CreateGuideData) => void;
  loading: boolean;
  error: string | null;
}
