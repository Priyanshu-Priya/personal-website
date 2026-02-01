-- Update Home Page Content with Contact Form Placeholders
UPDATE site_pages
SET content = jsonb_set(
    content,
    '{contact_section}',
    COALESCE(content->'contact_section', '{}'::jsonb) || '{
        "name_label": "Name",
        "email_label": "Email",
        "message_label": "Message",
        "name_placeholder": "Your name",
        "email_placeholder": "your@email.com",
        "message_placeholder": "Tell me about your project or just say hello...",
        "success_message": "Thank you! Your message has been sent successfully."
    }'::jsonb
)
WHERE page_slug = 'home';
