import { DefaultSession } from 'next-auth';

// This app stores the user's plan tier on the JWT and exposes it on the
// session, but next-auth's default types don't know about either — hence
// the module augmentation instead of `any`-casting `session.user` at every
// call site.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      tier: string;
    } & DefaultSession['user'];
  }

  interface User {
    tier?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    tier: string;
  }
}
