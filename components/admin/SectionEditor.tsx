'use client';

import { SmartField } from './SmartField';
import type { PageSection } from '@/hooks/usePageSections';

interface SectionEditorProps {
    section: PageSection;
    onChange: (newData: Record<string, unknown>) => void;
}

import { Switch } from '@/components/ui/switch';

// ... (imports)

export function SectionEditor({ section, onChange }: SectionEditorProps) {
    const updateField = (key: string, value: unknown) => {
        onChange({ ...section.data, [key]: value });
    };

    // Find the toggle key (enabled, visible, etc.)
    const toggleKey = Object.keys(section.data).find(key =>
        ['enabled', 'visible', 'is_enabled'].includes(key) &&
        typeof section.data[key] === 'boolean'
    );

    const toggleValue = toggleKey ? section.data[toggleKey] as boolean : false;

    // Filter out the toggle key from the main fields list
    const fields = Object.entries(section.data).filter(([key]) => key !== toggleKey);

    return (
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden w-full max-w-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        {section.label}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {fields.length} editable fields
                    </p>
                </div>

                {toggleKey && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-400">
                            {toggleValue ? 'Enabled' : 'Disabled'}
                        </span>
                        <Switch
                            checked={toggleValue}
                            onCheckedChange={(checked) => updateField(toggleKey, checked)}
                        />
                    </div>
                )}
            </div>

            {/* Fields */}
            <div className="p-6 space-y-6">
                {fields.map(([key, value]) => (
                    <SmartField
                        key={key}
                        fieldKey={key}
                        value={value}
                        onChange={(newValue) => updateField(key, newValue)}
                    />
                ))}
            </div>
        </div>
    );
}
