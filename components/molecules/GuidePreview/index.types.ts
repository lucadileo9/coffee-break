import { Guide } from '@/types/guides';

export default interface GuidePreviewProps {
  guide: Guide;
  onClick?: () => void;
}
