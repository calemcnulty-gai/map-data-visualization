import type { NextConfig } from "next";
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.local';

const envPath = resolve(process.cwd(), envFile);

// Only load if the file exists
if (existsSync(envPath)) {
  console.log(`Loading environment variables from ${envFile}`);
  config({ path: envPath });
} else {
  console.log(`Environment file ${envFile} not found, using default Next.js env loading`);
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
