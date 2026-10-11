-- TIVA: Basic post security policies

DROP POLICY IF EXISTS "Public posts are viewable"
ON public.posts;

CREATE POLICY "Public posts are viewable"
ON public.posts
FOR SELECT
TO anon, authenticated
USING (
    visibility = 'public'
    AND status = 'active'
);

DROP POLICY IF EXISTS "Authors can view their own posts"
ON public.posts;

CREATE POLICY "Authors can view their own posts"
ON public.posts
FOR SELECT
TO authenticated
USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can create their own posts"
ON public.posts;

CREATE POLICY "Users can create their own posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update their own posts"
ON public.posts;

CREATE POLICY "Authors can update their own posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can delete their own posts"
ON public.posts;

CREATE POLICY "Authors can delete their own posts"
ON public.posts
FOR DELETE
TO authenticated
USING (auth.uid() = author_id);