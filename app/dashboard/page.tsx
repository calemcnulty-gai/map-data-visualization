'use client';

import { useEffect } from 'react';
import { StudentDataTable } from '@/components/student-data-table';
import { useStudentStore } from '@/stores/student-store';

/**
 * Dashboard page - requires authentication
 * Main interface for MAP data visualization tool
 */
export default function DashboardPage() {
  const { loadStudentsFromDb } = useStudentStore();

  // Load students from database on mount
  useEffect(() => {
    loadStudentsFromDb().catch(console.error);
  }, [loadStudentsFromDb]);

  return (
    <div className="container mx-auto py-8">
      <StudentDataTable />
    </div>
  );
} 