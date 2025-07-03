'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentStore } from '@/stores/student-store';
import { Loader2 } from 'lucide-react';

export default function VisualizationRedirectPage() {
  const router = useRouter();
  const { selectedStudents } = useStudentStore();

  useEffect(() => {
    // If we have a selected student, redirect to their visualization page
    if (selectedStudents.length > 0) {
      router.replace(`/dashboard/visualize/${selectedStudents[0].id}`);
    } else {
      // Otherwise, go back to dashboard
      router.replace('/dashboard');
    }
  }, [selectedStudents, router]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
} 