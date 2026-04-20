-- Waitlist Table
CREATE TABLE public.waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('talent', 'startup', 'hr')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to the waitlist
CREATE POLICY "Allow anonymous inserts to waitlist"
    ON public.waitlist FOR INSERT
    WITH CHECK (true);

-- Only admins can view the waitlist
CREATE POLICY "Allow admins to view waitlist"fd
    ON public.waitlist FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type = 'admin'
        )
    );
