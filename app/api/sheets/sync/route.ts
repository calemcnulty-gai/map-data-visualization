/**
 * @fileoverview API endpoint for syncing data from Google Sheets
 * @module app/api/sheets/sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { GoogleSheetsClient } from '@/services/google-sheets/client';
import { StudentService } from '@/services/database/student-service';
import { Subject } from '@/lib/generated/prisma';

export async function GET(_request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to sync data',
          },
        },
        { status: 401 }
      );
    }

    // Initialize Google Sheets client
    const sheetsClient = new GoogleSheetsClient();

    // Test connection first
    const isConnected = await sheetsClient.testConnection();
    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONNECTION_FAILED',
            message: 'Failed to connect to Google Sheets. Please check your configuration.',
          },
        },
        { status: 500 }
      );
    }

    // Fetch student data from sheets
    const sheetStudents = await sheetsClient.fetchStudentData();
    const metadata = await sheetsClient.getSheetMetadata();

    // Convert sheet students to database format
    const studentsToSync = sheetStudents.map(student => {
      // Create a unique external ID based on name (you might want to adjust this)
      const externalId = student.name.toLowerCase().replace(/\s+/g, '-');
      
      // Collect all subject scores
      const scores: Array<{
        subject: Subject;
        ritScore: number;
        percentile: number;
        gradeEquivalent?: number;
        testDate: Date;
        growthProjection?: number;
      }> = [];
      
      if (student.scores.math) {
        scores.push({
          subject: Subject.MATH,
          ritScore: student.scores.math.ritScore,
          percentile: student.scores.math.percentile,
          gradeEquivalent: student.scores.math.gradeEquivalent,
          testDate: student.scores.math.testDate,
          growthProjection: student.scores.math.growthProjection,
        });
      }
      
      if (student.scores.reading) {
        scores.push({
          subject: Subject.READING,
          ritScore: student.scores.reading.ritScore,
          percentile: student.scores.reading.percentile,
          gradeEquivalent: student.scores.reading.gradeEquivalent,
          testDate: student.scores.reading.testDate,
          growthProjection: student.scores.reading.growthProjection,
        });
      }
      
      if (student.scores.language) {
        scores.push({
          subject: Subject.LANGUAGE,
          ritScore: student.scores.language.ritScore,
          percentile: student.scores.language.percentile,
          gradeEquivalent: student.scores.language.gradeEquivalent,
          testDate: student.scores.language.testDate,
          growthProjection: student.scores.language.growthProjection,
        });
      }
      
      if (student.scores.science) {
        scores.push({
          subject: Subject.SCIENCE,
          ritScore: student.scores.science.ritScore,
          percentile: student.scores.science.percentile,
          gradeEquivalent: student.scores.science.gradeEquivalent,
          testDate: student.scores.science.testDate,
          growthProjection: student.scores.science.growthProjection,
        });
      }
      
      return {
        externalId,
        name: student.name,
        grade: student.grade,
        age: student.age,
        scores,
      };
    });

    // Use efficient sync that only inserts new students
    const { newStudents, existingCount } = await StudentService.efficientSyncFromSheets(studentsToSync);

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        newStudents,
        metadata: {
          ...metadata,
          newStudentCount: newStudents.length,
          existingStudentCount: existingCount,
          totalStudentCount: existingCount + newStudents.length,
          syncedAt: new Date().toISOString(),
          syncedBy: session.user?.email || 'unknown',
        },
      },
    });
  } catch (error) {
    console.error('Error in sheets sync:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: 'An error occurred while syncing data from Google Sheets',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
} 