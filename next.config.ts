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
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Improve hot reloading performance
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  
  // Webpack configuration for better hot reloading
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Enable webpack hot module replacement
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
      
      // Fix module resolution issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
