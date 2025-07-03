/**
 * @fileoverview API routes for student CRUD operations
 * @module app/api/students
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { StudentService } from '@/services/database/student-service';
import { StudentBucket, Subject } from '@/lib/generated/prisma';
import { z } from 'zod';
import { AppError } from '@/lib/errors/error-handler';
import { getPercentileFromRIT } from '@/lib/calculations/percentile-calculator';

// Schema for score data (percentile is now optional since we calculate it)
const scoreSchema = z.object({
  ritScore: z.number().min(0),
  percentile: z.number().min(0).max(100).optional(),
  testDate: z.date().or(z.string().transform(str => new Date(str))),
  gradeEquivalent: z.number().optional(),
  growthProjection: z.number().optional(),
});

// Schema for creating a student
const createStudentSchema = z.object({
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
const mapStudentTypeToBucket = (studentType?: string): StudentBucket => {
  switch (studentType) {
    case 'tournament':
      return StudentBucket.TOURNAMENT;
    case 'prospective-tnt':
      return StudentBucket.PROSPECTIVE_TNT;
    case 'prospective-student':
    default:
      return StudentBucket.PROSPECTIVE_STUDENT;
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
 * GET /api/students
 * Get all students, optionally filtered by bucket
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const bucket = searchParams.get('bucket') as StudentBucket | null;
    const search = searchParams.get('search');
    const grade = searchParams.get('grade');

    let students;

    if (search) {
      students = await StudentService.searchStudents(search, bucket || undefined);
    } else if (grade) {
      const gradeNum = parseInt(grade, 10);
      if (!isNaN(gradeNum)) {
        students = await StudentService.getStudentsByGrade(gradeNum, bucket || undefined);
      } else {
        students = await StudentService.getAllStudents(bucket || undefined);
      }
    } else {
      students = await StudentService.getAllStudents(bucket || undefined);
    }

    return NextResponse.json({
      success: true,
      data: students,
      metadata: {
        count: students.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch students',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students
 * Create a new student with optional scores
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createStudentSchema.parse(body);

    // Create the student
    const student = await StudentService.createStudent({
      name: validatedData.name,
      grade: validatedData.grade,
      age: validatedData.age,
      bucket: mapStudentTypeToBucket(validatedData.studentType),
      notes: validatedData.notes,
    });

    // Add scores if provided
    if (validatedData.scores) {
      const scorePromises = [];
      
      // Process each subject
      const subjects: Array<keyof typeof validatedData.scores> = ['math', 'reading', 'language', 'science'];
      
      for (const subject of subjects) {
        const scoreData = validatedData.scores[subject];
        if (scoreData) {
          // Calculate percentile if not provided
          const percentile = scoreData.percentile ?? getPercentileFromRIT(
            scoreData.ritScore,
            validatedData.grade
          );
          
          scorePromises.push(
            StudentService.upsertSubjectScore(
              student.id,
              mapSubjectToEnum(subject),
              {
                ...scoreData,
                percentile,
              }
            )
          );
        }
      }
      
      await Promise.all(scorePromises);
    }

    // Fetch the complete student with scores
    const completeStudent = await StudentService.getStudentById(student.id);

    return NextResponse.json({
      success: true,
      data: completeStudent,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating student:', error);
    
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
          code: 'CREATE_ERROR',
          message: 'Failed to create student',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
} 