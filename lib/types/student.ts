/**
 * @fileoverview TypeScript interfaces for student data and MAP test scores
 * @module lib/types/student
 */

/** Represents a student's MAP test results */
export interface Student {
  id: string;
  name: string;
  grade: number;
  age?: number;
  scores: SubjectScores;
  lastUpdated: Date;
}

/** Subject-specific test scores */
export interface SubjectScores {
  math?: MapScore;
  reading?: MapScore;
  language?: MapScore;
  science?: MapScore;
}

/** Individual MAP test score data */
export interface MapScore {
  ritScore: number;
  percentile: number;
  gradeEquivalent?: number;
  testDate: Date;
  growthProjection?: number;
}

/** Tutoring package options */
export type TutoringPackage = '10-hour' | '20-hour' | '40-hour';

/** Improvement projection for a specific tutoring package */
export interface ImprovementProjection {
  package: TutoringPackage;
  projectedRitScore: number;
  projectedPercentile: number;
  projectedGradeEquivalent: number;
  improvementPoints: number;
}

/** Student with calculated projections */
export interface StudentWithProjections extends Student {
  projections: {
    math?: ImprovementProjection[];
    reading?: ImprovementProjection[];
    science?: ImprovementProjection[];
  };
  recommendations: {
    math?: {
      hoursToGradeLevel: number;
      hoursTo90thPercentile: number;
      recommendedPackage: TutoringPackage;
    };
    reading?: {
      hoursToGradeLevel: number;
      hoursTo90thPercentile: number;
      recommendedPackage: TutoringPackage;
    };
    science?: {
      hoursToGradeLevel: number;
      hoursTo90thPercentile: number;
      recommendedPackage: TutoringPackage;
    };
  };
}

/** Raw data from Google Sheets */
export interface SheetRow {
  studentName: string;
  grade: string;
  age?: string;
  mathRitScore?: string;
  mathPercentile?: string;
  mathTestDate?: string;
  readingRitScore?: string;
  readingPercentile?: string;
  readingTestDate?: string;
  [key: string]: string | undefined;
} 