/**
 * @fileoverview Student database service for CRUD operations
 * @module services/database/student-service
 */

import { prisma } from '@/lib/prisma';
import { Prisma, Student, SubjectScore, Subject, StudentBucket } from '@/lib/generated/prisma';
import type { Student as StudentType, SubjectScores, MapScore } from '@/lib/types/student';

/**
 * Convert database student to application student type
 */
function mapDbStudentToAppStudent(
  dbStudent: Student & { scores: SubjectScore[] }
): StudentType {
  const scores: SubjectScores = {};
  
  for (const score of dbStudent.scores) {
    const subject = score.subject.toLowerCase() as keyof SubjectScores;
    scores[subject] = {
      ritScore: score.ritScore,
      percentile: score.percentile,
      gradeEquivalent: score.gradeEquivalent || undefined,
      testDate: score.testDate,
      growthProjection: score.growthProjection || undefined,
    };
  }
  
  return {
    id: dbStudent.id,
    name: dbStudent.name,
    grade: dbStudent.grade,
    age: dbStudent.age || undefined,
    bucket: dbStudent.bucket,
    scores,
    lastUpdated: dbStudent.updatedAt,
  };
}

/**
 * Student service for database operations
 */
export class StudentService {
  /**
   * Get all students with their scores
   */
  static async getAllStudents(bucket?: StudentBucket): Promise<StudentType[]> {
    const where = bucket ? { bucket } : {};
    
    // Fetch all students and their scores in a single query with proper includes
    const students = await prisma.student.findMany({
      where,
      include: {
        scores: {
          orderBy: {
            subject: 'asc',
          },
        },
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' },
      ],
    });
    
    return students.map(mapDbStudentToAppStudent);
  }
  
  /**
   * Get a single student by ID
   */
  static async getStudentById(id: string): Promise<StudentType | null> {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        scores: true,
      },
    });
    
    return student ? mapDbStudentToAppStudent(student) : null;
  }
  
  /**
   * Create a new student
   */
  static async createStudent(data: {
    name: string;
    grade: number;
    age?: number;
    bucket?: StudentBucket;
    notes?: string;
    externalId?: string;
  }): Promise<StudentType> {
    const student = await prisma.student.create({
      data: {
        name: data.name,
        grade: data.grade,
        age: data.age,
        bucket: data.bucket || StudentBucket.PROSPECTIVE_STUDENT,
        notes: data.notes,
        externalId: data.externalId,
      },
      include: {
        scores: true,
      },
    });
    
    return mapDbStudentToAppStudent(student);
  }
  
  /**
   * Update a student
   */
  static async updateStudent(
    id: string,
    data: {
      name?: string;
      grade?: number;
      age?: number;
      bucket?: StudentBucket;
      notes?: string;
    }
  ): Promise<StudentType> {
    const student = await prisma.student.update({
      where: { id },
      data,
      include: {
        scores: true,
      },
    });
    
    return mapDbStudentToAppStudent(student);
  }
  
  /**
   * Delete a student (cascades to scores and visualizations)
   */
  static async deleteStudent(id: string): Promise<void> {
    await prisma.student.delete({
      where: { id },
    });
  }
  
  /**
   * Add or update a subject score for a student
   */
  static async upsertSubjectScore(
    studentId: string,
    subject: Subject,
    data: {
      ritScore: number;
      percentile: number;
      gradeEquivalent?: number;
      testDate: Date;
      growthProjection?: number;
    }
  ): Promise<SubjectScore> {
    return await prisma.subjectScore.upsert({
      where: {
        studentId_subject: {
          studentId,
          subject,
        },
      },
      update: data,
      create: {
        studentId,
        subject,
        ...data,
      },
    });
  }
  
  /**
   * Delete a subject score
   */
  static async deleteSubjectScore(studentId: string, subject: Subject): Promise<void> {
    await prisma.subjectScore.delete({
      where: {
        studentId_subject: {
          studentId,
          subject,
        },
      },
    });
  }
  
  /**
   * Bulk upsert students from Google Sheets sync
   */
  static async syncStudentsFromSheets(
    students: Array<{
      externalId: string;
      name: string;
      grade: number;
      age?: number;
      scores: {
        subject: Subject;
        ritScore: number;
        percentile: number;
        gradeEquivalent?: number;
        testDate: Date;
        growthProjection?: number;
      }[];
    }>
  ): Promise<StudentType[]> {
    const results: StudentType[] = [];
    
    // Use a transaction for consistency
    await prisma.$transaction(async (tx) => {
      for (const studentData of students) {
        // Upsert the student
        const student = await tx.student.upsert({
          where: {
            externalId: studentData.externalId,
          },
          update: {
            name: studentData.name,
            grade: studentData.grade,
            age: studentData.age,
            lastSyncedAt: new Date(),
          },
          create: {
            externalId: studentData.externalId,
            name: studentData.name,
            grade: studentData.grade,
            age: studentData.age,
            lastSyncedAt: new Date(),
          },
        });
        
        // Upsert each subject score
        for (const scoreData of studentData.scores) {
          await tx.subjectScore.upsert({
            where: {
              studentId_subject: {
                studentId: student.id,
                subject: scoreData.subject,
              },
            },
            update: {
              ritScore: scoreData.ritScore,
              percentile: scoreData.percentile,
              gradeEquivalent: scoreData.gradeEquivalent,
              testDate: scoreData.testDate,
              growthProjection: scoreData.growthProjection,
            },
            create: {
              studentId: student.id,
              subject: scoreData.subject,
              ritScore: scoreData.ritScore,
              percentile: scoreData.percentile,
              gradeEquivalent: scoreData.gradeEquivalent,
              testDate: scoreData.testDate,
              growthProjection: scoreData.growthProjection,
            },
          });
        }
        
        // Fetch the complete student with scores
        const completeStudent = await tx.student.findUnique({
          where: { id: student.id },
          include: { scores: true },
        });
        
        if (completeStudent) {
          results.push(mapDbStudentToAppStudent(completeStudent));
        }
      }
    });
    
    return results;
  }
  
  /**
   * Search students by name
   */
  static async searchStudents(query: string, bucket?: StudentBucket): Promise<StudentType[]> {
    const where: Prisma.StudentWhereInput = {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    };
    
    if (bucket) {
      where.bucket = bucket;
    }
    
    const students = await prisma.student.findMany({
      where,
      include: {
        scores: true,
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' },
      ],
    });
    
    return students.map(mapDbStudentToAppStudent);
  }
  
  /**
   * Get students by grade
   */
  static async getStudentsByGrade(grade: number, bucket?: StudentBucket): Promise<StudentType[]> {
    const where: Prisma.StudentWhereInput = { grade };
    
    if (bucket) {
      where.bucket = bucket;
    }
    
    const students = await prisma.student.findMany({
      where,
      include: {
        scores: true,
      },
      orderBy: { name: 'asc' },
    });
    
    return students.map(mapDbStudentToAppStudent);
  }
  
  /**
   * Update student bucket
   */
  static async updateStudentBucket(studentId: string, bucket: StudentBucket): Promise<StudentType> {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { bucket },
      include: {
        scores: true,
      },
    });
    
    return mapDbStudentToAppStudent(student);
  }

  /**
   * Efficient sync that only inserts new students from Google Sheets
   */
  static async efficientSyncFromSheets(
    sheetStudents: Array<{
      externalId: string;
      name: string;
      grade: number;
      age?: number;
      scores: {
        subject: Subject;
        ritScore: number;
        percentile: number;
        gradeEquivalent?: number;
        testDate: Date;
        growthProjection?: number;
      }[];
    }>
  ): Promise<{ newStudents: StudentType[]; existingCount: number }> {
    // First, get all existing external IDs in a single query
    const existingStudents = await prisma.student.findMany({
      where: {
        externalId: {
          in: sheetStudents.map(s => s.externalId),
        },
      },
      select: {
        externalId: true,
      },
    });
    
    const existingExternalIds = new Set(existingStudents.map(s => s.externalId).filter(Boolean) as string[]);
    
    // Filter to only new students
    const newStudentsData = sheetStudents.filter(s => !existingExternalIds.has(s.externalId));
    
    if (newStudentsData.length === 0) {
      return { newStudents: [], existingCount: existingStudents.length };
    }
    
    // Use a single transaction to insert all new students and their scores
    const newStudents = await prisma.$transaction(async (tx) => {
      // Create all students first
      const createdStudents = await Promise.all(
        newStudentsData.map(studentData =>
          tx.student.create({
            data: {
              externalId: studentData.externalId,
              name: studentData.name,
              grade: studentData.grade,
              age: studentData.age,
              lastSyncedAt: new Date(),
              bucket: StudentBucket.PROSPECTIVE_STUDENT,
            },
          })
        )
      );
      
      // Create a map for quick lookup
      const studentIdMap = new Map(
        createdStudents.map(s => [s.externalId!, s.id])
      );
      
      // Prepare all scores for batch insert
      const allScores: Prisma.SubjectScoreCreateManyInput[] = [];
      
      for (const studentData of newStudentsData) {
        const studentId = studentIdMap.get(studentData.externalId);
        if (!studentId) continue;
        
        for (const score of studentData.scores) {
          allScores.push({
            studentId,
            subject: score.subject,
            ritScore: score.ritScore,
            percentile: score.percentile,
            gradeEquivalent: score.gradeEquivalent,
            testDate: score.testDate,
            growthProjection: score.growthProjection,
          });
        }
      }
      
      // Batch insert all scores
      if (allScores.length > 0) {
        await tx.subjectScore.createMany({
          data: allScores,
        });
      }
      
      // Fetch complete students with scores
      const completeStudents = await tx.student.findMany({
        where: {
          id: {
            in: createdStudents.map(s => s.id),
          },
        },
        include: {
          scores: true,
        },
        orderBy: [
          { grade: 'asc' },
          { name: 'asc' },
        ],
      });
      
      return completeStudents.map(mapDbStudentToAppStudent);
    });
    
    return {
      newStudents,
      existingCount: existingStudents.length,
    };
  }
} 