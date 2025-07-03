/**
 * @fileoverview File storage service for managing visualization files
 * @module services/storage/file-storage
 */

import fs from 'fs/promises';
import path from 'path';
import { generateId } from '@/lib/utils';

const STORAGE_BASE_PATH = process.env.STORAGE_PATH || './storage';
const VISUALIZATIONS_PATH = path.join(STORAGE_BASE_PATH, 'visualizations');
const TEMP_PATH = path.join(STORAGE_BASE_PATH, 'temp');

// Ensure storage directories exist
async function ensureDirectories() {
  await fs.mkdir(VISUALIZATIONS_PATH, { recursive: true });
  await fs.mkdir(TEMP_PATH, { recursive: true });
}

/**
 * Save a file to storage
 * @param {Buffer} data - File data
 * @param {string} filename - Original filename
 * @param {string} type - File type (visualization/temp)
 * @returns {Promise<{ id: string; path: string; filename: string }>} File metadata
 */
export async function saveFile(
  data: Buffer,
  filename: string,
  type: 'visualization' | 'temp' = 'visualization'
): Promise<{ id: string; path: string; filename: string }> {
  await ensureDirectories();

  const id = generateId();
  const ext = path.extname(filename);
  const storedFilename = `${id}${ext}`;
  const basePath = type === 'visualization' ? VISUALIZATIONS_PATH : TEMP_PATH;
  const filePath = path.join(basePath, storedFilename);

  await fs.writeFile(filePath, data);

  return {
    id,
    path: filePath,
    filename: storedFilename,
  };
}

/**
 * Get a file from storage
 * @param {string} id - File ID
 * @param {string} type - File type (visualization/temp)
 * @returns {Promise<Buffer>} File data
 */
export async function getFile(
  id: string,
  type: 'visualization' | 'temp' = 'visualization'
): Promise<Buffer> {
  const basePath = type === 'visualization' ? VISUALIZATIONS_PATH : TEMP_PATH;
  const files = await fs.readdir(basePath);
  
  // Find file with matching ID
  const file = files.find(f => f.startsWith(id));
  if (!file) {
    throw new Error(`File not found: ${id}`);
  }

  const filePath = path.join(basePath, file);
  return fs.readFile(filePath);
}

/**
 * Delete a file from storage
 * @param {string} id - File ID
 * @param {string} type - File type (visualization/temp)
 * @returns {Promise<void>}
 */
export async function deleteFile(
  id: string,
  type: 'visualization' | 'temp' = 'visualization'
): Promise<void> {
  const basePath = type === 'visualization' ? VISUALIZATIONS_PATH : TEMP_PATH;
  const files = await fs.readdir(basePath);
  
  // Find file with matching ID
  const file = files.find(f => f.startsWith(id));
  if (!file) {
    return; // File doesn't exist, nothing to delete
  }

  const filePath = path.join(basePath, file);
  await fs.unlink(filePath);
}

/**
 * Clean up old files
 * @param {number} maxAgeInDays - Maximum age in days
 * @param {string} type - File type (visualization/temp)
 * @returns {Promise<number>} Number of files deleted
 */
export async function cleanupOldFiles(
  maxAgeInDays: number,
  type: 'visualization' | 'temp' = 'temp'
): Promise<number> {
  const basePath = type === 'visualization' ? VISUALIZATIONS_PATH : TEMP_PATH;
  const files = await fs.readdir(basePath);
  const maxAgeMs = maxAgeInDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  let deletedCount = 0;

  for (const file of files) {
    const filePath = path.join(basePath, file);
    const stats = await fs.stat(filePath);
    const age = now - stats.mtimeMs;

    if (age > maxAgeMs) {
      await fs.unlink(filePath);
      deletedCount++;
    }
  }

  return deletedCount;
}

/**
 * Get file metadata
 * @param {string} id - File ID
 * @param {string} type - File type (visualization/temp)
 * @returns {Promise<{ size: number; created: Date; modified: Date }>} File metadata
 */
export async function getFileMetadata(
  id: string,
  type: 'visualization' | 'temp' = 'visualization'
): Promise<{ size: number; created: Date; modified: Date }> {
  const basePath = type === 'visualization' ? VISUALIZATIONS_PATH : TEMP_PATH;
  const files = await fs.readdir(basePath);
  
  const file = files.find(f => f.startsWith(id));
  if (!file) {
    throw new Error(`File not found: ${id}`);
  }

  const filePath = path.join(basePath, file);
  const stats = await fs.stat(filePath);

  return {
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime,
  };
}

/**
 * Get storage path for a file
 * @param {string} id - File ID
 * @param {string} type - File type (visualization/temp)
 * @returns {string} Absolute file path
 */
export function getStoragePath(
  id: string,
  type: 'visualization' | 'temp' = 'visualization'
): string {
  const basePath = type === 'visualization' ? VISUALIZATIONS_PATH : TEMP_PATH;
  return path.join(basePath, id);
} 