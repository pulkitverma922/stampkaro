import { ScanExperience } from "./scan-experience";

export default async function ScanPage({ params }: { params: Promise<{ qrId: string }> }) {
  const { qrId } = await params;
  return <ScanExperience qrId={qrId} />;
}
