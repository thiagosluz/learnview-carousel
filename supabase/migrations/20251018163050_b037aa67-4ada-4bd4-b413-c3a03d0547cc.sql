-- Add clickable link functionality to news table

-- Add link column (nullable, optional URL)
ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS link text;

-- Add is_clickable column (boolean, default false)
ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS is_clickable boolean DEFAULT false;

-- Create URL validation function for news links
CREATE OR REPLACE FUNCTION public.validate_news_link()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF new.link IS NOT NULL AND new.link != '' AND new.link !~ '^https?://' THEN
    RAISE EXCEPTION 'Link must start with http:// or https://';
  END IF;
  RETURN new;
END;
$$;

-- Create trigger to validate news links
DROP TRIGGER IF EXISTS validate_news_link_trigger ON public.news;

CREATE TRIGGER validate_news_link_trigger
BEFORE INSERT OR UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.validate_news_link();

-- Add comment to explain the columns
COMMENT ON COLUMN public.news.link IS 'Optional URL to make the news item clickable';
COMMENT ON COLUMN public.news.is_clickable IS 'Flag to indicate if the news should be clickable (shows visual indicator)';