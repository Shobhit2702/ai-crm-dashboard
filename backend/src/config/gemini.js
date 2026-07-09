import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';

let ai = null;

const apiKey = env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error('Failed to initialize Google Gen AI client:', error.message);
  }
} else {
  // In development, we allow running the backend without a key for non-AI routes
  console.log('Gemini API client not initialized (missing or placeholder key).');
}

export { ai };
