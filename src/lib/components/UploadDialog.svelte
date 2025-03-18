<script lang="ts">
  import { CATEGORIES, LANGUAGES, PROVIDERS, ROLE_OPTIONS, type ContentItem, type FormErrors } from '$lib/models/ContentItem';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher<{
    cancel: void;
    save: ContentItem;
  }>();
  
  // Form data
  let formData: ContentItem = {
    title: '',
    description: '',
    category: '',
    language: '',
    provider: '',
    role: '',
    file: null
  };

  // Form validation
  let errors: FormErrors = {
    title: '',
    role: ''
  };

  // Handle file selection
  let fileInput: HTMLInputElement;
  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      formData.file = target.files[0];
    }
  }

  // Validate form
  function validateForm(): boolean {
    let isValid = true;
    
    // Validate title
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.length > 200) {
      errors.title = 'Title cannot exceed 200 characters';
      isValid = false;
    } else {
      errors.title = '';
    }
    
    // Validate role
    if (!formData.role) {
      errors.role = 'Role selection is required';
      isValid = false;
    } else {
      errors.role = '';
    }
    
    return isValid;
  }

  // Handle form submission
  function handleSubmit() {
    if (validateForm()) {
      // Prepare data for dispatch
      const itemToSave: ContentItem = {
        ...formData,
        //fileName: formData.file ? formData.file.name : 'No file'
      };
      
      // Dispatch save event with the new item
      dispatch('save', itemToSave);
    }
  }

  // Handle cancel
  function handleCancel() {
    dispatch('cancel');
  }
</script>

<div class="dialog-backdrop">
  <div class="dialog">
    <h2>Add New Content</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="title">
          Title <span class="required">*</span>
        </label>
        <input 
          type="text" 
          id="title" 
          bind:value={formData.title} 
          maxlength="200" 
          required
        />
        <div class="char-count">{formData.title.length}/200</div>
        {#if errors.title}
          <div class="error">{errors.title}</div>
        {/if}
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          bind:value={formData.description} 
          maxlength="1000"
        ></textarea>
        <div class="char-count">{formData.description.length}/1000</div>
      </div>
      
      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" bind:value={formData.category}>
          <option value="">Select a category</option>
          {#each CATEGORIES as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-group">
        <label for="language">Language</label>
        <select id="language" bind:value={formData.language}>
          <option value="">Select a language</option>
          {#each LANGUAGES as language}
            <option value={language}>{language}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-group">
        <label for="provider">Provider</label>
        <select id="provider" bind:value={formData.provider}>
          <option value="">Select a provider</option>
          {#each PROVIDERS as provider}
            <option value={provider}>{provider}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-group">
        <label for="role">
          Role <span class="required">*</span>
        </label>
        <div id="role" class="radio-group">
          {#each ROLE_OPTIONS as roleOption}
            <label class="radio-label">
              <input 
                type="radio" 
                name="role"
                value={roleOption}
                bind:group={formData.role}
              />
              {roleOption}
            </label>
          {/each}
        </div>
        {#if errors.role}
          <div class="error">{errors.role}</div>
        {/if}
      </div>
      
      <div class="form-group">
        <label for="file">File</label>
        <input 
          type="file" 
          id="file" 
          on:change={handleFileSelect}
          bind:this={fileInput}
          accept=".pdf,.txt,.ppt,.pptx,.doc,.docx,.mp4,.avi,.mov"
        />
        {#if formData.file}
          <div class="file-info">Selected: {formData.file.name}</div>
        {/if}
      </div>
      
      <div class="dialog-actions">
        <button type="button" class="cancel-button" on:click={handleCancel}>Cancel</button>
        <button type="submit" class="save-button">Save</button>
      </div>
    </form>
  </div>
</div>

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

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .required {
    color: #e53935;
  }

  input[type="text"],
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  textarea {
    height: 100px;
    resize: vertical;
  }

  .char-count {
    font-size: 0.8rem;
    color: #666;
    text-align: right;
    margin-top: 0.25rem;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .error {
    color: #e53935;
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  .file-info {
    font-size: 0.85rem;
    color: #666;
    margin-top: 0.5rem;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }

  .cancel-button {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    cursor: pointer;
  }

  .save-button {
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    cursor: pointer;
  }

  .cancel-button:hover {
    background-color: #e0e0e0;
  }

  .save-button:hover {
    background-color: #0055aa;
  }
</style>