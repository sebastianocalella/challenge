// Path: src/lib/models/ContentItem.ts

export interface ContentItem {
  id?: string;
  title: string;
  description: string;
  category: string;
  language: string;
  provider: string;
  role: string;
  file: File | null;
  fileName?: string;
  created_at?: string;
}

// Form validation interface
export interface FormErrors {
  title: string;
  role: string;
}

// Constants for form options
export const CATEGORIES = ['Leadership', 'Managing Complexity', 'Communication', 'Problem Solving', 'Teamwork'];
export const LANGUAGES = ['en', 'it', 'es', 'fr', 'de'];
export const PROVIDERS = ['Skilla', 'Linkedin', 'Pack', 'Mentor', 'External'];
export const ROLE_OPTIONS = ['Mentor/Coach', 'Mentee/Coachee'];