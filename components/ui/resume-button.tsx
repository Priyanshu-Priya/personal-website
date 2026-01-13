'use client';

import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResumeButtonProps {
    url?: string | null;
}

export function ResumeButton({ url }: ResumeButtonProps) {
    if (!url) return null;

    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors group"
        >
            <FileText className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
            <span className="text-sm font-medium">View Resume</span>
        </motion.a>
    );
}
