import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                    color: "white",
                    fontSize: 110,
                    fontWeight: 900,
                    letterSpacing: -4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 38,
                }}
            >
                V
            </div>
        ),
        { ...size }
    );
}

