'use client';

import { useEffect, useState } from 'react';
import { X, Mail, Clock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { getEmailDetails, type EmailDetails } from '@/actions/resend';

interface EmailPreviewProps {
    emailId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

// Status badge component
function StatusBadge({ status }: { status: string | null }) {
    const statusConfig: Record<string, { color: string; label: string }> = {
        delivered: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Delivered' },
        sent: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Sent' },
        opened: { color: 'bg-violet-500/10 text-violet-400 border-violet-500/20', label: 'Opened' },
        clicked: { color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', label: 'Clicked' },
        bounced: { color: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Bounced' },
        complained: { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: 'Complained' },
    };

    const config = statusConfig[status || 'sent'] || statusConfig.sent;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-full ${config.color}`}>
            <CheckCircle2 className="w-3 h-3" />
            {config.label}
        </span>
    );
}

// Loading skeleton
function EmailPreviewSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-3">
                <div className="h-6 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
            </div>
            <div className="flex gap-4">
                <div className="h-8 bg-slate-800 rounded w-24" />
                <div className="h-8 bg-slate-800 rounded w-32" />
            </div>
            <div className="h-64 bg-slate-800 rounded" />
        </div>
    );
}

export function EmailPreview({ emailId, isOpen, onClose }: EmailPreviewProps) {
    const [email, setEmail] = useState<EmailDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && emailId) {
            setLoading(true);
            setError(null);

            getEmailDetails(emailId)
                .then((result) => {
                    if (result.error) {
                        setError(result.error);
                    } else {
                        setEmail(result.email);
                    }
                })
                .catch((err) => {
                    setError(err instanceof Error ? err.message : 'Failed to load email');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [emailId, isOpen]);

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setEmail(null);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Centered Modal */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10">
                            <Mail className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Email Preview</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
                            <p className="text-slate-400">Loading email...</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <div>
                                <p className="font-medium">Failed to load email</p>
                                <p className="text-sm opacity-80">{error}</p>
                            </div>
                        </div>
                    )}

                    {!loading && !error && email && (
                        <div className="space-y-6">
                            {/* Subject & Meta */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-white">
                                    {email.subject}
                                </h3>

                                <div className="flex flex-wrap items-center gap-3">
                                    <StatusBadge status={email.last_event} />
                                    <span className="flex items-center gap-1.5 text-sm text-slate-400">
                                        <Clock className="w-4 h-4" />
                                        {format(new Date(email.created_at), 'MMM d, yyyy \'at\' h:mm a')}
                                    </span>
                                </div>
                            </div>

                            {/* From/To Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                        <User className="w-3 h-3" />
                                        FROM
                                    </div>
                                    <p className="text-sm text-white truncate">{email.from}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                        <Mail className="w-3 h-3" />
                                        TO
                                    </div>
                                    <p className="text-sm text-white truncate">
                                        {Array.isArray(email.to) ? email.to.join(', ') : email.to}
                                    </p>
                                </div>
                            </div>

                            {/* Email Body Preview */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                                    Email Content
                                </h4>

                                {email.html ? (
                                    <div className="rounded-lg border border-slate-700 overflow-hidden">
                                        <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700">
                                            <span className="text-xs text-slate-500">HTML Preview</span>
                                        </div>
                                        <iframe
                                            srcDoc={email.html}
                                            className="w-full h-96 bg-white"
                                            title="Email Preview"
                                            sandbox="allow-same-origin"
                                        />
                                    </div>
                                ) : email.text ? (
                                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                                        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                                            {email.text}
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="p-8 rounded-lg bg-slate-800/30 border border-slate-700/50 text-center">
                                        <p className="text-slate-500">No email content available</p>
                                    </div>
                                )}
                            </div>

                            {/* Email ID */}
                            <div className="pt-4 border-t border-slate-800">
                                <p className="text-xs text-slate-500">
                                    Email ID:{' '}
                                    <code className="text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                                        {email.id}
                                    </code>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-slate-800 bg-slate-900/80 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
