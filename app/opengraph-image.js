import { ImageResponse } from "next/og";

export const alt = "Vertex — Team management, reimagined";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#0a0a0a",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    padding: 80,
                    fontFamily: "sans-serif",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: -200,
                        right: -200,
                        width: 600,
                        height: 600,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)",
                    }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                            color: "white",
                            fontSize: 48,
                            fontWeight: 900,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 20,
                        }}
                    >
                        V
                    </div>
                    <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1 }}>Vertex</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", marginTop: 120 }}>
                    <div
                        style={{
                            fontSize: 84,
                            fontWeight: 900,
                            lineHeight: 1.05,
                            letterSpacing: -3,
                            maxWidth: 900,
                        }}
                    >
                        Team management, reimagined.
                    </div>
                    <div
                        style={{
                            fontSize: 30,
                            color: "#a1a1aa",
                            marginTop: 28,
                            maxWidth: 860,
                            lineHeight: 1.4,
                        }}
                    >
                        Workspaces, projects, tasks, real-time team chat, and smart notifications — in one fast, clean app.
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: 60,
                        left: 80,
                        display: "flex",
                        gap: 16,
                        fontSize: 22,
                        color: "#71717a",
                    }}
                >
                    <span>Next.js</span>
                    <span>·</span>
                    <span>Firebase</span>
                    <span>·</span>
                    <span>React 19</span>
                </div>
            </div>
        ),
        { ...size }
    );
}

