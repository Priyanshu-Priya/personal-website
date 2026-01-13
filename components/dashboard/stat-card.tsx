import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    className?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    href?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    className,
    trend,
    trendValue,
    href,
}: StatCardProps) {
    const Content = (
        <Card className={cn(
            "bg-slate-900/50 border-slate-800 backdrop-blur-sm transition-all hover:bg-slate-800/80 hover:border-slate-700",
            className
        )}>
            <CardContent className="p-3 sm:p-4 md:p-6">
                {/* Mobile Layout - Compact */}
                <div className="flex items-center gap-3 sm:hidden">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xl font-bold text-white">{value}</p>
                        <p className="text-xs text-slate-500 truncate">{title}</p>
                    </div>
                    {trend && trendValue && (
                        <div className={cn(
                            "text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
                            trend === 'up' ? "text-emerald-400 bg-emerald-500/10" :
                                trend === 'down' ? "text-rose-400 bg-rose-500/10" :
                                    "text-slate-400 bg-slate-500/10"
                        )}>
                            {trendValue}
                        </div>
                    )}
                </div>

                {/* Desktop Layout - Original */}
                <div className="hidden sm:block">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <p className="text-xs sm:text-sm font-medium text-slate-400">{title}</p>
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-400" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 sm:pt-2">
                        <div className="text-xl sm:text-2xl font-bold text-white">{value}</div>
                        {trend && trendValue && (
                            <div className={cn(
                                "text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full",
                                trend === 'up' ? "text-emerald-400 bg-emerald-500/10" :
                                    trend === 'down' ? "text-rose-400 bg-rose-500/10" :
                                        "text-slate-400 bg-slate-500/10"
                            )}>
                                {trendValue}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (href) {
        return <Link href={href} className="block">{Content}</Link>;
    }

    return Content;
}
