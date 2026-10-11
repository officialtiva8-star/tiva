-- TIVA: Basic post interaction security

-- Likes
DROP POLICY IF EXISTS "Authenticated users can view likes"
ON public.post_likes;

CREATE POLICY "Authenticated users can view likes"
ON public.post_likes
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can like posts as themselves"
ON public.post_likes;

CREATE POLICY "Users can like posts as themselves"
ON public.post_likes
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users can remove their own likes"
ON public.post_likes;

CREATE POLICY "Users can remove their own likes"
ON public.post_likes
FOR DELETE
TO authenticated
USING (
    auth.uid() = user_id
);


-- Comments
DROP POLICY IF EXISTS "Authenticated users can view comments"
ON public.post_comments;

CREATE POLICY "Authenticated users can view comments"
ON public.post_comments
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can create their own comments"
ON public.post_comments;

CREATE POLICY "Users can create their own comments"
ON public.post_comments
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = author_id
);

DROP POLICY IF EXISTS "Authors can update their own comments"
ON public.post_comments;

CREATE POLICY "Authors can update their own comments"
ON public.post_comments
FOR UPDATE
TO authenticated
USING (
    auth.uid() = author_id
)
WITH CHECK (
    auth.uid() = author_id
);

DROP POLICY IF EXISTS "Authors can delete their own comments"
ON public.post_comments;

CREATE POLICY "Authors can delete their own comments"
ON public.post_comments
FOR DELETE
TO authenticated
USING (
    auth.uid() = author_id
);


-- Saved posts
DROP POLICY IF EXISTS "Users can view their own saved posts"
ON public.post_saves;

CREATE POLICY "Users can view their own saved posts"
ON public.post_saves
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users can save posts as themselves"
ON public.post_saves;

CREATE POLICY "Users can save posts as themselves"
ON public.post_saves
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users can remove their own saved posts"
ON public.post_saves;

CREATE POLICY "Users can remove their own saved posts"
ON public.post_saves
FOR DELETE
TO authenticated
USING (
    auth.uid() = user_id
);