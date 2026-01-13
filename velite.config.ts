import { defineConfig, defineCollection, s } from 'velite';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const posts = defineCollection({
    name: 'Post',
    pattern: 'posts/**/*.mdx',
    schema: s.object({
        title: s.string().max(99),
        slug: s.slug('posts'),
        date: s.isodate(),
        summary: s.string().max(999),
        published: s.boolean().default(false),
        tags: s.array(s.string()).optional(),
        body: s.mdx(),
    }),
});

export default defineConfig({
    root: 'content',
    output: {
        data: '.velite',
        assets: 'public/static',
        base: '/static/',
        name: '[name]-[hash:6].[ext]',
        clean: true,
    },
    collections: { posts },
    mdx: {
        rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, { theme: 'github-dark' }],
            [
                rehypeAutolinkHeadings,
                {
                    behavior: 'wrap',
                    properties: {
                        className: ['anchor'],
                    },
                },
            ],
        ],
        remarkPlugins: [],
    },
});
