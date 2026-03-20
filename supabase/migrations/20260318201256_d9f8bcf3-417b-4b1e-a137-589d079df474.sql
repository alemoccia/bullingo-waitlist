ALTER TABLE public.waitlist_signups ADD COLUMN IF NOT EXISTS ip_address text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_signups_ip ON public.waitlist_signups (ip_address) WHERE ip_address IS NOT NULL;