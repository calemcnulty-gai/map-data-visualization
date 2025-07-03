'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Download, 
  Calendar,
  User,
  FileImage,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

interface Visualization {
  id: string;
  studentName: string;
  subject: string;
  grade: number;
  fileName: string;
  fileSize?: number;
  ritScore: number;
  percentile: number;
  recommendedPackage: string;
  generatedBy: string;
  generatedAt: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export default function HistoryPage() {
  const router = useRouter();
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVisualizations();
  }, [searchQuery, selectedSubject]);

  const fetchVisualizations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('studentName', searchQuery);
      if (selectedSubject) params.append('subject', selectedSubject);
      params.append('limit', '20');

      const response = await fetch(`/api/visualizations?${params}`);
      const result = await response.json();

      if (result.success) {
        setVisualizations(result.data.visualizations);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to fetch visualizations:', result.error);
      }
    } catch (error) {
      console.error('Error fetching visualizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (visualization: Visualization) => {
    setDownloadingId(visualization.id);
    try {
      const response = await fetch(`/api/visualizations/${visualization.id}/download`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = visualization.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading visualization:', error);
      alert('Failed to download visualization');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    return mb > 1 ? `${mb.toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
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
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Visualization History</h1>
        </div>
      </div>

      {/* Search and filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All Subjects</option>
            <option value="math">Math</option>
            <option value="reading">Reading</option>
          </select>
        </div>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : visualizations.length === 0 ? (
        <Card className="p-12 text-center">
          <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">No visualizations found</p>
          <p className="text-muted-foreground">
            {searchQuery || selectedSubject
              ? 'Try adjusting your search criteria'
              : 'Generate your first visualization from the dashboard'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {visualizations.map((viz) => (
            <Card key={viz.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-lg">{viz.studentName}</h3>
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      Grade {viz.grade}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      viz.subject === 'math' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {viz.subject.charAt(0).toUpperCase() + viz.subject.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(viz.generatedAt), 'MMM d, yyyy h:mm a')}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {viz.generatedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileImage className="h-4 w-4" />
                      {formatFileSize(viz.fileSize)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">RIT Score:</span> {viz.ritScore} |{' '}
                    <span className="font-medium">Percentile:</span> {viz.percentile}% |{' '}
                    <span className="font-medium">Recommended:</span> {viz.recommendedPackage}
                  </div>
                </div>
                <Button
                  onClick={() => handleDownload(viz)}
                  disabled={downloadingId === viz.id}
                  size="sm"
                  className="gap-2"
                >
                  {downloadingId === viz.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}

          {/* Pagination info */}
          {pagination && pagination.total > visualizations.length && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Showing {visualizations.length} of {pagination.total} visualizations
            </div>
          )}
        </div>
      )}
    </div>
  );
} 