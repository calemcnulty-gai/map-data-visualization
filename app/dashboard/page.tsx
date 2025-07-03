'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudentDataTable } from '@/components/student-data-table';
import { useStudentStore } from '@/stores/student-store';

/**
 * Dashboard page - requires authentication
 * Main interface for MAP data visualization tool
 */
export default function DashboardPage() {
  const router = useRouter();
  const { syncStudents, students, selectedStudents } = useStudentStore();

  // Initial data sync on mount
  useEffect(() => {
    if (students.length === 0) {
      syncStudents().catch(console.error);
    }
  }, []);

  const handleGenerateVisualization = () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }
    
    if (selectedStudents.length === 1) {
      // Single student - navigate to individual visualization page
      const student = selectedStudents[0];
      router.push(`/dashboard/visualize/${student.id}`);
    } else {
      // Multiple students - navigate to batch visualization page
      router.push('/dashboard/visualize/batch');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <StudentDataTable onGenerateVisualization={handleGenerateVisualization} />
    </div>
  );
} 