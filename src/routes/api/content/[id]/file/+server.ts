import type { RequestHandler } from './$types';
import {initializeDb} from '$lib/server/db';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;
    const db = await initializeDb();
    const result = await db.query(
      'SELECT file_data, file_name, file_type FROM content_items WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0 || !result.rows[0].file_data) {
      return new Response('File not found', { status: 404 });
    }
    
    const { file_data, file_name, file_type } = result.rows[0];
    
    return new Response(file_data, {
      headers: {
        'Content-Type': file_type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file_name}"`
      }
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return new Response('Failed to fetch file', { status: 500 });
  }
};