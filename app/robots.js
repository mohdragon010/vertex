const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vertex-app.vercel.app";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/workspaces/",
                    "/profile",
                    "/settings",
                    "/notifications",
                    "/api/",
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    };
}

