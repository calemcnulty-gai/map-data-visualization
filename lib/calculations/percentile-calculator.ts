/**
 * @fileoverview Calculate percentile from RIT score and grade using lookup tables
 * @module lib/calculations/percentile-calculator
 */

import { PERCENTILE_LOOKUP_FULL } from './lookup-tables';

/**
 * Get percentile for a given RIT score and grade
 * Uses binary search to find the percentile that corresponds to the RIT score
 * @param {number} ritScore - Student's RIT score
 * @param {number} grade - Student's grade level (0-12, where 0 is kindergarten)
 * @returns {number} Percentile (1-99)
 */
export function getPercentileFromRIT(ritScore: number, grade: number): number {
  // Ensure grade is within valid range
  const validGrade = Math.max(0, Math.min(12, Math.round(grade)));
  
  // Get all percentiles for this grade
  const percentiles: Array<[number, number]> = [];
  for (let p = 1; p <= 99; p++) {
    if (PERCENTILE_LOOKUP_FULL[p] && PERCENTILE_LOOKUP_FULL[p][validGrade] !== undefined) {
      percentiles.push([p, PERCENTILE_LOOKUP_FULL[p][validGrade]]);
    }
  }
  
  // If RIT score is below 1st percentile, return 1
  if (ritScore <= percentiles[0][1]) {
    return 1;
  }
  
  // If RIT score is above 99th percentile, return 99
  if (ritScore >= percentiles[percentiles.length - 1][1]) {
    return 99;
  }
  
  // Binary search to find the appropriate percentile
  let left = 0;
  let right = percentiles.length - 1;
  
  while (left < right - 1) {
    const mid = Math.floor((left + right) / 2);
    if (percentiles[mid][1] === ritScore) {
      return percentiles[mid][0];
    } else if (percentiles[mid][1] < ritScore) {
      left = mid;
    } else {
      right = mid;
    }
  }
  
  // Interpolate between the two nearest percentiles
  const [lowerPerc, lowerRIT] = percentiles[left];
  const [upperPerc, upperRIT] = percentiles[right];
  
  // Linear interpolation
  const ratio = (ritScore - lowerRIT) / (upperRIT - lowerRIT);
  const percentile = lowerPerc + (upperPerc - lowerPerc) * ratio;
  
  return Math.round(percentile);
}

/**
 * Get RIT score for a given percentile and grade
 * @param {number} percentile - Target percentile (1-99)
 * @param {number} grade - Grade level (0-12)
 * @returns {number} RIT score
 */
export function getRITFromPercentile(percentile: number, grade: number): number {
  // Ensure inputs are within valid ranges
  const validPercentile = Math.max(1, Math.min(99, Math.round(percentile)));
  const validGrade = Math.max(0, Math.min(12, Math.round(grade)));
  
  // Check if we have an exact match
  if (PERCENTILE_LOOKUP_FULL[validPercentile] && PERCENTILE_LOOKUP_FULL[validPercentile][validGrade] !== undefined) {
    return PERCENTILE_LOOKUP_FULL[validPercentile][validGrade];
  }
  
  // Find the nearest percentiles we have data for
  let lowerPerc = validPercentile;
  let upperPerc = validPercentile;
  
  // Find lower percentile
  while (lowerPerc > 1 && (!PERCENTILE_LOOKUP_FULL[lowerPerc] || PERCENTILE_LOOKUP_FULL[lowerPerc][validGrade] === undefined)) {
    lowerPerc--;
  }
  
  // Find upper percentile
  while (upperPerc < 99 && (!PERCENTILE_LOOKUP_FULL[upperPerc] || PERCENTILE_LOOKUP_FULL[upperPerc][validGrade] === undefined)) {
    upperPerc++;
  }
  
  // If we only found one, return it
  if (lowerPerc === upperPerc) {
    return PERCENTILE_LOOKUP_FULL[lowerPerc][validGrade];
  }
  
  // Interpolate between the two
  const lowerRIT = PERCENTILE_LOOKUP_FULL[lowerPerc][validGrade];
  const upperRIT = PERCENTILE_LOOKUP_FULL[upperPerc][validGrade];
  
  const ratio = (validPercentile - lowerPerc) / (upperPerc - lowerPerc);
  const ritScore = lowerRIT + (upperRIT - lowerRIT) * ratio;
  
  return Math.round(ritScore);
} 