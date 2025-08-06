import { Guide } from '@/types/guides';

export default interface GuideItemProps {
  guide: Guide;
  onEdit: (guide: Guide) => void;
  onDelete: () => void;
  loading: boolean;
}
