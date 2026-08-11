
CREATE TABLE public.recipe_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name TEXT NOT NULL,
    email TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    used_condiments JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

GRANT INSERT ON public.recipe_submissions TO anon, authenticated;
GRANT SELECT ON public.recipe_submissions TO service_role;
ALTER TABLE public.recipe_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a recipe" ON public.recipe_submissions 
FOR INSERT TO anon, authenticated 
WITH CHECK (true);
