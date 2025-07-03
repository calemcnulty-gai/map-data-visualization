'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentStore } from '@/stores/student-store';
import { MapVisualization } from '@/components/visualizations/map-visualization';
import { VisualizationTemplateSelector } from '@/components/visualization-template-selector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  generatePngFromElement, 
  generateFilename 
} from '@/services/image-generation/png-generator';
import { DEFAULT_VISUALIZATION_CONFIG, VisualizationConfig, VisualizationTemplate } from '@/lib/types';
import { 
  ArrowLeft, 
  Loader2, 
  Package, 
  CheckCircle2,
  AlertCircle,
  FileArchive
} from 'lucide-react';
import {
  calculateHoursToGradeLevel,
  calculateHoursTo90thPercentile,
  getRecommendedPackage,
} from '@/lib/calculations/rit-improvement';

interface BatchProgress {
  total: number;
  completed: number;
  current: string;
  errors: Array<{ student: string; error: string }>;
}

export default function BatchVisualizePage() {
  const router = useRouter();
  const { selectedStudents, clearSelection } = useStudentStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<VisualizationConfig>(DEFAULT_VISUALIZATION_CONFIG);
  const [selectedSubject, setSelectedSubject] = useState<'math' | 'reading' | 'language' | 'science' | 'all'>('all');
  const [progress, setProgress] = useState<BatchProgress>({
    total: 0,
    completed: 0,
    current: '',
    errors: []
  });
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  
  const visualizationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Redirect if no students selected
    if (selectedStudents.length === 0) {
      router.push('/dashboard');
    }
  }, [selectedStudents, router]);

  const generateVisualizationForStudent = async (
    student: typeof selectedStudents[0], 
    subject: 'math' | 'reading' | 'language' | 'science'
  ): Promise<string | null> => {
    try {
      if (!student.scores[subject]) {
        throw new Error(`No ${subject} data available`);
      }

      // Create a temporary container for the visualization
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      document.body.appendChild(tempContainer);

      // Render the visualization
      const root = await import('react-dom/client').then(m => m.createRoot(tempContainer));
      await new Promise<void>(resolve => {
        root.render(
          <MapVisualization
            student={student}
            subject={subject}
            config={config}
            onRenderComplete={() => resolve()}
          />
        );
      });

      // Wait a bit for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find the visualization element
      const vizElement = tempContainer.querySelector('.map-visualization') as HTMLElement;
      if (!vizElement) {
        throw new Error('Visualization element not found');
      }

      // Generate PNG
      const blob = await generatePngFromElement({
        element: vizElement,
        scale: 2,
      });

      const filename = generateFilename(student.name, subject);
      
      // Convert blob to base64 for API
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Calculate metrics
      const score = student.scores[subject]!;
      const hoursToGradeLevel = calculateHoursToGradeLevel(
        score.ritScore,
        student.grade,
        subject
      );
      const hoursTo90th = calculateHoursTo90thPercentile(
        score.ritScore,
        score.percentile,
        student.grade,
        subject
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
          subject,
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

      const result = await response.json();
      
      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);
      
      return result.data.id;
    } catch (error) {
      console.error(`Error generating visualization for ${student.name} (${subject}):`, error);
      throw error;
    }
  };

  const handleBatchGenerate = async () => {
    setIsGenerating(true);
    setGeneratedFiles([]);
    
    const subjects: ('math' | 'reading' | 'language' | 'science')[] = 
      selectedSubject === 'all' 
        ? ['math', 'reading', 'language', 'science'].filter(s => 
            selectedStudents.some(student => student.scores[s as keyof typeof student.scores] !== undefined)
          ) as ('math' | 'reading' | 'language' | 'science')[]
        : [selectedSubject];
    
    const totalTasks = selectedStudents.length * subjects.length;
    
    setProgress({
      total: totalTasks,
      completed: 0,
      current: '',
      errors: []
    });

    const fileIds: string[] = [];
    
    for (const student of selectedStudents) {
      for (const subject of subjects) {
        setProgress(prev => ({
          ...prev,
          current: `Generating ${student.name} - ${subject}`
        }));

        try {
          const fileId = await generateVisualizationForStudent(student, subject);
          if (fileId) {
            fileIds.push(fileId);
          }
          
          setProgress(prev => ({
            ...prev,
            completed: prev.completed + 1
          }));
        } catch (error) {
          setProgress(prev => ({
            ...prev,
            completed: prev.completed + 1,
            errors: [...prev.errors, {
              student: `${student.name} (${subject})`,
              error: error instanceof Error ? error.message : 'Unknown error'
            }]
          }));
        }
      }
    }

    setGeneratedFiles(fileIds);
    setIsGenerating(false);
  };

  const handleTemplateChange = (template: VisualizationTemplate, templateConfig: Partial<VisualizationConfig>) => {
    setConfig({
      ...config,
      ...templateConfig,
      template,
    });
  };

  const handleDownloadAll = async () => {
    if (generatedFiles.length === 0) return;

    try {
      const response = await fetch('/api/visualizations/batch/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visualizationIds: generatedFiles
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to download batch');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visualizations_batch_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading batch:', error);
      alert('Failed to download visualizations. Please try again.');
    }
  };

  const progressPercentage = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;

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
          <h1 className="text-2xl font-bold">Batch Visualization Generation</h1>
        </div>
      </div>

      {/* Student Summary */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Selected Students</h2>
            <p className="text-sm text-muted-foreground">
              {selectedStudents.length} students selected for batch processing
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearSelection();
              router.push('/dashboard');
            }}
          >
            Change Selection
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
          {selectedStudents.map((student) => (
            <div key={student.id} className="text-sm p-2 bg-gray-50 rounded">
              {student.name}
            </div>
          ))}
        </div>
      </Card>

      {/* Configuration */}
      <div className="space-y-6 mb-6">
        {/* Template Selection */}
        <VisualizationTemplateSelector
          selectedTemplate={config.template}
          onTemplateChange={handleTemplateChange}
          disabled={isGenerating}
        />

        {/* Other Configuration Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Subject</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="all"
                  checked={selectedSubject === 'all'}
                  onChange={() => setSelectedSubject('all')}
                  disabled={isGenerating}
                />
                All Subjects
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="math"
                  checked={selectedSubject === 'math'}
                  onChange={() => setSelectedSubject('math')}
                  disabled={isGenerating}
                />
                Math Only
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="reading"
                  checked={selectedSubject === 'reading'}
                  onChange={() => setSelectedSubject('reading')}
                  disabled={isGenerating}
                />
                Reading Only
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="language"
                  checked={selectedSubject === 'language'}
                  onChange={() => setSelectedSubject('language')}
                  disabled={isGenerating}
                />
                Language Only
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="science"
                  checked={selectedSubject === 'science'}
                  onChange={() => setSelectedSubject('science')}
                  disabled={isGenerating}
                />
                Science Only
              </label>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Layout</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="portrait"
                  checked={config.layout === 'portrait'}
                  onChange={() => setConfig({ ...config, layout: 'portrait' })}
                  disabled={isGenerating}
                />
                Portrait (Email)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="landscape"
                  checked={config.layout === 'landscape'}
                  onChange={() => setConfig({ ...config, layout: 'landscape' })}
                  disabled={isGenerating}
                />
                Landscape (Print)
              </label>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Advanced Options</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={config.includeProjections}
                  onChange={(e) => setConfig({ ...config, includeProjections: e.target.checked })}
                  disabled={isGenerating}
                />
                Show Projections
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={config.includeGradeLevelTargets}
                  onChange={(e) => setConfig({ ...config, includeGradeLevelTargets: e.target.checked })}
                  disabled={isGenerating}
                />
                Show Grade Targets
              </label>
            </div>
          </Card>
        </div>
      </div>

      {/* Generation Progress */}
      {(isGenerating || progress.completed > 0) && (
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Generation Progress</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{progress.current || 'Preparing...'}</span>
                <span>{progress.completed} / {progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-nextgen-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {progress.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    {progress.errors.length} error{progress.errors.length !== 1 ? 's' : ''} occurred
                  </span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {progress.errors.map((error, index) => (
                    <li key={index}>
                      {error.student}: {error.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {progress.completed === progress.total && progress.total > 0 && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">
                    Batch generation complete! 
                    {progress.errors.length === 0 
                      ? ' All visualizations generated successfully.' 
                      : ` ${progress.total - progress.errors.length} visualizations generated successfully.`
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleBatchGenerate}
          disabled={isGenerating}
          className="gap-2 bg-nextgen-green hover:bg-nextgen-green/90"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Package className="h-4 w-4" />
              Generate Batch
            </>
          )}
        </Button>

        {generatedFiles.length > 0 && (
          <Button
            onClick={handleDownloadAll}
            variant="outline"
            className="gap-2"
          >
            <FileArchive className="h-4 w-4" />
            Download All as ZIP
          </Button>
        )}
      </div>

      {/* Hidden container for rendering */}
      <div ref={visualizationRef} style={{ display: 'none' }} />
    </div>
  );
} 