<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let isOpen = false;
    export let fileContent: string | null = null;
    export let fileType: string | null = null;
    
    const dispatch = createEventDispatcher<{
      close: void;
    }>();
    
    function handleClose() {
      dispatch('close');
    }
    
    function handleBackdropClick(event: MouseEvent) {
      // Only close if clicking directly on the backdrop, not on its children
      if (event.target === event.currentTarget) {
        handleClose();
      }
    }
  </script>
  
  {#if isOpen}
    <div 
      class="dialog-backdrop" 
      on:click={handleBackdropClick} 
      on:keydown={(event) => event.key === 'Escape' && handleClose()} 
      role="button" 
      tabindex="0"
    >
      <div 
        class="dialog-content" 
        role="dialog" 
        aria-modal="true"
      >
        {#if fileContent}
          {#if fileType?.includes('pdf')}
            <iframe 
              src={`data:application/pdf;base64,${fileContent}`} 
              title="PDF Viewer" 
              class="file-viewer"
            ></iframe>
          {:else if fileType?.includes('image')}
            <img 
              src={`data:${fileType};base64,${fileContent}`} 
              alt="Document Preview" 
              class="file-viewer"
            />
          {:else if fileType?.includes('text') || fileType?.includes('application/json')}
            <div class="text-viewer">
              <pre>{fileContent}</pre>
            </div>
          {:else}
            <div class="unsupported-format">
              <p>Preview not available for this file type. Please download the file.</p>
            </div>
          {/if}
        {:else}
          <div class="loading">Loading...</div>
        {/if}
      </div>
    </div>
  {/if}
  
  <style>
    .dialog-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1100;
    }
    
    .dialog-content {
      background-color: white;
      border-radius: 8px;
      width: 90%;
      height: 90%;
      max-width: 900px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
    }
    
    .file-viewer {
      width: 100%;
      height: 100%;
      border: none;
    }
    
    .text-viewer {
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 1rem;
      background-color: #f9f9f9;
    }
    
    .text-viewer pre {
      white-space: pre-wrap;
      font-family: monospace;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .loading, .unsupported-format {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      color: #666;
    }
  </style>