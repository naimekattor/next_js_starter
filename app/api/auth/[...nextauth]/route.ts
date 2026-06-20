import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * NextAuth handler mapping GET and POST request endpoints
 * 
 * WHO SHOULD USE IT: Client login redirects or external session requests.
 * WHEN TO MODIFY: Not necessary unless implementing custom Next.js endpoint routing features.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
