/**
 * @fileoverview API endpoint for batch downloading visualizations as ZIP
 * @module app/api/visualizations/batch/download
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { fileStorage } from '@/services/storage/file-storage';
import JSZip from 'jszip';
import { handleApiError } from '@/lib/errors/error-handler';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Get visualization IDs from request
    const body = await request.json();
    const { visualizationIds } = body;

    if (!Array.isArray(visualizationIds) || visualizationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'No visualization IDs provided' } },
        { status: 400 }
      );
    }

    // Fetch visualizations from database
    const visualizations = await prisma.visualization.findMany({
      where: {
        id: { in: visualizationIds },
        generatedBy: session.user.email,
      },
      select: {
        id: true,
        fileName: true,
        studentName: true,
        subject: true,
      },
    });

    if (visualizations.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'No visualizations found' } },
        { status: 404 }
      );
    }

    // Create ZIP file
    const zip = new JSZip();

    // Add each visualization to the ZIP
    for (const viz of visualizations) {
      try {
        const fileData = await fileStorage.getFile(viz.id, 'visualization');
        if (fileData) {
          // Create a folder structure: StudentName/subject_filename.png
          const folderName = viz.studentName.replace(/[^a-zA-Z0-9\s]/g, '');
          const filePath = `${folderName}/${viz.fileName}`;
          zip.file(filePath, fileData);
        }
      } catch (error) {
        console.error(`Failed to add ${viz.fileName} to ZIP:`, error);
        // Continue with other files even if one fails
      }
    }

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6, // Balanced compression
      },
    });

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="visualizations_batch_${new Date().toISOString().split('T')[0]}.zip"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
} 