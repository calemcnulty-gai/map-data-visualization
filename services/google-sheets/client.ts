/**
 * @fileoverview Google Sheets client service for fetching MAP data
 * @module services/google-sheets/client
 */

import { google, sheets_v4 } from 'googleapis';
import { SheetRow, Student, MapScore } from '@/lib/types';
import { parseSheetRow } from './parser';
import { generateId } from '@/lib/utils';

export class GoogleSheetsClient {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor() {
    // Initialize auth with service account
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';

    if (!this.spreadsheetId) {
      throw new Error('NEXT_PUBLIC_GOOGLE_SHEETS_ID environment variable is not set');
    }
  }

  /**
   * Parse a number from string, handling various formats
   * @param {string} value - String value to parse
   * @returns {number | undefined} Parsed number or undefined
   */
  private parseNumber(value?: string): number | undefined {
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
  private parseGrade(gradeStr: string): number {
    const cleaned = gradeStr.replace(/[^0-9]/g, '');
    const grade = parseInt(cleaned, 10);
    return isNaN(grade) ? 0 : grade;
  }

  /**
   * Fetch all student data from the Google Sheet
   * @returns {Promise<Student[]>} Array of parsed student data
   */
  async fetchStudentData(): Promise<Student[]> {
    try {
      console.log('[GoogleSheetsClient] Starting to fetch student data...');
      console.log('[GoogleSheetsClient] Spreadsheet ID:', this.spreadsheetId);
      
      // Get the sheet data
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'A:Z', // Get all columns
      });

      const rows = response.data.values;
      console.log('[GoogleSheetsClient] Total rows received:', rows?.length || 0);
      
      if (!rows || rows.length === 0) {
        console.log('[GoogleSheetsClient] No rows found in spreadsheet');
        return [];
      }

      // First row should be headers
      const headers = rows[0];
      const dataRows = rows.slice(1);
      
      console.log('[GoogleSheetsClient] Headers found:', headers);
      console.log('[GoogleSheetsClient] Data rows count:', dataRows.length);

      // Map to store aggregated student data
      const studentMap = new Map<string, {
        firstName: string;
        lastName: string;
        grade: number;
        age?: number;
        mathScore?: MapScore;
        readingScore?: MapScore;
        scienceScore?: MapScore;
      }>();

      // Process each row
      dataRows.forEach((row, rowIndex) => {
        // Map row to object using headers
        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || '';
        });

        // Extract key fields
        const firstName = (rowData['First Name'] || '').trim();
        const lastName = (rowData['Last Name'] || '').trim();
        const studentName = `${firstName} ${lastName}`.trim();
        const subject = (rowData['Subject'] || '').toLowerCase();
        const ritScore = this.parseNumber(rowData['RIT Score']);
        const percentile = this.parseNumber(rowData['Percentile']);
        const grade = this.parseGrade(rowData['Age Grade'] || '');

        // Skip rows without essential data
        if (!studentName || !subject || !ritScore) {
          console.log(`[GoogleSheetsClient] Skipping row ${rowIndex} - missing essential data:`, {
            studentName,
            subject,
            ritScore
          });
          return;
        }

        // Get or create student entry
        if (!studentMap.has(studentName)) {
          studentMap.set(studentName, {
            firstName,
            lastName,
            grade,
          });
        }

        const student = studentMap.get(studentName)!;

        // Create MAP score object
        const mapScore: MapScore = {
          ritScore,
          percentile: percentile || 0,
          testDate: new Date(),
        };

        // Assign score to appropriate subject
        if (subject === 'math') {
          student.mathScore = mapScore;
        } else if (subject === 'reading') {
          student.readingScore = mapScore;
        } else if (subject === 'science') {
          student.scienceScore = mapScore;
        }

        if (rowIndex < 5) {
          console.log(`[GoogleSheetsClient] Processed row ${rowIndex}:`, {
            studentName,
            subject,
            ritScore,
            percentile,
            grade
          });
        }
      });

      console.log(`[GoogleSheetsClient] Aggregated ${studentMap.size} unique students`);

      // Convert map to Student array
      const students: Student[] = Array.from(studentMap.entries()).map(([name, data]) => {
        const student: Student = {
          id: generateId(),
          name,
          grade: data.grade,
          age: data.age,
          scores: {
            math: data.mathScore,
            reading: data.readingScore,
            science: data.scienceScore,
          },
          lastUpdated: new Date(),
        };

        return student;
      });

      // Log summary
      let mathCount = 0;
      let readingCount = 0;
      let scienceCount = 0;
      
      students.forEach(student => {
        if (student.scores.math) mathCount++;
        if (student.scores.reading) readingCount++;
        if (student.scores.science) scienceCount++;
      });

      console.log('[GoogleSheetsClient] Parsing complete:');
      console.log(`  - Total unique students: ${students.length}`);
      console.log(`  - Students with math scores: ${mathCount}`);
      console.log(`  - Students with reading scores: ${readingCount}`);
      console.log(`  - Students with science scores: ${scienceCount}`);

      // Log first few students for debugging
      students.slice(0, 3).forEach((student, i) => {
        console.log(`[GoogleSheetsClient] Student ${i + 1}:`, {
          name: student.name,
          grade: student.grade,
          hasMath: !!student.scores.math,
          hasReading: !!student.scores.reading,
          hasScience: !!student.scores.science,
          mathScore: student.scores.math?.ritScore,
          readingScore: student.scores.reading?.ritScore,
          scienceScore: student.scores.science?.ritScore,
        });
      });

      return students;
    } catch (error) {
      console.error('[GoogleSheetsClient] Error fetching data from Google Sheets:', error);
      throw new Error('Failed to fetch student data from Google Sheets');
    }
  }

  /**
   * Get sheet metadata (last modified time, etc.)
   * @returns {Promise<{ lastModified: Date }>} Sheet metadata
   */
  async getSheetMetadata(): Promise<{ lastModified: Date }> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
        fields: 'properties.title,properties.timeZone,sheets.properties',
      });

      // For now, return current time as last modified
      // In production, you might want to track this differently
      return {
        lastModified: new Date(),
      };
    } catch (error) {
      console.error('Error fetching sheet metadata:', error);
      throw new Error('Failed to fetch sheet metadata');
    }
  }

  /**
   * Test connection to Google Sheets
   * @returns {Promise<boolean>} True if connection successful
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
        fields: 'properties.title',
      });
      return true;
    } catch (error) {
      console.error('Google Sheets connection test failed:', error);
      return false;
    }
  }
} 