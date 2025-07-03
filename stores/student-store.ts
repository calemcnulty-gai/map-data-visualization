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
  bucketFilter: string | null;

  // Actions - Data Management
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  loadStudentsFromDb: () => Promise<void>;
  syncStudentsFromSheets: () => Promise<void>;
  clearSyncError: () => void;

  // Actions - Selection
  selectStudent: (student: Student) => void;
  deselectStudent: (studentId: string) => void;
  clearSelection: () => void;
  selectMultiple: (students: Student[]) => void;

  // Actions - Filtering
  setSearchQuery: (query: string) => void;
  setGradeFilter: (grade: number | null) => void;
  setBucketFilter: (bucket: string | null) => void;
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
  bucketFilter: null,

  // Data Management Actions
  setStudents: (students) => set({ students }),
  
  addStudent: (student) => 
    set((state) => ({
      students: [...state.students, student].sort((a, b) => {
        // Sort by grade first, then by name
        if (a.grade !== b.grade) {
          return a.grade - b.grade;
        }
        return a.name.localeCompare(b.name);
      }),
    })),

  updateStudent: (id, updates) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === id ? { ...student, ...updates } : student
      ),
    })),

  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter((student) => student.id !== id),
    })),

  loadStudentsFromDb: async () => {
    set({ isLoading: true, syncError: null });
    
    try {
      const response = await fetch('/api/students');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to load students');
      }

      set({
        students: result.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        syncError: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  syncStudentsFromSheets: async () => {
    set({ isSyncing: true, syncError: null });
    
    try {
      const response = await fetch('/api/sheets/sync');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to sync students');
      }

      // Only add new students to the existing list without reloading everything
      if (result.data.newStudents && result.data.newStudents.length > 0) {
        set((state) => ({
          students: [...state.students, ...result.data.newStudents].sort((a, b) => {
            // Sort by grade first, then by name
            if (a.grade !== b.grade) {
              return a.grade - b.grade;
            }
            return a.name.localeCompare(b.name);
          }),
          lastSyncTime: new Date(),
          isSyncing: false,
        }));
      } else {
        // No new students, just update sync time
        set({
          lastSyncTime: new Date(),
          isSyncing: false,
        });
      }
    } catch (error) {
      set({
        syncError: error instanceof Error ? error.message : 'Unknown error occurred',
        isSyncing: false,
      });
      // Don't throw error for background sync - just log it
      console.error('Background sync failed:', error);
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
  setBucketFilter: (bucket) => set({ bucketFilter: bucket }),
  clearFilters: () =>
    set({ searchQuery: '', gradeFilter: null, bucketFilter: null }),

  // Computed
  getFilteredStudents: () => {
    const { students, searchQuery, gradeFilter, bucketFilter } = get();

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

      // Bucket filter
      if (bucketFilter !== null && student.bucket !== bucketFilter) {
        return false;
      }

      return true;
    });
  },

  getSelectedIds: () => {
    const { selectedStudents } = get();
    return selectedStudents.map((s) => s.id);
  },
})); 