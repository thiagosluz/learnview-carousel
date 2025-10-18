-- Fix critical RLS security issues (handle existing policies)

-- 1. Fix profiles table - restrict email access to own profile only
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
-- The "Users can view their own profile" policy already exists, no need to recreate

-- 2. Fix professors table - remove unrestricted write policies
DROP POLICY IF EXISTS "Permitir INSERT para todos" ON public.professors;
DROP POLICY IF EXISTS "Permitir UPDATE para todos" ON public.professors;
DROP POLICY IF EXISTS "Permitir DELETE para todos" ON public.professors;

-- 3. Fix classes table - remove unrestricted write policies
DROP POLICY IF EXISTS "classes_insert_policy" ON public.classes;
DROP POLICY IF EXISTS "classes_update_policy" ON public.classes;
DROP POLICY IF EXISTS "classes_delete_policy" ON public.classes;

-- 4. Fix news table - remove unrestricted write policies
DROP POLICY IF EXISTS "Allow INSERT for all users" ON public.news;
DROP POLICY IF EXISTS "Allow UPDATE for all users" ON public.news;
DROP POLICY IF EXISTS "Allow DELETE for all users" ON public.news;
DROP POLICY IF EXISTS "Allow SELECT for all users" ON public.news;

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