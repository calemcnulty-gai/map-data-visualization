/**
 * @fileoverview PNG generation service for converting DOM elements to high-quality images
 * @module services/image-generation/png-generator
 */

import html2canvas from 'html2canvas';
import { EXPORT_SETTINGS } from '@/lib/constants/visualization';

export interface GeneratePngOptions {
  element: HTMLElement;
  scale?: number;
  backgroundColor?: string;
  quality?: number;
}

/**
 * Convert an HTML element to a PNG blob using html2canvas
 * @param {GeneratePngOptions} options - Generation options
 * @returns {Promise<Blob>} PNG blob
 */
export async function generatePngFromElement({
  element,
  scale = EXPORT_SETTINGS.scale,
  backgroundColor = 'white',
  quality = EXPORT_SETTINGS.quality,
}: GeneratePngOptions): Promise<Blob> {
  // Use html2canvas for reliable DOM to canvas conversion
  const canvas = await html2canvas(element, {
    scale,
    backgroundColor,
    logging: false,
    useCORS: true,
    allowTaint: true,
  });
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate PNG blob'));
        }
      },
      'image/png',
      quality
    );
  });
}



/**
 * Download a blob as a file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Filename for download
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename for visualization
 * @param {string} studentName - Student name
 * @param {string} subject - Subject (math/reading)
 * @returns {string} Formatted filename
 */
export function generateFilename(studentName: string, subject: string): string {
  const date = new Date().toISOString().split('T')[0];
  const sanitizedName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
  return `${sanitizedName}_${subject}_${date}.png`;
} 