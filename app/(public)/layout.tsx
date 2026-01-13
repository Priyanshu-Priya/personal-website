import { FooterWrapper } from '@/components/layout/footer-wrapper';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950">
            {/* 
              FloatingDock removed from here - now in root layout
              This prevents duplication and ensures single source of truth
            */}

            {/* Main content */}
            <main className="flex-1">{children}</main>

            {/* Footer - fetches global config from CMS */}
            <FooterWrapper />
        </div>
    );
}

