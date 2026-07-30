CREATE TABLE public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_handle text NOT NULL,
  author_name text NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  body text NOT NULL,
  city text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_reviews_status_chk CHECK (status IN ('pending','approved','rejected')),
  CONSTRAINT product_reviews_name_len CHECK (char_length(author_name) BETWEEN 2 AND 60),
  CONSTRAINT product_reviews_body_len CHECK (char_length(body) BETWEEN 10 AND 1200),
  CONSTRAINT product_reviews_title_len CHECK (title IS NULL OR char_length(title) <= 90),
  CONSTRAINT product_reviews_city_len CHECK (city IS NULL OR char_length(city) <= 60)
);

CREATE INDEX product_reviews_handle_status_idx ON public.product_reviews (product_handle, status, created_at DESC);

GRANT SELECT, INSERT ON public.product_reviews TO anon;
GRANT SELECT, INSERT ON public.product_reviews TO authenticated;
GRANT ALL ON public.product_reviews TO service_role;

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved reviews"
ON public.product_reviews FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "Anyone can submit a review for moderation"
ON public.product_reviews FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending');

CREATE POLICY "Admins manage product_reviews"
ON public.product_reviews FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER product_reviews_set_updated_at
BEFORE UPDATE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();