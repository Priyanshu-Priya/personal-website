'use server';

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

// =============================================================================
// ZOD VALIDATION SCHEMA
// =============================================================================

import { z } from 'zod';

const ContactFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters.' })
        .max(100, { message: 'Name must be less than 100 characters.' }),
    email: z
        .string()
        .email({ message: 'Please enter a valid email address.' }),
    message: z
        .string()
        .min(10, { message: 'Message must be at least 10 characters.' })
        .max(5000, { message: 'Message must be less than 5000 characters.' }),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

// =============================================================================
// RESPONSE TYPES
// =============================================================================

type SubmitMessageResponse =
    | { success: true; message: string }
    | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// =============================================================================
// EMAIL TEMPLATE
// =============================================================================

function generateEmailHTML(data: ContactFormData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                                ✉️ New Portfolio Message
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Sender Info Card -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                            From
                                        </p>
                                        <p style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #1e293b;">
                                            ${data.name}
                                        </p>
                                        <a href="mailto:${data.email}" style="font-size: 16px; color: #667eea; text-decoration: none;">
                                            ${data.email}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Message -->
                            <div style="margin-bottom: 24px;">
                                <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                    Message
                                </p>
                                <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; border-left: 4px solid #667eea;">
                                    <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #334155; white-space: pre-wrap;">
${data.message}
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Reply Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center">
                                        <a href="mailto:${data.email}?subject=Re: Your message on my portfolio" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                                            Reply to ${data.name}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; text-align: center; background-color: #f8fafc; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; font-size: 14px; color: #94a3b8;">
                                Sent from your portfolio contact form
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

// =============================================================================
// SUBMIT MESSAGE SERVER ACTION
// =============================================================================

export async function submitMessage(
    formData: ContactFormData
): Promise<SubmitMessageResponse> {
    // -------------------------------------------------------------------------
    // 1. VALIDATION
    // -------------------------------------------------------------------------
    const validationResult = ContactFormSchema.safeParse(formData);

    if (!validationResult.success) {
        const fieldErrors = validationResult.error.flatten().fieldErrors;
        return {
            success: false,
            error: 'Validation failed. Please check your inputs.',
            fieldErrors: fieldErrors as Record<string, string[]>,
        };
    }

    const { name, email, message } = validationResult.data;

    // -------------------------------------------------------------------------
    // 2. INITIALIZE CLIENTS
    // -------------------------------------------------------------------------
    const supabase = await createClient();
    const resend = new Resend(process.env.RESEND_API_KEY);

    // -------------------------------------------------------------------------
    // 3. PARALLEL EXECUTION: Database Insert + Email Notification
    // -------------------------------------------------------------------------
    const [dbResult, emailResult] = await Promise.allSettled([
        // Supabase Insert
        supabase.from('messages').insert({
            name,
            email,
            message,
            created_at: new Date().toISOString(),
        }),

        // Resend Email
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'priyanshupriyacodes@gmail.com',
            subject: `New Portfolio Message from ${name}`,
            html: generateEmailHTML({ name, email, message }),
        }),
    ]);

    // -------------------------------------------------------------------------
    // 4. ERROR HANDLING
    // -------------------------------------------------------------------------

    // Check Database Result
    const dbFailed =
        dbResult.status === 'rejected' ||
        (dbResult.status === 'fulfilled' && dbResult.value.error);

    if (dbFailed) {
        const dbError =
            dbResult.status === 'rejected'
                ? dbResult.reason
                : dbResult.value.error;
        console.error('Database Error:', dbError);
        return {
            success: false,
            error: 'Database Error: Failed to save your message. Please try again.',
        };
    }

    // Check Email Result (log error but still return success if DB succeeded)
    const emailFailed =
        emailResult.status === 'rejected' ||
        (emailResult.status === 'fulfilled' && emailResult.value.error);

    if (emailFailed) {
        const emailError =
            emailResult.status === 'rejected'
                ? emailResult.reason
                : emailResult.value.error;
        console.error('Email Notification Error:', emailError);
        // We still return success because the message was saved to the database
    }

    // -------------------------------------------------------------------------
    // 5. SUCCESS RESPONSE
    // -------------------------------------------------------------------------
    return {
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
    };
}
