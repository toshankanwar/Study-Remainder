// lib/auth.ts - Simplest fix
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function getTokenPayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function formatAuthError(error: Record<string, unknown> | Error | unknown): string {
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  
  if (err.response?.data?.message) {
    return err.response.data.message;
  }
  
  if (err.message) {
    return err.message;
  }
  
  return 'An unexpected error occurred';
}
