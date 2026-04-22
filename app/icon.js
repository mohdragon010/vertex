import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#6366F1",
                    color: "white",
                    fontSize: 22,
                    fontWeight: 900,
                    letterSpacing: -1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 7,
                }}
            >
                V
            </div>
        ),
        { ...size }
    );
}

