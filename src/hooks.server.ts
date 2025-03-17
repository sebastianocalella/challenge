import { building } from '$app/environment';
import dotenv from 'dotenv';

// Only load environment variables if we're not building
if (!building) {
  dotenv.config();
}

// No hooks needed yet, just loading env vars
interface HandleErrorReturn {
  message: string;
  code: string;
}

export const handleError = ({ error }): HandleErrorReturn => {
  console.error('Caught server error:', error);
  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR'
  };
};