/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'next-auth' {
  import { NextApiHandler } from 'next';
  const NextAuth: (options: any) => NextApiHandler;
  export default NextAuth;
}

declare module 'next-auth/providers/google' {
  const GoogleProvider: (opts?: any) => any;
  export default GoogleProvider;
}
