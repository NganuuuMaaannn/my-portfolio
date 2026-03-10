# Supabase Setup Guide for Allena Hub Admin

## Prerequisites

1. A Supabase account at https://supabase.com
2. A new Supabase project created

---

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** (⚙️ icon) → **API**
4. Copy the following:
   - **Project URL** (e.g., `https://xyzabc.supabase.co`)
   - **anon public** key (under "Project API keys")

---

## Step 2: Configure Environment Variables

1. Create a new file called `.env.local` in the project root (same folder as package.json)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Example:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: SQL Setup (Run in Supabase SQL Editor)

Copy and paste the following SQL into your Supabase SQL Editor and run it:

> **Note:** Run each block separately. If you get permission errors on any block, skip it and continue with the next.

### Block 1: Profiles Table

```sql
-- Create a profile table for additional user data
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own profile
CREATE POLICY "Users can read own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);
```

### Block 2: Projects Table

```sql
-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    tech_stack TEXT[],
    demo_url TEXT,
    repo_url TEXT,
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read projects
CREATE POLICY "Anyone can read projects" 
ON public.projects FOR SELECT 
USING (true);

-- Policy: Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated can manage projects" 
ON public.projects FOR ALL 
USING (auth.role() = 'authenticated');
```

### Block 3: Certificates Table

```sql
-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT,
    description TEXT,
    image_url TEXT,
    credential_url TEXT,
    earned_date DATE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read certificates
CREATE POLICY "Anyone can read certificates" 
ON public.certificates FOR SELECT 
USING (true);

-- Policy: Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated can manage certificates" 
ON public.certificates FOR ALL 
USING (auth.role() = 'authenticated');
```

### Block 4: Contact Messages Table

```sql
-- Create contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can send messages
CREATE POLICY "Anyone can send contact messages" 
ON public.contact_messages FOR INSERT 
WITH CHECK (true);

-- Policy: Only authenticated users can read/update
CREATE POLICY "Authenticated can manage messages" 
ON public.contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update messages" 
ON public.contact_messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete messages" 
ON public.contact_messages FOR DELETE USING (auth.role() = 'authenticated');
```

---

## Step 4: Configure Email OTP (6-digit code)

**Important:** By default, Supabase may send 8-digit OTP codes. To change this to 6 digits:

1. Go to **Authentication** → **Providers** → **Email**
2. Look for the **OTP Length** or similar setting
3. Change it from 8 to 6 digits
4. Save the settings

To also use 6-digit OTP instead of magic links in the email template:

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Email Templates**
   - Click on **Magic Link** template
   - Replace the content with a template that uses `{{ .Token }}` instead of `{{ .ConfirmationURL }}`

Example email template for OTP (nice HTML body):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Allena Hub</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">Verify Your Email</h2>
              
              <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 14px; line-height: 1.6;">
                Thank you for signing up! Please use the verification code below to verify your email address.
              </p>
              
              <!-- OTP Code Box -->
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px; font-weight: 700; color: #14b8a6; letter-spacing: 8px;">{{ .Token }}</span>
              </div>
              
              <p style="color: #9ca3af; margin: 0; font-size: 12px; text-align: center;">
                This code will expire in 1 hour.<br>
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © 2024 Allena Hub. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**Note:** Copy this entire HTML code into the email template editor in Supabase Dashboard.

2. **Add your site URL:**
   - Go to **Authentication** → **Settings**
   - Under **Site URL**, add: `http://localhost:3000`
   - This is required for the verification to work

3. **Enable Confirm Email:**
   - In **Authentication** → **Settings**
   - Make sure **Confirm email** is enabled

---

## Step 5: Configure Google OAuth

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Providers**
   - Click **Google**
   - Toggle **Enable Google**
   - Enter your Google OAuth credentials

2. **In Google Cloud Console:**
   - Go to https://console.cloud.google.com
   - Create OAuth 2.0 credentials
   - Set authorized redirect URI to: `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`

---

## Step 6: Run the Application

```bash
npm run dev
```

Visit http://localhost:3000/admin to see the login page.

---

## Project Structure

```
├── app/
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard (protected)
│   │   ├── login/
│   │   │   └── page.tsx      # Login page with Google + Email
│   │   ├── register/
│   │   │   └── page.tsx     # Register page with verification
│   │   └── auth/
│   │       └── callback/
│   │           └── page.tsx  # OAuth callback handler
├── lib/
│   ├── supabase.ts           # Client-side Supabase client
│   └── supabase/
│       └── server.ts         # Server-side Supabase client
├── middleware.ts             # Auth protection middleware
├── .env.local               # Your Supabase credentials
└── SUPABASE_SETUP.md         # This guide
```

---

## Making a User an Admin

After a user signs up (via Google or email), manually set their role to admin:

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Find the user you want to make admin
3. Copy their User ID (UUID)
4. Run this SQL:

```sql
INSERT INTO public.profiles (id, email, role)
VALUES ('user-uuid-here', 'user@email.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

Or if they already have a profile:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## Troubleshooting

### "Invalid login credentials"
- Make sure you've created a user in Supabase Authentication, or sign up via Google OAuth

### "Redirect URL mismatch"
- Add your exact URL (including http://localhost:3000) to Supabase's redirect URLs

### Middleware errors
- Make sure `.env.local` is properly configured
- Restart the dev server after changing environment variables

### Verification email not received
- Check your spam/junk folder
- Make sure Site URL is set to http://localhost:3000 in Authentication → Settings

---

## Security Notes

1. **Row Level Security (RLS)** is enabled on all tables
2. The `profiles` table policies ensure users can only modify their own data
3. The `projects`, `certificates`, and `contact_messages` tables require authentication for modifications
4. For production, add your actual domain to the allowed redirect URLs in Supabase
