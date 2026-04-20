# Email Notifications Production Setup

## Overview

The CareerUp platform includes a comprehensive email notification system that works in both **demo mode** (localStorage) and **production mode** (Supabase). This document explains how to set up email notifications for production.

## 📧 **System Architecture**

### Demo Mode (Current)
- **Storage**: In-app notifications stored in localStorage
- **UI**: Notification bell in header shows unread count
- **Service**: All email templates and logic already implemented
- **Testing**: Fully functional for development and testing

### Production Mode
- **Backend**: Supabase Edge Functions for sending emails
- **Provider**: Configurable email service (SendGrid, AWS SES, etc.)
- **Storage**: Notification history in Supabase database
- **Delivery**: Actual emails sent to users

## 🔁 **Notification Types**

| Email Type | Trigger | Template | Data Required |
|------------|---------|----------|---------------|
| `application_submitted` | User submits application | ✅ Complete | participantName, cohortName |
| `application_approved` | Admin approves application | ✅ Complete | participantName, cohortName |
| `application_rejected` | Admin rejects application | ✅ Complete | participantName, cohortName, reason |
| `task_assigned` | Admin assigns task | ✅ Complete | participantName, taskTitle, dueDate |
| `task_deadline_reminder` | 24h before deadline | ⏳ Needs cron job | participantName, taskTitle, dueDate |
| `badge_awarded` | Badge validation complete | ✅ Complete | participantName, badgeName, verificationUrl |
| `feedback_received` | Task feedback submitted | ✅ Complete | participantName, taskTitle, rating |

## 🚀 **Production Setup Steps**

### 1. Create Supabase Edge Function

```bash
# Create the email function
supabase functions new send-email
```

### 2. Implementation (`supabase/functions/send-email/index.ts`)

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  toName: string
  subject: string
  message: string
  type: string
  data: Record<string, any>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, toName, subject, message, type, data }: EmailRequest = await req.json()

    // Initialize your email service (SendGrid, AWS SES, etc.)
    const emailResponse = await sendEmail({
      to,
      toName,
      subject,
      html: generateEmailHTML(message, type, data),
      text: message
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function generateEmailHTML(message: string, type: string, data: any): string {
  return \`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>CareerUp Africa</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .footer { padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
          .button { background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CareerUp Africa</h1>
          </div>
          <div class="content">
            <p>\${message}</p>
            \${type === 'badge_awarded' ? \`<a href="\${data.verificationUrl}" class="button">View Your Badge</a>\` : ''}
          </div>
          <div class="footer">
            <p>© CareerUp Africa - Building careers across Africa</p>
          </div>
        </div>
      </body>
    </html>
  \`
}
```

### 3. Environment Variables

Add to your Supabase project settings:

```bash
# Email service configuration
SENDGRID_API_KEY=your_sendgrid_api_key
# OR
AWS_SES_ACCESS_KEY=your_aws_access_key
AWS_SES_SECRET_KEY=your_aws_secret_key
AWS_SES_REGION=your_region

# Email settings
FROM_EMAIL=notifications@careerupafrica.com
FROM_NAME=CareerUp Africa
```

### 4. Deploy Function

```bash
supabase functions deploy send-email
```

### 5. Test the System

```bash
# Test email function
curl -X POST 'https://your-project.supabase.co/functions/v1/send-email' \\
  -H 'Authorization: Bearer YOUR_ANON_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "to": "test@example.com",
    "toName": "Test User", 
    "subject": "Test Email",
    "message": "This is a test email",
    "type": "application_submitted",
    "data": {}
  }'
```

## ⚙️ **Email Service Providers**

### Option 1: SendGrid (Recommended)

```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY')!)

async function sendEmail({to, toName, subject, html, text}) {
  return sgMail.send({
    to: { email: to, name: toName },
    from: { email: 'notifications@careerupafrica.com', name: 'CareerUp Africa' },
    subject,
    html,
    text
  })
}
```

### Option 2: AWS SES

```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({ 
  region: Deno.env.get('AWS_SES_REGION'),
  credentials: {
    accessKeyId: Deno.env.get('AWS_SES_ACCESS_KEY')!,
    secretAccessKey: Deno.env.get('AWS_SES_SECRET_KEY')!
  }
})

async function sendEmail({to, toName, subject, html, text}) {
  return ses.send(new SendEmailCommand({
    Source: 'notifications@careerupafrica.com',
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: html },
        Text: { Data: text }
      }
    }
  }))
}
```

## 📋 **Database Schema**

Create notification history table (optional):

```sql
CREATE TABLE email_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  data JSONB
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON email_notifications(user_id);
CREATE INDEX idx_notifications_type ON email_notifications(type);
CREATE INDEX idx_notifications_sent_at ON email_notifications(sent_at);
```

## 🔧 **Testing in Demo Mode**

The notification system is fully functional in demo mode:

1. **Submit Application**: Check notification bell
2. **Admin Approval/Rejection**: Triggers status emails  
3. **Badge Awards**: Creates badge notification
4. **View Notifications**: Click bell icon in header
5. **Mark as Read**: Click individual notifications

## ⏰ **Deadline Reminders (Optional)**

For automated deadline reminders, set up a Supabase cron job:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create reminder function
CREATE OR REPLACE FUNCTION send_deadline_reminders()
RETURNS void AS $$
BEGIN
  -- Call Edge Function for tasks due in 24 hours
  PERFORM net.http_post(
    'https://your-project.supabase.co/functions/v1/send-deadline-reminders',
    '{}'::jsonb,
    headers => '{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb
  );
END;
$$ LANGUAGE plpgsql;

-- Schedule daily at 9 AM
SELECT cron.schedule(
  'deadline-reminders',
  '0 9 * * *', -- 9 AM daily  
  'SELECT send_deadline_reminders();'
);
```

## 🎯 **Next Steps**

1. **Choose Email Provider**: SendGrid or AWS SES
2. **Set up Domain**: Configure DNS for sending emails
3. **Create Edge Function**: Implement email sending logic
4. **Test thoroughly**: Verify all notification types work
5. **Monitor delivery**: Set up email analytics/tracking

The notification system is production-ready and only requires the Supabase Edge Function to enable actual email delivery.