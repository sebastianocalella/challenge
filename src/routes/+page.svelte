<script lang="ts">
  import { onMount } from 'svelte';
  import UploadDialog from '$lib/components/UploadDialog.svelte';
  import type { ContentItem } from '$lib/models/ContentItem';
  import { getContentItems, uploadContentItem, getFileDownloadUrl } from '$lib/services/contentService';
  
  let showDialog = false;
  let items: ContentItem[] = [];
  let loading = true;
  let error = '';
  
  // Fetch content items when component mounts
  onMount(async () => {
    try {
      items = await getContentItems();
      loading = false;
    } catch (err) {
      error = 'Failed to load content items. Please try again later.';
      loading = false;
      console.error(err);
    }
  });
  
  function openDialog() {
    showDialog = true;
  }

  function closeDialog() {
    showDialog = false;
  }

  async function handleSave(event: CustomEvent<ContentItem>) {
    try {
      const newItem = event.detail;
      // Upload the item to the server
      const savedItem = await uploadContentItem(newItem);
      
      // Add the saved item to the local state
      items = [...items, savedItem];
      closeDialog();
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Failed to save content item. Please try again.');
    }
  }
  
  function formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }
</script>

<div class="container">
  <header>
    <h1>Mentoring data uploader</h1>
    <button class="add-button" on:click={openDialog}>Add new</button>
  </header>
  
  <main>
    {#if loading}
      <div class="loading">Loading content items...</div>
    {:else if error}
      <div class="error-message">{error}</div>
    {:else}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Language</th>
            <th>Provider</th>
            <th>Role</th>
            <th>File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#if items.length === 0}
            <tr>
              <td colspan="7" class="empty-state">No content uploaded yet</td>
            </tr>
          {:else}
            {#each items as item}
              <tr>
                <td>{item.title}</td>
                <td>{item.category || '-'}</td>
                <td>{item.language || '-'}</td>
                <td>{item.provider || '-'}</td>
                <td>{item.role}</td>
                <td>
                  {#if item.fileName && item.id}
                    <a href={getFileDownloadUrl(item.id)} class="file-link" download>{item.fileName}</a>
                  {:else}
                    <span>No file</span>
                  {/if}
                </td>
                <td>
                  {#if item.id}
                    <a href={getFileDownloadUrl(item.id)} class="action-button" download>Download</a>
                  {/if}
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    {/if}
  </main>
</div>

{#if showDialog}
  <UploadDialog 
    on:cancel={closeDialog} 
    on:save={handleSave} 
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

  .file-link {
    color: #0066cc;
    text-decoration: none;
  }

  .file-link:hover {
    text-decoration: underline;
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
</style>