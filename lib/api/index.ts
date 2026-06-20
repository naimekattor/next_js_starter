/**
 * API Service Layer Entry
 * 
 * Consolidates all services and the Axios client to allow clean imports throughout the app.
 * Example: `import { authService, userService } from '@/lib/api';`
 * 
 * WHO SHOULD USE IT: Any page or component fetching data.
 * WHEN TO MODIFY: Adding a new API service file to export.
 */
export * from './axios';
export * from './endpoints';
export * from './auth.service';
export * from './user.service';
