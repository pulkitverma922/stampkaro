import { AuthGuard } from "@/components/shared/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function OwnerDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard roles={["owner", "staff"]}><DashboardShell>{children}</DashboardShell></AuthGuard>;
}
