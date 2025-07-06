# Email Invitation System Setup Guide

## 🎯 **Overview**

This guide will help you configure your domain and email processing to complete the Email Invitation System. Users will be able to generate invitation emails like `user-abc123@yourdomain.com` and invite them to their calendars for automatic syncing.

## 📋 **Prerequisites**

✅ **Domain purchased** (you have this!)  
✅ **Supabase Edge Function deployed** (we just did this!)  
✅ **Database migration applied** (sql/add_calendar_invitations_enhanced.sql)  

## 🌐 **Step 1: Choose Your Email Processing Method**

### **Option A: SendGrid Inbound Parse (Recommended)**

**Why SendGrid?**
- Free tier includes 100 emails/day
- Excellent parsing of calendar invitations
- Easy webhook integration
- Reliable delivery

**Setup Steps:**

1. **Create SendGrid Account**
   - Go to [SendGrid.com](https://sendgrid.com)
   - Sign up for free account

2. **Configure Inbound Parse**
   - Go to Settings → Inbound Parse
   - Add your domain: `yourdomain.com`
   - Set webhook URL: `https://[your-supabase-project].supabase.co/functions/v1/process-calendar-invitation`

3. **Domain DNS Configuration**
   ```dns
   # Add MX record in your domain registrar
   Type: MX
   Name: @
   Value: mx.sendgrid.net
   Priority: 10
   
   # Optional: subdomain for calendar emails only
   Type: MX
   Name: calendar
   Value: mx.sendgrid.net  
   Priority: 10
   ```

### **Option B: Mailgun (Alternative)**

**Setup Steps:**

1. **Create Mailgun Account**
   - Go to [Mailgun.com](https://www.mailgun.com)
   - Sign up for free account

2. **Add Domain**
   - Add your domain in Mailgun dashboard
   - Configure webhook URL: `https://[your-supabase-project].supabase.co/functions/v1/process-calendar-invitation`

3. **Domain DNS Configuration**
   ```dns
   # Add MX records
   Type: MX
   Name: @
   Value: mxa.mailgun.org
   Priority: 10
   
   Type: MX
   Name: @
   Value: mxb.mailgun.org
   Priority: 10
   ```

## 🔧 **Step 2: Update Environment Variables**

Add to your `.env.local`:

```env
# Your domain (replace with actual domain)
CALENDAR_INVITATION_DOMAIN=yourdomain.com

# Supabase Service Role Key (get from Supabase dashboard)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# SendGrid Configuration (if using SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_WEBHOOK_SIGNATURE_SECRET=your_webhook_signature_secret
```

**How to get Supabase Service Role Key:**
1. Go to your Supabase project dashboard
2. Go to Settings → API
3. Copy the `service_role` key (not the `anon` key!)

## 🗄️ **Step 3: Apply Database Migration**

**Copy the SQL from `sql/add_calendar_invitations_enhanced.sql` and run it in your Supabase SQL editor:**

1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Paste the entire SQL content from the file
4. Run the query

**Alternative (if you have psql):**
```bash
psql $DATABASE_URL -f sql/add_calendar_invitations_enhanced.sql
```

## 🔄 **Step 4: Test the Email System**

### **Local Testing:**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit Enhanced Onboarding:**
   - Go to `/app/add-calendar`
   - Click the "Email" tab
   - Click "Create Invitation"
   - Copy the generated email (e.g., `user-abc123@yourdomain.com`)

3. **Test Email Reception:**
   - Send a test email to the generated address
   - Check Supabase Edge Function logs for processing

### **Production Testing:**

1. **Deploy your app with new environment variables**
2. **Test the complete flow:**
   - User creates invitation
   - User invites the email to their Google Calendar
   - System processes the invitation automatically
   - Calendar feed is created and events start syncing

## 🔧 **Step 5: SendGrid Specific Configuration**

### **Inbound Parse Setup in SendGrid:**

1. **Login to SendGrid Dashboard**
2. **Go to Settings → Inbound Parse**
3. **Add Host & URL:**
   - **Hostname:** `yourdomain.com` (your actual domain)
   - **URL:** `https://[your-supabase-project-id].supabase.co/functions/v1/process-calendar-invitation`
   - **Check:** "POST the raw, full MIME message"

4. **Subdomain Configuration (Optional):**
   - **Hostname:** `calendar.yourdomain.com`
   - **URL:** Same webhook URL as above
   - This allows emails like `user-abc123@calendar.yourdomain.com`

### **Webhook Security (Recommended):**

Add webhook signature verification in your Edge Function:

```typescript
// Add to process-calendar-invitation/index.ts
const verifyWebhookSignature = (payload: string, signature: string): boolean => {
  const expectedSignature = Deno.env.get('SENDGRID_WEBHOOK_SIGNATURE_SECRET')
  if (!expectedSignature) return true // Skip verification if not configured
  
  // Implement SendGrid signature verification
  // See: https://docs.sendgrid.com/for-developers/tracking-events/getting-started-event-webhook-security-features
  return true // Simplified for now
}
```

## 🎯 **Step 6: Mailgun Specific Configuration**

### **Routes Setup in Mailgun:**

1. **Login to Mailgun Dashboard**
2. **Go to Receiving → Routes**
3. **Create Route:**
   - **Expression:** `match_recipient("user-.*@yourdomain.com")`
   - **Actions:** `forward("https://[your-supabase-project-id].supabase.co/functions/v1/process-calendar-invitation")`
   - **Priority:** 10

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Emails not reaching webhook:**
   - Check MX records are correctly configured
   - Verify domain ownership in email service
   - Check email service logs

2. **Webhook not processing invitations:**
   - Check Supabase Edge Function logs
   - Verify webhook URL is correct
   - Ensure database migration was applied

3. **Calendar feeds not created:**
   - Check invitation status in database
   - Verify calendar invitation contains valid .ics data
   - Check Edge Function processing logs

### **Debugging Commands:**

```bash
# Check Edge Function logs
npx supabase functions logs process-calendar-invitation

# Check database for invitations
# Run in Supabase SQL Editor:
SELECT * FROM calendar_invitations ORDER BY created_at DESC LIMIT 5;

# Check created calendar feeds
SELECT * FROM calendar_feeds WHERE created_via = 'email_invitation';
```

## 🚀 **Step 7: Going Live**

### **Production Checklist:**

- [ ] Domain MX records configured
- [ ] Email service (SendGrid/Mailgun) configured with webhook
- [ ] Environment variables set in production
- [ ] Database migration applied
- [ ] Edge Function deployed
- [ ] Test invitation creation and processing
- [ ] Monitor webhook logs for first few invitations

### **Monitoring:**

- **Edge Function logs:** Monitor for processing errors
- **Email service logs:** Check for delivery issues  
- **Database:** Monitor invitation statuses and feed creation
- **User feedback:** Track success rates and user experience

## 🎉 **Success!**

Once configured, your users can:

1. **Visit enhanced onboarding** → Choose "Email" option
2. **Generate unique invitation email** → Copy with one click
3. **Invite email to their calendar** → Google, Outlook, Apple, etc.
4. **System automatically processes** → Creates calendar feed
5. **Events start syncing** → Using existing sync infrastructure

## 🔄 **Next Steps**

### **Phase 3 Enhancements:**
- **Real-time notifications** when invitations are accepted
- **Multiple calendar support** from single invitation
- **Enhanced calendar provider detection**
- **Advanced invitation analytics**

### **Scaling Considerations:**
- **Rate limiting** on invitation creation
- **Email volume monitoring** for service limits
- **Backup email processing** for redundancy
- **Advanced security features** for enterprise users

This completes your Email Invitation System setup! 🎊 