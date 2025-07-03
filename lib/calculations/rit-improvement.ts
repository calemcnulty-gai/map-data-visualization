/**
 * @fileoverview Calculations for RIT score improvements based on tutoring hours
 * @module lib/calculations/rit-improvement
 */

import { TutoringPackage } from '@/lib/types';
import { RIT_TO_R50 } from './lookup-tables';
import { getPercentileFromRIT, getRITFromPercentile } from './percentile-calculator';

// Based on the RIT Score Calculations document
const HOURS_PER_PACKAGE: Record<TutoringPackage, number> = {
  '10-hour': 10,
  '20-hour': 20,
  '40-hour': 40,
};

// Grade level improvements based on hours
// const GRADE_IMPROVEMENT_PER_HOURS: Record<number, number> = {
//   10: 0.2,
//   20: 0.5,
//   40: 1.0,
// };

/**
 * Get R50 value for a given RIT score
 * @param {number} ritScore - RIT score
 * @returns {number} R50 value
 */
function getR50(ritScore: number): number {
  // If exact match exists, return it
  if (RIT_TO_R50[ritScore]) {
    return RIT_TO_R50[ritScore];
  }
  
  // Otherwise, interpolate between nearest values
  const scores = Object.keys(RIT_TO_R50).map(Number).sort((a, b) => a - b);
  
  // Find the two nearest scores
  let lowerScore = scores[0];
  let upperScore = scores[scores.length - 1];
  
  for (let i = 0; i < scores.length - 1; i++) {
    if (scores[i] <= ritScore && scores[i + 1] >= ritScore) {
      lowerScore = scores[i];
      upperScore = scores[i + 1];
      break;
    }
  }
  
  // Linear interpolation
  if (lowerScore === upperScore) {
    return RIT_TO_R50[lowerScore];
  }
  
  const lowerR50 = RIT_TO_R50[lowerScore];
  const upperR50 = RIT_TO_R50[upperScore];
  const ratio = (ritScore - lowerScore) / (upperScore - lowerScore);
  
  return lowerR50 + (upperR50 - lowerR50) * ratio;
}

/**
 * Get RIT score for a given percentile and grade
 * @param {number} percentile - Target percentile
 * @param {number} grade - Grade level
 * @returns {number} RIT score
 */
export function getRITForPercentile(percentile: number, grade: number): number {
  return getRITFromPercentile(percentile, grade);
}

/**
 * Calculate hours needed based on R50 improvement
 * @param {number} improvement - R50 improvement needed
 * @returns {number} Hours needed
 */
function calculateHoursFromImprovement(improvement: number): number {
  if (improvement <= 0) {
    return 0;
  }
  
  // Based on the pattern from the document:
  // 10 hours = 0.2 grade improvement
  // 20 hours = 0.5 grade improvement  
  // 40 hours = 1.0 grade improvement
  
  if (improvement <= 0.2) {
    // Linear: 50 hours per grade level
    return improvement * 50;
  } else if (improvement <= 0.5) {
    // 10 hours for first 0.2, then ~33.33 hours per grade level
    return 10 + (improvement - 0.2) * 33.33;
  } else if (improvement <= 1.0) {
    // 20 hours for first 0.5, then 40 hours per grade level
    return 20 + (improvement - 0.5) * 40;
  } else {
    // Beyond 1.0, assume 40 hours per grade level
    return improvement * 40;
  }
}

/**
 * Calculate projected RIT score improvement
 * @param {number} currentScore - Student's current RIT score
 * @param {number} tutoringHours - Number of tutoring hours
 * @param {string} subject - Academic subject
 * @returns {number} Projected new RIT score
 */
export function calculateRitImprovement(
  currentScore: number,
  tutoringHours: number,
  _subject: 'math' | 'reading' | 'language' | 'science'
): number {
  // Get current R50
  // const currentR50 = getR50(currentScore);
  
  // Calculate grade level improvement based on hours
  let gradeImprovement = 0;
  if (tutoringHours <= 10) {
    gradeImprovement = (tutoringHours / 10) * 0.2;
  } else if (tutoringHours <= 20) {
    gradeImprovement = 0.2 + ((tutoringHours - 10) / 10) * 0.3;
  } else if (tutoringHours <= 40) {
    gradeImprovement = 0.5 + ((tutoringHours - 20) / 20) * 0.5;
  } else {
    gradeImprovement = 1.0 + ((tutoringHours - 40) / 40);
  }
  
  // New R50
  // const newR50 = currentR50 + gradeImprovement;
  
  // Convert back to RIT score (this would need the reverse lookup table)
  // For now, approximate: 1 grade level ≈ 10-12 RIT points
  const ritImprovement = gradeImprovement * 11;
  
  return Math.round(currentScore + ritImprovement);
}

/**
 * Calculate hours needed to reach grade level
 * @param {number} currentScore - Student's current RIT score
 * @param {number} grade - Student's grade level
 * @param {string} subject - Academic subject
 * @returns {number} Hours needed to reach grade level
 */
export function calculateHoursToGradeLevel(
  currentScore: number,
  grade: number,
  _subject: 'math' | 'reading' | 'language' | 'science'
): number {
  // Get grade level RIT score (50th percentile)
  const targetScore = getRITForPercentile(50, grade);
  
  if (currentScore >= targetScore) {
    return 0; // Already at or above grade level
  }
  
  // Get R50 values
  const currentR50 = getR50(currentScore);
  const targetR50 = getR50(targetScore);
  const improvement = targetR50 - currentR50;
  
  return Math.round(calculateHoursFromImprovement(improvement));
}

/**
 * Calculate hours needed to reach 90th percentile
 * @param {number} currentScore - Student's current RIT score
 * @param {number} currentPercentile - Student's current percentile
 * @param {number} grade - Student's grade level
 * @param {string} subject - Academic subject
 * @returns {number} Hours needed to reach 90th percentile
 */
export function calculateHoursTo90thPercentile(
  currentScore: number,
  currentPercentile: number,
  grade: number,
  _subject: 'math' | 'reading' | 'language' | 'science'
): number {
  if (currentPercentile >= 90) {
    return 0; // Already at or above 90th percentile
  }
  
  // Get target RIT score for 90th percentile
  const targetScore = getRITForPercentile(90, grade);
  
  if (currentScore >= targetScore) {
    return 0;
  }
  
  // Get R50 values
  const currentR50 = getR50(currentScore);
  const targetR50 = getR50(targetScore);
  const improvement = targetR50 - currentR50;
  
  return Math.round(calculateHoursFromImprovement(improvement));
}

/**
 * Get grade level RIT score target
 * @param {number} grade - Grade level
 * @param {string} subject - Academic subject
 * @returns {number} Target RIT score for grade level
 */
export function getGradeLevelRitScore(grade: number, _subject: 'math' | 'reading' | 'language' | 'science'): number {
  return getRITForPercentile(50, grade);
}

/**
 * Get 90th percentile RIT score for a grade level
 * @param {number} grade - Grade level
 * @param {string} subject - Academic subject
 * @returns {number} 90th percentile RIT score
 */
export function get90thPercentileRitScore(grade: number, _subject: 'math' | 'reading' | 'language' | 'science'): number {
  return getRITForPercentile(90, grade);
}

/**
 * Convert RIT score improvement to percentile change
 * @param {number} currentScore - Current RIT score
 * @param {number} newScore - New RIT score
 * @param {number} currentPercentile - Current percentile
 * @param {number} grade - Student's grade level
 * @returns {number} Estimated new percentile
 */
export function estimateNewPercentile(
  currentScore: number,
  newScore: number,
  currentPercentile: number,
  grade?: number
): number {
  // If we have the grade, use the accurate lookup
  if (grade !== undefined) {
    return getPercentileFromRIT(newScore, grade);
  }
  
  // Otherwise use the old approximation for backward compatibility
  const scoreDiff = newScore - currentScore;
  
  // Rough approximation: 1 RIT point ≈ 1.5 percentile points
  // This varies significantly based on where you are in the distribution
  let percentileChange = scoreDiff * 1.5;
  
  // Adjust for diminishing returns at higher percentiles
  if (currentPercentile > 70) {
    percentileChange *= 0.8;
  }
  if (currentPercentile > 85) {
    percentileChange *= 0.6;
  }
  
  const newPercentile = currentPercentile + percentileChange;
  
  // Ensure percentile stays within valid range
  return Math.max(1, Math.min(99, Math.round(newPercentile)));
}

/**
 * Get recommended tutoring package based on goals
 * @param {number} hoursToGradeLevel - Hours needed to reach grade level
 * @param {number} hoursTo90th - Hours needed to reach 90th percentile
 * @returns {TutoringPackage} Recommended package
 */
export function getRecommendedPackage(
  hoursToGradeLevel: number,
  hoursTo90th: number
): TutoringPackage {
  // If student is already at grade level, focus on 90th percentile goal
  const targetHours = hoursToGradeLevel > 0 ? hoursToGradeLevel : hoursTo90th;
  
  if (targetHours <= 15) {
    return '10-hour';
  } else if (targetHours <= 30) {
    return '20-hour';
  } else {
    return '40-hour';
  }
}

/**
 * Get effective grade level from RIT score
 * @param {number} ritScore - Student's RIT score
 * @returns {number} Effective grade level (R50 value)
 */
export function getEffectiveGradeLevel(ritScore: number): number {
  const r50 = getR50(ritScore);
  // Round to 1 decimal place
  return Math.round(r50 * 10) / 10;
}

/**
 * Calculate all improvement projections for a student
 * @param {number} currentScore - Current RIT score
 * @param {number} currentPercentile - Current percentile
 * @param {string} subject - Academic subject
 * @param {number} grade - Student's grade level
 * @returns {Array} Array of projections for each package
 */
export function calculateAllProjections(
  currentScore: number,
  currentPercentile: number,
  subject: 'math' | 'reading' | 'language' | 'science',
  grade?: number
) {
  return Object.entries(HOURS_PER_PACKAGE).map(([packageName, hours]) => {
    const projectedScore = calculateRitImprovement(currentScore, hours, subject);
    const projectedPercentile = estimateNewPercentile(currentScore, projectedScore, currentPercentile, grade);
    
    return {
      package: packageName as TutoringPackage,
      hours,
      projectedRitScore: projectedScore,
      projectedPercentile,
      improvementPoints: projectedScore - currentScore,
    };
  });
} 