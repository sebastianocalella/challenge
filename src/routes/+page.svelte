<script lang="ts">
    import { onMount } from 'svelte';
    import UploadDialog from '$lib/components/UploadDialog.svelte';
    import type { ContentItem } from '$lib/models/ContentItem';
    
    let showDialog = false;
    let items: ContentItem[] = [];
    
    function openDialog() {
      showDialog = true;
    }
  
    function closeDialog() {
      showDialog = false;
    }
  
    function handleSave(event: CustomEvent<ContentItem>) {
      const newItem = event.detail;
      items = [...items, {
        ...newItem,
        id: Date.now().toString()
      }];
      closeDialog();
    }
  </script>
  
  <div class="container">
    <header>
      <h1>Mentoring data uploader</h1>
      <button class="add-button" on:click={openDialog}>Add new</button>
    </header>
    
    <main>
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
                <td>{item.category}</td>
                <td>{item.language}</td>
                <td>{item.provider}</td>
                <td>{item.role}</td>
                <td>
                  <a href="#" class="file-link">{item.fileName}</a>
                </td>
                <td>
                  <button class="action-button">View</button>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
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
    }
  
    .file-link {
      color: #0066cc;
      text-decoration: none;
    }
  
    .file-link:hover {
      text-decoration: underline;
    }
  </style>