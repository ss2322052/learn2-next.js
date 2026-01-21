import type { NextAuthConfig } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { Session } from 'next-auth';

import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import postgres from 'postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs'; 

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await sql<{ id: string, name: string, email: string, password: string, role: string }[]>`SELECT * FROM users WHERE email=${email}`;
    const userRow = result[0];

    if (!userRow) return undefined;

    const user: User = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      password: userRow.password,
      role: userRow.role as 'admin' | 'user',
    };

    return user; 
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// NextAuth の設定オブジェクトを定義
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

         if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }: { auth: Session | null; request: NextRequest }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async jwt({ token, user, account, profile, trigger }) { 
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token, user, trigger }) { 
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string; 
      }
      return session;
    },
  },
} satisfies NextAuthConfig;