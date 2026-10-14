"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Check, Sparkles, UserRound } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import { auth, googleProvider } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

async function createSession(idToken: string, intent: "customer" | "owner") {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, intent }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) throw new Error(payload.error?.message ?? "Could not create your secure session");
  return payload.data as { destination: string; hasProfile: boolean };
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, role, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const ownerIntent = searchParams.get("type") === "owner";

  useEffect(() => {
    if (authLoading || loading || !user || !profile) return;
    router.replace(role === "customer" ? "/wallet" : role === "admin" ? "/admin" : "/dashboard");
  }, [authLoading, loading, profile, role, router, user]);

  async function finishSignIn(idToken: string) {
    const session = await createSession(idToken, ownerIntent ? "owner" : "customer");
    if (ownerIntent && !session.hasProfile) sessionStorage.setItem("stampkaro:onboarding-role", "owner");
    const next = searchParams.get("next");
    router.replace(next?.startsWith("/") && session.hasProfile ? next : session.destination);
  }

  async function submitEmail(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = mode === "signup"
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      await finishSignIn(await result.user.getIdToken(true));
    } catch (error) {
      toast.error(error instanceof FirebaseError ? error.message.replace("Firebase: ", "") : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitGoogle() {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider as GoogleAuthProvider);
      await finishSignIn(await result.user.getIdToken(true));
    } catch (error) {
      toast.error(error instanceof FirebaseError ? error.message.replace("Firebase: ", "") : "Google sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
    <Card className="overflow-hidden border-white/60 bg-white/85 shadow-2xl shadow-orange-200/50 backdrop-blur-xl">
      <div className={`h-2 ${ownerIntent ? "bg-gradient-to-r from-orange-600 via-emerald-500 to-amber-400" : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"}`} />
      <CardHeader className="items-center px-7 pt-8 text-center">
        <motion.span whileHover={{ rotate: 5, scale: 1.05 }} className={`mb-2 flex size-14 items-center justify-center rounded-2xl ${ownerIntent ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>
          {ownerIntent ? <Building2 className="size-7" /> : <UserRound className="size-7" />}
        </motion.span>
        <CardTitle className="font-heading text-3xl">
          {ownerIntent ? "Build customer loyalty" : "Your rewards are waiting"}
        </CardTitle>
        <CardDescription className="max-w-sm text-base leading-6">
          {ownerIntent ? "Launch a branded digital stamp program and understand what brings customers back." : "Keep every loyalty card in one wallet and never miss a reward again."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-7 pb-8">
        <Tabs value={mode} onValueChange={(value) => setMode(value as "signin" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button className="h-11 w-full rounded-xl border-2" variant="outline" onClick={submitGoogle} disabled={loading}>
          <Sparkles /> Continue with Google
        </Button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or use email <span className="h-px flex-1 bg-border" />
        </div>
        <form className="space-y-4" onSubmit={submitEmail}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} required value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <Button className="h-11 w-full rounded-xl shadow-lg shadow-orange-200" type="submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"} <ArrowRight />
          </Button>
        </form>
        <div className={`rounded-2xl p-4 text-sm ${ownerIntent ? "bg-orange-50" : "bg-emerald-50"}`}>
          <p className="mb-2 font-semibold">{ownerIntent ? "Your business account includes" : "Your customer account includes"}</p>
          <p className="flex items-center gap-2 text-muted-foreground"><Check className="size-4 text-emerald-600" /> {ownerIntent ? "QR loyalty program and live insights" : "One wallet for every StampKaro business"}</p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {ownerIntent ? "Collecting rewards?" : "Running a business?"}{" "}
          <Link className="font-semibold text-primary hover:underline" href={ownerIntent ? "/login" : "/login?type=owner"}>
            {ownerIntent ? "Switch to customer" : "Switch to business"}
          </Link>
        </p>
      </CardContent>
    </Card>
    </motion.div>
  );
}
