CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    follower_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    following_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT no_self_follow
        CHECK (follower_id <> following_id),

    CONSTRAINT unique_follow
        UNIQUE (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS follows_following_idx
    ON public.follows (following_id);

CREATE INDEX IF NOT EXISTS follows_follower_idx
    ON public.follows (follower_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;