<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ContentItem } from '$lib/models/ContentItem';
  import { getFileDownloadUrl, fetchFileContent } from '$lib/services/contentService';
  import FileViewerDialog from '$lib/components/FielViewerDialog.svelte';
  
  export let item: ContentItem;
  
  const dispatch = createEventDispatcher<{
    close: void;
  }>();
  
  function handleClose() {
    dispatch('close');
  }

  // State for file viewer
  let showFileViewer = false;
  let fileContent: string | null = null;
  let fileType: string | null = null;
  let isLoading = false;
  
  async function handleShowFile() {
    if (!item.id) return;
    
    isLoading = true;
    try {
      const result = await fetchFileContent(item.id);
      fileContent = result.content;
      fileType = result.type;
      showFileViewer = true;
    } catch (error) {
      console.error('Error fetching file:', error);
      alert('Failed to load file. Please try downloading instead.');
    } finally {
      isLoading = false;
    }
  }
  
  function handleFileViewerClose() {
    showFileViewer = false;
  }
</script>

<div class="dialog-backdrop">
  <div class="dialog">
    <h2>Content Details</h2>
    
    <div class="content-details">
      <div class="detail-group">
        <label for="title">Title</label>
        <div id="title" class="detail-value">{item.title || '-'}</div>
      </div>
      
      {#if item.description}
        <div class="detail-group">
          <label for="description">Description</label>
          <div id="description" class="detail-value description">{item.description}</div>
        </div>
      {/if}
      
      <div class="detail-row">
        <div class="detail-group">
          <label for="category">Category</label>
          <div id=category class="detail-value">{item.category || '-'}</div>
        </div>
        
        <div class="detail-group">
          <label for="language">Language</label>
          <div id=language class="detail-value">{item.language || '-'}</div>
        </div>
      </div>
      
      <div class="detail-row">
        <div class="detail-group">
          <label for="provider">Provider</label>
          <div id=provider class="detail-value">{item.provider || '-'}</div>
        </div>
        
        <div class="detail-group">
          <label for="role">Role</label>
          <div id=role class="detail-value">{item.role || '-'}</div>
        </div>
      </div>
      
      <div class="file-section">
        <label for="File">File</label>
        {#if item.fileName && item.id}
          <div class="file-details">
            <div class="file-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="file-name">{item.fileName}</div>
            <div class="file-actions">
              <button type="button" class="show-button" on:click={handleShowFile} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Show'}
              </button>
              <a href={getFileDownloadUrl(item.id)} class="download-button" download>Download</a>
            </div>
          </div>
        {:else}
          <div class="no-file">No file attached</div>
        {/if}
      </div>
    </div>
    
    <div class="dialog-actions">
      <button type="button" class="close-button" on:click={handleClose}>Close</button>
    </div>
  </div>
</div>

<FileViewerDialog 
  isOpen={showFileViewer} 
  fileContent={fileContent} 
  fileType={fileType}
  on:close={handleFileViewerClose}
/>

<style>
  .dialog-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .dialog {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 1.5rem 0;
  }

  .content-details {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .detail-row {
    display: flex;
    gap: 1.5rem;
  }

  .detail-row .detail-group {
    flex: 1;
  }

  .detail-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 500;
    color: #666;
    font-size: 0.9rem;
  }

  .detail-value {
    font-size: 1rem;
    color: #333;
  }

  .description {
    white-space: pre-wrap;
    line-height: 1.5;
    max-height: 200px;
    overflow-y: auto;
    padding: 0.5rem;
    background-color: #f9f9f9;
    border-radius: 4px;
  }

  .file-section {
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
  }

  .file-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 4px;
  }

  .file-icon {
    color: #0066cc;
  }

  .file-name {
    flex: 1;
    font-size: 1rem;
    word-break: break-all;
  }

  .file-actions {
    display: flex;
    gap: 0.5rem;
  }

  .no-file {
    color: #666;
    font-style: italic;
    margin-top: 0.5rem;
  }

  .show-button {
    background-color: #00aa66;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
  }

  .show-button:hover {
    background-color: #008855;
  }

  .show-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .download-button {
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
  }

  .download-button:hover {
    background-color: #0055aa;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .close-button {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    cursor: pointer;
  }

  .close-button:hover {
    background-color: #e0e0e0;
  }
</style>