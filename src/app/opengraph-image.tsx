import { ImageResponse } from "next/og";

export const alt = "StampKaro — Har visit pe stamp, har stamp pe reward";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "linear-gradient(135deg, #f5f3ff, #ffffff)", color: "#111827", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", padding: 80, textAlign: "center", width: "100%" }}>
      <div style={{ color: "#ff7a00", display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: 8, textTransform: "uppercase" }}>Digital loyalty, made simple</div>
      <div style={{ display: "flex", fontSize: 112, fontWeight: 800, marginTop: 34 }}>StampKaro</div>
      <div style={{ color: "#6b7280", display: "flex", fontSize: 42, marginTop: 24 }}>Har visit pe stamp, har stamp pe reward.</div>
    </div>,
    size,
  );
}
