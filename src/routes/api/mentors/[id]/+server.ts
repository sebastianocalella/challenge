import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {initializeDb} from '$lib/server/db';

/* export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;
    const db = await initializeDb();
    const result = await db.query(
      `SELECT id, title, description, category, language, provider, role, file_name, file_type, created_at
       FROM content_items 
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return json({ error: 'Content item not found' }, { status: 404 });
    }
    
    return json({ result: result.rows[0] });
  } catch (error) {
    console.error(`Error fetching content item ${params.id}:`, error);
    return json({ error: 'Failed to fetch content item' }, { status: 500 });
  }
}; */

/* 
export const PUT: RequestHandler = async ({ params, request }) => {
};

export const DELETE: RequestHandler = async ({ params }) => {
}; */