import { CardDetail } from "./card-detail";

export default async function WalletCardPage({ params }: { params: Promise<{ bizId: string }> }) {
  const { bizId } = await params;
  return <CardDetail bizId={bizId} />;
}
