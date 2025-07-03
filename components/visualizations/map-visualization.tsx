/**
 * @fileoverview Complete MAP visualization component with header, footer, and student info
 * @module components/visualizations/map-visualization
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { Student, VisualizationConfig } from '@/lib/types';
import { StudentPerformanceChart } from './student-performance-chart';
import {
  calculateAllProjections,
  calculateHoursToGradeLevel,
  calculateHoursTo90thPercentile,
  getGradeLevelRitScore,
  get90thPercentileRitScore,
  getRecommendedPackage,
  getEffectiveGradeLevel,
} from '@/lib/calculations/rit-improvement';
import {
  BRAND_COLORS,
  VISUALIZATION_DIMENSIONS,
  FONTS,
} from '@/lib/constants/visualization';
import { formatPercentileForParents } from '@/lib/utils';

interface MapVisualizationProps {
  student: Student;
  subject: 'math' | 'reading' | 'language' | 'science';
  config: VisualizationConfig;
  onRenderComplete?: () => void;
}

export function MapVisualization({
  student,
  subject,
  config,
  onRenderComplete,
}: MapVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = VISUALIZATION_DIMENSIONS[config.layout];
  
  // Call onRenderComplete when component mounts and chart is ready
  useEffect(() => {
    // Give the chart time to render
    const timer = setTimeout(() => {
      if (onRenderComplete) {
        onRenderComplete();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [onRenderComplete]);
  
  const score = student.scores[subject];
  if (!score) {
    return <div>No {subject} score available for this student</div>;
  }

  // Calculate all necessary data
  const projections = calculateAllProjections(
    score.ritScore,
    score.percentile,
    subject,
    student.grade
  ).filter(p => config.packages.includes(p.package));

  const hoursToGradeLevel = calculateHoursToGradeLevel(
    score.ritScore,
    student.grade,
    subject
  );

  const hoursTo90th = calculateHoursTo90thPercentile(
    score.ritScore,
    score.percentile,
    student.grade,
    subject
  );

  const recommendedPackage = getRecommendedPackage(hoursToGradeLevel, hoursTo90th);
  const effectiveGradeLevel = getEffectiveGradeLevel(score.ritScore);

  const chartData = {
    student,
    subject,
    currentScore: score.ritScore,
    currentPercentile: score.percentile,
    gradeLevel: student.grade,
    projections: projections.map(p => ({
      package: p.package,
      hours: p.hours,
      projectedScore: p.projectedRitScore,
      improvement: p.improvementPoints,
      percentile: p.projectedPercentile,
    })),
    peerComparison: {
      nationalAverage: getGradeLevelRitScore(student.grade, subject),
      gradeAverage: getGradeLevelRitScore(student.grade, subject),
      percentileRanges: {
        p10: getGradeLevelRitScore(student.grade, subject) - 15,
        p25: getGradeLevelRitScore(student.grade, subject) - 8,
        p50: getGradeLevelRitScore(student.grade, subject),
        p75: getGradeLevelRitScore(student.grade, subject) + 8,
        p90: getGradeLevelRitScore(student.grade, subject) + 15,
      },
    },
    targets: {
      gradeLevelScore: getGradeLevelRitScore(student.grade, subject),
      hoursToGradeLevel,
      ninetiethPercentileScore: get90thPercentileRitScore(student.grade, subject),
      hoursTo90thPercentile: hoursTo90th,
    },
  };

  return (
    <div
      ref={containerRef}
      className="map-visualization"
      style={{
        width: dimensions.width,
        backgroundColor: 'white',
        position: 'relative',
        fontFamily: FONTS.primary,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: dimensions.headerHeight,
          padding: dimensions.padding,
          backgroundColor: BRAND_COLORS.primary,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: FONTS.sizes.title,
              fontWeight: FONTS.weights.bold,
              margin: 0,
            }}
          >
            MAP Performance Report
          </h1>
          <p
            style={{
              fontSize: FONTS.sizes.body,
              margin: '4px 0 0 0',
              opacity: 0.9,
            }}
          >
            {student.name} • Grade {student.grade} • {subject.charAt(0).toUpperCase() + subject.slice(1)}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: FONTS.sizes.subtitle,
              fontWeight: FONTS.weights.bold,
            }}
          >
            NextGen Academy
          </div>
          <div style={{ fontSize: FONTS.sizes.small, opacity: 0.9 }}>
            Tutoring Excellence
          </div>
        </div>
      </div>

      {/* Student Info Section */}
      <div
        style={{
          padding: `20px ${dimensions.padding}px`,
          paddingBottom: 10,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              backgroundColor: BRAND_COLORS.gray[50],
              padding: 16,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: FONTS.sizes.small,
                color: BRAND_COLORS.gray[600],
                marginBottom: 4,
              }}
            >
              Current RIT Score
            </div>
            <div
              style={{
                fontSize: FONTS.sizes.subtitle,
                fontWeight: FONTS.weights.bold,
                color: BRAND_COLORS.secondary,
              }}
            >
              {score.ritScore}
            </div>
          </div>

          <div
            style={{
              backgroundColor: BRAND_COLORS.gray[50],
              padding: 16,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: FONTS.sizes.small,
                color: BRAND_COLORS.gray[600],
                marginBottom: 4,
              }}
            >
              Performance Level
            </div>
            <div
              style={{
                fontSize: FONTS.sizes.subtitle,
                fontWeight: FONTS.weights.bold,
                color: BRAND_COLORS.secondary,
              }}
            >
              {formatPercentileForParents(score.percentile)}
            </div>
          </div>

          <div
            style={{
              backgroundColor: BRAND_COLORS.gray[50],
              padding: 16,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: FONTS.sizes.small,
                color: BRAND_COLORS.gray[600],
                marginBottom: 4,
              }}
            >
              Effective Grade
            </div>
            <div
              style={{
                fontSize: FONTS.sizes.subtitle,
                fontWeight: FONTS.weights.bold,
                color: effectiveGradeLevel < student.grade ? '#EF4444' : BRAND_COLORS.primary,
              }}
            >
              {effectiveGradeLevel}
            </div>
          </div>

          <div
            style={{
              backgroundColor: BRAND_COLORS.gray[50],
              padding: 16,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: FONTS.sizes.small,
                color: BRAND_COLORS.gray[600],
                marginBottom: 4,
              }}
            >
              Hours to Grade Level
            </div>
            <div
              style={{
                fontSize: FONTS.sizes.subtitle,
                fontWeight: FONTS.weights.bold,
                color: hoursToGradeLevel > 0 ? '#EF4444' : BRAND_COLORS.primary,
              }}
            >
              {hoursToGradeLevel > 0 ? hoursToGradeLevel : 'At Level'}
            </div>
          </div>

          <div
            style={{
              backgroundColor: BRAND_COLORS.gray[50],
              padding: 16,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: FONTS.sizes.small,
                color: BRAND_COLORS.gray[600],
                marginBottom: 4,
              }}
            >
              Hours to Mastery
            </div>
            <div
              style={{
                fontSize: FONTS.sizes.subtitle,
                fontWeight: FONTS.weights.bold,
                color: BRAND_COLORS.primary,
              }}
            >
              {hoursTo90th}
            </div>
          </div>
        </div>

        {/* Recommendation Box */}
        <div
          style={{
            backgroundColor: BRAND_COLORS.primary + '10',
            border: `2px solid ${BRAND_COLORS.primary}`,
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: FONTS.sizes.body,
              fontWeight: FONTS.weights.semibold,
              color: BRAND_COLORS.secondary,
              marginBottom: 4,
            }}
          >
            Recommended Package: {recommendedPackage} Tutoring
          </div>
          <div
            style={{
              fontSize: FONTS.sizes.small,
              color: BRAND_COLORS.gray[700],
            }}
          >
            Based on current performance and improvement goals
          </div>
        </div>
      </div>

      {/* Chart */}
      <StudentPerformanceChart
        data={chartData}
        layout={config.layout}
        showProjections={config.includeProjections}
        showPeerComparison={config.includePeerComparison}
        showTargets={config.includeGradeLevelTargets || config.include90thPercentileTargets}
      />

      {/* Custom Message */}
      {config.customMessage && (
        <div
          style={{
            padding: `20px ${dimensions.padding}px`,
            fontSize: FONTS.sizes.body,
            color: BRAND_COLORS.gray[700],
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          {config.customMessage}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          height: dimensions.footerHeight,
          backgroundColor: BRAND_COLORS.secondary,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `0 ${dimensions.padding}px`,
          marginTop: 'auto',
        }}
      >
        <div style={{ fontSize: FONTS.sizes.small }}>
          Generated on {new Date().toLocaleDateString()}
        </div>
        <div style={{ fontSize: FONTS.sizes.small }}>
          © NextGen Academy • www.nextgenafter.school
        </div>
      </div>
    </div>
  );
} 