/**
 * @fileoverview Zustand store for managing student data and sync state
 * @module stores/student-store
 */

import { create } from 'zustand';
import { Student } from '@/lib/types';

interface StudentStore {
  // State
  students: Student[];
  selectedStudents: Student[];
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
  searchQuery: string;
  gradeFilter: number | null;
  subjectFilter: 'all' | 'math' | 'reading';

  // Actions - Data Management
  setStudents: (students: Student[]) => void;
  syncStudents: () => Promise<void>;
  clearSyncError: () => void;

  // Actions - Selection
  selectStudent: (student: Student) => void;
  deselectStudent: (studentId: string) => void;
  clearSelection: () => void;
  selectMultiple: (students: Student[]) => void;

  // Actions - Filtering
  setSearchQuery: (query: string) => void;
  setGradeFilter: (grade: number | null) => void;
  setSubjectFilter: (subject: 'all' | 'math' | 'reading') => void;
  clearFilters: () => void;

  // Computed
  getFilteredStudents: () => Student[];
  getSelectedIds: () => string[];
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  // Initial state
  students: [],
  selectedStudents: [],
  isLoading: false,
  isSyncing: false,
  lastSyncTime: null,
  syncError: null,
  searchQuery: '',
  gradeFilter: null,
  subjectFilter: 'all',

  // Data Management Actions
  setStudents: (students) => set({ students, lastSyncTime: new Date() }),

  syncStudents: async () => {
    set({ isSyncing: true, syncError: null });
    
    try {
      const response = await fetch('/api/sheets/sync');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to sync students');
      }

      set({
        students: result.data.students,
        lastSyncTime: new Date(),
        isSyncing: false,
      });
    } catch (error) {
      set({
        syncError: error instanceof Error ? error.message : 'Unknown error occurred',
        isSyncing: false,
      });
      throw error;
    }
  },

  clearSyncError: () => set({ syncError: null }),

  // Selection Actions
  selectStudent: (student) =>
    set((state) => ({
      selectedStudents: [...state.selectedStudents, student],
    })),

  deselectStudent: (studentId) =>
    set((state) => ({
      selectedStudents: state.selectedStudents.filter((s) => s.id !== studentId),
    })),

  clearSelection: () => set({ selectedStudents: [] }),

  selectMultiple: (students) => set({ selectedStudents: students }),

  // Filtering Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setGradeFilter: (grade) => set({ gradeFilter: grade }),
  setSubjectFilter: (subject) => set({ subjectFilter: subject }),
  clearFilters: () =>
    set({ searchQuery: '', gradeFilter: null, subjectFilter: 'all' }),

  // Computed
  getFilteredStudents: () => {
    const { students, searchQuery, gradeFilter, subjectFilter } = get();

    return students.filter((student) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!student.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Grade filter
      if (gradeFilter !== null && student.grade !== gradeFilter) {
        return false;
      }

      // Subject filter
      if (subjectFilter !== 'all') {
        const hasSubjectScore = student.scores[subjectFilter];
        if (!hasSubjectScore) {
          return false;
        }
      }

      return true;
    });
  },

  getSelectedIds: () => {
    const { selectedStudents } = get();
    return selectedStudents.map((s) => s.id);
  },
})); 