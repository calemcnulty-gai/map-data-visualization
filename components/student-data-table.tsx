/**
 * @fileoverview Student data table component with search and filtering
 * @module components/student-data-table
 */

'use client';

import { useState, useMemo } from 'react';
import { Student } from '@/lib/types';
import { useStudentStore } from '@/stores/student-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddStudentForm } from '@/components/forms/add-student-form';
import { 
  Search, 
  RefreshCw, 
  AlertCircle, 
  ChevronDown,
  Filter,
  Loader2,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StudentDataTableProps {
  onGenerateVisualization?: () => void;
}

export function StudentDataTable({ onGenerateVisualization }: StudentDataTableProps) {
  const router = useRouter();
  const {
    students,
    isLoading,
    isSyncing,
    lastSyncTime,
    syncError,
    searchQuery,
    gradeFilter,
    bucketFilter,
    syncStudentsFromSheets,
    clearSyncError,
    setSearchQuery,
    setGradeFilter,
    setBucketFilter,
    getFilteredStudents,
    loadStudentsFromDb,
    deleteStudent,
  } = useStudentStore();

  const [showFilters, setShowFilters] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const filteredStudents = useMemo(() => getFilteredStudents(), [
    students,
    searchQuery,
    gradeFilter,
    bucketFilter,
    getFilteredStudents,
  ]);

  const uniqueGrades = useMemo(() => {
    const grades = new Set(students.map((s) => s.grade));
    return Array.from(grades).sort((a, b) => a - b);
  }, [students]);

  const handleRowClick = (student: Student) => {
    router.push(`/dashboard/visualize/${student.id}`);
  };

  const handleEdit = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setEditingStudent(student);
  };

  const handleDelete = async (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      // Remove from store after successful deletion
      deleteStudent(student.id);
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student. Please try again.');
    }
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never synced';
    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return lastSyncTime.toLocaleDateString();
  };

  const handleAddStudentSuccess = (studentId: string) => {
    setShowAddStudentModal(false);
    // Navigate to visualization page for the new student
    router.push(`/dashboard/visualize/${studentId}`);
  };

  const handleEditStudentSuccess = () => {
    setEditingStudent(null);
    // The form will have already updated the student in the store
  };

  return (
    <div className="space-y-4">
      {/* Header with sync status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Student Data</h2>
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading students...
              </span>
            ) : (
              <>
                {students.length} students
                {lastSyncTime && <> • Last synced: {formatLastSync()}</>}
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={syncStudentsFromSheets}
            disabled={isSyncing || isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', isSyncing && 'animate-spin')} />
            {isSyncing ? 'Syncing...' : 'Sync from Sheets'}
          </Button>
          <Button
            onClick={() => setShowAddStudentModal(true)}
            disabled={isLoading}
            variant="default"
            size="sm"
            className="bg-nextgen-green hover:bg-nextgen-green/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Add Student Modal */}
      <Dialog open={showAddStudentModal} onOpenChange={setShowAddStudentModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student's information and MAP test scores. You'll be taken to the visualization page after saving.
            </DialogDescription>
          </DialogHeader>
          <AddStudentForm 
            onSuccess={handleAddStudentSuccess}
            onCancel={() => setShowAddStudentModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student's information and MAP test scores.
            </DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <AddStudentForm 
              student={editingStudent}
              onSuccess={handleEditStudentSuccess}
              onCancel={() => setEditingStudent(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Error message */}
      {syncError && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">{syncError}</p>
            <Button
              onClick={clearSyncError}
              variant="ghost"
              size="sm"
              className="ml-auto"
            >
              Dismiss
            </Button>
          </div>
        </Card>
      )}

      {/* Search and filters */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
            disabled={isLoading}
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={cn('h-4 w-4 transition-transform', showFilters && 'rotate-180')} />
          </Button>
        </div>

        {/* Filter options */}
        {showFilters && (
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Grade Level</label>
                <Select
                  value={gradeFilter?.toString() || 'all'}
                  onValueChange={(value) => setGradeFilter(value === 'all' ? null : Number(value))}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {uniqueGrades.map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Student Type</label>
                <Select
                  value={bucketFilter || 'all'}
                  onValueChange={(value) => setBucketFilter(value === 'all' ? null : value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                    <SelectItem value="PROSPECTIVE_TNT">Prospective TNT</SelectItem>
                    <SelectItem value="PROSPECTIVE_STUDENT">Prospective Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Data table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left font-medium">Student Name</th>
                <th className="p-4 text-left font-medium">Grade</th>
                <th className="p-4 text-left font-medium">Type</th>
                <th className="p-4 text-center font-medium">Math</th>
                <th className="p-4 text-center font-medium">Reading</th>
                <th className="p-4 text-center font-medium">Language</th>
                <th className="p-4 text-center font-medium">Science</th>
                <th className="p-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading students from database...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    {students.length === 0
                      ? 'No student data available. Click "Sync from Sheets" to import data.'
                      : 'No students match your search criteria.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleRowClick(student)}
                  >
                    <td className="p-4 font-medium">{student.name}</td>
                    <td className="p-4">{student.grade}</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                        student.bucket === 'TOURNAMENT' && "bg-[#251931] text-white",
                        student.bucket === 'PROSPECTIVE_TNT' && "bg-[#559A36] text-white", 
                        student.bucket === 'PROSPECTIVE_STUDENT' && "bg-gray-100 text-gray-700"
                      )}>
                        {student.bucket === 'TOURNAMENT' && 'Tournament'}
                        {student.bucket === 'PROSPECTIVE_TNT' && 'Prospective TNT'}
                        {student.bucket === 'PROSPECTIVE_STUDENT' && 'Prospective'}
                      </span>
                    </td>
                    <td className="p-4 text-center text-sm">
                      {student.scores.math ? (
                        <div>
                          <div className="font-medium">{student.scores.math.ritScore}</div>
                          <div className="text-muted-foreground">{student.scores.math.percentile}%</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-center text-sm">
                      {student.scores.reading ? (
                        <div>
                          <div className="font-medium">{student.scores.reading.ritScore}</div>
                          <div className="text-muted-foreground">{student.scores.reading.percentile}%</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-center text-sm">
                      {student.scores.language ? (
                        <div>
                          <div className="font-medium">{student.scores.language.ritScore}</div>
                          <div className="text-muted-foreground">{student.scores.language.percentile}%</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-center text-sm">
                      {student.scores.science ? (
                        <div>
                          <div className="font-medium">{student.scores.science.ritScore}</div>
                          <div className="text-muted-foreground">{student.scores.science.percentile}%</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEdit(e, student)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(e, student)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 