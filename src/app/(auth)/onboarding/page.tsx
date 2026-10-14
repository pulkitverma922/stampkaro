"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Building2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/utils/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BusinessCategory } from "@/types/models";

type OwnerForm = {
  businessName: string;
  category: BusinessCategory;
  rewardTitle: string;
  requiredStamps: number;
  branchName: string;
  address: string;
};

const initialOwnerForm: OwnerForm = {
  businessName: "",
  category: "cafe",
  rewardTitle: "",
  requiredStamps: 8,
  branchName: "Main branch",
  address: "",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, loading, refreshClaims } = useAuth();
  const [role, setRole] = useState<"customer" | "owner" | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [ownerForm, setOwnerForm] = useState(initialOwnerForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const intendedRole = sessionStorage.getItem("stampkaro:onboarding-role");
    if (intendedRole === "owner") {
      setRole("owner");
      sessionStorage.removeItem("stampkaro:onboarding-role");
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (profile) router.replace(profile.role === "customer" ? "/wallet" : profile.role === "admin" ? "/admin" : "/dashboard");
  }, [loading, profile, router, user]);

  if (loading || !user || profile) return <p className="text-center text-muted-foreground">Loading your account…</p>;

  async function onboardCustomer(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api("/api/onboarding/customer", { method: "POST", body: JSON.stringify({ displayName: displayName || undefined }) });
      await refreshClaims();
      router.replace("/wallet");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not finish onboarding");
    } finally {
      setSubmitting(false);
    }
  }

  async function onboardOwner(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api("/api/onboarding/owner", {
        method: "POST",
        body: JSON.stringify({
          businessName: ownerForm.businessName,
          category: ownerForm.category,
          rewardTitle: ownerForm.rewardTitle,
          requiredStamps: ownerForm.requiredStamps,
          branch: { name: ownerForm.branchName, address: ownerForm.address },
        }),
      });
      await refreshClaims();
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create your business");
    } finally {
      setSubmitting(false);
    }
  }

  if (!role) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">How will you use StampKaro?</CardTitle>
          <CardDescription>Choose your account type to personalize your setup.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Button className="h-auto flex-col gap-3 py-8" variant="outline" onClick={() => setRole("customer")}>
            <UserRound className="size-8 text-primary" />
            <span>Collect rewards</span>
          </Button>
          <Button className="h-auto flex-col gap-3 py-8" variant="outline" onClick={() => setRole("owner")}>
            <Building2 className="size-8 text-primary" />
            <span>Grow my business</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (role === "customer") {
    return (
      <Card>
        <CardHeader><CardTitle>Set up your wallet</CardTitle><CardDescription>Tell businesses what name to show on your loyalty card.</CardDescription></CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onboardCustomer}>
            <div className="space-y-2"><Label htmlFor="displayName">Display name</Label><Input id="displayName" minLength={2} maxLength={60} value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder={user.displayName ?? "Your name"} /></div>
            <div className="flex gap-3"><Button type="button" variant="outline" onClick={() => setRole(null)}>Back</Button><Button className="flex-1" type="submit" disabled={submitting}>Create my wallet</Button></div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Create your loyalty program</CardTitle><CardDescription>You can change reward and visit rules later.</CardDescription></CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onboardOwner}>
          <div className="space-y-2"><Label htmlFor="businessName">Business name</Label><Input id="businessName" required minLength={2} maxLength={60} value={ownerForm.businessName} onChange={(event) => setOwnerForm({ ...ownerForm, businessName: event.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="category">Category</Label><select id="category" className="h-9 w-full rounded-md border bg-transparent px-3 text-sm" value={ownerForm.category} onChange={(event) => setOwnerForm({ ...ownerForm, category: event.target.value as BusinessCategory })}><option value="cafe">Cafe</option><option value="salon">Salon</option><option value="gym">Gym</option><option value="restaurant">Restaurant</option><option value="retail">Retail</option><option value="other">Other</option></select></div>
          <div className="space-y-2"><Label htmlFor="rewardTitle">Reward</Label><Input id="rewardTitle" required minLength={2} maxLength={60} value={ownerForm.rewardTitle} onChange={(event) => setOwnerForm({ ...ownerForm, rewardTitle: event.target.value })} placeholder="Free coffee" /></div>
          <div className="space-y-2"><Label htmlFor="requiredStamps">Visits required</Label><Input id="requiredStamps" type="number" min={3} max={20} required value={ownerForm.requiredStamps} onChange={(event) => setOwnerForm({ ...ownerForm, requiredStamps: Number(event.target.value) })} /></div>
          <div className="space-y-2"><Label htmlFor="branchName">First branch</Label><Input id="branchName" required maxLength={60} value={ownerForm.branchName} onChange={(event) => setOwnerForm({ ...ownerForm, branchName: event.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" required maxLength={200} value={ownerForm.address} onChange={(event) => setOwnerForm({ ...ownerForm, address: event.target.value })} /></div>
          <div className="flex gap-3"><Button type="button" variant="outline" onClick={() => setRole(null)}>Back</Button><Button className="flex-1" type="submit" disabled={submitting}>Create business</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
