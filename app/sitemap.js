const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vertex-app.vercel.app";

export default function sitemap() {
    const now = new Date();
    return [
        {
            url: `${siteUrl}/`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${siteUrl}/login`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${siteUrl}/signup`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.6,
        },
        {
            url: `${siteUrl}/forgot-password`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];
}

