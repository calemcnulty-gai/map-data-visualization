'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStudentStore } from '@/stores/student-store';
import { MapVisualization } from '@/components/visualizations/map-visualization';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  generatePngFromElement, 
  downloadBlob, 
  generateFilename 
} from '@/services/image-generation/png-generator';
import { DEFAULT_VISUALIZATION_CONFIG, VisualizationConfig } from '@/lib/types';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import {
  calculateHoursToGradeLevel,
  calculateHoursTo90thPercentile,
  getRecommendedPackage,
} from '@/lib/calculations/rit-improvement';

export default function VisualizePage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;
  
  const { students, selectedStudents, syncStudentsFromSheets, selectStudent } = useStudentStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<VisualizationConfig>(DEFAULT_VISUALIZATION_CONFIG);
  const [selectedSubject, setSelectedSubject] = useState<'math' | 'reading' | 'language' | 'science'>('math');
  const visualizationRef = useRef<HTMLDivElement>(null);

  // Find the student from store or selected students
  const student = students.find(s => s.id === studentId) || 
                  selectedStudents.find(s => s.id === studentId);

  useEffect(() => {
    const loadStudent = async () => {
      // If we don't have the student data, try to sync from sheets
      if (!student && students.length === 0) {
        try {
          await syncStudentsFromSheets();
        } catch (error) {
          console.error('Failed to sync students:', error);
        }
      }
      
      // If we have the student but it's not selected, select it
      if (student && !selectedStudents.find(s => s.id === studentId)) {
        selectStudent(student);
      }
      
      setIsLoading(false);
    };

    loadStudent();
  }, [studentId, student, students.length, syncStudentsFromSheets, selectStudent, selectedStudents]);

  // Redirect if student not found after loading
  useEffect(() => {
    if (!isLoading && !student) {
      router.push('/dashboard');
    }
  }, [isLoading, student, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Return null while redirecting
  if (!student) {
    return null;
  }

  const hasSubjectData = student.scores[selectedSubject] !== undefined;
  const hasAnyData = student.scores.math !== undefined || 
                     student.scores.reading !== undefined ||
                     student.scores.language !== undefined ||
                     student.scores.science !== undefined;

  const handleDownload = async () => {
    if (!visualizationRef.current) return;

    setIsGenerating(true);
    try {
      // Find the visualization element within the ref
      const vizElement = visualizationRef.current.querySelector('.map-visualization') as HTMLElement;
      if (!vizElement) {
        throw new Error('Visualization element not found');
      }

      const blob = await generatePngFromElement({
        element: vizElement,
        scale: 2, // High quality
      });

      const filename = generateFilename(student.name, selectedSubject);
      
      // Convert blob to base64 for API
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Calculate metrics
      const score = student.scores[selectedSubject]!;
      const hoursToGradeLevel = calculateHoursToGradeLevel(
        score.ritScore,
        student.grade,
        selectedSubject
      );
      const hoursTo90th = calculateHoursTo90thPercentile(
        score.ritScore,
        score.percentile,
        student.grade,
        selectedSubject
      );
      const recommendedPackage = getRecommendedPackage(hoursToGradeLevel, hoursTo90th);

      // Save to server
      const response = await fetch('/api/visualizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.id,
          studentName: student.name,
          subject: selectedSubject,
          grade: student.grade,
          config,
          ritScore: score.ritScore,
          percentile: score.percentile,
          hoursToGradeLevel,
          hoursTo90th,
          recommendedPackage,
          imageData: base64Data,
          fileName: filename,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save visualization');
      }

      // Download the file
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Failed to generate visualization. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubjectChange = (subject: 'math' | 'reading' | 'language' | 'science') => {
    setSelectedSubject(subject);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </Button>
          <h1 className="text-2xl font-bold">Generate Visualization</h1>
        </div>
      </div>

      {/* Visualization Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="flex items-center gap-3">
            {hasAnyData && (
              <Select
                value={selectedSubject}
                onValueChange={(value) => handleSubjectChange(value as 'math' | 'reading' | 'language' | 'science')}
                disabled={isGenerating}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {student.scores.math && (
                    <SelectItem value="math">Math</SelectItem>
                  )}
                  {student.scores.reading && (
                    <SelectItem value="reading">Reading</SelectItem>
                  )}
                  {student.scores.language && (
                    <SelectItem value="language">Language</SelectItem>
                  )}
                  {student.scores.science && (
                    <SelectItem value="science">Science</SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
            {hasSubjectData && (
              <Button
                onClick={handleDownload}
                disabled={!hasSubjectData || isGenerating}
                className="gap-2 bg-nextgen-green hover:bg-nextgen-green/90"
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PNG
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        {hasSubjectData ? (
          <div 
            ref={visualizationRef} 
            className="flex justify-center"
          >
            <MapVisualization
              student={student}
              subject={selectedSubject}
              config={config}
            />
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No {selectedSubject} data available for this student
          </div>
        )}
      </Card>
    </div>
  );
} 