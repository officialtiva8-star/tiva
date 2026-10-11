-- TIVA: Basic friendship security

DROP POLICY IF EXISTS "Users can view their own friendships"
ON public.friendships;

CREATE POLICY "Users can view their own friendships"
ON public.friendships
FOR SELECT
TO authenticated
USING (
    auth.uid() = requester_id
    OR auth.uid() = addressee_id
);

DROP POLICY IF EXISTS "Users can send friendship requests"
ON public.friendships;

CREATE POLICY "Users can send friendship requests"
ON public.friendships
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = requester_id
    AND status = 'pending'
);

-- Status changes will be implemented through trusted server-side
-- operations so users cannot accept or block friendships arbitrarily.