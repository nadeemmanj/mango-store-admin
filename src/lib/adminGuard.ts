import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

// Roles that may use the admin area (same set the login page redirects to /admin).
export const ADMIN_ROLES = ['admin', 'manager', 'staff'];

export type SessionUser = { id?: string; role?: string };

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as SessionUser | undefined) ?? null;
}

export function isAdminRole(role?: string): boolean {
  return !!role && ADMIN_ROLES.includes(role);
}

/**
 * Call at the top of any admin-only API handler.
 * Returns a 401/403 response to send back, or null when the caller is allowed.
 *
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }
  if (!isAdminRole(user.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  return null;
}
