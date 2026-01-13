'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ExternalLink, Image as ImageIcon, Link as LinkIcon, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

// =========================================
// SMART FIELD COMPONENT
// Intelligently renders form fields based on key/value analysis
// =========================================

interface SmartFieldProps {
    fieldKey: string;
    value: unknown;
    onChange: (value: unknown) => void;
    path?: string;
    level?: number;
}

export function SmartField({ fieldKey, value, onChange, path = '', level = 0 }: SmartFieldProps) {
    const fullPath = path ? `${path}.${fieldKey}` : fieldKey;
    const label = formatLabel(fieldKey);

    // Detect field type based on key name and value
    const fieldType = detectFieldType(fieldKey, value);

    // STRING FIELDS
    if (typeof value === 'string') {
        return (
            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    {label}
                    {fieldType === 'image' && <ImageIcon className="w-3.5 h-3.5 text-violet-400" />}
                    {fieldType === 'url' && <LinkIcon className="w-3.5 h-3.5 text-blue-400" />}
                    {fieldType === 'color' && <Palette className="w-3.5 h-3.5 text-pink-400" />}
                </Label>

                {/* IMAGE FIELD */}
                {fieldType === 'image' && (
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <Input
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder="Enter image URL..."
                                className="bg-slate-800/50 border-slate-700 text-white flex-1"
                            />
                            {value && (
                                <a
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-violet-500/50 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                </a>
                            )}
                        </div>
                        {value && (
                            <div className="relative w-full h-32 rounded-lg bg-slate-800/50 border border-slate-700 overflow-hidden">
                                <img
                                    src={value}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* URL FIELD */}
                {fieldType === 'url' && (
                    <div className="flex gap-3 min-w-0">
                        <Input
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Enter URL..."
                            className="bg-slate-800/50 border-slate-700 text-white flex-1 min-w-0"
                        />
                        {value && (
                            <a
                                href={value.startsWith('/') ? value : value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-colors shrink-0"
                            >
                                <ExternalLink className="w-4 h-4 text-blue-400" />
                            </a>
                        )}
                    </div>
                )}

                {/* COLOR FIELD */}
                {fieldType === 'color' && (
                    <div className="flex gap-3 items-center min-w-0">
                        <Input
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="bg-slate-800/50 border-slate-700 text-white flex-1 min-w-0"
                        />
                        <div
                            className="w-10 h-10 rounded-lg border border-slate-700 shrink-0"
                            style={{ backgroundColor: value || '#374151' }}
                        />
                    </div>
                )}

                {/* LONG TEXT FIELD */}
                {fieldType === 'longText' && (
                    <AutoResizeTextarea
                        value={value}
                        onChange={(val) => onChange(val)}
                        className="bg-slate-800/50 border-slate-700 text-white w-full max-w-full"
                    />
                )}

                {/* DEFAULT STRING FIELD */}
                {fieldType === 'string' && (
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-white w-full max-w-full"
                    />
                )}
            </div>
        );
    }

    // NUMBER FIELD
    if (typeof value === 'number') {
        return (
            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">{label}</Label>
                <Input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="bg-slate-800/50 border-slate-700 text-white w-32"
                />
            </div>
        );
    }

    // BOOLEAN FIELD - Toggle Switch
    if (typeof value === 'boolean') {
        return (
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <Label className="text-sm font-medium text-slate-300">{label}</Label>
                <Switch
                    checked={value}
                    onCheckedChange={(checked) => onChange(checked)}
                />
            </div>
        );
    }

    // ARRAY OF STRINGS
    if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
        return (
            <StringArrayField
                label={label}
                value={value as string[]}
                onChange={onChange}
            />
        );
    }

    // ARRAY OF OBJECTS
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        return (
            <ObjectArrayField
                label={label}
                value={value as Record<string, unknown>[]}
                onChange={onChange}
                path={fullPath}
                level={level}
            />
        );
    }

    // NESTED OBJECT
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
            <NestedObjectField
                label={label}
                value={value as Record<string, unknown>}
                onChange={onChange}
                path={fullPath}
                level={level}
            />
        );
    }

    return null;
}

// =========================================
// HELPER COMPONENTS
// =========================================

function AutoResizeTextarea({
    value,
    onChange,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn('min-h-[100px] resize-none', className)}
            rows={3}
        />
    );
}

function StringArrayField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string[];
    onChange: (value: unknown) => void;
}) {
    const addItem = () => onChange([...value, '']);
    const removeItem = (index: number) => onChange(value.filter((_, i) => i !== index));
    const updateItem = (index: number, newValue: string) => {
        const updated = [...value];
        updated[index] = newValue;
        onChange(updated);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-300">{label}</Label>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={addItem}
                    className="text-violet-400 hover:text-violet-300 h-7 px-2"
                >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                </Button>
            </div>
            <div className="space-y-2">
                {value.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            value={item}
                            onChange={(e) => updateItem(index, e.target.value)}
                            className="bg-slate-800/50 border-slate-700 text-white flex-1"
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeItem(index)}
                            className="text-red-400 hover:text-red-300 h-9 w-9"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ObjectArrayField({
    label,
    value,
    onChange,
    path,
    level,
}: {
    label: string;
    value: Record<string, unknown>[];
    onChange: (value: unknown) => void;
    path: string;
    level: number;
}) {
    const addItem = () => onChange([...value, { ...value[0] }]);
    const removeItem = (index: number) => onChange(value.filter((_, i) => i !== index));
    const updateItem = (index: number, newValue: Record<string, unknown>) => {
        const updated = [...value];
        updated[index] = newValue;
        onChange(updated);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-300">
                    {label} <span className="text-slate-500">({value.length})</span>
                </Label>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={addItem}
                    className="text-violet-400 hover:text-violet-300 h-7 px-2"
                >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                </Button>
            </div>
            <div className="space-y-3">
                {value.map((item, index) => (
                    <div
                        key={index}
                        className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-slate-500">
                                Item {index + 1}
                            </span>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeItem(index)}
                                className="text-red-400 hover:text-red-300 h-6 px-2"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        {Object.entries(item).map(([key, val]) => (
                            <SmartField
                                key={key}
                                fieldKey={key}
                                value={val}
                                onChange={(newVal) => updateItem(index, { ...item, [key]: newVal })}
                                path={`${path}[${index}]`}
                                level={level + 1}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function NestedObjectField({
    label,
    value,
    onChange,
    path,
    level,
}: {
    label: string;
    value: Record<string, unknown>;
    onChange: (value: unknown) => void;
    path: string;
    level: number;
}) {
    const updateField = useCallback((key: string, newValue: unknown) => {
        onChange({ ...value, [key]: newValue });
    }, [value, onChange]);

    return (
        <div className="space-y-4">
            <Label className="text-sm font-semibold text-violet-400">{label}</Label>
            <div className={cn('space-y-4', level > 0 && 'ml-4 pl-4 border-l border-slate-700')}>
                {Object.entries(value).map(([key, val]) => (
                    <SmartField
                        key={key}
                        fieldKey={key}
                        value={val}
                        onChange={(newVal) => updateField(key, newVal)}
                        path={path}
                        level={level + 1}
                    />
                ))}
            </div>
        </div>
    );
}

// =========================================
// UTILITY FUNCTIONS
// =========================================

function formatLabel(key: string): string {
    return key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}

type FieldType = 'image' | 'url' | 'color' | 'longText' | 'string';

function detectFieldType(key: string, value: unknown): FieldType {
    if (typeof value !== 'string') return 'string';

    const lowerKey = key.toLowerCase();

    // Image detection
    if (
        lowerKey.includes('image') ||
        lowerKey.includes('img') ||
        lowerKey.includes('thumbnail') ||
        lowerKey.includes('avatar') ||
        lowerKey.includes('cover') ||
        lowerKey.includes('photo')
    ) {
        return 'image';
    }

    // URL detection (but not image URLs)
    if (
        lowerKey.includes('url') ||
        lowerKey.includes('href') ||
        lowerKey.includes('link') ||
        lowerKey.includes('src')
    ) {
        return 'url';
    }

    // Color detection
    if (lowerKey.includes('color') || lowerKey.includes('bg')) {
        return 'color';
    }

    // Long text detection
    if (
        value.length > 50 ||
        value.includes('\n') ||
        lowerKey.includes('description') ||
        lowerKey.includes('bio') ||
        lowerKey.includes('content') ||
        lowerKey.includes('summary') ||
        lowerKey.includes('text') ||
        lowerKey.includes('paragraph')
    ) {
        return 'longText';
    }

    return 'string';
}
