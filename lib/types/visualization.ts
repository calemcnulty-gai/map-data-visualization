/**
 * @fileoverview TypeScript interfaces for visualization configuration and data
 * @module lib/types/visualization
 */

import { Student, TutoringPackage } from './student';

/** Configuration for visualization generation */
export interface VisualizationConfig {
  includeProjections: boolean;
  packages: TutoringPackage[];
  colorScheme: 'default' | 'high-contrast';
  layout: 'portrait' | 'landscape';
  includeCurrentPerformance: boolean;
  includePeerComparison: boolean;
  includeGradeLevelTargets: boolean;
  include90thPercentileTargets: boolean;
  customMessage?: string;
}

/** Visualization metadata */
export interface VisualizationMetadata {
  id: string;
  studentId: string;
  studentName: string;
  subject: 'math' | 'reading' | 'language' | 'science' | 'all';
  generatedAt: Date;
  generatedBy: string;
  config: VisualizationConfig;
  fileSize?: number;
  fileName: string;
}

/** Visualization generation request */
export interface VisualizationRequest {
  studentIds: string[];
  config: VisualizationConfig;
  subject: 'math' | 'reading' | 'language' | 'science' | 'all';
}

/** Visualization generation response */
export interface VisualizationResponse {
  success: boolean;
  visualizations?: GeneratedVisualization[];
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Generated visualization data */
export interface GeneratedVisualization {
  id: string;
  studentName: string;
  subject: 'math' | 'reading' | 'language' | 'science';
  imageData: string; // Base64 encoded PNG
  metadata: VisualizationMetadata;
  downloadUrl: string;
}

/** Chart data structure for D3.js */
export interface ChartData {
  student: Student;
  subject: 'math' | 'reading' | 'language' | 'science';
  currentScore: number;
  currentPercentile: number;
  gradeLevel: number;
  projections: ProjectionDataPoint[];
  peerComparison: PeerComparisonData;
  targets: TargetData;
}

/** Data point for improvement projections */
export interface ProjectionDataPoint {
  package: TutoringPackage;
  hours: number;
  projectedScore: number;
  improvement: number;
  percentile: number;
}

/** Peer comparison data */
export interface PeerComparisonData {
  nationalAverage: number;
  gradeAverage: number;
  percentileRanges: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

/** Target achievement data */
export interface TargetData {
  gradeLevelScore: number;
  hoursToGradeLevel: number;
  ninetiethPercentileScore: number;
  hoursTo90thPercentile: number;
}

/** Default visualization configuration */
export const DEFAULT_VISUALIZATION_CONFIG: VisualizationConfig = {
  includeProjections: true,
  packages: ['10-hour', '20-hour', '40-hour'],
  colorScheme: 'default',
  layout: 'portrait',
  includeCurrentPerformance: true,
  includePeerComparison: true,
  includeGradeLevelTargets: true,
  include90thPercentileTargets: true,
}; 