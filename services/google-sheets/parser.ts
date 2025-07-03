/**
 * @fileoverview Parser for converting Google Sheets data to Student type
 * @module services/google-sheets/parser
 */

import { SheetRow, Student, MapScore } from '@/lib/types';
import { generateId } from '@/lib/utils';

/**
 * Parse a date string from various formats
 * @param {string} dateStr - Date string to parse
 * @returns {Date} Parsed date or current date if invalid
 */
function parseDate(dateStr?: string): Date {
  if (!dateStr) return new Date();
  
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Parse a number from string, handling various formats
 * @param {string} value - String value to parse
 * @returns {number | undefined} Parsed number or undefined
 */
function parseNumber(value?: string): number | undefined {
  if (!value) return undefined;
  
  // Remove any non-numeric characters except decimal point and negative sign
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Parse grade level from string (handles formats like "5", "5th", "Grade 5")
 * @param {string} gradeStr - Grade string to parse
 * @returns {number} Parsed grade level
 */
function parseGrade(gradeStr: string): number {
  const cleaned = gradeStr.replace(/[^0-9]/g, '');
  const grade = parseInt(cleaned, 10);
  return isNaN(grade) ? 0 : grade;
}

/**
 * Parse a single MAP score from sheet data
 * @param {SheetRow} row - Raw sheet row data
 * @param {string} subject - Subject
 * @returns {MapScore | undefined} Parsed MAP score or undefined
 */
function parseMapScore(row: SheetRow, subject: 'math' | 'reading' | 'language' | 'science'): MapScore | undefined {
  const ritScore = parseNumber(row[`${subject}RitScore`]);
  const percentile = parseNumber(row[`${subject}Percentile`]);
  
  if (!ritScore || !percentile) {
    return undefined;
  }
  
  return {
    ritScore,
    percentile,
    testDate: parseDate(row[`${subject}TestDate`]),
    // Grade equivalent can be calculated later if needed
  };
}

/**
 * Parse a row from Google Sheets into a Student object
 * @param {SheetRow} row - Raw row data from Google Sheets
 * @returns {Student | null} Parsed student object or null if invalid
 */
export function parseSheetRow(row: SheetRow): Student | null {
  // Validate required fields
  if (!row.studentName || !row.grade) {
    console.log('[Parser] Skipping row - missing studentName or grade:', {
      studentName: row.studentName || 'MISSING',
      grade: row.grade || 'MISSING'
    });
    return null;
  }
  
  const mathScore = parseMapScore(row, 'math');
  const readingScore = parseMapScore(row, 'reading');
  const languageScore = parseMapScore(row, 'language');
  const scienceScore = parseMapScore(row, 'science');
  
  // Skip rows with no valid scores
  if (!mathScore && !readingScore && !languageScore && !scienceScore) {
    console.log('[Parser] Skipping row - no valid scores:', {
      studentName: row.studentName,
      mathRitScore: row.mathRitScore || 'MISSING',
      readingRitScore: row.readingRitScore || 'MISSING',
      languageRitScore: row.languageRitScore || 'MISSING',
      scienceRitScore: row.scienceRitScore || 'MISSING'
    });
    return null;
  }
  
  const student: Student = {
    id: generateId(),
    name: row.studentName.trim(),
    grade: parseGrade(row.grade),
    age: row.age ? parseNumber(row.age) : undefined,
    scores: {
      math: mathScore,
      reading: readingScore,
      language: languageScore,
      science: scienceScore,
    },
    lastUpdated: new Date(),
  };
  
  return student;
}

/**
 * Validate that a student has required data for visualization
 * @param {Student} student - Student to validate
 * @param {string} subject - Subject to check
 * @returns {boolean} True if student has valid data for the subject
 */
export function validateStudentData(student: Student, subject: 'math' | 'reading' | 'language' | 'science'): boolean {
  const score = student.scores[subject];
  
  if (!score) return false;
  
  return (
    score.ritScore > 0 &&
    score.percentile >= 0 &&
    score.percentile <= 100
  );
}

 