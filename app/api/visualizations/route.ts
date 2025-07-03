/**
 * @fileoverview API endpoints for visualization management
 * @module app/api/visualizations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { saveFile } from '@/services/storage/file-storage';
import { z } from 'zod';
import { Subject } from '@/lib/generated/prisma';

// Validation schema for visualization creation
const createVisualizationSchema = z.object({
  studentId: z.string(),
  studentName: z.string(), // Still accept it but we won't store it
  subject: z.enum(['math', 'reading', 'language', 'science']),
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

    // Map subject string to enum
    const subjectEnum = data.subject.toUpperCase() as Subject;

    // Create database record
    const visualization = await prisma.visualization.create({
      data: {
        studentId: data.studentId,
        subject: subjectEnum,
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