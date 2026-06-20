import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from './api/auth.service';

/**
 * NextAuth Configuration Options
 * 
 * WHO SHOULD USE IT: API routers or server actions validating tokens.
 * WHEN TO MODIFY: Adding OAuth providers (Google, Github), custom jwt lifetimes, or callback transformations.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        try {
          // Verify with decoupled authService
          const authData = await authService.login(credentials.email, credentials.password);
          if (authData && authData.user) {
            return {
              id: authData.user.id,
              name: authData.user.name,
              email: authData.user.email,
              role: authData.user.role,
              accessToken: authData.accessToken,
              refreshToken: authData.refreshToken,
            };
          }
          return null;
        } catch (error: unknown) {
          const errMsg = error instanceof Error ? error.message : (error as { message?: string })?.message || 'Authentication failed';
          throw new Error(errMsg);
        }
      },
    }),
  ],
  callbacks: {
    // Sync backend tokens and roles with NextAuth JWT cookie
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    // Expose tokens and roles to the React Client session contexts
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 Days session lifetime
  },
  secret: process.env.NEXTAUTH_SECRET,
};
