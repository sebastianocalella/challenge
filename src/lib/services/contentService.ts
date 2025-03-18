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
    
    const response = await fetch('/api/mentors', {
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
      file: data.result.file,
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

// New function to fetch file content
export async function fetchFileContent(id: string): Promise<{content: string, type: string}> {
  try {
    const response = await fetch(`/api/mentors/${id}/file`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    
    const fileType = response.headers.get('content-type');
    
    // Get the file content as blob
    const blob = await response.blob();
    
    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64Content = reader.result as string;
        // Remove the Data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Data = base64Content.split(',')[1];
        resolve({
          content: base64Data,
          type: fileType || 'application/octet-stream'
        });
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to fetch file content:', error);
    throw error;
  }
}