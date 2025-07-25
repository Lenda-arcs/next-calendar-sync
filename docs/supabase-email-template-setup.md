# Supabase Email Template Configuration

## Step 1: Access Email Templates in Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Select **Confirm signup** template

## Step 2: Customize the Confirmation Email Template

Replace the default template with this customized version:

```html
<h2>Welcome to avara.!</h2>

<p>Hi there,</p>

<p>Thanks for signing up for avara.! We're excited to help you manage your yoga classes and calendar events.</p>

<p>To complete your registration and start using avara., please confirm your email address by clicking the button below:</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
    Confirm Email Address
  </a>
</div>

<p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
<p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>

<p><strong>What's next?</strong></p>
<ul>
  <li>✅ Connect your calendar (Google, iCloud, or Outlook)</li>
  <li>✅ Set up your yoga class patterns</li>
  <li>✅ Start managing your schedule effortlessly</li>
</ul>

<p>If you didn't create an account with avara., you can safely ignore this email.</p>

<p>Best regards,<br>
The avara. Team</p>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
<p style="font-size: 12px; color: #6b7280;">
  This email was sent from avara. If you have any questions, please contact us at support@avara.studio
</p>
```

## Step 3: Configure the Confirmation URL

The `{{ .ConfirmationURL }}` will be automatically generated by Supabase. To ensure it redirects to the right place, we need to configure the Site URL in Supabase:

### In Supabase Dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://yourdomain.com` (or `http://localhost:3001` for development)
3. Add **Redirect URLs**:
   - `https://yourdomain.com/auth/callback`
   - `http://localhost:3001/auth/callback` (for development)

## Step 4: Email Template Variables

Supabase provides these variables you can use in your email template:

- `{{ .ConfirmationURL }}` - The confirmation link
- `{{ .Token }}` - The confirmation token
- `{{ .Email }}` - The user's email address
- `{{ .RedirectTo }}` - The redirect URL (if specified)

## Step 5: Custom Redirect After Confirmation

To customize where users go after email confirmation, you can modify the confirmation URL in your application code when sending the signup request:

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
    },
    emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent('/app/add-calendar')}`
  }
})
```

## Step 6: Testing the Email Template

1. **Save** the template in Supabase Dashboard
2. **Test** by registering a new user in your app
3. **Check** the email received matches your template
4. **Verify** the confirmation link works properly

## Email Template Best Practices

- **Clear call-to-action** with prominent button
- **Fallback text link** for accessibility
- **Branded styling** consistent with your app
- **Clear next steps** after confirmation
- **Contact information** for support
- **Mobile-responsive** design 