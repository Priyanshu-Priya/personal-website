import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/about',
        '/projects',
        '/library',
        '/contact',
    ].map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
    }));

    return routes;
}
