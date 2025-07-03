/**
 * @fileoverview API endpoint for syncing data from Google Sheets
 * @module app/api/sheets/sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { GoogleSheetsClient } from '@/services/google-sheets/client';

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

    // Fetch student data
    const students = await sheetsClient.fetchStudentData();
    const metadata = await sheetsClient.getSheetMetadata();

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        students,
        metadata: {
          ...metadata,
          studentCount: students.length,
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