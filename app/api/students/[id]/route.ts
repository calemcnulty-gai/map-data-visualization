/**
 * @fileoverview API routes for individual student operations
 * @module app/api/students/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { StudentService } from '@/services/database/student-service';
import { Subject } from '@/lib/generated/prisma';
import { z } from 'zod';
import { getPercentileFromRIT } from '@/lib/calculations/percentile-calculator';

// Schema for score data
const scoreSchema = z.object({
  ritScore: z.number().min(0),
  percentile: z.number().min(0).max(100).optional(),
  testDate: z.date().or(z.string().transform(str => new Date(str))),
  gradeEquivalent: z.number().optional(),
  growthProjection: z.number().optional(),
});

// Schema for updating a student
const updateStudentSchema = z.object({
  name: z.string().min(1).max(100),
  grade: z.number().int().min(0).max(12),
  age: z.number().int().min(5).max(20).optional(),
  studentType: z.enum(['tournament', 'prospective-tnt', 'prospective-student']).optional(),
  notes: z.string().max(500).optional(),
  scores: z.object({
    math: scoreSchema.optional(),
    reading: scoreSchema.optional(),
    language: scoreSchema.optional(),
    science: scoreSchema.optional(),
  }).optional(),
});

// Map studentType to StudentBucket enum
const mapStudentTypeToBucket = (studentType?: string) => {
  switch (studentType) {
    case 'tournament':
      return 'TOURNAMENT';
    case 'prospective-tnt':
      return 'PROSPECTIVE_TNT';
    case 'prospective-student':
    default:
      return 'PROSPECTIVE_STUDENT';
  }
};

// Map subject string to Subject enum
const mapSubjectToEnum = (subject: string): Subject => {
  switch (subject.toLowerCase()) {
    case 'math':
      return Subject.MATH;
    case 'reading':
      return Subject.READING;
    case 'language':
      return Subject.LANGUAGE;
    case 'science':
      return Subject.SCIENCE;
    default:
      throw new Error(`Invalid subject: ${subject}`);
  }
};

/**
 * GET /api/students/[id]
 * Get a single student by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const student = await StudentService.getStudentById(id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Student not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch student',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/students/[id]
 * Update a student
 */
export async function PUT(
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
    const validatedData = updateStudentSchema.parse(body);

    // Update the student basic info
    const updateData: any = {
      name: validatedData.name,
      grade: validatedData.grade,
      age: validatedData.age,
      notes: validatedData.notes,
    };
    
    // Only update bucket if studentType is provided
    if (validatedData.studentType) {
      updateData.bucket = mapStudentTypeToBucket(validatedData.studentType);
    }
    
    const student = await StudentService.updateStudent(id, updateData);

    // Update scores if provided
    if (validatedData.scores) {
      const subjects: Array<keyof typeof validatedData.scores> = ['math', 'reading', 'language', 'science'];
      
      for (const subject of subjects) {
        const scoreData = validatedData.scores[subject];
        if (scoreData) {
          // Calculate percentile if not provided
          const percentile = scoreData.percentile ?? getPercentileFromRIT(
            scoreData.ritScore,
            validatedData.grade
          );
          
          await StudentService.upsertSubjectScore(
            id,
            mapSubjectToEnum(subject),
            {
              ...scoreData,
              percentile,
            }
          );
        }
      }
    }

    // Fetch the complete updated student with scores
    const completeStudent = await StudentService.getStudentById(id);

    return NextResponse.json({
      success: true,
      data: completeStudent,
    });
  } catch (error) {
    console.error('Error updating student:', error);
    
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
          message: 'Failed to update student',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/students/[id]
 * Delete a student
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
    
    // Check if student exists
    const student = await StudentService.getStudentById(id);
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Student not found',
          },
        },
        { status: 404 }
      );
    }

    // Delete the student (cascades to scores and visualizations)
    await StudentService.deleteStudent(id);

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Failed to delete student',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
} 