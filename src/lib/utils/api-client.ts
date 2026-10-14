"use client";
import { auth } from "@/lib/firebase/client";

/** Client fetch helper that attaches the Firebase ID token. */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  const json = await res.json();
  if (!json.ok) throw Object.assign(new Error(json.error?.message ?? "Request failed"), json.error);
  return json.data as T;
}
