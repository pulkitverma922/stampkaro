import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "./admin";
import type { Role } from "@/types/models";
import { ApiError, toErrorResponse } from "@/lib/utils/api";

export type AuthedUser = { uid: string; email?: string; role: Role };
type Handler<C> = (req: NextRequest, ctx: C, user: AuthedUser) => Promise<NextResponse>;

/** Wrap a route handler: verifies Firebase ID token and (optionally) role. */
export function withAuth<C>(handler: Handler<C>, opts: { roles?: Role[] } = {}) {
  return async (req: NextRequest, ctx: C) => {
    try {
      const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
      if (!token) throw new ApiError("UNAUTHENTICATED", "Missing token", 401);
      const decoded = await adminAuth.verifyIdToken(token);
      const role = ((decoded.role as Role | undefined) ?? "customer");
      if (opts.roles && !opts.roles.includes(role) && role !== "admin")
        throw new ApiError("FORBIDDEN", "Insufficient role", 403);
      return await handler(req, ctx, { uid: decoded.uid, email: decoded.email, role });
    } catch (e) {
      return toErrorResponse(e);
    }
  };
}
