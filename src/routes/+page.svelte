<script lang="ts">
  import { onMount } from 'svelte';
  import UploadDialog from '$lib/components/UploadDialog.svelte';
  import ContentDetailsDialog from '$lib/components/ContentDetailsDialog.svelte';
  import type { ContentItem } from '$lib/models/ContentItem';
  import { getContentItems, uploadContentItem, getFileDownloadUrl } from '$lib/services/contentService';
  
  let showUploadDialog = false; // Renamed from showDialog
  let showDetailsDialog = false; // New state for details dialog
  let selectedItem: ContentItem | null = null; // Track which item is selected
  let items: ContentItem[] = [];
  let loading = true;
  let error = '';
  
  // Fetch content items when component mounts
  onMount(async () => {
    /* try {
      items = await getContentItems();
      loading = false;
    } catch (err) {
      error = 'Failed to load content items. Please try again later.';
      loading = false;
      console.error(err);
    } */
  });
  
  function openUploadDialog() {
    showUploadDialog = true;
  }

  function closeUploadDialog() {
    showUploadDialog = false;
  }
  
  function openDetailsDialog(item: ContentItem) {
    selectedItem = item;
    showDetailsDialog = true;
  }
  
  function closeDetailsDialog() {
    showDetailsDialog = false;
    selectedItem = null;
  }

  async function handleSave(event: CustomEvent<ContentItem>) {
    try {
      const newItem = event.detail;
      // Upload the item to the server
      const savedItem = await uploadContentItem(newItem);
      
      // Add the saved item to the local state
      items = [...items, savedItem];
      closeUploadDialog();
    } catch (err) {
      console.error('Error saving item:', err);

      // For debugging, create a mock saved item with file information
    const mockSavedItem = {
      ...event.detail,
      id: Date.now().toString(),
      fileName: event.detail.file ? event.detail.file.name : undefined,
      // Create a mock base64 encoded string for debugging
      fileData: event.detail.file ? 'data:mock/encoded;base64,TW9ja0ZpbGVDb250ZW50' : null,
      fileType: event.detail.file ? event.detail.file.type : null
    };
    items = [...items, mockSavedItem];
    }
    const newItem = event.detail;
       closeUploadDialog();
  }
</script>

<div class="container">
  <header>
    <h1>Mentoring data uploader</h1>RequestHandler
    <button class="add-button" on:click={openUploadDialog}>Add new</button>
  </header>
  
  <main>
    <!-- {#if loading}
      <div class="loading">Loading content items...</div>
    {:else if error}
      <div class="error-message">{error}</div>
    {:else} -->
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Language</th>
            <th>Provider</th>
            <th>Role</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {#if items.length === 0}
            <tr>
              <td colspan="7" class="empty-state">No content uploaded yet</td>
            </tr>
          {:else}
            {#each items as item}
              <tr on:click={() => openDetailsDialog(item)} class="content-row">
                <td class="title-column" title={item.title}>{item.title}</td>
                <td>{item.category || '-'}</td>
                <td>{item.language || '-'}</td>
                <td>{item.provider || '-'}</td>
                <td>{item.role}</td>
                <td class="file-column">
                  {#if item.file && item.id}
                    <span>{item.fileName}</span>
                  {/if}
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    <!-- {/if} -->
  </main>
</div>

{#if showUploadDialog}
  <UploadDialog 
    on:cancel={closeUploadDialog} 
    on:save={handleSave} 
  />
{/if}

{#if showDetailsDialog && selectedItem}
  <ContentDetailsDialog 
    item={selectedItem}
    on:close={closeDetailsDialog}
  />
{/if}

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .add-button {
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .add-button:hover {
    background-color: #0055aa;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f5f5f5;
    font-weight: 500;
  }
  
  .content-row {
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .content-row:hover {
    background-color: #f9f9f9;
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .action-button {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
  }

  .file-column {
    text-align: center;
  }

  .file-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #0066cc;
    cursor: pointer;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  
  .error-message {
    text-align: center;
    padding: 2rem;
    color: #e53935;
  }

  .title-column {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
</style>