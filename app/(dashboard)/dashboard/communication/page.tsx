import { getSentEmails } from '@/actions/resend';
import { EmailLogTable } from '@/components/dashboard/email-log-table';
import { Mail, MessageSquare, Inbox } from 'lucide-react';

export const metadata = {
    title: 'Communication | Dashboard',
};

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';

export default async function CommunicationPage() {
    const { emails, error } = await getSentEmails();

    // Calculate stats
    const totalEmails = emails.length;
    const last24Hours = emails.filter((email) => {
        const emailDate = new Date(email.created_at);
        const now = new Date();
        const diff = now.getTime() - emailDate.getTime();
        return diff < 24 * 60 * 60 * 1000;
    }).length;

    // Calculate opened emails
    const openedEmails = emails.filter((email) => email.last_event === 'opened').length;

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Communication</h1>
                <p className="text-sm sm:text-base text-slate-400 mt-1">
                    Monitor messages received from your contact form
                </p>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Emails */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-2 sm:p-2.5 rounded-lg bg-indigo-500/10">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-400 hidden sm:block">
                            Total Received
                        </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{totalEmails}</p>
                    <p className="text-xs text-slate-500 mt-1 sm:hidden">Total</p>
                </div>

                {/* Last 24 Hours */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/10">
                            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-400 hidden sm:block">
                            Last 24 Hours
                        </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{last24Hours}</p>
                    <p className="text-xs text-slate-500 mt-1 sm:hidden">Today</p>
                </div>

                {/* Opened Emails */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-2 sm:p-2.5 rounded-lg bg-violet-500/10">
                            <Inbox className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-400 hidden sm:block">
                            Opened
                        </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{openedEmails}</p>
                    <p className="text-xs text-slate-500 mt-1 sm:hidden">Opened</p>
                </div>

                {/* API Status */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className={`p-2 sm:p-2.5 rounded-lg ${error ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                            <span className="relative flex h-3 w-3">
                                {!error && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                )}
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${error ? 'bg-red-500' : 'bg-emerald-500'}`} />
                            </span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-400 hidden sm:block">
                            API Status
                        </span>
                    </div>
                    <p className={`text-base sm:text-lg font-semibold ${error ? 'text-red-400' : 'text-emerald-400'}`}>
                        {error ? 'Error' : 'Connected'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 sm:hidden">Resend</p>
                </div>
            </div>

            {/* Email Log Table */}
            <EmailLogTable emails={emails} error={error} />
        </div>
    );
}
