// Deliberately has zero other imports. middleware.ts (Edge runtime) needs
// this constant without pulling in session.ts's node:crypto/Prisma usage
// into the edge bundle — importing it from auth-guard.ts would do exactly
// that, since auth-guard.ts also imports validateSession.
export const SESSION_COOKIE_NAME = "sanchari_admin_session";
