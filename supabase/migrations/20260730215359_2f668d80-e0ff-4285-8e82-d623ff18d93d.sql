CREATE TABLE public.ambassador_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  state text,
  instagram text,
  profile_type text NOT NULL,
  audience_size text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.ambassador_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.ambassador_applications TO authenticated;
GRANT ALL ON public.ambassador_applications TO service_role;

ALTER TABLE public.ambassador_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply to the ambassador program"
  ON public.ambassador_applications FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

CREATE POLICY "Admins manage ambassador_applications"
  ON public.ambassador_applications FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_ambassador_applications_updated_at
  BEFORE UPDATE ON public.ambassador_applications
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();