'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitMessage } from '@/actions/contact';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormErrors {
    name?: string[];
    email?: string[];
    message?: string[];
}

interface ContactFormProps {
    nameLabel?: string;
    emailLabel?: string;
    messageLabel?: string;
    namePlaceholder?: string;
    emailPlaceholder?: string;
    messagePlaceholder?: string;
    submitText?: string;
    successMessage?: string;
}

export function ContactForm({
    nameLabel = 'Name',
    emailLabel = 'Email',
    messageLabel = 'Message',
    namePlaceholder = 'Your name',
    emailPlaceholder = 'your@email.com',
    messagePlaceholder = 'Tell me about your project or just say hello...',
    submitText = 'Send Message',
    successMessage = 'Thank you! Your message has been sent successfully.',
}: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setErrors({});
        setServerError(null);

        const result = await submitMessage(formData);

        if (result.success) {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } else {
            setStatus('error');
            if (result.fieldErrors) {
                setErrors(result.fieldErrors);
            } else {
                setServerError(result.error);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">
                        {nameLabel}
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={namePlaceholder}
                        value={formData.name}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                        aria-invalid={!!errors.name}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-violet-500 focus-visible:ring-violet-500/20"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.name[0]}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">
                        {emailLabel}
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={emailPlaceholder}
                        value={formData.email}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                        aria-invalid={!!errors.email}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-violet-500 focus-visible:ring-violet-500/20"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email[0]}
                        </p>
                    )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-300">
                        {messageLabel}
                    </Label>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder={messagePlaceholder}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                        aria-invalid={!!errors.message}
                        rows={5}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-violet-500 focus-visible:ring-violet-500/20 resize-none"
                    />
                    {errors.message && (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.message[0]}
                        </p>
                    )}
                </div>

                {/* Server Error */}
                {serverError && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm">{serverError}</p>
                    </div>
                )}

                {/* Success Message */}
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm">{successMessage}</p>
                    </motion.div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3 px-6 rounded-lg bg-linear-to-r from-violet-600 to-indigo-600 text-white font-medium transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {status === 'submitting' ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            {submitText}
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}
