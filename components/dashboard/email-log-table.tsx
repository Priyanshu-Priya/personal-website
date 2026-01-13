'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Mail, AlertCircle, Eye, CheckCircle2, MailOpen, Send, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { EmailLog } from '@/actions/resend';
import { EmailPreview } from './email-preview';

interface EmailLogTableProps {
    emails: EmailLog[];
    error?: string | null;
}

// Status badge configuration
const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
    delivered: { icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Delivered' },
    sent: { icon: Send, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Sent' },
    opened: { icon: MailOpen, color: 'bg-violet-500/10 text-violet-400 border-violet-500/20', label: 'Opened' },
    clicked: { icon: MailOpen, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', label: 'Clicked' },
    bounced: { icon: XCircle, color: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Bounced' },
    complained: { icon: XCircle, color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: 'Spam' },
    delivery_delayed: { icon: Clock, color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', label: 'Delayed' },
};

function StatusBadge({ status }: { status: string | null }) {
    const config = STATUS_CONFIG[status || 'sent'] || STATUS_CONFIG.sent;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium border rounded-full ${config.color}`}>
            <Icon className="w-3 h-3" />
            <span className="hidden sm:inline">{config.label}</span>
        </span>
    );
}

export function EmailLogTable({ emails, error }: EmailLogTableProps) {
    const router = useRouter();
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleRefresh = () => {
        router.refresh();
    };

    const handleViewEmail = (emailId: string) => {
        setSelectedEmailId(emailId);
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setSelectedEmailId(null);
    };

    // Truncate subject if too long
    const truncateSubject = (subject: string, maxLength: number = 40): string => {
        if (subject.length <= maxLength) return subject;
        return subject.slice(0, maxLength) + '...';
    };

    // Extract sender name from subject (e.g., "New Portfolio Message from John Doe")
    const extractSenderName = (subject: string): string | null => {
        const match = subject.match(/from\s+(.+)$/i);
        return match ? match[1] : null;
    };

    return (
        <>
            <div className="space-y-4">
                {/* Header with Refresh Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base sm:text-lg font-semibold text-white">Email Log</h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Live view of messages received
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2 sm:gap-3">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <div>
                            <p className="font-medium text-sm">Failed to load emails</p>
                            <p className="text-xs opacity-80">{error}</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!error && emails.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 rounded-xl bg-slate-900/50 border border-slate-800">
                        <div className="p-3 sm:p-4 rounded-full bg-slate-800/50 mb-3 sm:mb-4">
                            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-slate-300 mb-1">
                            No emails received yet
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 text-center max-w-sm">
                            When someone submits your contact form, their messages will appear here.
                        </p>
                    </div>
                )}

                {/* Email Table - Desktop */}
                {!error && emails.length > 0 && (
                    <div className="hidden md:block rounded-xl border border-slate-800 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-800">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        From
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Subject
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">
                                        View
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {emails.map((email) => {
                                    const senderName = extractSenderName(email.subject);
                                    return (
                                        <tr
                                            key={email.id}
                                            className="bg-slate-900/30 hover:bg-slate-800/50 transition-colors group"
                                        >
                                            <td className="py-4 px-4">
                                                <button
                                                    onClick={() => handleViewEmail(email.id)}
                                                    className="text-left hover:text-indigo-400 transition-colors"
                                                >
                                                    <div className="flex flex-col">
                                                        {senderName && (
                                                            <span className="text-base text-white font-semibold group-hover:text-indigo-400">
                                                                {senderName}
                                                            </span>
                                                        )}
                                                        <span className="text-sm text-slate-400">
                                                            {email.from}
                                                        </span>
                                                    </div>
                                                </button>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm text-slate-400">
                                                    {truncateSubject(email.subject, 50)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <StatusBadge status={email.last_event} />
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm text-slate-500">
                                                    {format(new Date(email.created_at), 'MMM d, h:mm a')}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleViewEmail(email.id)}
                                                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                                        title="View email"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Email Cards - Mobile */}
                {!error && emails.length > 0 && (
                    <div className="md:hidden space-y-3">
                        {emails.map((email) => {
                            const senderName = extractSenderName(email.subject);
                            return (
                                <button
                                    key={email.id}
                                    onClick={() => handleViewEmail(email.id)}
                                    className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors text-left"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex-1 min-w-0">
                                            {senderName && (
                                                <p className="text-white font-semibold truncate">
                                                    {senderName}
                                                </p>
                                            )}
                                            <p className="text-sm text-slate-400 truncate">
                                                {email.from}
                                            </p>
                                        </div>
                                        <StatusBadge status={email.last_event} />
                                    </div>
                                    <p className="text-sm text-slate-500 truncate mb-2">
                                        {truncateSubject(email.subject, 60)}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            {format(new Date(email.created_at), 'MMM d, h:mm a')}
                                        </span>
                                        <Eye className="w-4 h-4 text-slate-500" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Footer Info */}
                {!error && emails.length > 0 && (
                    <p className="text-xs text-slate-500 text-center">
                        Showing last {emails.length} emails
                    </p>
                )}
            </div>

            {/* Email Preview Panel */}
            <EmailPreview
                emailId={selectedEmailId}
                isOpen={isPreviewOpen}
                onClose={handleClosePreview}
            />
        </>
    );
}
