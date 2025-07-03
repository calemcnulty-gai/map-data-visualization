/**
 * @fileoverview API endpoint for downloading visualization files
 * @module app/api/visualizations/[id]/download
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { getFile } from '@/services/storage/file-storage';

// GET /api/visualizations/[id]/download - Download a visualization file
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to download visualizations',
          },
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Fetch visualization metadata
    const visualization = await prisma.visualization.findUnique({
      where: { id },
      select: {
        id: true,
        fileId: true,
        fileName: true,
        studentName: true,
        subject: true,
      },
    });

    if (!visualization) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Visualization not found',
          },
        },
        { status: 404 }
      );
    }

    // Get file from storage
    const fileBuffer = await getFile(visualization.fileId);

    // Return file as response
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${visualization.fileName}"`,
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error downloading visualization:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to download visualization',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
} 