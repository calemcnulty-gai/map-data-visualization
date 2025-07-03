/**
 * @fileoverview API routes for managing student subject scores
 * @module app/api/students/[id]/scores
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { StudentService } from '@/services/database/student-service';
import { Subject } from '@/lib/generated/prisma';
import { z } from 'zod';

// Schema for creating/updating a score
const scoreSchema = z.object({
  subject: z.nativeEnum(Subject),
  ritScore: z.number().int().min(100).max(350),
  percentile: z.number().int().min(1).max(99),
  gradeEquivalent: z.number().optional(),
  testDate: z.string().datetime(),
  growthProjection: z.number().int().optional(),
});

/**
 * POST /api/students/[id]/scores
 * Add or update a subject score for a student
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = scoreSchema.parse(body);

    const score = await StudentService.upsertSubjectScore(
      id,
      validatedData.subject,
      {
        ritScore: validatedData.ritScore,
        percentile: validatedData.percentile,
        gradeEquivalent: validatedData.gradeEquivalent,
        testDate: new Date(validatedData.testDate),
        growthProjection: validatedData.growthProjection,
      }
    );

    return NextResponse.json({
      success: true,
      data: score,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating score:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update score',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/students/[id]/scores
 * Delete a subject score
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const subject = searchParams.get('subject') as Subject | null;

    if (!subject || !Object.values(Subject).includes(subject)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid or missing subject parameter',
          },
        },
        { status: 400 }
      );
    }

    await StudentService.deleteSubjectScore(id, subject);

    return NextResponse.json({
      success: true,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error deleting score:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Failed to delete score',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
} 