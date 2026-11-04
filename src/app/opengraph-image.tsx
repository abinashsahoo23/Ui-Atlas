import { ImageResponse } from "next/og";

export const alt = "UI Atlas — React interface studies and component previews";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 84px",
          color: "#f6f4fa",
          background: "linear-gradient(135deg, #090a11 0%, #151221 64%, #291019 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 58,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #ff5268",
              borderRadius: 12,
              color: "#ff5268",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            UI
          </div>
          <div style={{ color: "#c8c5d2", fontSize: 22, letterSpacing: 7 }}>UI ATLAS</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -3 }}>Interface ideas,</div>
          <div style={{ display: "flex", gap: 18, fontSize: 72, fontWeight: 700, letterSpacing: -3 }}>
            <span>ready to</span>
            <span style={{ color: "#ff5268" }}>adapt.</span>
          </div>
          <div style={{ marginTop: 10, color: "#aaa6b7", fontSize: 25 }}>
            Original React studies · Live previews · Copy-ready source
          </div>
        </div>
        <div style={{ color: "#777383", fontSize: 19, letterSpacing: 2 }}>UI-ATLAS-TEAL.VERCEL.APP</div>
      </div>
    ),
    size,
  );
}
