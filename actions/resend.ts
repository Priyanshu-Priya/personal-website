'use server';

import { Resend } from 'resend';

// =============================================================================
// TYPES
// =============================================================================

export interface EmailLog {
    id: string;
    to: string | string[];
    from: string;
    subject: string;
    created_at: string;
    last_event: string | null;
}

export interface EmailDetails extends EmailLog {
    html: string | null;
    text: string | null;
}

interface EmailListResponse {
    emails: EmailLog[];
    error: string | null;
}

interface EmailDetailsResponse {
    email: EmailDetails | null;
    error: string | null;
}

// =============================================================================
// GET SENT EMAILS
// =============================================================================

export async function getSentEmails(): Promise<EmailListResponse> {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const response = await resend.emails.list();

        if (response.error) {
            console.error('Resend API Error:', response.error);
            return { emails: [], error: response.error.message };
        }

        // Map the response to our EmailLog interface
        const emails: EmailLog[] = (response.data?.data || []).map((email) => ({
            id: email.id,
            to: email.to,
            from: email.from,
            subject: email.subject,
            created_at: email.created_at,
            last_event: email.last_event || null,
        }));

        return { emails, error: null };
    } catch (error) {
        console.error('Failed to fetch emails from Resend:', error);
        return {
            emails: [],
            error: error instanceof Error ? error.message : 'Failed to fetch emails',
        };
    }
}

// =============================================================================
// GET EMAIL DETAILS
// =============================================================================

export async function getEmailDetails(
    emailId: string
): Promise<EmailDetailsResponse> {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const response = await resend.emails.get(emailId);

        if (response.error) {
            console.error('Resend API Error:', response.error);
            return { email: null, error: response.error.message };
        }

        if (!response.data) {
            return { email: null, error: 'Email not found' };
        }

        const email: EmailDetails = {
            id: response.data.id,
            to: response.data.to,
            from: response.data.from,
            subject: response.data.subject,
            created_at: response.data.created_at,
            html: response.data.html || null,
            text: response.data.text || null,
            last_event: response.data.last_event || null,
        };

        return { email, error: null };
    } catch (error) {
        console.error('Failed to fetch email details from Resend:', error);
        return {
            email: null,
            error: error instanceof Error ? error.message : 'Failed to fetch email details',
        };
    }
}
