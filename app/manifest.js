export default function manifest() {
    return {
        name: "Vertex — Team management, reimagined",
        short_name: "Vertex",
        description:
            "Workspaces, projects, tasks, real-time team chat, and smart notifications in one clean, fast app.",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#6366F1",
        categories: ["productivity", "business", "collaboration"],
        icons: [
            {
                src: "/icon",
                sizes: "32x32",
                type: "image/png",
            },
            {
                src: "/apple-icon",
                sizes: "180x180",
                type: "image/png",
                purpose: "any",
            },
        ],
    };
}

