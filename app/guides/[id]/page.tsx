'use client';

import { useParams, useRouter } from 'next/navigation';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import MyButton from '@/components/atoms/MyButton';
import ProtectedRoute from '@/components/atoms/ProtectedRoute';
import GuideCard from '@/components/molecules/GuideCard';
import { useGuide } from '@/lib/hooks/useGuide';

export default function GuidePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { guide, loading, error } = useGuide(id);

  if (loading) {
    return (
      <ProtectedRoute>
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <MyButton
            icon="arrow-left"
            onClick={() => router.push('/guides')}
            className="mb-8 gap-2"
          >
            Torna alle Guide
          </MyButton>
          <LoadingSkeleton lines={5} className="mb-8" />
        </div>
      </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <MyButton
            icon="arrow-left"
            onClick={() => router.push('/guides')}
            className="mb-8 gap-2"
          >
            Torna alle Guide
          </MyButton>
          <ErrorMessage
            title={error ?? undefined}
            message="Si è verificato un errore durante il caricamento della guida."
          />
        </div>
      </div>
      </ProtectedRoute>
    );
  }

  if (!guide) {
    return null;
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <MyButton
          icon="arrow-left"
          onClick={() => router.push('/guides')}
          className="mb-8 gap-2"
        >
          Torna alle Guide
        </MyButton>

        {/* Guide Content */}
        <GuideCard guide={guide} />
      </div>
    </div>
    </ProtectedRoute>
  );
}
