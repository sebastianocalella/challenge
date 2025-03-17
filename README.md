# Content Management System

## Database Setup

This project uses PostgreSQL for data storage. Follow these steps to set up the database:

### Prerequisites
- Docker and Docker Compose

### Setup Instructions

1. Start the PostgreSQL database:
   ```bash
   npm run db:start
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   (Edit .env file if needed)

3. Start the development server:
   ```bash
   npm run dev
   ```

Or use the combined command to start both database and server:
```bash
npm run start
```

### Database Schema

The application uses a single table `content_items` with the following structure:
- `id`: Primary key
- `title`: Content title (max 200 chars)
- `description`: Content description (max 1000 chars)
- `category`: Content category (Leadership, Managing Complexity, etc.)
- `language`: Content language code (en, it, es, etc.)
- `provider`: Content provider (Skilla, LinkedIn, etc.)
- `role`: Target role (Mentor/Coach, Mentee/Coachee)
- `file_name`: Name of the uploaded file
- `file_data`: Binary content of the uploaded file
- `file_type`: MIME type of the uploaded file
- `created_at`: Timestamp of creation