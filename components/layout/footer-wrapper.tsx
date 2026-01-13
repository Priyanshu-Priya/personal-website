import { FooterClient } from './footer';
import { getSiteConfig, defaultGlobalConfig } from '@/lib/content';

export async function FooterWrapper() {
    const config = await getSiteConfig();

    return <FooterClient config={config || defaultGlobalConfig} />;
}
