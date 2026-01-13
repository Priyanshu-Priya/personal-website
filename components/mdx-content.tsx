'use client';

import * as runtime from 'react/jsx-runtime';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MDXContentProps {
    code: string;
}

// Custom components for MDX
const components = {
    // Enhanced Image component
    Image: (props: React.ComponentProps<typeof Image>) => (
        <Image {...props} className="rounded-lg" alt={props.alt || ''} />
    ),

    // Enhanced Link component
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
        const isExternal = href?.startsWith('http');
        if (isExternal) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                >
                    {children}
                </a>
            );
        }
        return (
            <Link href={href || '#'} {...props}>
                {children}
            </Link>
        );
    },

    // Callout component
    Callout: ({
        type = 'info',
        children,
    }: {
        type?: 'info' | 'warning' | 'tip';
        children: React.ReactNode;
    }) => {
        const styles = {
            info: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200',
            warning: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
            tip: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
        };

        return (
            <div
                className={`p-4 rounded-lg border my-6 ${styles[type]}`}
                role="alert"
            >
                {children}
            </div>
        );
    },

    // Code block wrapper (enhances pre elements)
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
        <pre
            {...props}
            className="relative overflow-x-auto rounded-lg bg-slate-900 border border-slate-800 p-4"
        >
            {children}
        </pre>
    ),
};

const useMDXComponent = (code: string) => {
    return useMemo(() => {
        const fn = new Function('runtime', code);
        const { default: MDXContent } = fn(runtime);
        return MDXContent;
    }, [code]);
};

export function MDXContent({ code }: MDXContentProps) {
    const Component = useMDXComponent(code);
    return <Component components={components} />;
}
