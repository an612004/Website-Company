declare module 'next-auth/react' {
  export * from 'next-auth/react/types';
  export function signIn(provider?: string | undefined, options?: Record<string, unknown>): Promise<void>;
}
