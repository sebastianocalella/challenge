import { writable } from 'svelte/store';
import type { ContentItem } from '$lib/models/ContentItem';

export interface ContentItemResponse extends Omit<ContentItem, 'file'> {
  id: string;
  created_at: string;
  file_type?: string;
}

function createContentStore() {
  const { subscribe, set, update } = writable<ContentItemResponse[]>([]);

  return {
    subscribe,
    
    // Fetch all content items
    async fetchAll() {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) throw new Error('Failed to fetch content items');
        const data = await response.json();
        set(data);
        return data;
      } catch (error) {
        console.error('Error in fetchAll:', error);
        return [];
      }
    },
    
    // Add a new content item
    async add(contentItem: ContentItem) {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('title', contentItem.title);
        formData.append('description', contentItem.description || '');
        formData.append('category', contentItem.category || '');
        formData.append('language', contentItem.language || '');
        formData.append('provider', contentItem.provider || '');
        formData.append('role', contentItem.role);
        
        if (contentItem.file) {
          formData.append('file', contentItem.file);
        }
        
        const response = await fetch('/api/content', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Failed to add content item');
        
        const newItem = await response.json();
        
        // Update the store with the new item
        update(items => [newItem, ...items]);
        
        return newItem;
      } catch (error) {
        console.error('Error in add:', error);
        throw error;
      }
    },
    
    // Delete a content item
    async delete(id: string) {
      try {
        const response = await fetch(`/api/content/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete content item');
        
        // Remove the item from the store
        update(items => items.filter(item => item.id !== id));
        
        return true;
      } catch (error) {
        console.error('Error in delete:', error);
        return false;
      }
    }
  };
}

export const contentStore = createContentStore();