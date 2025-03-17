import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {initializeDb} from '$lib/server/db';

// GET endpoint to retrieve all content items
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

// POST endpoint to create a new content item
export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    // Extract values from form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const language = formData.get('language') as string;
    const provider = formData.get('provider') as string;
    const role = formData.get('role') as string;
    const file = formData.get('file') as File;
    
    // Process file if present
    let fileName = null;
    // File handling logic here...
    
    // Insert new content item
    const db = await initializeDb();
    const result = await db.query(
      `INSERT INTO content_items (title, description, category, language, provider, role, file_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, category, language, provider, role, file_name`,
      [title, description, category, language, provider, role, fileName]
    );
    
    return json({ result: result.rows[0] });
  } catch (error) {
    console.error('Error creating content item:', error);
    return json({ error: 'Failed to create content item' }, { status: 500 });
  }
};