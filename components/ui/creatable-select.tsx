'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface Option {
    value: string;
    label: string;
}

interface CreatableSelectProps {
    options: Option[];
    value?: string;
    name?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export function CreatableSelect({
    options,
    value,
    name,
    placeholder = 'Select or type...',
    onChange,
    className,
}: CreatableSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value || '');
    const [searchTerm, setSearchTerm] = React.useState('');
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Filter options based on search term
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle outside click to close dropdown
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Update internal state when prop changes
    React.useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const handleSelect = (optionValue: string) => {
        setInputValue(optionValue);
        setSearchTerm('');
        setOpen(false);
        onChange?.(optionValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setSearchTerm(newValue);
        onChange?.(newValue);
        if (!open) setOpen(true);
    };

    return (
        <div className={cn('relative w-full', className)} ref={containerRef}>
            {/* The actual input that gets submitted or displayed */}
            <div className="relative">
                <Input
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="pr-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    onFocus={() => setOpen(true)}
                    autoComplete="off"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400"
                    onClick={() => setOpen(!open)}
                >
                    <ChevronsUpDown className="h-4 w-4 shrink-0" />
                </Button>
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 rounded-md border border-slate-700 bg-slate-900 shadow-xl overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto p-1">
                            {filteredOptions.length === 0 && searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => handleSelect(searchTerm)}
                                    className="w-full relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm text-indigo-400 hover:bg-slate-800 outline-none transition-colors"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create &quot;{searchTerm}&quot;
                                </button>
                            )}

                            {filteredOptions.length === 0 && !searchTerm && (
                                <p className="p-2 text-sm text-slate-500 text-center">
                                    Start typing to create...
                                </p>
                            )}

                            {filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={cn(
                                        "w-full relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-slate-800",
                                        inputValue === option.value ? "text-white bg-slate-800" : "text-slate-300"
                                    )}
                                >
                                    <span className="flex-1 text-left truncate">
                                        {option.label}
                                    </span>
                                    {inputValue === option.value && (
                                        <Check className="ml-auto h-4 w-4 text-indigo-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
