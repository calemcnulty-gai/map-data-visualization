/**
 * @fileoverview TypeScript interfaces for visualization configuration and data
 * @module lib/types/visualization
 */

import { Student, TutoringPackage } from './student';

/** Available visualization templates */
export type VisualizationTemplate = 
  | 'performance-overview'    // Default - shows current performance and all projections
  | 'improvement-focus'       // Emphasizes improvement potential
  | 'comparative-analysis';   // Compares packages side-by-side

/** Template-specific configuration */
export interface TemplateConfig {
  id: VisualizationTemplate;
  name: string;
  description: string;
  defaultConfig: Partial<VisualizationConfig>;
  features: {
    showCurrentPerformance: boolean;
    showProjections: boolean;
    showPeerComparison: boolean;
    showGradeTargets: boolean;
    show90thTargets: boolean;
    emphasizeImprovement: boolean;
    comparePackages: boolean;
  };
}

/** Configuration for visualization generation */
export interface VisualizationConfig {
  template: VisualizationTemplate;
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
  subject: 'math' | 'reading' | 'both';
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
  subject: 'math' | 'reading' | 'both';
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
  subject: 'math' | 'reading';
  imageData: string; // Base64 encoded PNG
  metadata: VisualizationMetadata;
  downloadUrl: string;
}

/** Chart data structure for D3.js */
export interface ChartData {
  student: Student;
  subject: 'math' | 'reading';
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
  template: 'performance-overview',
  includeProjections: true,
  packages: ['10-hour', '20-hour', '40-hour'],
  colorScheme: 'default',
  layout: 'portrait',
  includeCurrentPerformance: true,
  includePeerComparison: true,
  includeGradeLevelTargets: true,
  include90thPercentileTargets: true,
};

/** Visualization template definitions */
export const VISUALIZATION_TEMPLATES: Record<VisualizationTemplate, TemplateConfig> = {
  'performance-overview': {
    id: 'performance-overview',
    name: 'Performance Overview',
    description: 'Complete view of current performance and improvement projections',
    defaultConfig: {
      includeProjections: true,
      packages: ['10-hour', '20-hour', '40-hour'],
      includeCurrentPerformance: true,
      includePeerComparison: true,
      includeGradeLevelTargets: true,
      include90thPercentileTargets: true,
    },
    features: {
      showCurrentPerformance: true,
      showProjections: true,
      showPeerComparison: true,
      showGradeTargets: true,
      show90thTargets: true,
      emphasizeImprovement: false,
      comparePackages: false,
    },
  },
  'improvement-focus': {
    id: 'improvement-focus',
    name: 'Improvement Focus',
    description: 'Emphasizes potential improvement with tutoring packages',
    defaultConfig: {
      includeProjections: true,
      packages: ['10-hour', '20-hour', '40-hour'],
      includeCurrentPerformance: true,
      includePeerComparison: false,
      includeGradeLevelTargets: true,
      include90thPercentileTargets: true,
    },
    features: {
      showCurrentPerformance: true,
      showProjections: true,
      showPeerComparison: false,
      showGradeTargets: true,
      show90thTargets: true,
      emphasizeImprovement: true,
      comparePackages: false,
    },
  },
  'comparative-analysis': {
    id: 'comparative-analysis',
    name: 'Package Comparison',
    description: 'Side-by-side comparison of tutoring package outcomes',
    defaultConfig: {
      includeProjections: true,
      packages: ['10-hour', '20-hour', '40-hour'],
      includeCurrentPerformance: true,
      includePeerComparison: false,
      includeGradeLevelTargets: false,
      include90thPercentileTargets: false,
    },
    features: {
      showCurrentPerformance: true,
      showProjections: true,
      showPeerComparison: false,
      showGradeTargets: false,
      show90thTargets: false,
      emphasizeImprovement: false,
      comparePackages: true,
    },
  },
}; 