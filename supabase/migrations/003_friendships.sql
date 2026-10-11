CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    requester_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    addressee_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT no_self_friendship
        CHECK (requester_id <> addressee_id),

    CONSTRAINT unique_friendship_pair
        UNIQUE (requester_id, addressee_id)
);

CREATE INDEX IF NOT EXISTS friendships_addressee_status_idx
    ON public.friendships (addressee_id, status);

CREATE INDEX IF NOT EXISTS friendships_requester_status_idx
    ON public.friendships (requester_id, status);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;