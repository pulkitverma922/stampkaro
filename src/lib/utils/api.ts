import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ErrorCode =
  | "UNAUTHENTICATED" | "FORBIDDEN" | "VALIDATION" | "NOT_FOUND" | "COOLDOWN" | "DAILY_LIMIT"
  | "OUT_OF_RANGE" | "PLAN_EXPIRED" | "BRANCH_LIMIT" | "ALREADY_REDEEMED" | "CODE_EXPIRED" | "INTERNAL";

export class ApiError extends Error {
  constructor(public code: ErrorCode, message: string, public status = 400, public meta?: unknown) {
    super(message);
  }
}

export const ok = <T>(data: T, status = 200) => NextResponse.json({ ok: true, data }, { status });

export function toErrorResponse(e: unknown) {
  if (e instanceof ApiError)
    return NextResponse.json({ ok: false, error: { code: e.code, message: e.message, meta: e.meta } }, { status: e.status });
  if (e instanceof ZodError)
    return NextResponse.json({ ok: false, error: { code: "VALIDATION", message: "Invalid input", meta: e.flatten() } }, { status: 422 });
  console.error(e);
  return NextResponse.json({ ok: false, error: { code: "INTERNAL", message: "Something went wrong" } }, { status: 500 });
}
