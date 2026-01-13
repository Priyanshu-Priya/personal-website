import type { Metadata } from 'next';
import { getPageContent, getSiteConfig, defaultContactContent, defaultGlobalConfig } from '@/lib/content';
import { ContactPageClient } from './contact-client';

export const metadata: Metadata = {
    title: 'Contact | Priyanshu',
    description: "Get in touch with me. I'd love to hear about your project or just say hello.",
};

export default async function ContactPage() {
    const [content, config] = await Promise.all([
        getPageContent<'contact'>('contact'),
        getSiteConfig(),
    ]);

    const pageContent = content || defaultContactContent;
    const siteConfig = config || defaultGlobalConfig;

    return <ContactPageClient content={pageContent} config={siteConfig} />;
}
