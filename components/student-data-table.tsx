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
  Search, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2,
  ChevronDown,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentDataTableProps {
  onGenerateVisualization: () => void;
}

export function StudentDataTable({ onGenerateVisualization }: StudentDataTableProps) {
  const {
    students,
    selectedStudents,
    isLoading: _isLoading,
    isSyncing,
    lastSyncTime,
    syncError,
    searchQuery,
    gradeFilter,
    subjectFilter,
    syncStudents,
    clearSyncError,
    selectStudent,
    deselectStudent,
    clearSelection,
    setSearchQuery,
    setGradeFilter,
    setSubjectFilter,
    getFilteredStudents,
    getSelectedIds,
  } = useStudentStore();

  const [showFilters, setShowFilters] = useState(false);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  
  const SELECTION_LIMIT = 50;
  
  const filteredStudents = useMemo(() => getFilteredStudents(), [
    students,
    searchQuery,
    gradeFilter,
    subjectFilter,
    getFilteredStudents,
  ]);

  const selectedIds = useMemo(() => getSelectedIds(), [selectedStudents, getSelectedIds]);

  const uniqueGrades = useMemo(() => {
    const grades = new Set(students.map((s) => s.grade));
    return Array.from(grades).sort((a, b) => a - b);
  }, [students]);

  const handleStudentToggle = (student: Student) => {
    if (selectedIds.includes(student.id)) {
      deselectStudent(student.id);
      setSelectionError(null);
    } else {
      if (selectedIds.length >= SELECTION_LIMIT) {
        setSelectionError(`Maximum ${SELECTION_LIMIT} students can be selected at once`);
        return;
      }
      selectStudent(student);
      setSelectionError(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      clearSelection();
      setSelectionError(null);
    } else {
      const studentsToSelect = filteredStudents.slice(0, SELECTION_LIMIT);
      useStudentStore.getState().selectMultiple(studentsToSelect);
      if (filteredStudents.length > SELECTION_LIMIT) {
        setSelectionError(`Only first ${SELECTION_LIMIT} students selected due to limit`);
      } else {
        setSelectionError(null);
      }
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

  return (
    <div className="space-y-4">
      {/* Header with sync status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Student Data</h2>
          <div className="text-sm text-muted-foreground">
            {students.length} students • Last synced: {formatLastSync()}
          </div>
        </div>
        <Button
          onClick={syncStudents}
          disabled={isSyncing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', isSyncing && 'animate-spin')} />
          {isSyncing ? 'Syncing...' : 'Refresh Data'}
        </Button>
      </div>

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
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
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
                <select
                  value={gradeFilter || ''}
                  onChange={(e) => setGradeFilter(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">All Grades</option>
                  {uniqueGrades.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="all">All Subjects</option>
                  <option value="math">Math Only</option>
                  <option value="reading">Reading Only</option>
                  <option value="language">Language Only</option>
                  <option value="science">Science Only</option>
                </select>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Selection summary */}
      {selectedIds.length > 0 && (
        <Card className="p-4 bg-nextgen-green/10 border-nextgen-green/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-nextgen-green" />
                <span className="text-sm font-medium">
                  {selectedIds.length} student{selectedIds.length !== 1 ? 's' : ''} selected
                </span>
                {selectedIds.length >= SELECTION_LIMIT && (
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    Max limit reached
                  </span>
                )}
              </div>
              {selectionError && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  {selectionError}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  clearSelection();
                  setSelectionError(null);
                }}
              >
                Clear Selection
              </Button>
              <Button 
                onClick={onGenerateVisualization}
                size="sm"
                className="bg-nextgen-green hover:bg-nextgen-green/90"
              >
                {selectedIds.length > 1 ? 'Generate Batch' : 'Generate Visualization'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Data table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="p-4 text-left font-medium">Student Name</th>
                <th className="p-4 text-left font-medium">Grade</th>
                <th className="p-4 text-center font-medium">Math</th>
                <th className="p-4 text-center font-medium">Reading</th>
                <th className="p-4 text-center font-medium">Language</th>
                <th className="p-4 text-center font-medium">Science</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    {students.length === 0
                      ? 'No student data available. Click "Refresh Data" to sync from Google Sheets.'
                      : 'No students match your search criteria.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className={cn(
                      'border-b hover:bg-muted/50 cursor-pointer',
                      selectedIds.includes(student.id) && 'bg-nextgen-green/5'
                    )}
                    onClick={() => handleStudentToggle(student)}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(student.id)}
                        onChange={() => handleStudentToggle(student)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4 font-medium">{student.name}</td>
                    <td className="p-4">{student.grade}</td>
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