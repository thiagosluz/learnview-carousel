-- Fix critical RLS security issues

-- 1. Fix profiles table - restrict email access to own profile only
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 2. Fix professors table - remove unrestricted write policies
DROP POLICY IF EXISTS "Permitir INSERT para todos" ON public.professors;
DROP POLICY IF EXISTS "Permitir UPDATE para todos" ON public.professors;
DROP POLICY IF EXISTS "Permitir DELETE para todos" ON public.professors;

-- Keep the existing authenticated and public read policies
-- The "Authenticated users can perform all actions" policy already provides authenticated access
-- The "Enable read access for all users" policy allows public viewing of professors

-- 3. Fix classes table - remove unrestricted write policies
DROP POLICY IF EXISTS "classes_insert_policy" ON public.classes;
DROP POLICY IF EXISTS "classes_update_policy" ON public.classes;
DROP POLICY IF EXISTS "classes_delete_policy" ON public.classes;

-- Keep "classes_select_policy" for public viewing of schedules
-- Keep "Authenticated users can perform all actions" for authenticated write access

-- 4. Fix news table - remove unrestricted write policies
DROP POLICY IF EXISTS "Allow INSERT for all users" ON public.news;
DROP POLICY IF EXISTS "Allow UPDATE for all users" ON public.news;
DROP POLICY IF EXISTS "Allow DELETE for all users" ON public.news;
DROP POLICY IF EXISTS "Allow SELECT for all users" ON public.news;

-- Keep "Enable read access for all users" for public viewing of active news
-- Keep "Authenticated users can perform all actions" for authenticated write access

-- 5. Add URL validation for coordination_links
CREATE OR REPLACE FUNCTION public.validate_coordination_url()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF new.url !~ '^https?://' THEN
    RAISE EXCEPTION 'URL must start with http:// or https://';
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS validate_coordination_url_trigger ON public.coordination_links;

CREATE TRIGGER validate_coordination_url_trigger
BEFORE INSERT OR UPDATE ON public.coordination_links
FOR EACH ROW
EXECUTE FUNCTION public.validate_coordination_url();