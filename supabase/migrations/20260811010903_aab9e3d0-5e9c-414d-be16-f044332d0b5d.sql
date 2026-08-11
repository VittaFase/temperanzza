CREATE POLICY "Admins can view recipe submissions"
ON public.recipe_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

GRANT SELECT ON public.recipe_submissions TO authenticated;
GRANT ALL ON public.recipe_submissions TO service_role;