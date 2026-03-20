
-- Waitlist signups table
CREATE TABLE public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  platform TEXT CHECK (platform IN ('ios', 'android')),
  referral_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(4), 'hex'),
  referred_by UUID REFERENCES public.waitlist_signups(id),
  referral_count INT NOT NULL DEFAULT 0,
  position SERIAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (public waitlist)
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist_signups FOR INSERT
  WITH CHECK (true);

-- Allow reading own row by email (used after signup)
CREATE POLICY "Anyone can read waitlist entries"
  ON public.waitlist_signups FOR SELECT
  USING (true);

-- Function to increment referral count when someone signs up with a referral
CREATE OR REPLACE FUNCTION public.increment_referral_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE public.waitlist_signups
    SET referral_count = referral_count + 1
    WHERE id = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_waitlist_signup_referral
  AFTER INSERT ON public.waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_referral_count();

-- Index for referral code lookups
CREATE INDEX idx_waitlist_referral_code ON public.waitlist_signups(referral_code);
