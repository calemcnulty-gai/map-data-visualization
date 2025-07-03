/**
 * @fileoverview API endpoints for visualization management
 * @module app/api/visualizations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { saveFile } from '@/services/storage/file-storage';
import { z } from 'zod';

// Validation schema for visualization creation
const createVisualizationSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  subject: z.enum(['math', 'reading']),
  grade: z.number(),
  config: z.object({
    includeProjections: z.boolean(),
    packages: z.array(z.enum(['10-hour', '20-hour', '40-hour'])),
    colorScheme: z.enum(['default', 'high-contrast']),
    layout: z.enum(['portrait', 'landscape']),
    includeCurrentPerformance: z.boolean(),
    includePeerComparison: z.boolean(),
    includeGradeLevelTargets: z.boolean(),
    include90thPercentileTargets: z.boolean(),
    customMessage: z.string().optional(),
  }),
  ritScore: z.number(),
  percentile: z.number(),
  hoursToGradeLevel: z.number(),
  hoursTo90th: z.number(),
  recommendedPackage: z.enum(['10-hour', '20-hour', '40-hour']),
  imageData: z.string(), // Base64 encoded image
  fileName: z.string(),
});

// POST /api/visualizations - Create a new visualization
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to save visualizations',
          },
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createVisualizationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validationResult.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Convert base64 image to buffer
    const base64Data = data.imageData.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Save file to storage
    const fileResult = await saveFile(imageBuffer, data.fileName);

    // Create database record
    const visualization = await prisma.visualization.create({
      data: {
        studentId: data.studentId,
        studentName: data.studentName,
        subject: data.subject,
        grade: data.grade,
        fileId: fileResult.id,
        fileName: data.fileName,
        fileSize: imageBuffer.length,
        config: data.config,
        ritScore: data.ritScore,
        percentile: data.percentile,
        hoursToGradeLevel: data.hoursToGradeLevel,
        hoursTo90th: data.hoursTo90th,
        recommendedPackage: data.recommendedPackage,
        generatedBy: session.user.email,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: visualization.id,
        fileId: visualization.fileId,
        downloadUrl: `/api/visualizations/${visualization.id}/download`,
      },
    });
  } catch (error) {
    console.error('Error creating visualization:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to save visualization',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// GET /api/visualizations - Get visualization history
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to view visualizations',
          },
        },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const studentName = searchParams.get('studentName');
    const subject = searchParams.get('subject');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query conditions
    const where: any = {};
    if (studentName) {
      where.studentName = {
        contains: studentName,
        mode: 'insensitive',
      };
    }
    if (subject) {
      where.subject = subject;
    }

    // Fetch visualizations
    const [visualizations, total] = await Promise.all([
      prisma.visualization.findMany({
        where,
        orderBy: {
          generatedAt: 'desc',
        },
        skip: offset,
        take: limit,
        select: {
          id: true,
          studentName: true,
          subject: true,
          grade: true,
          fileName: true,
          fileSize: true,
          ritScore: true,
          percentile: true,
          recommendedPackage: true,
          generatedBy: true,
          generatedAt: true,
        },
      }),
      prisma.visualization.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        visualizations,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching visualizations:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch visualizations',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
} 