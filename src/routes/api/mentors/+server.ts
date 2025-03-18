import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {initializeDb} from '$lib/server/db';

export const GET: RequestHandler = async () => {
  try {
    const db = await initializeDb();
    const result = await db.query(
      `SELECT id, title, description, category, language, provider, role, file_name, file_type, created_at
       FROM content_items`
    );
    
    return json({ result: result.rows });
  } catch (error) {
    console.error('Error fetching content items:', error);
    return json({ error: 'Failed to fetch content items' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const language = formData.get('language') as string;
    const provider = formData.get('provider') as string;
    const role = formData.get('role') as string;
    const file = formData.get('file');
    
    // Initialize file-related variables
    let fileName = null;
    let fileType = null;
    let fileData = null;
    
    // Process file if it exists
    if (file && file instanceof File) {
      // Get file name and type
      fileName = file.name;
      fileType = file.type;
      
      // Check if file type is acceptable when a file is provided
      const acceptableTypes = [
        'application/pdf',                                // PDF
        'text/plain',                                     // TXT
        'application/vnd.ms-powerpoint',                  // PPT
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
        'application/msword',                             // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'video/mp4',                                      // MP4
        'video/x-msvideo',                                // AVI
        'video/quicktime'                                 // MOV
      ];
      
      if (!acceptableTypes.includes(fileType)) {
        return json({ 
          error: 'Unsupported file type. Acceptable types are PDF, TXT, PPT, PPTX, DOC, DOCX, MP4, AVI, and MOV.' 
        }, { status: 400 });
      }
      
      // Read file data as ArrayBuffer
      const fileArrayBuffer = await file.arrayBuffer();
      
      // Convert ArrayBuffer to Base64 string for storage
      fileData = Buffer.from(fileArrayBuffer).toString('base64');
    }
    
    const db = await initializeDb();
    const result = await db.query(
      `INSERT INTO content_items (title, description, category, language, provider, role, file_name, file_type, file_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, title, description, category, language, provider, role, file_name, file_type`,
      [title, description, category, language, provider, role, fileName, fileType, fileData]
    );
    
    return json({ result: result.rows[0] });
  } catch (error) {
    console.error('Error creating content item:', error);
    return json({ error: 'Failed to create content item' }, { status: 500 });
  }
};