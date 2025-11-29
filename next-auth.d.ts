declare module 'next-auth/react' {
  export function signIn(provider?: string, options?: Record<string, unknown>): Promise<void>;
  export function signOut(options?: Record<string, unknown>): Promise<void>;
  export function useSession(): { data: any; status: string };
}
