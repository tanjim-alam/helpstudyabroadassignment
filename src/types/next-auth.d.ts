// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
      firstName?: string;
      lastName?: string;
    };
  }
}
