import { Guide } from '@/types/guides';

export default interface GuideListProps {
  guides: Guide[];
  loading?: boolean;
  onGuideClick: (guideId: string) => void;
  emptyMessage?: string;
}
