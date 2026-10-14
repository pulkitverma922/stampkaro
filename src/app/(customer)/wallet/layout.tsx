import { AuthGuard } from "@/components/shared/auth-guard";
import { WalletShell } from "@/components/customer/wallet-shell";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard roles={["customer"]}><WalletShell>{children}</WalletShell></AuthGuard>;
}
