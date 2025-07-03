/**
 * @fileoverview Custom hook for integrating D3 with React
 * @module lib/hooks/use-d3
 */

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

/**
 * Custom hook for using D3.js with React
 * @param {Function} renderFn - D3 rendering function
 * @param {Array} dependencies - React dependencies array
 * @returns {React.RefObject} Reference to the SVG element
 */
export function useD3<T extends SVGElement>(
  renderFn: (svg: d3.Selection<T, unknown, null, undefined>) => void,
  dependencies: React.DependencyList
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      renderFn(svg);
      
      // Cleanup function
      return () => {
        svg.selectAll('*').remove();
      };
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderFn, ...dependencies]);

  return ref;
} 