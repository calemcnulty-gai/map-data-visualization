/**
 * @fileoverview Form component for adding new students
 * @module components/forms/add-student-form
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useStudentStore } from '@/stores/student-store';
import { Student } from '@/lib/types';

export type StudentType = 'tournament' | 'prospective-tnt' | 'prospective-student';

interface AddStudentFormProps {
  student?: Student;
  onSuccess?: (studentId: string) => void;
  onCancel?: () => void;
}

export function AddStudentForm({ student, onSuccess, onCancel }: AddStudentFormProps) {
  const router = useRouter();
  const addStudent = useStudentStore((state) => state.addStudent);
  const updateStudent = useStudentStore((state) => state.updateStudent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    mathRitScore: '',
    readingRitScore: '',
    scienceRitScore: '',
    languageRitScore: '',
    studentType: '' as StudentType | '',
  });

  // Initialize form with student data if editing
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        grade: student.grade.toString(),
        mathRitScore: student.scores.math?.ritScore.toString() || '',
        readingRitScore: student.scores.reading?.ritScore.toString() || '',
        scienceRitScore: student.scores.science?.ritScore.toString() || '',
        languageRitScore: student.scores.language?.ritScore.toString() || '',
        studentType: mapBucketToStudentType(student.bucket),
      });
    }
  }, [student]);

  const mapBucketToStudentType = (bucket?: string): StudentType | '' => {
    switch (bucket) {
      case 'TOURNAMENT':
        return 'tournament';
      case 'PROSPECTIVE_TNT':
        return 'prospective-tnt';
      case 'PROSPECTIVE_STUDENT':
        return 'prospective-student';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!formData.name || !formData.grade) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Validate at least one subject has a RIT score
    const hasScores = 
      formData.mathRitScore ||
      formData.readingRitScore ||
      formData.scienceRitScore ||
      formData.languageRitScore;
    
    if (!hasScores) {
      setError('Please enter RIT score for at least one subject');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const url = student ? `/api/students/${student.id}` : '/api/students';
      const method = student ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          grade: parseInt(formData.grade),
          studentType: formData.studentType || undefined,
          scores: {
            math: formData.mathRitScore ? {
              ritScore: parseFloat(formData.mathRitScore),
              testDate: new Date(),
            } : undefined,
            reading: formData.readingRitScore ? {
              ritScore: parseFloat(formData.readingRitScore),
              testDate: new Date(),
            } : undefined,
            science: formData.scienceRitScore ? {
              ritScore: parseFloat(formData.scienceRitScore),
              testDate: new Date(),
            } : undefined,
            language: formData.languageRitScore ? {
              ritScore: parseFloat(formData.languageRitScore),
              testDate: new Date(),
            } : undefined,
          },
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || `Failed to ${student ? 'update' : 'add'} student`);
      }
      
      // Update the store with the new/updated student data
      if (student) {
        // Update existing student in store
        updateStudent(student.id, result.data);
      } else {
        // Add new student to store
        addStudent(result.data);
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result.data.id);
      } else if (!student) {
        // Only navigate to visualization for new students
        router.push(`/dashboard/visualize/${result.data.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      
      {/* Student Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Student Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter student name"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="grade">Grade Level *</Label>
            <Input
              id="grade"
              type="number"
              min="1"
              max="12"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              placeholder="1-12"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="studentType">Student Type</Label>
            <Select
              value={formData.studentType}
              onValueChange={(value: StudentType) => setFormData({ ...formData, studentType: value })}
            >
              <SelectTrigger id="studentType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tournament">Tournament</SelectItem>
                <SelectItem value="prospective-tnt">Prospective TNT</SelectItem>
                <SelectItem value="prospective-student">Prospective Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Subject Scores */}
      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground">
          Subject Scores (enter at least one)
        </h3>
        
        {/* Math */}
        <div>
          <Label htmlFor="mathRitScore">Math RIT Score</Label>
          <Input
            id="mathRitScore"
            type="number"
            placeholder="Enter RIT Score"
            value={formData.mathRitScore}
            onChange={(e) => setFormData({ ...formData, mathRitScore: e.target.value })}
          />
        </div>
        
        {/* Reading */}
        <div>
          <Label htmlFor="readingRitScore">Reading RIT Score</Label>
          <Input
            id="readingRitScore"
            type="number"
            placeholder="Enter RIT Score"
            value={formData.readingRitScore}
            onChange={(e) => setFormData({ ...formData, readingRitScore: e.target.value })}
          />
        </div>
        
        {/* Science */}
        <div>
          <Label htmlFor="scienceRitScore">Science RIT Score</Label>
          <Input
            id="scienceRitScore"
            type="number"
            placeholder="Enter RIT Score"
            value={formData.scienceRitScore}
            onChange={(e) => setFormData({ ...formData, scienceRitScore: e.target.value })}
          />
        </div>
        
        {/* Language */}
        <div>
          <Label htmlFor="languageRitScore">Language RIT Score</Label>
          <Input
            id="languageRitScore"
            type="number"
            placeholder="Enter RIT Score"
            value={formData.languageRitScore}
            onChange={(e) => setFormData({ ...formData, languageRitScore: e.target.value })}
          />
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-nextgen-green hover:bg-nextgen-green/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {student ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            student ? 'Update Student' : 'Save & Generate Visualization'
          )}
        </Button>
      </div>
    </form>
  );
} 