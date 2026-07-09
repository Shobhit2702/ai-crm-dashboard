import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root (up two levels from src/config)
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnv = [];

// Warn or throw for missing environment variables
if (process.env.NODE_ENV === 'production') {
  requiredEnv.push('GEMINI_API_KEY');
}

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables in production: ${missing.join(', ')}`);
}

// In development, warn if GEMINI_API_KEY is not set or is placeholder
if (
  !process.env.GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY === 'your_gemini_api_key_here'
) {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    'WARNING: GEMINI_API_KEY is not set or using placeholder. AI features will fail to initialize.'
  );
}

export const env = {
  PORT: parseInt(process.env.PORT || '5001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production'
};
