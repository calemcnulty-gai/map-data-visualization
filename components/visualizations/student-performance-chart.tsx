/**
 * @fileoverview Student performance visualization component using D3.js
 * @module components/visualizations/student-performance-chart
 */

'use client';

import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '@/lib/hooks/use-d3';
import { ChartData } from '@/lib/types';
import {
  BRAND_COLORS,
  CHART_COLORS,
  VISUALIZATION_DIMENSIONS,
  FONTS,
  CHART_SETTINGS,
} from '@/lib/constants/visualization';
import { 
  calculateRitImprovement,
  estimateNewPercentile,
  getRITForPercentile,
} from '@/lib/calculations/rit-improvement';
import { formatPercentileForParents } from '@/lib/utils';

interface StudentPerformanceChartProps {
  data: ChartData;
  layout?: 'portrait' | 'landscape';
  showProjections?: boolean;
  showPeerComparison?: boolean;
  showTargets?: boolean;
}

export function StudentPerformanceChart({
  data,
  layout = 'portrait',
  showProjections = true,
  showPeerComparison = true,
  showTargets = true,
}: StudentPerformanceChartProps) {
  const dimensions = VISUALIZATION_DIMENSIONS[layout];
  const chartWidth = dimensions.width - dimensions.padding * 2;
  const chartHeight = 380; // Reduced from 420 to prevent footer overlap

  const svgRef = useD3<SVGSVGElement>(
    (svg) => {
      // Clear previous content
      svg.selectAll('*').remove();

      // Create main group with padding
      const g = svg
        .append('g')
        .attr('transform', `translate(${dimensions.padding}, ${dimensions.headerHeight})`);

      // Add background
      g.append('rect')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('fill', BRAND_COLORS.gray[50])
        .attr('rx', 8);

      // Calculate dynamic projections based on hours needed
      const maxHoursNeeded = Math.max(
        data.targets.hoursToGradeLevel,
        data.targets.hoursTo90thPercentile,
        40 // Minimum 40 hours
      );
      
      // Generate projections at intervals up to the hours needed
      const projectionIntervals = [];
      if (maxHoursNeeded <= 40) {
        projectionIntervals.push(10, 20, 40);
      } else if (maxHoursNeeded <= 60) {
        projectionIntervals.push(10, 20, 40, 60);
      } else if (maxHoursNeeded <= 80) {
        projectionIntervals.push(20, 40, 60, 80);
      } else {
        // For very high hours, use larger intervals
        const interval = Math.ceil(maxHoursNeeded / 4 / 20) * 20;
        for (let i = interval; i <= maxHoursNeeded + interval; i += interval) {
          projectionIntervals.push(i);
        }
      }

      // Calculate projections for these intervals
      const dynamicProjections = projectionIntervals.map(hours => {
        const projectedScore = calculateRitImprovement(data.currentScore, hours, data.subject);
        const projectedPercentile = estimateNewPercentile(data.currentScore, projectedScore, data.currentPercentile, data.gradeLevel);
        return {
          label: `${hours}hr`,
          score: projectedScore,
          percentile: projectedPercentile,
          hours,
          improvement: projectedScore - data.currentScore,
          type: `projection${hours}`,
        };
      });

      // Prepare data for visualization
      const allScores = [
        { 
          label: 'Current', 
          score: data.currentScore, 
          percentile: data.currentPercentile,
          type: 'current' 
        },
        ...dynamicProjections,
      ];

      // Get RIT scores for percentile range (0-100)
      const percentileRange = [];
      for (let p = 1; p <= 99; p += 10) {
        percentileRange.push({
          percentile: p,
          ritScore: getRITForPercentile(p, data.gradeLevel),
        });
      }

      // Calculate Y scale to center 50th percentile
      const score50th = getRITForPercentile(50, data.gradeLevel);
      const score1st = getRITForPercentile(1, data.gradeLevel);
      const score99th = getRITForPercentile(99, data.gradeLevel);
      
      // Calculate the range to show full bell curve with 50th percentile in middle
      const rangeBelow50th = score50th - score1st;
      const rangeAbove50th = score99th - score50th;
      const maxRange = Math.max(rangeBelow50th, rangeAbove50th);
      
      const yMin = score50th - maxRange - 10;
      const yMax = score50th + maxRange + 10;

      // Set up scales
      const xScale = d3
        .scaleBand()
        .domain(allScores.map((d) => d.label))
        .range([CHART_SETTINGS.margins.left, chartWidth - CHART_SETTINGS.margins.right])
        .padding(0.3);

      const yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .nice()
        .range([chartHeight - CHART_SETTINGS.margins.bottom, CHART_SETTINGS.margins.top]);

      // Create a secondary scale for percentiles
      // const percentileScale = d3
      //   .scaleLinear()
      //   .domain([0, 100])
      //   .range([chartHeight - CHART_SETTINGS.margins.bottom, CHART_SETTINGS.margins.top]);

      // Add percentile background bands
      const percentileBands = [
        { start: 0, end: 10, color: '#FEE2E2' },
        { start: 10, end: 25, color: '#FED7AA' },
        { start: 25, end: 50, color: '#FEF3C7' },
        { start: 50, end: 75, color: '#D9F99D' },
        { start: 75, end: 90, color: '#BBF7D0' },
        { start: 90, end: 100, color: '#A7F3D0' },
      ];

      percentileBands.forEach(band => {
        const yTop = yScale(getRITForPercentile(band.end, data.gradeLevel));
        const yBottom = yScale(getRITForPercentile(band.start, data.gradeLevel));
        
        g.append('rect')
          .attr('x', CHART_SETTINGS.margins.left)
          .attr('width', chartWidth - CHART_SETTINGS.margins.left - CHART_SETTINGS.margins.right)
          .attr('y', yTop)
          .attr('height', yBottom - yTop)
          .attr('fill', band.color)
          .attr('opacity', 0.3);
      });

      // Add grid lines
      const gridLines = g.append('g').attr('class', 'grid-lines');

      gridLines
        .selectAll('line')
        .data(yScale.ticks(8))
        .enter()
        .append('line')
        .attr('x1', CHART_SETTINGS.margins.left)
        .attr('x2', chartWidth - CHART_SETTINGS.margins.right)
        .attr('y1', (d) => yScale(d))
        .attr('y2', (d) => yScale(d))
        .attr('stroke', BRAND_COLORS.gray[300])
        .attr('stroke-dasharray', '2,2');

      // Add axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Add percentile labels on the right
      const percentileAxis = d3.axisRight(yScale)
        .tickValues([1, 10, 25, 50, 75, 90, 99])
        .tickFormat((d) => {
          // Find the closest percentile for this RIT score
          const percentiles = [1, 10, 25, 50, 75, 90, 99];
          for (const p of percentiles) {
            const ritForP = getRITForPercentile(p, data.gradeLevel);
            if (Math.abs(ritForP - Number(d)) < 3) {
              return formatPercentileForParents(p);
            }
          }
          return '';
        });

      g.append('g')
        .attr('transform', `translate(0, ${chartHeight - CHART_SETTINGS.margins.bottom})`)
        .call(xAxis)
        .selectAll('text')
        .style('font-family', FONTS.primary)
        .style('font-size', `${FONTS.sizes.body}px`)
        .style('fill', BRAND_COLORS.gray[700])
        .style('font-weight', FONTS.weights.semibold)
        .attr('dy', '1.5em');

      g.append('g')
        .attr('transform', `translate(${CHART_SETTINGS.margins.left}, 0)`)
        .call(yAxis)
        .selectAll('text')
        .style('font-family', FONTS.primary)
        .style('font-size', `${FONTS.sizes.small}px`)
        .style('fill', BRAND_COLORS.gray[700])
        .style('font-weight', FONTS.weights.medium);

      // Add percentile axis on the right
      g.append('g')
        .attr('transform', `translate(${chartWidth - CHART_SETTINGS.margins.right}, 0)`)
        .call(percentileAxis)
        .selectAll('text')
        .style('font-family', FONTS.primary)
        .style('font-size', `${FONTS.sizes.small}px`)
        .style('fill', BRAND_COLORS.gray[600])
        .style('font-weight', FONTS.weights.medium);

      // Add Y-axis label
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0)
        .attr('x', 0 - chartHeight / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-family', FONTS.primary)
        .style('font-size', `${FONTS.sizes.body}px`)
        .style('font-weight', FONTS.weights.medium)
        .style('fill', BRAND_COLORS.gray[700])
        .text('RIT Score');

      // Add Percentile label on right
      g.append('text')
        .attr('transform', 'rotate(90)')
        .attr('y', -(chartWidth - CHART_SETTINGS.margins.right + 40))
        .attr('x', chartHeight / 2)
        .style('text-anchor', 'middle')
        .style('font-family', FONTS.primary)
        .style('font-size', `${FONTS.sizes.body}px`)
        .style('font-weight', FONTS.weights.medium)
        .style('fill', BRAND_COLORS.gray[600])
        .text('Performance Level');

      // Draw bars
      const bars = g.selectAll('.bar').data(allScores);

      bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => xScale(d.label)!)
        .attr('y', (d) => yScale(d.score))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => chartHeight - CHART_SETTINGS.margins.bottom - yScale(d.score))
        .attr('fill', (d) => {
          if (d.type === 'current') return CHART_COLORS.current;
          // Use gradient of green for projections
          const index = dynamicProjections.findIndex(p => p.type === d.type);
          const opacity = 0.4 + (index / dynamicProjections.length) * 0.6;
          return d3.color(BRAND_COLORS.primary)!.copy({opacity}).toString();
        })
        .attr('rx', CHART_SETTINGS.barChart.cornerRadius);

      // Add value labels on bars
      bars
        .enter()
        .append('text')
        .attr('x', (d) => xScale(d.label)! + xScale.bandwidth() / 2)
        .attr('y', (d) => yScale(d.score) - 5)
        .attr('text-anchor', 'middle')
        .style('font-family', FONTS.primary)
        .style('font-size', `${FONTS.sizes.small}px`)
        .style('font-weight', FONTS.weights.bold)
        .style('fill', BRAND_COLORS.gray[800])
        .text((d) => d.score);

      // Add percentile labels below bars
      bars
        .enter()
        .append('text')
        .attr('x', (d) => xScale(d.label)! + xScale.bandwidth() / 2)
        .attr('y', chartHeight - CHART_SETTINGS.margins.bottom + 55)
        .attr('text-anchor', 'middle')
        .style('font-family', FONTS.primary)
        .style('font-size', `${FONTS.sizes.small}px`)
        .style('font-weight', FONTS.weights.medium)
        .style('fill', BRAND_COLORS.gray[600])
        .text((d) => d.percentile ? formatPercentileForParents(d.percentile) : '');

      // Add target lines if enabled
      if (showTargets && data.targets) {
        // Grade level target line (50th percentile)
        g.append('line')
          .attr('x1', CHART_SETTINGS.margins.left)
          .attr('x2', chartWidth - CHART_SETTINGS.margins.right)
          .attr('y1', yScale(data.targets.gradeLevelScore))
          .attr('y2', yScale(data.targets.gradeLevelScore))
          .attr('stroke', CHART_COLORS.target)
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', '5,5');

        g.append('text')
          .attr('x', CHART_SETTINGS.margins.left + 10)
          .attr('y', yScale(data.targets.gradeLevelScore) - 5)
          .attr('text-anchor', 'start')
          .style('font-family', FONTS.primary)
          .style('font-size', `${FONTS.sizes.small}px`)
          .style('font-weight', FONTS.weights.bold)
          .style('fill', CHART_COLORS.target)
          .text('Grade Level (Top 50%)');

        // 90th percentile target line
        g.append('line')
          .attr('x1', CHART_SETTINGS.margins.left)
          .attr('x2', chartWidth - CHART_SETTINGS.margins.right)
          .attr('y1', yScale(data.targets.ninetiethPercentileScore))
          .attr('y2', yScale(data.targets.ninetiethPercentileScore))
          .attr('stroke', BRAND_COLORS.primary)
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', '5,5');

        g.append('text')
          .attr('x', CHART_SETTINGS.margins.left + 10)
          .attr('y', yScale(data.targets.ninetiethPercentileScore) - 5)
          .attr('text-anchor', 'start')
          .style('font-family', FONTS.primary)
          .style('font-size', `${FONTS.sizes.small}px`)
          .style('font-weight', FONTS.weights.bold)
          .style('fill', BRAND_COLORS.primary)
          .text('Mastery (Top 10%)');
      }

      // Add improvement indicators
      if (showProjections) {
        dynamicProjections.forEach((projection) => {
          const x = xScale(projection.label)! + xScale.bandwidth() / 2;
          const y = yScale(projection.score) - 20;

          g.append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('text-anchor', 'middle')
            .style('font-family', FONTS.primary)
            .style('font-size', `${FONTS.sizes.tiny}px`)
            .style('font-weight', FONTS.weights.bold)
            .style('fill', BRAND_COLORS.primary)
            .text(`+${projection.improvement || 0}`);
        });
      }
    },
    [data, layout, showProjections, showPeerComparison, showTargets]
  );

  return (
    <div className="visualization-container">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={chartHeight + dimensions.headerHeight + dimensions.padding}
        style={{ backgroundColor: 'white' }}
      />
    </div>
  );
}