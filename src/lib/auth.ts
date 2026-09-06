import { NextAuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// SECURITY: Fail fast if critical env vars are missing in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('FATAL: NEXTAUTH_SECRET is not set. Refusing to start.');
  }
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('FATAL: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set.');
  }
}

export const authOptions: NextAuthOptions = {
  // @auth/prisma-adapter targets the newer @auth/core Adapter type, which is
  // structurally compatible with but not identical to next-auth v4's own
  // Adapter type — a known cross-package mismatch. Casting to the concrete
  // `Adapter` type (rather than `any`) keeps this a documented, narrow
  // workaround instead of an escape hatch from type-checking altogether.
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;
        return { id: user.id, email: user.email, name: user.name, tier: user.tier };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        token.tier = dbUser?.tier || 'FREE';
      }
      // SECURITY: Never trust a client-supplied `session` payload for tier —
      // re-read it from the DB instead. `trigger === "update"` is reachable by
      // any signed-in client via `useSession().update(...)`, so accepting
      // arbitrary fields from it (as this used to) let a FREE user grant
      // themselves PRO without paying.
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        token.tier = dbUser?.tier || 'FREE';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.tier = token.tier;
      }
      return session;
    }
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};
