"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";
import {
  onIdTokenChanged,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import type { Role, UserDoc } from "@/types/models";

type AuthContextValue = {
  user: User | null;
  profile: UserDoc | null;
  role: Role | null;
  loading: boolean;
  refreshClaims: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [claimRole, setClaimRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onIdTokenChanged(auth, async (currentUser) => {
    setLoading(true);
    setUser(currentUser);

    if (!currentUser) {
      setProfile(null);
      setClaimRole(null);
      setLoading(false);
      return;
    }

    const token = await currentUser.getIdTokenResult();
    setClaimRole((token.claims.role as Role | undefined) ?? "customer");
  }), []);

  useEffect(() => {
    if (!user) return;

    return onSnapshot(doc(db, "users", user.uid), { includeMetadataChanges: true }, (snapshot) => {
      setProfile(snapshot.exists() ? snapshot.data() as UserDoc : null);
      setLoading(false);
    }, (error) => {
      console.warn("Could not load the signed-in profile", error.code);
      setProfile(null);
      setLoading(false);
    });
  }, [user]);

  const refreshClaims = useCallback(async () => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdTokenResult(true);
    setClaimRole((token.claims.role as Role | undefined) ?? "customer");
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo(() => ({
    user,
    profile,
    role: profile?.role ?? claimRole,
    loading,
    refreshClaims,
    signOut,
  }), [user, profile, claimRole, loading, refreshClaims, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
