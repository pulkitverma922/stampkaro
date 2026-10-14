import { AuthGuard } from "@/components/shared/auth-guard";
import { AdminBusinesses } from "./admin-businesses";

export default function AdminPage() {
  return <AuthGuard roles={["admin"]}><AdminBusinesses /></AuthGuard>;
}
