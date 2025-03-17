// Path: src/lib/services/contentService.ts

import type { ContentItem } from '$lib/models/ContentItem';

// Interface for the API response
interface ApiResponse {
  result: any;
  error?: string;
}

// Get all content items
export async function getContentItems(): Promise<ContentItem[]> {
  try {
    const response = await fetch('/api/content');
    const data: ApiResponse = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Map the API result to ContentItem format
    return data.result.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      description: item.description,
      category: item.category,
      language: item.language,
      provider: item.provider,
      role: item.role,
      file: null, // We don't get the file from API, just metadata
      fileName: item.file_name
    }));
  } catch (error) {
    console.error('Failed to fetch content items:', error);
    throw error;
  }
}

// Upload a new content item
export async function uploadContentItem(item: ContentItem): Promise<ContentItem> {
  try {
    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    formData.append('title', item.title);
    formData.append('description', item.description);
    formData.append('category', item.category);
    formData.append('language', item.language);
    formData.append('provider', item.provider);
    formData.append('role', item.role);
    
    // Add file if present
    if (item.file) {
      formData.append('file', item.file);
    }
    
    const response = await fetch('/api/content', {
      method: 'POST',
      body: formData
    });
    
    const data: ApiResponse = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Map the API result back to ContentItem
    return {
      id: data.result.id.toString(),
      title: data.result.title,
      description: data.result.description,
      category: data.result.category,
      language: data.result.language,
      provider: data.result.provider,
      role: data.result.role,
      file: null,
      fileName: data.result.file_name
    };
  } catch (error) {
    console.error('Failed to upload content item:', error);
    throw error;
  }
}

// Get file download URL
export function getFileDownloadUrl(id: string): string {
  return `/api/content/${id}/file`;
}