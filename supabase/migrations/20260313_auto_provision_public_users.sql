-- Automatically provision public.users rows for every auth.users signup.
-- This keeps auth-backed flows like RSVPs and profile reads consistent.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  derived_full_name text;
BEGIN
  derived_full_name := NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), '');

  IF derived_full_name IS NULL THEN
    derived_full_name := split_part(COALESCE(NEW.email, 'member@example.com'), '@', 1);
  END IF;

  INSERT INTO public.users (id, email, full_name, plan)
  VALUES (
    NEW.id,
    NEW.email,
    derived_full_name,
    'free'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill any existing auth users that predate the trigger.
INSERT INTO public.users (id, email, full_name, plan)
SELECT
  au.id,
  au.email,
  COALESCE(
    NULLIF(trim(au.raw_user_meta_data->>'full_name'), ''),
    split_part(COALESCE(au.email, 'member@example.com'), '@', 1)
  ) AS full_name,
  'free'::user_plan
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL;
