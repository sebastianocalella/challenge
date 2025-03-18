<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let isOpen = false;
  export let fileContent: string | null = null; 
  export let mockedFileContent: File | null = null;
  export let fileType: string | null = null;
  
  const dispatch = createEventDispatcher<{
    close: void;
  }>();
  
  // Local state to store processed file content
  let processedContent: string | null = null;
  let objectUrl: string | null = null;
  
  // Process the mocked file when component mounts or when mockedFileContent changes
  $: if (mockedFileContent && isOpen) {
    processFile(mockedFileContent);
  }
  
  async function processFile(file: File) {
    // Clean up any previous objectUrl
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    
    // Use the file's type if fileType is not provided
    const type = fileType || file.type;
    
    if (type.includes('pdf') || type.includes('image') || type.includes('video')) {
      // For PDFs and images, create an object URL
      objectUrl = URL.createObjectURL(file);
    } else if (type.includes('text') || type.includes('application/json')) {
      // For text files, read as text
      const reader = new FileReader();
      reader.onload = (e) => {
        processedContent = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  }
  
  // Clean up object URL when component is unmounted
  onMount(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  });
  
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
    aria-label="Close dialog"
  >
    <div class="dialog-content" role="dialog" aria-modal="true">
      {#if mockedFileContent}
        {#if fileType?.includes('pdf')}
          <iframe 
            src={objectUrl} 
            title="PDF Viewer" 
            class="file-viewer"
          ></iframe>
        {:else if fileType?.includes('image')}
          <img 
            src={objectUrl} 
            alt="Document Preview" 
            class="file-viewer"
          />
        {:else if fileType?.includes('video')}
          <video 
            src={objectUrl} 
            controls 
            autoplay 
            class="file-viewer" 
            title="Video Player">
            <track kind="captions" src="path/to/captions.vtt" srclang="en" label="English">
            Your browser does not support video playback.
          </video>
        {:else if fileType?.includes('text') || fileType?.includes('application/json')}
          <div class="text-viewer">
            <pre>{processedContent}</pre>
          </div>
        {:else}
          <div class="unsupported-format">
            <p>Preview not available for this file type ({mockedFileContent.type}). Please download the file.</p>
          </div>
        {/if}
      {:else}
        <div class="loading">No file to display</div>
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