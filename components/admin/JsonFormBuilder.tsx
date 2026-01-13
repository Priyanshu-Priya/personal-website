'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// =========================================
// RECURSIVE JSON FORM BUILDER
// Automatically generates form fields from JSON structure
// =========================================

interface JsonFormBuilderProps {
    data: Record<string, unknown>;
    onChange: (newData: Record<string, unknown>) => void;
    path?: string;
    level?: number;
}

export function JsonFormBuilder({
    data,
    onChange,
    path = '',
    level = 0,
}: JsonFormBuilderProps) {
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

    const toggleCollapse = (key: string) => {
        const newCollapsed = new Set(collapsedSections);
        if (newCollapsed.has(key)) {
            newCollapsed.delete(key);
        } else {
            newCollapsed.add(key);
        }
        setCollapsedSections(newCollapsed);
    };

    const updateValue = (key: string, value: unknown) => {
        onChange({ ...data, [key]: value });
    };

    const updateArrayItem = (key: string, index: number, value: unknown) => {
        const arr = [...(data[key] as unknown[])];
        arr[index] = value;
        onChange({ ...data, [key]: arr });
    };

    const addArrayItem = (key: string, template: unknown) => {
        const arr = [...(data[key] as unknown[]), template];
        onChange({ ...data, [key]: arr });
    };

    const removeArrayItem = (key: string, index: number) => {
        const arr = (data[key] as unknown[]).filter((_, i) => i !== index);
        onChange({ ...data, [key]: arr });
    };

    const formatLabel = (key: string) => {
        return key
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    };

    const isLongText = (value: string) => value.length > 100 || value.includes('\n');

    return (
        <div className={cn('space-y-4', level > 0 && 'ml-4 pl-4 border-l border-slate-700')}>
            {Object.entries(data).map(([key, value]) => {
                const fullPath = path ? `${path}.${key}` : key;
                const isCollapsed = collapsedSections.has(fullPath);

                // STRING
                if (typeof value === 'string') {
                    return (
                        <div key={fullPath} className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                                {formatLabel(key)}
                            </label>
                            {isLongText(value) ? (
                                <Textarea
                                    value={value}
                                    onChange={(e) => updateValue(key, e.target.value)}
                                    className="bg-slate-800/50 border-slate-700 text-white min-h-[100px]"
                                    rows={4}
                                />
                            ) : (
                                <Input
                                    value={value}
                                    onChange={(e) => updateValue(key, e.target.value)}
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                />
                            )}
                        </div>
                    );
                }

                // NUMBER
                if (typeof value === 'number') {
                    return (
                        <div key={fullPath} className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                                {formatLabel(key)}
                            </label>
                            <Input
                                type="number"
                                value={value}
                                onChange={(e) => updateValue(key, Number(e.target.value))}
                                className="bg-slate-800/50 border-slate-700 text-white"
                            />
                        </div>
                    );
                }

                // BOOLEAN
                if (typeof value === 'boolean') {
                    return (
                        <div key={fullPath} className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => updateValue(key, e.target.checked)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-800"
                            />
                            <label className="text-sm font-medium text-slate-300">
                                {formatLabel(key)}
                            </label>
                        </div>
                    );
                }

                // ARRAY OF STRINGS
                if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
                    return (
                        <div key={fullPath} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300">
                                    {formatLabel(key)}
                                </label>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => addArrayItem(key, '')}
                                    className="text-violet-400 hover:text-violet-300"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {(value as string[]).map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={item}
                                            onChange={(e) =>
                                                updateArrayItem(key, index, e.target.value)
                                            }
                                            className="bg-slate-800/50 border-slate-700 text-white flex-1"
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => removeArrayItem(key, index)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                // ARRAY OF OBJECTS
                if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                    return (
                        <div key={fullPath} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => toggleCollapse(fullPath)}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
                                >
                                    {isCollapsed ? (
                                        <ChevronRight className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                    {formatLabel(key)} ({value.length} items)
                                </button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => addArrayItem(key, { ...value[0] })}
                                    className="text-violet-400 hover:text-violet-300"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add
                                </Button>
                            </div>
                            {!isCollapsed && (
                                <div className="space-y-4">
                                    {(value as Record<string, unknown>[]).map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-mono text-slate-500">
                                                    Item {index + 1}
                                                </span>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => removeArrayItem(key, index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <JsonFormBuilder
                                                data={item}
                                                onChange={(newItem) =>
                                                    updateArrayItem(key, index, newItem)
                                                }
                                                path={`${fullPath}[${index}]`}
                                                level={level + 1}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }

                // NESTED OBJECT
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    return (
                        <div key={fullPath} className="space-y-3">
                            <button
                                type="button"
                                onClick={() => toggleCollapse(fullPath)}
                                className="flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300"
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                                {formatLabel(key)}
                            </button>
                            {!isCollapsed && (
                                <JsonFormBuilder
                                    data={value as Record<string, unknown>}
                                    onChange={(newValue) => updateValue(key, newValue)}
                                    path={fullPath}
                                    level={level + 1}
                                />
                            )}
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}
